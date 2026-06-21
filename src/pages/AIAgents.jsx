import { useEffect, useRef, useState, Fragment } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import FadeIn from '../components/FadeIn.jsx'
import AuditCTA from '../components/AuditCTA.jsx'
import SpringCard from '../components/SpringCard.jsx'
import WorkflowCanvas from '../components/WorkflowCanvas.jsx'
import MeshNetworkCanvas from '../components/MeshNetworkCanvas.jsx'
import Process from '../components/Process.jsx'
import CaseStudies from '../components/CaseStudies.jsx'
import Pricing from '../components/Pricing.jsx'
import FAQ from '../components/FAQ.jsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] },
})

function StatCounter({ target, suffix, label }) {
  const ref = useRef(null)
  const numRef = useRef(null)
  const prefersReduced = useReducedMotion()
  useEffect(() => {
    if (prefersReduced) return
    const isDecimal = String(target).includes('.')
    let started = false
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || started) return
      started = true; obs.disconnect()
      const duration = 1300; const startTime = performance.now()
      function tick(now) {
        const p = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        const val = isDecimal ? (eased * target).toFixed(1) : Math.floor(eased * target)
        if (numRef.current) numRef.current.innerHTML = val + '<sup>' + suffix + '</sup>'
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, suffix, prefersReduced])
  return (
    <motion.div className="stat" ref={ref} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      <div className="n" ref={numRef} dangerouslySetInnerHTML={{ __html: `${target}<sup>${suffix}</sup>` }} />
      <div className="l">{label}</div>
    </motion.div>
  )
}

const secondaryBuilds = [
  {
    icon: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    title: 'Mobile Apps',
    desc: 'Native iOS and Android apps built for production — from MVP through App Store launch.',
  },
  {
    icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
    title: 'AI Teaching & Training',
    desc: 'Hands-on workshops and custom LLM training that leave you and your team actually capable — not dependent on a vendor.',
    href: '/ai-training',
  },
  {
    icon: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>,
    title: 'Custom Integrations',
    desc: 'Complex API integrations and specialized deployments standard agencies won\'t touch.',
  },
]

function navigate(href) {
  history.pushState({}, '', href)
  window.dispatchEvent(new Event('locationchange'))
}

const HANDOFF_STEPS = [
  { label: 'Client Request', sub: 'Inbound trigger' },
  { label: 'Intake Agent',   sub: 'Cloud Node / VPS' },
  { label: 'Smart Router',   sub: 'Mesh Hub / VPN' },
  { label: 'Specialist Agent', sub: 'Assigned Node' },
  { label: 'Delivered Output', sub: 'Task complete' },
]

const NODE_LEGEND = [
  { id: 'hub',   color: '#3B82F6', label: 'Mesh Hub',     desc: 'VPN routing & secure tunnels' },
  { id: 'cloud', color: '#8B5CF6', label: 'Cloud Node',   desc: 'Always-on intake & ops agents' },
  { id: 'local', color: '#22C55E', label: 'Private Node', desc: 'Local AI & proprietary data' },
]

const useCases = [
  {
    industry: 'Legal / Prof. Services',
    color: '#9D6FFF',
    title: 'Expert Witness Management',
    solution: '5 AI agents managing expert matching, intake, and follow-up — split across local and cloud nodes.',
    metric: '3× faster placement',
    nodes: ['local'],
  },
  {
    industry: 'E-commerce',
    color: '#34D399',
    title: 'Operations Automation',
    solution: 'Automated inventory alerts, supplier comms, and order reconciliation running 24/7.',
    metric: '80% ops time saved',
    nodes: ['cloud'],
  },
  {
    industry: 'Tech / SaaS',
    color: '#3B9EFF',
    title: 'Customer Success Agents',
    solution: 'AI agents handling onboarding sequences, health scoring, and churn signal detection.',
    metric: '4× retention lift',
    nodes: ['hub', 'cloud', 'local'],
  },
  {
    industry: 'Legal',
    color: '#F97316',
    title: 'Law Firm Intake',
    solution: '24/7 client intake, conflict checks, and matter routing — no staff required after hours.',
    metric: 'Zero missed leads',
    nodes: ['cloud'],
  },
  {
    industry: 'Healthcare',
    color: '#06B6D4',
    title: 'Admin Coordination',
    solution: 'Appointment scheduling, insurance pre-auth, and patient follow-up coordination.',
    metric: '60% admin reduction',
    nodes: ['cloud', 'hub'],
  },
  {
    industry: 'Real Estate',
    color: '#F59E0B',
    title: 'Deal Pipeline Ops',
    solution: 'Lead qualification, showing scheduling, and CRM sync across platforms — automated end-to-end.',
    metric: '2× deal velocity',
    nodes: ['hub', 'cloud'],
  },
]

