import { SYSTEM_PROMPT, userPrompt, type Platform } from "./prompt";

const BASE = "https://openrouter.ai/api/v1";

export type ORModel = {
  id: string;
  name: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
};

export type Variant = { label: string; platform?: string; string: string };
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
  return data.data
    .filter(isFree)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function generateBoolean(opts: {
  apiKey: string;
  model: string;
  jd: string;
  platforms: Platform[];
  signal?: AbortSignal;
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
        { role: "user", content: userPrompt(opts.jd, opts.platforms) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OpenRouter error ${res.status}: ${txt.slice(0, 240)}`);
  }
  const json = await res.json();
  const content: string = json.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Empty response from model.");

  const parsed = parseLoose(content);
  if (!parsed?.variants?.length) throw new Error("Model returned an unexpected shape.");
  return parsed;
}

function parseLoose(s: string): GenerateResult | null {
  try {
    return JSON.parse(s);
  } catch {
    const m = s.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      return JSON.parse(m[0]);
    } catch {
      return null;
    }
  }
}
