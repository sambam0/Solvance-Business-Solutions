---
name: Solvance
description: Digital agency for businesses at every growth stage — from first website to custom AI systems.
colors:
  studio-void: "#0A0A0C"
  elevated-dark: "#111114"
  lifted-surface: "#18181C"
  cold-light: "#F0F0F5"
  diffused-light: "#C8C8D0"
  ambient-gray: "#8A8A96"
  silent-edge: "#5A5A66"
  blueprint-line: "#222228"
  active-edge: "#2A2A32"
  bay-signal-blue: "#3B9EFF"
  studio-violet: "#9D6FFF"
  deep-ocean: "#0F1E36"
  dusk-violet: "#1A1030"
  signal-green: "#34D399"
typography:
  display:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "clamp(48px, 7.6vw, 108px)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.04em"
    fontFeature: "'ss01', 'cv11', 'cv02'"
  headline:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "clamp(38px, 5vw, 60px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Geist Mono', ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  pill: "999px"
  xl: "20px"
  md: "12px"
  sm: "6px"
  logo: "8px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "28px"
  lg: "48px"
  xl: "80px"
  container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.cold-light}"
    textColor: "{colors.studio-void}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.cold-light}"
    textColor: "{colors.studio-void}"
  button-brand:
    backgroundColor: "{colors.bay-signal-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  button-brand-hover:
    backgroundColor: "{colors.bay-signal-blue}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "{colors.elevated-dark}"
    textColor: "{colors.cold-light}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  button-ghost-hover:
    backgroundColor: "{colors.lifted-surface}"
    textColor: "{colors.cold-light}"
  nav-item-active:
    backgroundColor: "rgba(59, 158, 255, 0.10)"
    textColor: "{colors.bay-signal-blue}"
    rounded: "{rounded.sm}"
    padding: "2px 4px"
---

# Design System: Solvance

## 1. Overview

**Creative North Star: "The Night Build"**

Solvance is a Bay Area tech-design agency at 11pm — screens glowing, builds shipping, no clients watching. The aesthetic is not austere minimalism or corporate polish; it's the confident messiness of a studio that ships world-class work and doesn't need to announce it. Dark surfaces, electric signals in blue and violet, typography that moves with precision. The experience should make a skeptical business owner feel like they found the people who actually know what they're doing — because the site proves it without saying so.

The palette is a deep studio void cut through with blue signal light. Motion is orchestrated and purposeful: Awwwards-tier entrance choreography, Active Theory–level scroll presence. Every surface reacts to the cursor. Nothing sits inert. The site should leave a visitor asking "how did they build that?" — the answer is Solvance, and that's the whole pitch.

This system explicitly rejects: hustle-culture excitement (no "10x your revenue," no emoji-heavy energy), corporate formality (no IBM-weight, no committee-feel), and the generic AI landing page (no hero-metric template, no cream backgrounds, no floating feature cards, no eyebrow labels on every section). If it could have been generated from a default prompt, start over.

**Key Characteristics:**
- Near-void dark background (`#0A0A0C`) as the foundation — not dark gray, not navy, but the absence of light
- Two signal colors (Bay Signal Blue + Studio Violet) used as emitters, not fills
- Geist as the single type family: precise, geometric, the font of the builder generation
- Cursor-tracked radial glows on every interactive surface
- Spring physics on all hover interactions (Framer Motion)
- Lenis smooth scroll — the scroll feel is part of the brand


## 2. Colors: The Night Build Palette

A void foundation lit by signal colors. Blue is the primary emitter; violet is the harmonic overtone. Green appears only as a live/active indicator.

### Primary
- **Bay Signal Blue** (`#3B9EFF`): The brand's primary emitter. Used on CTAs, active states, gradient accents, hover glows, checkmarks, and the scroll progress bar. Never used as a fill on large surfaces — its rarity makes it feel electric.
- **Deep Ocean** (`#0F1E36`): Blue-tinted dark tint; used as a glow or soft background wash behind blue elements.

