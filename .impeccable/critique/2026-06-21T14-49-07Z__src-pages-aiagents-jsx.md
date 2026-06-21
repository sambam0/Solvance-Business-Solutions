---
target: src/pages/AIAgents.jsx
total_score: 21
p0_count: 2
p1_count: 2
timestamp: 2026-06-21T14-49-07Z
slug: src-pages-aiagents-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scroll bar and use-case active states work. StatCounter animation signals "loading" but communicates nothing true. |
| 2 | Match System / Real World | 2 | "Open Claw Network" is unexplained jargon. NODE_LEGEND tries to compensate but arrives too late on the page. |
| 3 | User Control and Freedom | 2 | No breadcrumb or in-page back affordance. Use-case detail has no explicit close target — mobile stumble. |
| 4 | Consistency and Standards | 1 | Secondary build items lose cursor glow (no SpringCard). Hero CTAs use old Framer whileHover pattern. Two sections share identical `.grad` copy "Built for your industry." |
| 5 | Error Prevention | 2 | navigate() calls pushState with no null-check on href. No disabled/loading guard on use-case buttons. |
| 6 | Recognition Rather Than Recall | 3 | Handoff flow is legible — numbered, sub-labeled. Use-case cards surface metric without requiring expansion. |
| 7 | Flexibility and Efficiency | 2 | "See use cases" CTA anchors section top, not the industry grid. With Lenis active, likely overshoots or undershoots. |
| 8 | Aesthetic and Minimalist Design | 1 | Three orbs + announcement badge + StatCounter row + TrustBar marquee all on the first fold. Eight competing animated elements before the headline has landed. |
| 9 | Error Recovery | 2 | Dual Lenis instances produce scroll jank with no visible error — silent UX failure. No recovery if #audit anchor isn't ready. |
| 10 | Help and Documentation | 3 | FAQ and Pricing present. SMB owner gets answers if they scroll far enough — but the distance to those answers is the problem. |
| **Total** | | **21/40** | **Acceptable — but fails the "impossible to replicate" test** |

---

## Anti-Patterns Verdict

**LLM assessment — Yes, this reads as AI-assembled.**

Three ambient orbs behind the hero. A StatCounter row (40+ projects, 3 weeks, 12 industries) — appears in roughly 40% of all generated dark-mode SaaS pages. An announcement badge pattern the homepage already deleted. Eyebrow labels above two section headings. The identical phrase "Built for your industry." appearing as a gradient span in BOTH the hero h1 AND the Open Claw Network h2 — a copy-paste fingerprint no human art director would approve. The MeshNetworkCanvas and use-case interaction are the only moments that approach "how did they build that?" Everything surrounding them is scaffolding that was never reviewed with human eyes.

**Deterministic scan — 11 findings, all `design-system-color`, all advisory.**

The detector found color drift throughout: `#3B82F6` (Tailwind Blue-500, not Bay Signal Blue `#3B9EFF`), `#8B5CF6` (Tailwind Violet-500, not Studio Violet `#9D6FFF`), plus `#F97316`, `#06B6D4`, `#F59E0B`, `#60A5FA`, `#A78BFA` used as industry/use-case accent colors. The industry accent colors (`#F97316` orange, `#06B6D4` cyan, etc.) are multi-color data visualization — intentional and defensible. The NODE_LEGEND colors `#3B82F6` and `#8B5CF6` are legitimately wrong: these are Tailwind defaults, not the brand's Bay Signal Blue and Studio Violet. The detector confirms what Assessment A found: color is being managed by reflex (Tailwind defaults) not by design system.

The detector did not flag the eyebrow labels, gradient text duplication, hero orbs, StatCounter, TrustBar, or dual Lenis bug — those are structural/behavioral issues outside its scan scope.

---

## Overall Impression

The page has a great core — the mesh canvas, the use-case interaction, the handoff flow — buried under a hero that hasn't been cleaned up since the homepage redesign. The homepage got the treatment; the AI Agents page didn't follow. The dual Lenis bug is a silent scroll jank source that will make this feel broken on some machines. Fix the hero clutter first, then pull the bug out, and the page is most of the way there. The underlying content is solid.

