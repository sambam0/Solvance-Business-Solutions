import { useScroll, motion, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, Fragment } from 'react'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import AuditCTA from './components/AuditCTA.jsx'
import Footer from './components/Footer.jsx'
import FadeIn from './components/FadeIn.jsx'
import SpringCard from './components/SpringCard.jsx'
import TerminalPane from './components/TerminalPane.jsx'
import HeroRainCanvas from './components/HeroRainCanvas.jsx'
import HeroTracesCanvas from './components/HeroTracesCanvas.jsx'
import NeuralNetCanvas from './components/NeuralNetCanvas.jsx'

const HeroBg = HeroRainCanvas
import FAQ from './components/FAQ.jsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] },
})

/* ── Pain Points ── */
const painPoints = [
  {
    icon: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>,
    title: "You're losing hours to work AI can handle",
    desc: "Drafting, summarizing, researching, responding — you're doing it manually because you haven't had time to set AI up properly.",
  },
  {
    icon: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    title: 'Your competitors are already using it',
    desc: "Businesses automating their ops now run leaner than competitors at the same revenue. That efficiency gap doesn't shrink on its own.",
  },
  {
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    title: "You've tried ChatGPT but it doesn't stick",
    desc: "Generic AI gives generic output. Without configuration, context, and workflow integration, it's a novelty — not a business tool.",
  },
]

/* ── AI Systems: mesh, handoff, use cases ── */
const HANDOFF_STEPS = [
  { label: 'Client Request', sub: 'Inbound trigger' },
  { label: 'Intake Agent',   sub: 'Cloud Node / VPS' },
  { label: 'Smart Router',   sub: 'Mesh Hub / VPN' },
  { label: 'Specialist Agent', sub: 'Assigned Node' },
  { label: 'Delivered Output', sub: 'Task complete' },
]

const PROCESS_STEPS = [
  {
    step: 'Audit',
    headline: 'We look before we build.',
    body: 'After your free call, we map your operations and price your options honestly. No pitch, no upsell.',
    deliverable: 'Operations map + prioritized AI opportunity list',
  },
  {
    step: 'Consult',
    headline: 'You see the full plan before you commit.',
    body: 'A concrete build proposal: what we build, what you own, what it costs, when it ships. You approve every line before we start.',
    deliverable: 'Signed scope + fixed-price quote',
  },
  {
    step: 'Build',
    headline: 'We ship it. You own everything.',
    body: 'Your code, your models, your data pipelines. No monthly SaaS fees. No vendor dependency. No black box.',
    deliverable: 'Live system + 60-day support window',
  },
]

const useCases = [
  {
    industry: 'Professional Services', color: '#9D6FFF',
    title: 'Expert Witness Management',
    solution: '5 AI agents managing expert matching, intake, and follow-up — split across local and cloud nodes.',
    metric: '3× faster placement', nodes: ['local'],
  },
  {
    industry: 'E-commerce', color: '#34D399',
    title: 'Operations Automation',
    solution: 'Automated inventory alerts, supplier comms, and order reconciliation running 24/7.',
    metric: '80% ops time saved', nodes: ['cloud'],
  },
  {
    industry: 'Tech / SaaS', color: '#3B9EFF',
    title: 'Customer Success Agents',
    solution: 'AI agents handling onboarding sequences, health scoring, and churn signal detection.',
    metric: '4× retention lift', nodes: ['hub', 'cloud', 'local'],
  },
  {
    industry: 'Agency / Services', color: '#F97316',
    title: 'Proposal & Scope Automation',
    solution: 'AI agents that draft proposals, pull historical project data, and generate accurate scopes — in minutes, not hours.',
    metric: '70% faster proposals', nodes: ['cloud', 'local'],
  },
  {
    industry: 'Healthcare', color: '#06B6D4',
    title: 'Admin Coordination',
    solution: 'Appointment scheduling, insurance pre-auth, and patient follow-up coordination.',
    metric: '60% admin reduction', nodes: ['cloud', 'hub'],
  },
  {
    industry: 'Real Estate', color: '#F59E0B',
    title: 'Deal Pipeline Ops',
    solution: 'Lead qualification, showing scheduling, and CRM sync across platforms — automated end-to-end.',
    metric: '2× deal velocity', nodes: ['hub', 'cloud'],
  },
]