### Secondary
- **Studio Violet** (`#9D6FFF`): The harmonic to Bay Signal Blue. Appears in gradients paired with blue, in the brand mark radial gradient, and as a secondary accent. More ambient than blue; it flavors rather than signals.
- **Dusk Violet** (`#1A1030`): Violet-tinted bg wash behind violet elements.

### Tertiary
- **Signal Green** (`#34D399`): Reserved exclusively for live/active indicators (the pulsing dot in the nav badge). Never used decoratively.

### Neutral
- **Studio Void** (`#0A0A0C`): The body background. Not dark gray — intentionally near-black with a cool undertone. The canvas of the night build.
- **Elevated Dark** (`#111114`): Card and panel surfaces. One step above the void.
- **Lifted Surface** (`#18181C`): Hovered panels and active containers.
- **Blueprint Line** (`#222228`): Default borders and dividers. Used for the outer ring of interactive containers at rest.
- **Active Edge** (`#2A2A32`): Borders on hover and on elevated panels.
- **Cold Light** (`#F0F0F5`): Primary text. Cool-white; carries the void's temperature.
- **Diffused Light** (`#C8C8D0`): Secondary text — body copy, descriptions, lede paragraphs.
- **Ambient Gray** (`#8A8A96`): Muted / supporting text. Labels, metadata, helper copy.
- **Silent Edge** (`#5A5A66`): Disabled text and deep-muted labels.

### Named Rules
**The Emitter Rule.** Bay Signal Blue and Studio Violet are light sources, not fills. They belong on small high-contrast elements (buttons, badges, glows, active indicators) and in gradients. A large blue surface is a violation — blue is rare here, and rarity is the point.

**The Temperature Rule.** Every neutral has a cool undertone. Warm grays, cream, or sand backgrounds are prohibited — they conflict with the cold-light signal palette and read as a different brand entirely.


## 3. Typography

**Display / Body Font:** Geist (system-ui, sans-serif fallback)
**Label / Mono Font:** Geist Mono (ui-monospace, monospace fallback)

**Character:** A single-family system where weight and size carry all hierarchy. Geist is precise and geometric — built by Vercel, shaped by the same hands that built the tools this industry runs on. The mono variant appears only for labels, section eyebrows, and technical context — used sparingly so it reads as a mark of precision rather than costume.

### Hierarchy
- **Display** (700 weight, `clamp(48px, 7.6vw, 108px)`, line-height 0.96, tracking -0.04em): Hero headings only. Tight leading creates density. Max capped at ~108px to stay this side of shouting.
- **Headline** (700 weight, `clamp(38px, 5vw, 60px)`, line-height 1.02, tracking -0.03em): Section titles and sub-page heroes. Same compression as Display, slightly more air.
- **Title** (600 weight, 18px, line-height 1.3, tracking -0.02em): Card headings, nav brand name, feature labels. Medium-size weight that reads as confident without competing with headlines.
- **Body** (400 weight, 16px, line-height 1.55): All prose. Max line length: 62–65ch. Color is `--ink-2` (Diffused Light) on dark backgrounds, never full Cold Light, to reduce fatigue.
- **Label** (Geist Mono, 400 weight, 11–12px, tracking +0.08em, uppercase): Section eyebrows, service category tags, technical labels. Mono reinforces the "precise instrument" voice. Use sparingly — one label per section, not above every heading.

### Named Rules
**The Compression Rule.** Display and Headline headings use tight leading (0.96–1.02) and strong negative tracking (-0.03em to -0.04em). Loose leading on large type reads as unconfident. If a heading wraps, `text-wrap: balance` prevents orphans.

**The Mono-as-Mark Rule.** Geist Mono signals technical precision. It appears on category labels, code, and stat suffixes — not on body copy, nav links, or marketing headings. Its rarity is what makes it mean something.


