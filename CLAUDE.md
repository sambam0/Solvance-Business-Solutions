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

## Design aesthetic

The studio is a Figma/Linear-era creative agency at 11pm — builds shipping, no clients watching, screens glowing in the dark. The physical anchor: an open-plan studio where the work on the monitors IS the proof of capability. Not a corporate agency presenting credentials, not a consultant with a pitch deck. Smart people who build things. That's the room. Design from it.

**What this means in practice:**
- Surfaces are dark and precise, lit by signal — not atmospheric or moody for its own sake
- Motion is choreographed, not decorative. Ask: does this movement carry information or earn attention? If no, cut it
- Typography is compressed and confident. Loose leading reads as unconfident; tight leading reads as a decision
- Blue and violet appear as electricity in the dark — CTAs, active states, glows. They are rare by design. Their rarity is what makes them feel alive
- Every interactive surface tracks the cursor. The cursor is a light source, not a pointer
- Each section should feel like it was art-directed individually. Template repetition is the enemy

**What this is not:**
- Not austere Scandinavian minimalism — there is texture, motion, and signal here
- Not dark-mode SaaS — not the standard navy-to-black with purple accents template
- Not hype — no gradient blobs, no floating feature icon cards, no "10x" energy
- Not a portfolio — this is a live demonstration of capability, not a showcase of past work

**The test:** Would a visitor ask "how was this made?" If it could have been generated from a default AI prompt, start over. The site should be impossible to replicate by prompting a generic AI.

## North star
"The Night Build" — Bay Area tech studio at 11pm. Awwwards/Active Theory production quality.
References: Active Theory interaction density, Awwwards-tier entrance choreography, Linear's typographic confidence, Figma's builder credibility.