const industries = [
  { abbr: 'SA', label: 'SaaS / Operations',    color: '#3B9EFF' },
  { abbr: 'EC', label: 'E-commerce',            color: '#34d399' },
  { abbr: 'PS', label: 'Professional Services', color: '#9D6FFF' },
  { abbr: 'HC', label: 'Healthcare',            color: '#06B6D4' },
  { abbr: 'FN', label: 'Fintech',               color: '#F59E0B' },
  { abbr: 'MD', label: 'Media & Content',       color: '#F97316' },
  { abbr: 'LG', label: 'Logistics',             color: '#60A5FA' },
  { abbr: 'RE', label: 'Real Estate',           color: '#A78BFA' },
]

function TrustBar() {
  const tiles = [...industries, ...industries]
  return (
    <div className="logos-section">
      <div className="wrap">
        <p className="label">Industries we've shipped for</p>
      </div>
      <div className="marquee-wrap">
        <div className="marquee">
          {tiles.map((ind, i) => (
            <div key={i} className="logo-tile">
              <div className="lm" style={{ background: ind.color }}>{ind.abbr}</div>
              {ind.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AIAgents() {
  const { scrollYProgress } = useScroll()
  const prefersReduced = useReducedMotion()
  const containerRef = useRef(null)
  const buildRef = useRef(null)
  const ucRef = useRef(null)
  const { scrollY } = useScroll()
  const headingY = useTransform(scrollY, [0, 400], [0, prefersReduced ? 0 : -30])
  const [selectedUseCase, setSelectedUseCase] = useState(null)
  const highlightNodes = selectedUseCase !== null ? useCases[selectedUseCase].nodes : []

  useEffect(() => {
    document.title = 'AI Agents & Automation — Solvance'
    window.scrollTo(0, 0)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.5 })
    let rafId
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (buildRef.current) {
        const buildItems = buildRef.current.querySelectorAll('.build-anim')
        gsap.from(buildItems, {
          opacity: 0,
          y: 28,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: buildRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        })
      }
      if (ucRef.current) {
        const ucCards = ucRef.current.querySelectorAll('.uc-industry-card')
        gsap.from(ucCards, {
          opacity: 0,
          y: 24,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.07,
          scrollTrigger: {
            trigger: ucRef.current.querySelector('.uc-industry-grid'),
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    })
  })

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <Nav />

      {/* ── Hero ── */}
      <section className="hero" id="hero" ref={containerRef}>
        <div className="hero-orbs" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        {/* Faint topology hint — 3-node mesh architecture */}
        <div className="hero-topo" aria-hidden="true">
          <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="160" y1="44" x2="68" y2="196" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 7" />
            <line x1="160" y1="44" x2="252" y2="196" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4 7" />
            <line x1="68" y1="196" x2="252" y2="196" stroke="#22C55E" strokeWidth="1" strokeDasharray="4 7" />
            <circle cx="160" cy="44" r="16" fill="#0F1E36" />
            <circle cx="160" cy="44" r="16" stroke="#3B82F6" strokeWidth="1.5" />
            <circle cx="68" cy="196" r="16" fill="#1A1030" />
            <circle cx="68" cy="196" r="16" stroke="#8B5CF6" strokeWidth="1.5" />
            <circle cx="252" cy="196" r="16" fill="#022c22" />
            <circle cx="252" cy="196" r="16" stroke="#22C55E" strokeWidth="1.5" />
            <text x="160" y="28" textAnchor="middle" fill="#3B82F6" fontSize="9" fontFamily="monospace" opacity="0.8">HUB</text>
            <text x="68" y="226" textAnchor="middle" fill="#8B5CF6" fontSize="9" fontFamily="monospace" opacity="0.8">CLOUD</text>
            <text x="252" y="226" textAnchor="middle" fill="#22C55E" fontSize="9" fontFamily="monospace" opacity="0.8">LOCAL</text>
            <circle className="topo-traveler" r="3" fill="#3B9EFF">
              <animateMotion dur="3s" repeatCount="indefinite" path="M160,44 L68,196" />
            </circle>
            <circle className="topo-traveler" r="3" fill="#9D6FFF">
              <animateMotion dur="4.2s" repeatCount="indefinite" begin="1.4s" path="M160,44 L252,196" />
            </circle>
            <circle className="topo-traveler" r="3" fill="#22C55E">
              <animateMotion dur="3.6s" repeatCount="indefinite" begin="2.1s" path="M68,196 L252,196" />
            </circle>
          </svg>
        </div>

        <div className="wrap">
          <motion.a className="ann" href="#audit" {...fadeUp(0)}>
            <b>Now</b> Taking 3 new AI projects this quarter →
          </motion.a>

          <motion.h1 style={{ y: headingY }} {...fadeUp(0.1)}>
            AI that works while you sleep.<br />
            <span className="grad">Built for your industry.</span>
          </motion.h1>

          <motion.p className="lede" {...fadeUp(0.28)}>
            Custom AI agents and automation systems that handle intake, operations, and follow-up —
            production-grade, stack-agnostic, yours to keep.
          </motion.p>

          <motion.div className="ctas" {...fadeUp(0.44)}>
            <motion.a
              href="#audit"
              className="btn brand"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Get started <span className="arrow">→</span>
            </motion.a>
            <motion.a
              href="#use-cases"
              className="btn ghost"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              See use cases
            </motion.a>
          </motion.div>

          <motion.div className="micro" {...fadeUp(0.56)}>
            <span><span className="ck">✓</span> You own everything we build</span>
            <span><span className="ck">✓</span> Stack-agnostic</span>
            <span><span className="ck">✓</span> Results-first, always</span>
          </motion.div>

          <div className="stats">
            <StatCounter target={40} suffix="+" label="Projects delivered across industries" />
            <StatCounter target={3} suffix=" wks" label="Average time to first measurable result" />
            <StatCounter target={12} suffix="+" label="Industries served across all projects" />
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <TrustBar />

      {/* ── What We Build ── */}
      <section id="what-we-build" ref={buildRef}>
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> What we build</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Four capabilities.<br />Unlimited scope.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">From a mobile app to a fully autonomous AI system — if your business needs it, we can build it.</p></FadeIn>

          <div className="cb-build-layout">
            {/* Left: AI Agents feature block */}
            <FadeIn className="cb-build-featured-wrap">
              <SpringCard className="card cb-build-featured" hoverY={-4}>
                <div className="cb-build-featured-head">
                  <div className="ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                    </svg>
                  </div>
                  <span className="cb-core-label">Core offering</span>
                </div>
                <h3>AI Agents &<br />Automation</h3>
                <p>Autonomous agents that run research, outreach, data processing, and customer support — 24/7, without manual oversight. Built on your data, your tools, your stack.</p>
                {/* Mini mesh — mirrors the Open Claw architecture */}
                <div className="cb-mini-mesh" aria-hidden="true">
                  <svg viewBox="0 0 260 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="130" y1="26" x2="50" y2="134" stroke="#3B82F6" strokeWidth="1.5" opacity="0.35" strokeDasharray="3 5" />
                    <line x1="130" y1="26" x2="210" y2="134" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.35" strokeDasharray="3 5" />
                    <line x1="50" y1="134" x2="210" y2="134" stroke="#22C55E" strokeWidth="1.5" opacity="0.35" strokeDasharray="3 5" />
                    <circle cx="130" cy="26" r="15" fill="#0F1E36" />
                    <circle cx="130" cy="26" r="15" stroke="#3B82F6" strokeWidth="1.5" />
                    <text x="130" y="30" textAnchor="middle" fill="#3B9EFF" fontSize="8" fontFamily="monospace" fontWeight="600">HUB</text>
                    <circle cx="50" cy="134" r="15" fill="#1A1030" />
                    <circle cx="50" cy="134" r="15" stroke="#8B5CF6" strokeWidth="1.5" />
                    <text x="50" y="138" textAnchor="middle" fill="#9D6FFF" fontSize="7" fontFamily="monospace" fontWeight="600">CLOUD</text>
                    <circle cx="210" cy="134" r="15" fill="#022c22" />
                    <circle cx="210" cy="134" r="15" stroke="#22C55E" strokeWidth="1.5" />
                    <text x="210" y="138" textAnchor="middle" fill="#22C55E" fontSize="7" fontFamily="monospace" fontWeight="600">LOCAL</text>
                    <circle className="mini-mesh-traveler" r="3" fill="#3B9EFF">
                      <animateMotion dur="2.8s" repeatCount="indefinite" path="M130,26 L50,134" />
                    </circle>
                    <circle className="mini-mesh-traveler" r="3" fill="#9D6FFF">
                      <animateMotion dur="3.3s" repeatCount="indefinite" begin="1.1s" path="M130,26 L210,134" />
                    </circle>
                    <circle className="mini-mesh-traveler" r="3" fill="#22C55E">
                      <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.6s" path="M50,134 L210,134" />
                    </circle>
                  </svg>
                </div>
              </SpringCard>
            </FadeIn>

            {/* Right: 3 secondary capabilities */}
            <div className="cb-build-secondary">
              {secondaryBuilds.map((item, i) => (
                <div key={item.title} className="build-anim">
                  <div className={`cb-build-item${i < secondaryBuilds.length - 1 ? ' cb-build-item-divided' : ''}`}>
                    <div className="ic cb-item-ic">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <div className="cb-item-title">
                        {item.href
                          ? <button onClick={() => navigate(item.href)} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: 3 }}>{item.title} →</button>
                          : item.title
                        }
                      </div>
                      <p className="cb-item-desc">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Open Claw Network ── */}
      <section id="use-cases" ref={ucRef}>
        <div className="wrap">
          <FadeIn>
            <span className="eyebrow"><span className="dot" /> Open Claw Network</span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="section-title">
              Real infrastructure.<br />
              <span className="grad">Built for your industry.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Three nodes. Six industries. One mesh that routes every task to the right agent automatically.
            </p>
          </FadeIn>
        </div>

        {/* Full-viewport-width canvas with edge vignettes */}
        <div className="cb-canvas-full">
          <MeshNetworkCanvas highlightNodes={highlightNodes} />
        </div>

        <div className="wrap">
          {/* Node legend */}
          <div className="cb-node-legend">
            {NODE_LEGEND.map(n => (
              <div key={n.id} className="cb-node-legend-item">
                <span className="cb-node-dot" style={{ background: n.color, boxShadow: `0 0 8px ${n.color}66` }} />
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

          {/* Industry selector — 3-column cards */}
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

      {/* ── Case Studies — deep ocean wash ── */}
      <div className="cb-case-bg">
        <CaseStudies />
      </div>

      {/* ── WorkflowCanvas ── */}
      <WorkflowCanvas />

      {/* ── Process ── */}
      <Process />

      {/* ── Pricing ── */}
      <Pricing />

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── Capacity stripe — elevated conversion trigger ── */}
      <div className="cb-capacity-stripe">
        <div className="wrap">
          <div className="cb-cap-inner">
            <span className="cb-cap-dot" aria-hidden="true" />
            <p className="cb-cap-text">
              Taking <strong>3 new projects</strong> this quarter — <strong>2 slots remaining</strong>
            </p>
            <a href="#audit" className="btn brand cb-cap-cta">
              Reserve a slot <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <AuditCTA preset="ai-agents" accent="blue" />
      <Footer />
    </>
  )
}