## 4. Elevation

This system uses a hybrid elevation model: deep structural shadows at rest, cursor-tracked radial glows as the primary depth signal on interaction. There is no traditional "card pops up" shadow model — elevation is earned through cursor proximity, not static layering.

### Shadow Vocabulary
- **Ambient** (`0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.5)` — `--shadow`): Default resting shadow on interactive panels. Creates subtle separation without lifting.
- **Deep Lift** (`0 30px 60px -20px rgba(0,0,0,.7), 0 8px 24px rgba(0,0,0,.5)` — `--shadow-lg`): Applied on hover via Framer Motion spring animation. The card physically lifts 4–5px on the Y axis while the deep shadow spreads.
- **Scroll Progress Glow** (`linear-gradient(90deg, #3B9EFF, #9D6FFF)`): The 2px fixed top bar that tracks scroll position. Not a shadow — a signal.
- **Cursor Glow** (`radial-gradient(380px circle at var(--glow-x) var(--glow-y), rgba(59,158,255,.07), transparent 65%)`): Applied via JS-set CSS custom properties to all `.card`, `.tier`, `.step`, `.qcard` surfaces on hover. The cursor becomes a light source.
- **Nav Depth** (`0 4px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04)`): The floating frosted-glass nav. Inner-edge highlight reinforces the glass effect.

### Named Rules
**The Cursor-as-Light Rule.** Elevation is not static — it follows the user. Every card surface tracks cursor position via `--glow-x` / `--glow-y` CSS custom properties and emits a 380px radial blue glow. Static flat cards are prohibited. If a surface is interactive and uses `.card`, the cursor glow is mandatory.

**The Flat-at-Rest Rule.** Surfaces are flat at rest. Deep shadows appear only as a response to hover. A resting card does not lift itself out of the page.


## 5. Components

### Buttons
Pill-shaped across all variants — `border-radius: 999px`. Font: Geist 500 weight, 14px. Three variants in production.

- **Primary** (`.btn.primary`): White fill (`#F0F0F5`) with near-black text (`#0A0A0C`). Used for secondary actions. Hover: Y -1px lift, shadow brightens.
- **Brand** (`.btn.brand`): Linear gradient fill `(180deg, #3B9EFF, #1a7de0)`, white text. The primary CTA. Box shadow: `0 10px 24px -8px rgba(59,158,255,.45)`, inner top highlight. Hover: brightness +8%, deeper shadow, Y -1px.
- **Ghost** (`.btn.ghost`): Transparent fill, `--bg-2` background, `--line-2` border. Used for secondary navigation prompts. Hover: background lifts to `--bg-3`.
- **All variants:** Arrow `→` inside CTA buttons, `transition: transform .25s ease` on hover — arrow nudges 3px right.
- **Focus:** `outline: 2px solid var(--brand)`, `outline-offset: 3px`.

### Cards / Containers
The SpringCard is the signature interactive container. Every card combines: spring hover lift, cursor-tracked radial glow, and `border-radius: 20px`.

