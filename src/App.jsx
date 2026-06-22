import { useScroll, motion, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, Fragment } from 'react'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import AuditCTA from './components/AuditCTA.jsx'
import Footer from './components/Footer.jsx'
import FadeIn from './components/FadeIn.jsx'
import SpringCard from './components/SpringCard.jsx'
import TerminalPane from './components/TerminalPane.jsx'
import MeshNetworkCanvas from './components/MeshNetworkCanvas.jsx'
import HeroRainCanvas from './components/HeroRainCanvas.jsx'
import HeroTracesCanvas from './components/HeroTracesCanvas.jsx'

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
    desc: "The businesses pulling ahead automated their repetitive work and focused on growth. The gap widens every month you wait.",
  },
  {
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    title: "You've tried ChatGPT but it doesn't stick",
    desc: "Generic AI gives generic output. Without configuration, context, and workflow integration, it's a novelty — not a business tool.",
  },
]

/* ── AI Systems: mesh, handoff, use cases ── */
const NODE_LEGEND = [
  { id: 'hub',   color: 'var(--brand)',  label: 'Mesh Hub',     desc: 'VPN routing & secure tunnels' },
  { id: 'cloud', color: 'var(--brand-2)', label: 'Cloud Node',   desc: 'Always-on intake & ops agents' },
  { id: 'local', color: 'var(--green)',  label: 'Private Node', desc: 'Local AI & proprietary data' },
]

const HANDOFF_STEPS = [
  { label: 'Client Request', sub: 'Inbound trigger' },
  { label: 'Intake Agent',   sub: 'Cloud Node / VPS' },
  { label: 'Smart Router',   sub: 'Mesh Hub / VPN' },
  { label: 'Specialist Agent', sub: 'Assigned Node' },
  { label: 'Delivered Output', sub: 'Task complete' },
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
    desc: 'Monthly sessions to expand your AI stack. New tools, workflows, prompt refinement — scoped to what you actually need.',
    items: ['2 sessions per month', 'Prompt library expansion', 'Unlimited async Q&A', 'No long-term commitment'],
  },
  {
    name: 'Team Training',
    desc: 'Custom AI training for your whole org. Assessment, curriculum, live sessions, and prompt playbooks your team will actually use.',
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
    social: { github: 'https://github.com/sambam0', linkedin: 'https://linkedin.com/in/sam-solvance' },
  },
  {
    name: 'Joe',
    role: 'Head of Sales',
    initials: 'J',
    desc: 'Your first call. Translates business problems into technical scopes, manages timelines, and makes sure nothing gets lost between what you need and what gets built.',
    social: { linkedin: 'https://linkedin.com/in/joe-solvance' },
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
    a: "Everything. Code, prompts, infrastructure, documentation. No recurring licensing fees, no vendor lock-in, no hostage situation. You own it completely and can modify it without us.",
  },
  {
    q: 'Is our data safe?',
    a: "Every system runs on encrypted tunnels via Tailscale VPN, with private nodes for sensitive data and your choice of local or cloud deployment. We sign NDAs before any detailed conversation. Your data never touches our infrastructure unless you choose to host it there.",
  },
  {
    q: "What if it doesn't work?",
    a: "The free audit has zero commitment — it's designed to show you exactly where AI fits before you spend anything. Agent builds are scoped with fixed pricing and a 3-week delivery target. If we miss the target, we extend support free until it's right.",
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
  const highlightNodes = selectedUseCase !== null ? useCases[selectedUseCase].nodes : []

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
              We build custom AI systems for businesses ready to scale — and train the
              owners who want to understand exactly how it works.
            </motion.p>

            <motion.div className="ctas" {...fadeUp(0.44)}>
              <a href="#audit" className="btn brand">
                Book a free audit <span className="arrow">→</span>
              </a>
              <a href="#systems" className="btn ghost">
                See what we build <span className="arrow">→</span>
              </a>
            </motion.div>

            <motion.div className="hero-proof" {...fadeUp(0.56)}>
              <span>40+ AI systems shipped. 3 weeks to first result.</span>
              <span>Stack-agnostic. Everything you own.</span>
            </motion.div>
          </div>

          <TerminalPane />
        </div>
      </section>

      {/* ── 2. Pain Points ── */}
      <section id="pain" ref={painRef}>
        <div className="wrap">
          <FadeIn><h2 className="section-title">You know AI matters.<br />You just haven't had time.</h2></FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Your business is growing. Your operations aren't keeping up. These are the problems we solve.
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
            <h2 className="section-title">What we build.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Every system runs on a distributed mesh — private nodes for sensitive data,
              cloud nodes for always-on availability, encrypted tunnels between them.
              Built on <span className="mono">OpenClaw</span> orchestration, <span className="mono">Hermes</span> for
              intelligent routing, and <span className="mono">Tailscale</span> for zero-trust networking.
            </p>
          </FadeIn>
        </div>

        <div className="cb-canvas-full">
          <MeshNetworkCanvas highlightNodes={highlightNodes} />
        </div>

        <div className="wrap">
          {/* Node legend */}
          <div className="cb-node-legend">
            {NODE_LEGEND.map(n => (
              <div key={n.id} className="cb-node-legend-item">
                <span className="cb-node-dot" style={{ background: n.color, boxShadow: `0 0 8px color-mix(in srgb, ${n.color} 40%, transparent)` }} />
                <span className="cb-node-name" style={{ color: n.color }}>{n.label}</span>
                <span className="cb-node-desc">{n.desc}</span>
              </div>
            ))}
          </div>

          {/* Agent Handoff Flow */}
          <FadeIn>
            <div className="cb-handoff">
              <p className="cb-handoff-label">How a request flows through the network</p>
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
      <section id="training" ref={trainingRef} style={{ background: 'var(--bg-2)' }}>
        <div className="wrap">
          <FadeIn><h2 className="section-title">Your second brain,<br />configured in a half day.</h2></FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Most business owners spend 10–15 hours a week on work they could hand off to AI.
              We set up Claude as your personal second brain — tuned to your voice, your tasks,
              your business — and hand it back to you in a half day.
            </p>
          </FadeIn>

          <div className="training-grid">
            {offerings.map((o) => (
              <div key={o.name} className={`offer-anim${o.featured ? ' training-featured' : ''}`}>
                <SpringCard className={`card${o.featured ? ' training-card-featured' : ''}`} hoverY={-4} style={{ height: '100%', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, borderColor: o.featured ? 'var(--brand-2)' : undefined }}>
                  {o.ribbon && <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: 'var(--brand-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{o.ribbon}</span>}
                  <h3 style={{ fontSize: 20, lineHeight: 1.3, color: 'var(--ink)' }}>{o.name}</h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.55, flex: 1 }}>{o.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {o.items.map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="#audit" className={`btn ${o.featured ? 'brand' : 'ghost'}`} style={{ alignSelf: 'flex-start', fontSize: 13, padding: '10px 20px' }}>
                    {o.featured ? 'Start with a free audit' : 'Learn more'} <span className="arrow">→</span>
                  </a>
                </SpringCard>
              </div>
            ))}
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
