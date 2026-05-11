# String Magic — AI Boolean Search Generator

Turn any job description into recruiter-grade Boolean search strings in seconds. Uses free OpenRouter models — your API key stays in your browser.

## What it does

Paste a job description, select a free AI model, and get three Boolean search variants:

- **Broad** — high recall, loose synonyms, lighter exclusions
- **Balanced** — production default, sensible precision/recall tradeoff
- **Strict** — high precision, tight title list, strong exclusions

Each variant is platform-agnostic and works across LinkedIn Recruiter, Indeed, GitHub, Google X-Ray, and most ATS sourcing tools.

## How it works

1. Bring your own OpenRouter API key (free tier available)
2. Select a free model from the dropdown
3. Paste a job description and click Generate
4. Copy the Boolean strings to your sourcing tool

## Quick setup

1. Go to [openrouter.ai](https://openrouter.ai) and create a free account
2. Visit [Keys](https://openrouter.ai/keys) and generate an API key
3. Paste it into String Magic — stored only in your browser's localStorage

## Tech stack

- **Framework**: TanStack Start (React, Vite)
- **UI**: Tailwind CSS v4, Radix UI primitives
- **AI**: OpenRouter API (free models only)
- **Deployment**: Cloudflare Pages / Workers

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Format
npm run format
```

## Features

- Zero backend — everything runs in the browser
- Dark/light theme with persistent toggle
- Free models only — no paid model integrations
- No accounts, no tracking, no data storage
- Responsive design with mobile-first approach
- Copy-to-clipboard with toast feedback
- Structural background with ambient animations

## Privacy

Your OpenRouter API key is stored only in your browser's localStorage. It is never sent to any server other than OpenRouter directly. We do not log, track, or store any data.

## License

MIT
