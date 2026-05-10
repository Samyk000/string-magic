export type Platform = "global" | "linkedin" | "indeed" | "github" | "google";

export const PLATFORM_LABEL: Record<Platform, string> = {
  global: "Global",
  linkedin: "LinkedIn",
  indeed: "Indeed",
  github: "GitHub",
  google: "Google X-Ray",
};

const PLATFORM_NOTES: Record<Platform, string> = {
  global:
    "Generic Boolean usable in most ATS / sourcing tools. AND, OR, NOT, parentheses.",
  linkedin:
    "LinkedIn Recruiter / search. AND/OR/NOT in caps. Quote multi-word terms. No wildcards.",
  indeed:
    "Indeed search. Uppercase AND/OR/NOT. Quote phrases. Supports title:, company:.",
  github:
    "GitHub user/code search. Use language:, location:, followers:>X. Group OR skill keywords in parens.",
  google:
    "Google X-Ray (e.g. site:linkedin.com/in). Use site:, intitle:, inurl:, -exclusion. Quote phrases.",
};

export const SYSTEM_PROMPT = `You are an expert technical recruiter and Boolean search architect. You convert job descriptions into precise, syntactically valid Boolean search strings — one tailored string per requested platform.

Universal rules:
- Use ONLY uppercase operators: AND, OR, NOT.
- Wrap every multi-word term in straight double quotes.
- Use parentheses to group OR clauses. Every opening paren must be closed.
- No markdown, no commentary inside the "string" fields — pure Boolean only.
- Do not invent skills not implied by the JD.
- Prefer synonyms and common abbreviations grouped with OR.

Respond with a single JSON object of this exact shape:
{
  "variants": [
    { "label": "<Platform Name>", "platform": "<platform-id>", "string": "..." }
  ],
  "rationale": "1-2 sentences on the approach",
  "extracted": {
    "titles":     ["..."],
    "skills":     ["..."],
    "exclusions": ["..."]
  }
}

Return EXACTLY one variant per requested platform, in the order requested. Use the provided platform label for "label" and the platform id for "platform".`;

export function userPrompt(jd: string, platforms: Platform[]) {
  const list = platforms
    .map((p) => `- id: ${p} | label: ${PLATFORM_LABEL[p]} — ${PLATFORM_NOTES[p]}`)
    .join("\n");

  return `Requested platforms (${platforms.length}):
${list}

Job description:

"""
${jd.trim()}
"""

Return the JSON object now with one variant per requested platform.`;
}