---

## What's Working

**1. The MeshNetworkCanvas + use-case interaction is the best thing on the site.**
Cross-wiring the industry grid to node highlighting is a genuine "live demonstration of capability" — the visitor experiences the pitch, not just reads it. This is the north star in practice.

**2. The handoff flow is clean and honest.**
Five numbered steps because the order matters. Connector travelers reinforce "signal in motion." The only section that reads like it was designed, not generated.

**3. Use-case copy specificity.**
"5 AI agents managing expert matching, intake, and follow-up — split across local and cloud nodes." These are the specific claims CLAUDE.md demands. The copywriter was doing the right thing; the designer buried it.

---

## Priority Issues

**[P0] Dual Lenis instantiation — silent scroll jank**
- **Why:** `App.jsx` runs Lenis globally. This page creates a second independent instance (line 195) with its own RAF loop. Two smooth-scroll engines fighting simultaneously produces jank. A skeptical SMB owner feels "this site is broken" and closes the tab. `prefers-reduced-motion` coordination is also undefined between the two instances.
- **Fix:** Delete lines 192–200 entirely. Trust the global Lenis instance in App.jsx.
- **Command:** `/impeccable harden`

**[P0] Hero fold has 8 competing animated elements — headline doesn't land**
- **Why:** Three orbs (involuntary peripheral pull) + announcement badge + topology SVG with 3 animated travelers + h1 + two CTAs + StatCounter row. The brain cannot parse all of this. The headline — the only thing that needs to land — gets diluted to one-eighth of visual bandwidth. The orbs are generic dark-mode SaaS decoration explicitly rejected by the design system. The `.ann` badge was removed from the homepage for the same reason. The StatCounter row is a banned hero-metric template.
- **Fix (three parts):** Remove hero orbs (lines 245–249). Remove `.ann` badge (line 279). Remove StatCounter row (lines 320–324). The topology SVG stays — it's specific and earns its place.
- **Command:** `/impeccable distill`

**[P1] Duplicate `.grad` span + identical copy in two sections (lines 286 + 418)**
- **Why:** `background-clip: text` gradient is a design luxury that works by scarcity. Using it twice erases both instances. Worse: both use the exact phrase "Built for your industry." — a copy-paste fingerprint that reads as template assembly, not authorship. Design-literate visitors will clock this and disengage.
- **Fix:** Remove the `.grad` span from line 418. Write a new h2 for the Open Claw Network section. "Real infrastructure. Routed to your stack." or similar — let the section's specificity do the lifting.
- **Command:** `/impeccable clarify`

**[P1] Secondary build items missing SpringCard — cursor glow drops mid-section (lines 382–402)**
- **Why:** The featured AI Agents card uses SpringCard with cursor glow. The three secondary capability items next to it use plain `div` wrappers. A visitor mousing between them loses the cursor-as-light effect mid-section. DESIGN.md: "Every interactive surface tracks the cursor. Static cards are a regression."
- **Fix:** Wrap each `cb-build-item` in `<SpringCard hoverY={-2}>`.
- **Command:** `/impeccable polish`

**[P2] NODE_LEGEND uses Tailwind defaults instead of brand tokens (line 92–95)**
- **Why:** `color: '#3B82F6'` is Tailwind Blue-500, not Bay Signal Blue `#3B9EFF`. `color: '#8B5CF6'` is Tailwind Violet-500, not Studio Violet `#9D6FFF`. The detector caught both. These are the node type indicators that teach the visitor to read the mesh diagram — using the wrong brand colors here makes the diagram feel visually disconnected from the brand.
- **Fix:** Replace `'#3B82F6'` → `'#3B9EFF'` and `'#8B5CF6'` → `'#9D6FFF'` in the NODE_LEGEND array. For the SVG stroke/fill values throughout, thread `var(--brand)` and `var(--mute)` where the SVG allows attribute inheritance.
- **Command:** `/impeccable audit`

