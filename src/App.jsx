import { useScroll, motion, useTransform, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import AuditCTA from './components/AuditCTA.jsx'
import Footer from './components/Footer.jsx'
import FadeIn from './components/FadeIn.jsx'
import SpringCard from './components/SpringCard.jsx'

function navigate(href) {
  history.pushState({}, '', href)
  window.dispatchEvent(new Event('locationchange'))
}

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

const pillars = [
  {
    href: '/ai-agents',
    label: 'AI Agents & Automation',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
    eyebrow: 'We build it for you',
    headline: 'AI that handles your operations while you focus on growth.',
    features: [
      'Custom agents for intake, ops, and customer support',
      'Production-grade — stack-agnostic, yours to own',
      'Live in weeks, not months',
    ],
    cta: 'See what we build',
  },
  {
    href: '/ai-training',
    label: 'AI Teaching & Training',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    eyebrow: 'We teach you how',
    headline: 'Understand AI well enough to run your business with it.',
    features: [
      'Hands-on workshops — your tools, your workflows',
      'Prompt engineering, tool selection, and agent basics',
      'Walk away capable, not dependent',
    ],
    cta: 'See how we teach',
  },
]

export default function App() {
  const { scrollYProgress } = useScroll()
  const prefersReduced = useReducedMotion()
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const headingY = useTransform(scrollY, [0, 400], [0, prefersReduced ? 0 : -30])

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
            Your business on AI.<br />
            <span className="grad">Built right. Taught well.</span>
          </motion.h1>

          <motion.p className="lede" {...fadeUp(0.28)}>
            We build custom AI agents for businesses ready to scale — and train the owners
            who want to understand exactly how it works.
          </motion.p>

          <motion.div className="ctas" {...fadeUp(0.44)}>
            <motion.button
              className="btn brand"
              onClick={() => navigate('/ai-agents')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              AI Agents <span className="arrow">→</span>
            </motion.button>
            <motion.button
              className="btn ghost"
              onClick={() => navigate('/ai-training')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              AI Training <span className="arrow">→</span>
            </motion.button>
          </motion.div>

          <motion.div className="micro" {...fadeUp(0.56)}>
            <span><span className="ck">✓</span> You own everything we build</span>
            <span><span className="ck">✓</span> AI Agents + Teaching under one roof</span>
            <span><span className="ck">✓</span> Results-first, always</span>
          </motion.div>

          <div className="stats">
            <StatCounter target={40} suffix="+" label="Projects delivered across industries" />
            <StatCounter target={3} suffix=" wks" label="Average time to first measurable result" />
            <StatCounter target={12} suffix="+" label="Industries served across all projects" />
          </div>
        </div>
      </section>

      {/* ── Two-pillar offering cards ── */}
      <section id="services">
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> What we do</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Two offerings.<br />One focus.</h2></FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Whether you need AI built into your operations or your team trained to use it — we do both, under one roof.
            </p>
          </FadeIn>

          <div className="cb-build-layout" style={{ gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 48 }}>
            {pillars.map((p, i) => (
              <FadeIn key={p.label} delay={0.1 * i}>
                <SpringCard
                  className="card"
                  hoverY={-5}
                  onClick={() => navigate(p.href)}
                  style={{ height: '100%', padding: '32px 28px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 20 }}
                >
                  <div>
                    <div className="ic" style={{ marginBottom: 16 }}>{p.icon}</div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--brand)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{p.eyebrow}</div>
                    <h3 style={{ fontSize: 22, lineHeight: 1.3, marginBottom: 12 }}>{p.headline}</h3>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontSize: 14, color: 'var(--brand)', fontWeight: 500 }}>
                    {p.cta} <span style={{ opacity: 0.7 }}>→</span>
                  </div>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <TrustBar />

      <AuditCTA preset="" accent="blue" />
      <Footer />
    </>
  )
}