- **Corner Style:** Gently curved (20px radius — `{rounded.xl}`).
- **Background:** `--bg-2` (#111114) at rest.
- **Border:** 1px `--line` (#222228) at rest; transitions to 1px `--line-2` on hover.
- **Hover State:** Y-axis spring lift (−4 to −5px, `stiffness: 300, damping: 22`), `--shadow-lg` appears, cursor glow activates.
- **Internal Padding:** 28–32px.
- **Cursor Glow:** Mandatory. All `.card` surfaces must set `--glow-x` / `--glow-y` via `onMouseMove`.

### Navigation
Floating frosted-glass pill that sits 16px above the viewport top edge.

- **Shape:** Full-width pill capped at 1100px, `border-radius: 999px`, `padding: 0 20px`.
- **Background:** `rgba(10,10,12,.82)` + `backdrop-filter: saturate(180%) blur(20px)`.
- **Border:** 1px `rgba(255,255,255,.08)`.
- **Height:** 60px.
- **Active Links:** Color shifts to `--brand` with a blue-tinted pill overlay (`background: rgba(59,158,255,.10)`, `border: 1px rgba(59,158,255,.18)`).
- **Badge:** Right-side pill badge showing live status. Green pulsing dot (`#34D399`) + Geist Mono 12px label.
- **Mobile:** Hamburger collapses nav links; full-width dropdown drawer.

### Announcement Badge (`.ann`)
The eyebrow above the hero headline. A frosted pill with a gradient-filled `<b>` tag as the category label.

- **Shape:** Pill, `fit-content`, centered.
- **Background:** `rgba(17,17,20,.9)` + blur(8px).
- **Label inside:** Gradient background `(135deg, #3B9EFF, #9D6FFF)`, white text, 12px Geist 600, pill-shaped inner badge.
- **Animation:** Slides up from Y-8px on load.

### SpringCard (Signature Component)
The reusable wrapper that makes every card feel physically alive. Built on Framer Motion.

- Sets `--glow-x` / `--glow-y` CSS vars on `mousemove` for the `::after` radial glow layer.
- `whileHover={{ y: hoverY, boxShadow: '0 0 0 1px var(--line-2), var(--shadow-lg)' }}`
- Spring: `stiffness: 300, damping: 22`.
- Every major card in the system (vertical cards, case study cards, pricing tiers, FAQ cards) uses SpringCard as its container.


## 6. Do's and Don'ts

### Do:
- **Do** keep the background at `#0A0A0C` (Studio Void). It is not dark gray and not navy — the exact near-black cool-undertone is the foundation of the entire signal palette.
- **Do** use Bay Signal Blue sparingly as an emitter. CTAs, glows, active indicators, gradient accents. One or two touch points per fold. Its rarity is the brand.
- **Do** add cursor-tracked glow (`--glow-x` / `--glow-y` + SpringCard) to every interactive card surface. Static cards are a regression.
- **Do** use Geist Mono exclusively for labels, stat suffixes, category eyebrows, and code. Never for body copy or headings.
- **Do** apply `text-wrap: balance` on h1–h3 elements to prevent orphan words at narrow viewports.
- **Do** respect `prefers-reduced-motion` — Framer Motion's `useReducedMotion` is already in the hero; extend it to all scroll-driven animations.
- **Do** treat each section as its own visual world. Section backgrounds, grid treatments, and motion patterns can differ — consistency of voice beats consistency of treatment.

### Don't:
- **Don't** use hype / hustle copy or excited-emoji energy. The brand voice is confident and specific, not motivational.
- **Don't** use big-agency corporate aesthetics — no IBM-weight typography, no formal grid layouts, no impersonal committee-designed section templates.
- **Don't** ship a generic AI-generated landing page. No hero-metric template (big stat, small label, gradient blob), no cream/warm-neutral backgrounds, no floating feature icon cards, no eyebrow labels above every section heading.
- **Don't** use warm or sand-tinted backgrounds. The entire neutral ramp is cool-tinted. Warm grays violate the color system.
- **Don't** add `border-left` colored stripes as accents on cards or callouts. Use full-border or background tint instead.
- **Don't** use `background-clip: text` gradient text outside of the hero h1 `.grad` and the hero H1 animation. One deliberate gradient-text moment per page maximum.
- **Don't** place Geist Mono on body copy or marketing headings. It signals "technical" — used wrongly it becomes costume.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding. Numbers earn their place only when a section IS an ordered sequence and the order carries information.
- **Don't** reduce contrast for "elegance." Body text must read at 4.5:1 minimum against its background — `--ink-2` on `--bg` passes; test before tinting further.
- **Don't** ship a new card without SpringCard's cursor-glow behavior. If it's interactive, it tracks the cursor.
