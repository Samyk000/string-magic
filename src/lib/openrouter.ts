import { SYSTEM_PROMPT, userPrompt } from "./prompt";

const BASE = "https://openrouter.ai/api/v1";

export type ORModel = {
  id: string;
  name: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
};

export type Variant = { label: string; string: string };
export type GenerateResult = {
  variants: Variant[];
  rationale: string;
  extracted: { titles: string[]; skills: string[]; exclusions: string[] };
};

const HEADERS_BASE = {
  "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
  "X-Title": "String Magic",
};

function isFree(m: ORModel) {
  if (m.id.endsWith(":free")) return true;
  const p = m.pricing;
  if (!p) return false;
  const a = parseFloat(p.prompt ?? "1");
  const b = parseFloat(p.completion ?? "1");
  return a === 0 && b === 0;
}

export async function fetchFreeModels(apiKey?: string): Promise<ORModel[]> {
  const res = await fetch(`${BASE}/models`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
  });
  if (!res.ok) throw new Error(`Failed to load models (${res.status})`);
  const data = (await res.json()) as { data: ORModel[] };
  return data.data.filter(isFree).sort((a, b) => a.name.localeCompare(b.name));
}

export async function generateBoolean(opts: {
  apiKey: string;
  model: string;
  jd: string;
  signal?: AbortSignal;
  onProgress?: (text: string) => void;
}): Promise<GenerateResult> {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    signal: opts.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
      ...HEADERS_BASE,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(opts.jd) },
      ],
      temperature: 0.2,
      stream: true,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    let errorMsg = `OpenRouter error ${res.status}: ${txt.slice(0, 100)}`;
    
    if (res.status === 429) {
      errorMsg = "You've reached your free daily rate limit for this model. Please try again later or select a different model.";
    } else if (res.status === 401) {
      errorMsg = "Invalid API key. Please check your OpenRouter API key.";
    } else if (res.status === 402) {
      errorMsg = "Insufficient credits on your OpenRouter account.";
    } else if (res.status === 403) {
      errorMsg = "Access denied or model blocked by OpenRouter policy.";
    } else if (res.status === 529 || res.status === 502) {
      errorMsg = "The AI model provider is currently overloaded or down. Please try another model.";
    } else {
      try {
         const jsonErr = JSON.parse(txt);
         if (jsonErr.error && jsonErr.error.message) {
           errorMsg = jsonErr.error.message;
         }
      } catch(e) {}
    }
    throw new Error(errorMsg);
  }

  // Real-time rate limit tracking
  const remReq = res.headers.get("x-ratelimit-remaining-requests");
  const limitReq = res.headers.get("x-ratelimit-limit-requests");
  if (remReq && limitReq) {
    localStorage.setItem("or_rate_remaining", remReq);
    localStorage.setItem("or_rate_limit", limitReq);
    window.dispatchEvent(new Event("ratelimit_update"));
  }

  if (!res.body) throw new Error("Empty response stream from model.");
  
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let content = "";
  let buffer = "";
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    
    let boundary = buffer.indexOf("\n");
    while (boundary !== -1) {
      const line = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 1);
      
      if (line.startsWith("data: ")) {
        const dataStr = line.replace(/^data: /, "").trim();
        if (dataStr === "[DONE]") break;
        try {
          const data = JSON.parse(dataStr);
          const text = data.choices[0]?.delta?.content;
          if (text) {
            content += text;
            if (opts.onProgress) opts.onProgress(content);
          }
        } catch (e) {
          // Suppress parse failures on partial final lines
        }
      }
      boundary = buffer.indexOf("\n");
    }
  }

  const parsed = parseBlocks(content);
  if (!parsed?.variants?.length) throw new Error("Model response failed to generate required data shape.");
  return parsed;
}

function parseBlocks(s: string): GenerateResult | null {
  try {
    // Helper to pull text between a tag [KEY] and the next bracket [ or EOF
    const extractBlock = (key: string) => {
      const regex = new RegExp(`\\[${key}\\]\\s*([\\s\\S]*?)(?=\\n\\[|$)`, 'i');
      return s.match(regex)?.[1]?.trim() ?? "";
    };

    const b1 = extractBlock("BROAD");
    const b2 = extractBlock("BALANCED");
    const b3 = extractBlock("STRICT");

    if (!b1 && !b2 && !b3) return null;

    const parseList = (str: string) => 
      str.split(',').map(t => t.trim().replace(/^["']+|["']+$/g, '')).filter(Boolean);

    return {
      variants: [
        { label: "Broad", string: b1 },
        { label: "Balanced", string: b2 },
        { label: "Strict", string: b3 }
      ].filter(v => v.string),
      rationale: extractBlock("RATIONALE"),
      extracted: {
        titles: parseList(extractBlock("TITLES")),
        skills: parseList(extractBlock("SKILLS")),
        exclusions: parseList(extractBlock("EXCLUSIONS"))
      }
    };
  } catch {
    return null;
  }
}
