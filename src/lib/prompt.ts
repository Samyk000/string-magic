export const VARIANT_LABELS = ["Broad", "Balanced", "Strict"] as const;
export type VariantLabel = (typeof VARIANT_LABELS)[number];

export const SYSTEM_PROMPT = `Expert Boolean search architect. Convert a job description into 3 platform-agnostic Boolean search strings (LinkedIn Recruiter, Indeed, GitHub, Google X-Ray, ATS compatible).

Rules:
- Operators: AND, OR, NOT (uppercase only).
- Multi-word terms in straight double quotes.
- Parentheses for OR groups; every open paren must close.
- No site:, intitle:, language:, title: or platform-specific operators.
- No markdown or commentary inside "string" values — pure Boolean only.
- Only skills implied by the JD. Group synonyms/abbreviations with OR.

Variants (this order):
1. Broad — high recall, loose synonyms, fewer ANDs, light exclusions.
2. Balanced — core stack ANDed, common synonyms, sensible exclusions.
3. Strict — all must-haves ANDed, tight titles, strong exclusions.

Respond ONLY with JSON, no other text:
{"variants":[{"label":"Broad","string":"..."},{"label":"Balanced","string":"..."},{"label":"Strict","string":"..."}],"rationale":"one sentence","extracted":{"titles":["..."],"skills":["..."],"exclusions":["..."]}}`;

export function userPrompt(jd: string) {
  return `Job description:

"""
${jd.trim()}
"""

Return the JSON object now with exactly three variants: Broad, Balanced, Strict.`;
}