**[P3] TrustBar marquee is credibility theater (line 329)**
- **Why:** "SA", "EC", "PS" in colored tiles means nothing to a first-time visitor. It's a friction layer between the hero and the first substantive section. The use-case grid below already shows industries with context (problem, solution, metric). This surface occupies space without adding signal.
- **Fix:** Remove. One static sentence in the lede — "Shipped across legal, e-commerce, SaaS, and healthcare" — carries more authority than a looping animation of acronyms.
- **Command:** `/impeccable distill`

---

## Persona Red Flags

**Jordan (Confused First-Timer)**
Lands on a hero with 8 competing elements — orbs, badge, counting numbers, topology SVG — and clocks it as "another AI landing page" within 10 seconds. On scroll reaches "Built for your industry." as a gradient headline in the hero, then hits it again in the Open Claw Network section. The second instance signals copy-paste. "Open Claw Network" is unexplained; Jordan has to stop and parse a jargon term before the mesh diagram makes any sense. By the time Jordan reaches the use-case grid — the page's best feature — Jordan has been depleted by scaffolding. The CaseStudies section is the first place Jordan sees a real named outcome. It arrives too late.

**Casey (Mobile User)**
The StatCounter row on mobile stacks vertically — three modest numbers in a column feel even less impressive than side-by-side. The topology SVG travelers are 3px dots on a 375px screen; they contribute visual noise without communicating. The use-case detail panel expands below the grid: when Casey taps a card, the result is below the fold and requires a scroll Casey may not know to do. No explicit close affordance — the toggle behavior is invisible on first use. The hero orb CSS animations on mobile drain battery and add no value.

**Skeptical SMB Owner (project-specific)**
Arrives with "Can you actually do this?" and immediately hits three unverifiable stats (40 projects, 3 weeks, 12 industries) with no source, no client name, no context. The response is "who says?" The page then asks them to understand a distributed mesh architecture and a node legend before showing them proof it works for anyone like them. Trust architecture is inverted: the page demands comprehension before it has earned belief. The CaseStudies section exists below the fold and is the first credible proof — but it arrives after a section titled "Open Claw Network" that requires domain knowledge to interpret.

---

## Minor Observations

- `secondaryBuilds[0]` is "Mobile Apps" — neither AI Agents & Automation nor AI Training. Stale capability from a previous service architecture. Dilutes the page's service narrative.
- Two "Legal" entries in `useCases` (index 0: "Legal / Prof. Services", index 3: "Legal") — will render as two separate cards in the grid. Looks like a data error.
- `useScroll()` is called twice at lines 181 and 186 — both `scrollYProgress` and `scrollY` could come from one call. Minor but sloppy.
- `.cb-core-label` ("Core offering") is effectively an eyebrow label inside the featured card — same pattern the CLAUDE.md bans at section level, applied one tier down.
- Framer Motion `whileHover={{ y: -2 }}` on CTA buttons (lines 295–311) — pattern the homepage redesign removed. Inconsistency between pages will be felt as "something is slightly off" by visitors who can't name why.

---

## Questions to Consider

1. **If the MeshNetworkCanvas were the hero instead of the topology SVG, would the page be stronger?** The mesh is the most compelling thing here. Right now it's 60% down the page. What if it was the first thing you saw?

2. **What does "Open Claw Network" mean to someone who has never heard it before?** Is this a named product or an internal codename that leaked into the UI? If it's real, it needs introduction before the diagram.

3. **The page proves capability through complexity — mesh diagrams, node architectures, handoff flows. What if it proved capability through one specific client, one specific outcome, one specific timeline?** Complexity signals knowledge. Specificity signals confidence. Which converts a skeptical SMB owner?

4. **Why does a page called "AI Agents & Automation" list "Mobile Apps" as one of its four capabilities?**

5. **The dual Lenis bug produces no error — it's invisible until someone feels the jank. How many other pages have the same issue?**

---

First run for this target, no trend yet.
