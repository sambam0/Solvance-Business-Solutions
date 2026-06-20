import { useEffect, useRef, useState } from 'react'
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

const whatWeBuild = [
  {
    icon: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    title: 'Mobile Apps',
    desc: 'Native iOS and Android apps built for production — from MVP through App Store launch. We\'ve shipped apps across consumer, B2B, and vertical SaaS use cases.',
  },
  {
    icon: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>,
    title: 'AI Agents & Automation',
    desc: 'Autonomous agents that run research, outreach, data processing, and customer support — 24/7, without manual oversight. Built on your data, your tools, your stack.',
  },
  {
    icon: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>,
    title: 'Custom Integrations & Stack Installs',
    desc: 'Bespoke system builds, complex API integrations, and specialized software deployments standard agencies won\'t touch. If your stack is unusual or your requirements are exact, we\'re built for it.',
  },
  {
    icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
    title: 'AI Teaching & Training',
    desc: 'Custom LLM fine-tuning, AI literacy programs, and hands-on workshops that leave your team capable of extending and maintaining the systems we build.',
  },
]

const industries = [
  { abbr: 'SA', label: 'SaaS / Operations',      color: '#3B9EFF' },
  { abbr: 'EC', label: 'E-commerce',              color: '#34d399' },
  { abbr: 'PS', label: 'Professional Services',   color: '#9D6FFF' },
  { abbr: 'HC', label: 'Healthcare',              color: '#06B6D4' },
  { abbr: 'FN', label: 'Fintech',                 color: '#F59E0B' },
  { abbr: 'MD', label: 'Media & Content',         color: '#F97316' },
  { abbr: 'LG', label: 'Logistics',               color: '#60A5FA' },
  { abbr: 'RE', label: 'Real Estate',             color: '#A78BFA' },
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

export default function CustomBuilds() {
  const { scrollYProgress } = useScroll()
  const prefersReduced = useReducedMotion()
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const orb1Y = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -60])
  const orb2Y = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -40])
  const headingY = useTransform(scrollY, [0, 400], [0, prefersReduced ? 0 : -30])
  const [selectedUseCase, setSelectedUseCase] = useState(null)
  const highlightNodes = selectedUseCase !== null ? useCases[selectedUseCase].nodes : []

  useEffect(() => {
    document.title = 'Custom Builds — Solvance'
    window.scrollTo(0, 0)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.5 })
    let rafId
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <Nav />

      {/* ── Hero ── */}
      <section className="hero" id="hero" ref={containerRef}>
        <div className="hero-orbs" aria-hidden="true">
          <motion.div className="hero-orb hero-orb-1" style={{ y: orb1Y }} />
          <motion.div className="hero-orb hero-orb-2" style={{ y: orb2Y }} />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="wrap">
          <motion.a className="ann" href="#audit" {...fadeUp(0)}>
            <b>Now</b> Taking 3 new projects this quarter →
          </motion.a>

          <motion.h1 style={{ y: headingY }} {...fadeUp(0.1)}>
            Built for where you're going,<br />
            <span className="grad">not where you've been.</span>
          </motion.h1>

          <motion.p className="lede" {...fadeUp(0.28)}>
            Custom AI systems, mobile apps, and integrations for businesses done settling.
            Production-grade, stack-agnostic, yours to keep.
          </motion.p>

          <motion.div className="ctas" {...fadeUp(0.44)}>
            <motion.a
              href="#audit"
              className="btn brand"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Get a free audit <span className="arrow">→</span>
            </motion.a>
            <motion.a
              href="#what-we-build"
              className="btn ghost"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              See what we build
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
      <section id="what-we-build">
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> What we build</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Four categories.<br />Unlimited scope.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">From a mobile app to a fully autonomous AI system — if your business needs it, we can build it.</p></FadeIn>

          <div className="feat-grid" style={{ marginTop: 48 }}>
            {whatWeBuild.map((item, i) => (
              <FadeIn key={item.title} delay={0.08 * i} className="span-6">
                <SpringCard className="card" hoverY={-4} style={{ height: '100%' }}>
                  <div className="ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {item.icon}
                    </svg>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases + Mesh Network (unified) ── */}
      <section id="use-cases">
        <div className="wrap">
          <FadeIn>
            <span className="eyebrow"><span className="dot" /> Open Claw Network</span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="section-title">
              Powered by real infrastructure.<br />
              <span className="grad">Built for your industry.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              The same mesh — hub, cloud, and local node — runs every deployment.
              Select your industry to see which nodes handle the work.
            </p>
          </FadeIn>
        </div>

        <MeshNetworkCanvas highlightNodes={highlightNodes} />

        <div className="wrap">
          <div className="uc-pills">
            {useCases.map((uc, i) => (
              <button
                key={uc.title}
                className={`uc-pill${selectedUseCase === i ? ' active' : ''}`}
                style={{ '--uc-accent': uc.color }}
                onClick={() => setSelectedUseCase(prev => prev === i ? null : i)}
                aria-pressed={selectedUseCase === i}
              >
                {uc.industry}
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

      {/* ── Case Studies — before technical sections so social proof lands first ── */}
      <CaseStudies />

      {/* ── WorkflowCanvas ── */}
      <WorkflowCanvas />

      {/* ── Process ── */}
      <Process />

      {/* ── Pricing ── */}
      <Pricing />

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── Capacity signal ── */}
      <div className="cb-capacity">
        <div className="wrap">
          <div className="cb-cap-pill">
            <span className="cb-cap-dot" aria-hidden="true" />
            Taking <strong>3 new projects</strong> this quarter — 2 slots remaining
          </div>
        </div>
      </div>

      <AuditCTA preset="custom-builds" accent="blue" />
      <Footer />
    </>
  )
}