/* ── AI Teaching offerings ── */
const offerings = [
  {
    name: 'Second Brain Setup',
    desc: 'One half-day session. Claude configured for your voice, your workflow, and your top recurring tasks. You leave with a working system — prompt library, system prompt, tested on real work.',
    items: ['4-hour hands-on session', 'System prompt tuned to your business', 'Prompt library for your top tasks', '30 days async follow-up', 'You own everything'],
    featured: true,
    ribbon: 'Start here',
  },
  {
    name: '1-on-1 Coaching',
    desc: 'Monthly sessions to deepen how you use AI — new tools, workflows, prompt refinement — scoped to what you actually need next.',
    items: ['2 sessions per month', 'Prompt library expansion', 'Unlimited async Q&A', 'No long-term commitment'],
  },
  {
    name: 'Team Training',
    desc: 'Custom AI training for your whole team. Readiness assessment, live sessions, and prompt playbooks built for your specific workflows.',
    items: ['AI readiness assessment', 'Custom curriculum design', 'Live group training', 'Prompt playbooks + docs'],
  },
]

/* ── Team ── */
const team = [
  {
    name: 'Sam',
    role: 'CEO / CTO',
    initials: 'S',
    desc: 'Builds the systems. Configures the infrastructure. Writes the code. Stays on through deployment and 60-day support. If it ships, Sam built it.',
    social: { github: 'https://github.com/sambam0', linkedin: 'https://www.linkedin.com/in/samuel-antoncich-785647358/' },
  },
  {
    name: 'Joe',
    role: 'Head of Sales',
    initials: 'J',
    desc: 'Your first call. Turns what you need into a concrete build plan, manages timelines, and makes sure nothing gets lost between the conversation and what ships.',
    social: { linkedin: 'https://www.linkedin.com/in/joseph-fasullo-a8112a368/' },
  },
]

/* ── FAQ ── */
const faqs = [
  {
    q: 'We already use ChatGPT — why do we need you?',
    a: "ChatGPT is a general-purpose tool. A configured second brain or custom agent system is built for your business — your data, your workflows, your voice. The difference is between owning a hammer and having a house built. We set up the systems, teach you to run them, and hand over everything.",
  },
  {
    q: 'How long does a typical engagement take?',
    a: "The Second Brain Setup is a half-day session — you leave using it the same week. AI agent systems typically go live in 3 weeks. Advisory retainers start immediately. Every engagement begins with a free 30-minute audit call to scope what makes sense.",
  },
  {
    q: 'Do we need technical staff?',
    a: "No. Our training is built for business owners and operators, not engineers. Our agent systems are designed to run without developer oversight. If you can describe your problem, we can solve it.",
  },
  {
    q: "What do we actually own when it's done?",
    a: "Everything — code, prompts, infrastructure, model configurations, and documentation. No recurring licensing fees, no vendor lock-in. You can modify the system yourself, hand it to another developer, migrate it to a different provider, or shut it down entirely. We write clean, documented code so you don't need us to maintain it unless you want to. After the 60-day support window, the system is fully yours to run independently.",
  },
  {
    q: 'Is our data safe?',
    a: "Every system runs on encrypted tunnels via Tailscale VPN, with private nodes for sensitive data and your choice of local or cloud deployment. We sign NDAs before any detailed conversation. Your data never touches our infrastructure unless you choose to host it there.",
  },
  {
    q: "What if it doesn't work?",
    a: "The free audit has zero commitment — it's designed to show you exactly where AI fits before you spend anything. Agent builds are scoped with fixed pricing and a 3-week delivery target. If we miss the target, we extend support free until it's right.",
  },
  {
    q: 'What does a build cost?',
    a: "Every build is scoped before it's priced — complexity and integrations vary too much for a fixed menu. The Second Brain Setup is a flat half-day session. All pricing comes in a written fixed-price quote after the free audit — no hourly billing, no surprises. If the numbers don't make sense for your business, we'll tell you upfront.",
  },
]


