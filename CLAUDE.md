# Solvance — Claude Instructions

## Always read first
- `PRODUCT.md` — business context, users, brand voice, design principles
- `DESIGN.md` — full design system: colors, typography, components, do/don'ts

## Business
AI consulting firm for SMBs. Two services: **AI Agents & Automation**, **AI Teaching & Training**.
This is NOT a web/ads agency. Ignore any old references to Websites/SEO, Ads/Marketing, or Custom Builds as a service.

## Tech stack
- React SPA (Vite). No React Router — routing via `pushState` + `locationchange` custom event.
- Animations: GSAP + ScrollTrigger for scroll-driven reveals. Framer Motion retained for SpringCard hover physics only.
- Design tokens live in `index.css`. Never hardcode colors, spacing, or radii — always use CSS custom properties (`--brand`, `--bg`, `--ink`, etc.).
- Lenis smooth scroll is active — don't fight it with scroll manipulation.

## Design rules (non-negotiables)
- Background is `#0A0A0C` (Studio Void). Not dark gray, not navy.
- Bay Signal Blue and Studio Violet are emitters, not fills. Use sparingly.
- Every interactive card must use SpringCard with cursor-tracked glow (`--glow-x` / `--glow-y`). Static cards are a regression.
- `background-clip: text` gradient text is allowed only once per page (hero h1). Do not add more instances.
- No warm or sand-tinted backgrounds anywhere. The entire neutral ramp is cool-tinted.
- No eyebrow labels above every section heading — this is explicitly called out as an anti-pattern.

## Copy rules
- Voice: **precise, alive, credible** — builder energy, not hype.
- Use specifics, not superlatives: "3 weeks to first result", "60-day support", "$1,500/mo advisory" — not "fast", "affordable", "world-class".
- No "10x your revenue" energy. No emoji. No excited punctuation.
- No numbered section markers (01 / 02 / 03) unless the section IS an ordered sequence.

## North star
"The Night Build" — Bay Area tech studio at 11pm. Awwwards/Active Theory production quality.
The site should make a visitor ask "how was this made?" If it could be generated from a default AI prompt, start over.
