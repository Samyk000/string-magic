export const VARIANT_LABELS = ["Broad", "Balanced", "Strict"] as const;
export type VariantLabel = (typeof VARIANT_LABELS)[number];

export const SYSTEM_PROMPT = `Expert Boolean search architect. Convert a job description into 3 platform-agnostic Boolean search strings.

Rules:
- Operators: AND, OR, NOT (uppercase only).
- Multi-word terms in raw straight double quotes.
- Parentheses for OR groups; every open paren must close.
- No markdown or commentary inside results.
- Only skills implied by the JD. Group synonyms with OR.

FORMAT REQUIREMENT:
Do not use JSON. Do not use code escaping. Output raw text exactly like this template:

[BROAD]
(boolean search here)

[BALANCED]
(boolean search here)

[STRICT]
(boolean search here)

[TITLES]
Job Title, Job Title

[SKILLS]
Skill, Skill

[EXCLUSIONS]
Exclusion, Exclusion`;

export function userPrompt(jd: string) {
  return `Job description:

"""
${jd.trim()}
"""

Generate response in raw text block format now.`;
}
