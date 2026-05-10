# String Magic — Implementation Plan

A single-page, zero-backend utility that turns a job description into a Boolean search string using OpenRouter (free models only). Keys live in `localStorage`. Visual style follows the Technical Minimalist system from the PRD.

## Scope (v1)

- Single route `/` (no auth, no DB).
- User pastes JD → selects free model → clicks Generate → gets Boolean string variants.
- API key & last-used model persisted client-side only.
- Light/dark theme with persistent toggle.
- Below-the-fold sections: how it works, features, FAQ/setup guide, footer.

Explicitly out of scope: accounts, history, ATS features, direct LinkedIn integration, paid models.

## Pages & Routes

Single TanStack route file:
- `src/routes/index.tsx` — full landing + tool experience on one page (hero with the generator inline, then below-the-fold content sections per design system).

## Component Architecture

```
src/
  routes/index.tsx            # page composition
  components/
    layout/
      Header.tsx              # logo, nav anchors, ThemeToggle, "Set API Key" button
      Footer.tsx
      StructuralBackground.tsx# fixed grid + radial mask + ambient orbs/shapes
    theme/
      ThemeToggle.tsx         # sun/moon, toggles `dark` on <html>, persists
    sections/
      Hero.tsx                # headline + the Generator panel on the right
      HowItWorks.tsx          # 3-step structural cards
      Features.tsx            # asymmetric feature grid
      SetupGuide.tsx          # how to get an OpenRouter key (link + steps)
      FaqOrCta.tsx            # final CTA block
    generator/
      GeneratorPanel.tsx      # orchestrates state: key, model, JD, output
      ApiKeyDialog.tsx        # masked input, save/clear, link to OpenRouter
      ModelSelect.tsx         # fetches /models, filters free, searchable
      JobDescriptionInput.tsx # textarea + char count + sample JD button
      GenerateButton.tsx
      ResultCard.tsx          # scrollable, break-all, copy button per variant
      EmptyState.tsx
  lib/
    openrouter.ts             # fetchModels(), generateBoolean()
    prompt.ts                 # system prompt + JSON schema for variants
    storage.ts                # typed localStorage helpers
    reveal.ts                 # IntersectionObserver hook for .reveal/.active
  styles.css                  # tokens, keyframes, grid bg, reveal classes
```

## Data Flow

1. On mount: read `sm.apiKey`, `sm.modelId`, `theme` from `localStorage`.
2. If key present → fetch `GET https://openrouter.ai/api/v1/models` (Authorization optional for listing) and filter `id` ending in `:free` OR `pricing.prompt === "0"` and `pricing.completion === "0"`. Show count of available free models.
3. User pastes JD, picks model, hits Generate.
4. Call `POST https://openrouter.ai/api/v1/chat/completions` with `response_format: { type: "json_object" }` and a strict system prompt requesting variants (broad, balanced, strict) + an array of must/should/exclude keyword groups.
5. Parse JSON → render 3 ResultCards, each with copy-to-clipboard.

## Prompt Contract (returned JSON)

```json
{
  "variants": [
    { "label": "Broad",    "string": "(\"...\" OR \"...\") AND ..." },
    { "label": "Balanced", "string": "..." },
    { "label": "Strict",   "string": "..." }
  ],
  "rationale": "short plain-text explanation",
  "extracted": {
    "titles": ["..."], "skills": ["..."], "exclusions": ["..."]
  }
}
```

Prompt enforces: only AND/OR/NOT, parentheses balanced, multi-word terms quoted, no markdown, no commentary.

## Design System Wiring

- Add Technical Minimalist tokens to `src/styles.css` as oklch values (bg, surface, surface-soft, border, text-main, text-muted, accent-blue/violet/green/amber/rose).
- Add fonts: Inter (sans) + JetBrains Mono (mono) via Google Fonts `<link>` in `__root.tsx` head.
- Add keyframes: `floatY`, `pulseLine`, `shineSweep`; reveal classes `.reveal` / `.reveal.active`.
- Fixed `StructuralBackground` with linear-gradient grid + radial mask + 2-3 low-opacity ambient orbs and sparse geometric shapes.
- Theme toggle: blocking inline script in `__root.tsx` `<head>` to set `dark` class before paint, prevents flicker. Persists to `localStorage["theme"]`. Respects `prefers-color-scheme` when no saved value.
- Buttons: primary high-contrast fill, secondary bordered, `rounded-xl`/`rounded-2xl`. Mono font for labels/badges/metadata.

## Setup Guide Section (for users without an OpenRouter account)

Short structural card with numbered steps:
1. Go to openrouter.ai and create a free account (link).
2. Visit Keys page, create a new API key (link to `https://openrouter.ai/keys`).
3. Paste it into String Magic — stored only in your browser.

Plus a callout: "Free models are rate-limited by OpenRouter. We never see or store your key."

## Security & Validation

- Validate JD with zod: non-empty, max ~8000 chars.
- Validate API key format (`sk-or-...`), masked input, "Show" toggle, "Clear key" action.
- All fetches use `encodeURIComponent` where applicable; key is sent only in `Authorization: Bearer` header to OpenRouter directly from the browser.
- Never log key. No analytics.

## Responsiveness

- Hero: 2-col on `lg+` (copy left, generator card right), stacked on mobile with generator first after headline.
- Result cards: `max-h-[420px] overflow-auto`, `break-all`, mono font.
- Sticky-ish header with backdrop blur.

## Accessibility

- Theme toggle: `aria-label="Toggle theme"`, `aria-pressed`.
- All inputs labeled, focus rings visible in both themes.
- Copy button announces success via `aria-live="polite"` toast (sonner).
- Color contrast verified for both themes.

## Build Order

1. Tokens + fonts + structural background + theme toggle in `__root.tsx`/`styles.css`.
2. Layout shell: Header, Footer, Hero scaffold.
3. `lib/storage.ts`, `lib/openrouter.ts`, `lib/prompt.ts`.
4. ApiKeyDialog + ModelSelect (with free-model filtering).
5. GeneratorPanel + JobDescriptionInput + ResultCard + copy.
6. Below-the-fold sections: HowItWorks, Features, SetupGuide, final CTA.
7. Reveal animations + polish pass + responsive QA.

## Open Questions (assumed defaults — tell me to change any)

- Number of variants: default **3** (Broad / Balanced / Strict).
- Sample JD button: **included** for first-run delight.
- Toast library: **sonner** (already in template).
- Model list refresh: fetched on key set + manual refresh button; cached in memory.
