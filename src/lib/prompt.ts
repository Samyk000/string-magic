export type Platform = "global" | "linkedin" | "indeed" | "github" | "google";

const PLATFORM_NOTES: Record<Platform, string> = {
  global:
    "Target: generic Boolean syntax usable across most sourcing tools. Use AND, OR, NOT and parentheses.",
  linkedin:
    "Target: LinkedIn Recruiter / LinkedIn search. Use AND, OR, NOT in caps. Quote multi-word terms. Avoid wildcards (LinkedIn ignores them). Keep within ~300 character clauses where possible.",
  indeed:
    "Target: Indeed search. Use AND, OR, NOT (uppercase). Quote multi-word terms. Indeed supports title:, company:. Prefer simple grouping; avoid deep nesting.",
  github:
    "Target: GitHub user/code search. Combine qualifiers like language:, location:, followers:>X with quoted terms. Avoid OR across qualifiers; group skill keywords with OR in parentheses.",
  google:
    "Target: Google X-Ray search (e.g. site:linkedin.com/in). Use site:, intitle:, inurl:, -exclusion. Quote multi-word terms. Use parentheses for OR groups.",
};

export const SYSTEM_PROMPT = `You are an expert technical recruiter and Boolean search architect. You convert job descriptions into precise, syntactically valid Boolean search strings.

Universal rules:
- Use ONLY uppercase operators: AND, OR, NOT.
- Wrap every multi-word term in straight double quotes.
- Use parentheses to group OR clauses. Every opening paren must be closed.
- No markdown, no commentary. Plain Boolean only inside the "string" fields.
- Do not invent skills not implied by the JD.
- Prefer synonyms and common abbreviations grouped with OR.

Respond with a single JSON object of this exact shape:
{
  "variants": [
    { "label": "Broad",    "string": "..." },
    { "label": "Balanced", "string": "..." },
    { "label": "Strict",   "string": "..." }
  ],
  "rationale": "1-2 sentences explaining the differences",
  "extracted": {
    "titles":     ["..."],
    "skills":     ["..."],
    "exclusions": ["..."]
  }
}

Variant guidance:
- Broad: maximum recall. Wide title and skill synonyms, fewer required ANDs.
- Balanced: production-ready default. Required core skills ANDed, nice-to-haves ORed.
- Strict: maximum precision. Required skills, seniority and NOT exclusions.`;

export function userPrompt(jd: string, platform: Platform) {
  return `Platform: ${platform.toUpperCase()}
${PLATFORM_NOTES[platform]}

Job description:

"""
${jd.trim()}
"""

Return the JSON object now, tuned for the ${platform.toUpperCase()} platform.`;
}