export default function App() {
  const { scrollYProgress, scrollY } = useScroll()
  const prefersReduced = useReducedMotion()
  const containerRef = useRef(null)
  const painRef = useRef(null)
  const systemsRef = useRef(null)
  const trainingRef = useRef(null)
  const teamRef = useRef(null)
  const headingY = useTransform(scrollY, [0, 400], [0, prefersReduced ? 0 : -30])
  const [selectedUseCase, setSelectedUseCase] = useState(null)

  useEffect(() => {
    const target = sessionStorage.getItem('scrollTarget')
    if (target) {
      sessionStorage.removeItem('scrollTarget')
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    }
  }, [])

  useEffect(() => {
    document.title = 'Solvance — AI Consulting & Implementation'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    let rafId
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Pain point cards
      if (painRef.current) {
        gsap.from(painRef.current.querySelectorAll('.pain-anim'), {
          opacity: 0, y: 32, duration: 0.6, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: painRef.current, start: 'top 78%', toggleActions: 'play none none none' },
        })
      }
      // Use case industry cards
      if (systemsRef.current) {
        gsap.from(systemsRef.current.querySelectorAll('.uc-industry-card'), {
          opacity: 0, y: 24, duration: 0.5, ease: 'power2.out', stagger: 0.07,
          scrollTrigger: { trigger: systemsRef.current.querySelector('.uc-industry-grid'), start: 'top 80%', toggleActions: 'play none none none' },
        })
      }
      // Training offering cards
      if (trainingRef.current) {
        gsap.from(trainingRef.current.querySelectorAll('.offer-anim'), {
          opacity: 0, y: 28, duration: 0.55, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: trainingRef.current, start: 'top 78%', toggleActions: 'play none none none' },
        })
      }
      // Team cards
      if (teamRef.current) {
        gsap.from(teamRef.current.querySelectorAll('.team-anim'), {
          opacity: 0, y: 28, duration: 0.6, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: teamRef.current, start: 'top 78%', toggleActions: 'play none none none' },
        })
      }
    })
  })

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <Nav />

      {/* ── 1. Hero ── */}
      <section className="hero" id="hero" ref={containerRef}>
        <HeroBg />
        <div className="wrap hero-wrap">
          <div className="hero-text">
            <motion.h1 style={{ y: headingY }} {...fadeUp(0.1)}>
              Your business,<br />
              <span className="grad">running on AI.</span>
            </motion.h1>

            <motion.p className="lede" {...fadeUp(0.28)}>
              We build custom AI systems for businesses ready to stop doing things manually —
              and train owners who want AI working for them, not just open in a tab.
            </motion.p>

            <motion.div className="ctas" {...fadeUp(0.44)}>
              <a href="#audit" className="btn brand">
                Book a free audit <span className="arrow">→</span>
              </a>
              <a href="#systems" className="btn ghost">
                See what we build <span className="arrow">→</span>
              </a>
            </motion.div>

            <motion.div className="hero-service-nav" {...fadeUp(0.52)}>
              <a href="#systems" className="service-chip">AI Systems & Automation <span className="chip-arrow">↓</span></a>
              <a href="#training" className="service-chip">AI Training & Teaching <span className="chip-arrow">↓</span></a>
            </motion.div>

            <motion.div className="hero-proof" {...fadeUp(0.62)}>
              <span>40+ AI systems shipped. 3 weeks to first result.</span>
              <span>Stack-agnostic. You own everything we build.</span>
            </motion.div>
          </div>

          <TerminalPane />
        </div>
      </section>

      {/* ── 2. Pain Points ── */}
      <section id="pain" ref={painRef}>
        <div className="wrap">
          <FadeIn><h2 className="section-title">Here's what doing it<br />manually is costing you.</h2></FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Your revenue grows. Your operations don't keep up. Every one of these is solvable — without hiring more people.
            </p>
          </FadeIn>

          <div className="pain-grid">
            {painPoints.map(p => (
              <div key={p.title} className="pain-anim">
                <SpringCard className="card" hoverY={-4} style={{ height: '100%', padding: '28px 24px' }}>
                  <div className="ic" style={{ marginBottom: 16 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{p.icon}</svg>
                  </div>
                  <h3 style={{ fontSize: 17, lineHeight: 1.35, marginBottom: 10, color: 'var(--ink)' }}>{p.title}</h3>
                  <p className="cb-item-desc">{p.desc}</p>
                </SpringCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. AI Systems ── */}
      <section id="systems" ref={systemsRef} style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroTracesCanvas />
        <div className="wrap">
          <FadeIn>
            <h2 className="section-title">AI agents built for<br />your business.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              We build AI agents that handle intake, ops, customer support, research, and outreach —
              running 24/7 without your attention. Everything we build runs in your environment.
              You own the code, the models, and the data. No SaaS fees, no vendor lock-in.
              Unlike rule-based automation tools, these agents can read context, handle ambiguous
              inputs, and make decisions — they're not just routing triggers from A to B.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="scenario-split">
              <div className="scenario-card">
                <span className="scenario-label">Best for</span>
                <h4 className="scenario-heading">You want work handled without you</h4>
                <p className="scenario-body">Intake routed, emails drafted, data reconciled — automatically, around the clock. You describe the workflow; we build the agent.</p>
                <a href="#systems" className="scenario-link">AI Agents & Automation <span className="arrow">→</span></a>
              </div>
              <div className="scenario-divider" aria-hidden="true" />
              <div className="scenario-card">
                <span className="scenario-label">Best for</span>
                <h4 className="scenario-heading">You want to use AI yourself, better</h4>
                <p className="scenario-body">A Claude setup tuned to your voice, your recurring tasks, and how you make decisions. Done in a half day. You leave using it immediately.</p>
                <a href="#training" className="scenario-link">AI Teaching & Training <span className="arrow">→</span></a>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="process-rail">
              {PROCESS_STEPS.map((s, i) => (
                <SpringCard key={s.step} className="process-card">
                  <div className="process-step-meta">
                    <span className="process-step-num">{i + 1}</span>
                    <span className="process-step-label">{s.step}</span>
                  </div>
                  <h3 className="process-headline">{s.headline}</h3>
                  <p className="process-body">{s.body}</p>
                  <div className="process-deliverable">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {s.deliverable}
                  </div>
                </SpringCard>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="wrap">
          {/* Agent Handoff Flow */}
          <FadeIn>
            <div className="cb-handoff">
              <p className="cb-handoff-label">How your AI handles a request from start to finish</p>
              <div className="cb-handoff-steps">
                {HANDOFF_STEPS.map((step, i) => (
                  <Fragment key={step.label}>
                    <div className="cb-handoff-step">
                      <div className="cb-handoff-num">{i + 1}</div>
                      <div className="cb-handoff-text">
                        <span className="cb-handoff-title">{step.label}</span>
                        <span className="cb-handoff-sub">{step.sub}</span>
                      </div>
                    </div>
                    {i < HANDOFF_STEPS.length - 1 && (
                      <div className="cb-handoff-connector" aria-hidden="true">
                        <div className="cb-handoff-line">
                          <div className="cb-handoff-traveler" style={{ animationDelay: `${i * 0.48}s` }} />
                        </div>
                        <svg className="cb-handoff-chevron" width="6" height="10" viewBox="0 0 6 10" fill="none">
                          <path d="M0 0L6 5L0 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Industry use case selector */}
          <div className="uc-industry-grid">
            {useCases.map((uc, i) => (
              <button
                key={uc.title}
                className={`uc-industry-card${selectedUseCase === i ? ' active' : ''}`}
                style={{ '--uc-accent': uc.color }}
                onClick={() => setSelectedUseCase(prev => prev === i ? null : i)}
                aria-pressed={selectedUseCase === i}
              >
                <span className="uc-ic-industry">{uc.industry}</span>
                <span className="uc-ic-title">{uc.title}</span>
                <span className="uc-ic-metric">{uc.metric}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedUseCase !== null && (
              <motion.div
                key={selectedUseCase}
                className="uc-detail"
                style={{ '--uc-accent': useCases[selectedUseCase].color }}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                exit={{    opacity: 0, y: -6, filter: 'blur(3px)' }}
                transition={{ type: 'spring', duration: 0.38, bounce: 0 }}
              >
                <div className="uc-detail-metric">
                  {useCases[selectedUseCase].metric}
                </div>
                <div className="uc-detail-body">
                  <h3>{useCases[selectedUseCase].title}</h3>
                  <p>{useCases[selectedUseCase].solution}</p>
                </div>
                <div className="uc-detail-nodes">
                  {useCases[selectedUseCase].nodes.map(id => (
                    <span key={id} className="uc-node-badge">{id}</span>
                  ))}
                  <span className="uc-node-label">active nodes</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── 4. AI Teaching / Second Brain ── */}
      <section id="training" ref={trainingRef} style={{ background: 'var(--bg-2)', position: 'relative' }}>
        <NeuralNetCanvas />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-identity">AI Training & Teaching</div>
          <FadeIn><h2 className="section-title">AI training,<br />for your business.</h2></FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Most people use Claude like a search engine — open it, ask a question, copy the
              answer, close the tab. That's not wrong, it's just the surface.{' '}
              We teach you how to actually work with it: connect it to your tools, build a second
              brain that knows your business, and automate the repetitive work that's eating your
              week. Most clients reclaim 5–10 hours in the first month.{' '}
              If you need a system that operates without your involvement at all, that's AI Agents.
              Most clients do one, then the other.
            </p>
          </FadeIn>

          <div className="training-stats">
            {[
              { metric: '5–10 hrs', label: 'reclaimed per week' },
              { metric: 'Half day', label: 'to get fully set up' },
              { metric: '30 days', label: 'async follow-up included' },
            ].map(({ metric, label }) => (
              <SpringCard key={metric} className="training-stat offer-anim" hoverY={-2}>
                <span className="stat-metric">{metric}</span>
                <span className="stat-label">{label}</span>
              </SpringCard>
            ))}
          </div>

          <div className="training-grid">
            {/* Featured hero panel — Second Brain Setup */}
            {(() => {
              const featured = offerings.find(o => o.featured);
              return (
                <FadeIn delay={0.05}>
                  <SpringCard className="card" hoverY={-3} style={{ padding: '36px 32px', borderColor: 'var(--brand-2)' }}>
                    <div className="training-hero-panel">
                      {/* Left: identity + checklist + CTA */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <span className="offer-ribbon">{featured.ribbon}</span>
                          <h3 className="offer-title">{featured.name}</h3>
                          <p className="offer-desc">{featured.desc}</p>
                        </div>
                        <ul className="offer-features">
                          {featured.items.map(item => (
                            <li key={item} className="offer-feature">
                              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <a href="#audit" className="btn brand" style={{ alignSelf: 'flex-start', fontSize: 14, padding: '13px 24px' }}>
                          Start with a free audit <span className="arrow">→</span>
                        </a>
                      </div>
                      {/* Right: process steps */}
                      <div className="offer-steps">
                        <p className="offer-steps-label">How the 4 hours work</p>
                        <div className="offer-step">
                          <span className="offer-step-num">01</span>
                          <div className="offer-step-body">
                            <span className="offer-step-name">Discovery</span>
                            <span className="offer-step-desc">We map your top 5 recurring tasks and how you think through decisions.</span>
                          </div>
                        </div>
                        <div className="offer-step">
                          <span className="offer-step-num">02</span>
                          <div className="offer-step-body">
                            <span className="offer-step-name">Configuration</span>
                            <span className="offer-step-desc">We build your system prompt, prompt library, and test everything on real work.</span>
                          </div>
                        </div>
                        <div className="offer-step">
                          <span className="offer-step-num">03</span>
                          <div className="offer-step-body">
                            <span className="offer-step-name">Handoff</span>
                            <span className="offer-step-desc">You leave running it yourself. 30 days of async follow-up if anything needs tuning.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SpringCard>
                </FadeIn>
              );
            })()}

            {/* Secondary cards — 1-on-1 Coaching + Team Training */}
            <div className="training-secondary">
              {offerings.filter(o => !o.featured).map((o, i) => {
                const labels = ['Learn about Coaching', 'Learn about Team Training'];
                return (
                  <FadeIn key={o.name} delay={0.1 + i * 0.06}>
                    <SpringCard className="card" hoverY={-4} style={{ height: '100%', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <h3 className="offer-title-sm">{o.name}</h3>
                      <p className="offer-desc-sm">{o.desc}</p>
                      <ul className="offer-features">
                        {o.items.map(item => (
                          <li key={item} className="offer-feature">
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a href="#audit" className="btn ghost" style={{ alignSelf: 'flex-start', fontSize: 14, padding: '13px 24px', marginTop: 'auto' }}
                        aria-label={labels[i]}>
                        {labels[i]} <span className="arrow">→</span>
                      </a>
                    </SpringCard>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Team ── */}
      <section id="team" ref={teamRef}>
        <div className="wrap">
          <FadeIn>
            <p className="team-intro">A two-person firm by design. You work directly with the people who build your system — no account managers, no handoffs, no telephone game.</p>
          </FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Who you'll work with.</h2></FadeIn>

          <div className="team-grid">
            {team.map(m => (
              <div key={m.name} className="team-anim">
                <SpringCard className="card team-card" hoverY={-4} style={{ padding: '32px 28px' }}>
                  <div className="team-av">{m.initials}</div>
                  <div className="team-info">
                    <h3 style={{ fontSize: 20, marginBottom: 2 }}>{m.name}</h3>
                    <span style={{ fontSize: 12, fontFamily: "'Geist Mono', monospace", color: 'var(--brand)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{m.role}</span>
                    <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.55, marginTop: 14 }}>{m.desc}</p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                      {m.social.linkedin && (
                        <a href={m.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={`${m.name} LinkedIn`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                      )}
                      {m.social.github && (
                        <a href={m.social.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={`${m.name} GitHub`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                </SpringCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <FAQ faqs={faqs} />

      <AuditCTA preset="" accent="blue" />
      <Footer />
    </>
  )
}
