import { useScroll, motion, useTransform, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import AuditCTA from './components/AuditCTA.jsx'
import Footer from './components/Footer.jsx'
import FadeIn from './components/FadeIn.jsx'
import SpringCard from './components/SpringCard.jsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function navigate(href) {
  history.pushState({}, '', href)
  window.dispatchEvent(new Event('locationchange'))
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] },
})


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
  const servicesRef = useRef(null)
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

  useGSAP(() => {
    const el = servicesRef.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const pillarEls = el.querySelectorAll('.pillar-anim')
      gsap.from(pillarEls, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: el,
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      })
    })
  })

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <Nav />

      {/* ── Hero ── */}
      <section className="hero" id="hero" ref={containerRef}>
        <div className="wrap hero-wrap">
          <div className="hero-text">
            <motion.h1 style={{ y: headingY }} {...fadeUp(0.1)}>
              Your business on AI.<br />
              Built right. Taught well.
            </motion.h1>

            <motion.p className="lede" {...fadeUp(0.28)}>
              We build custom AI agents for businesses ready to scale — and train the owners
              who want to understand exactly how it works.
            </motion.p>

            <motion.div className="ctas" {...fadeUp(0.44)}>
              <button className="btn brand" onClick={() => navigate('/ai-agents')}>
                AI Agents <span className="arrow">→</span>
              </button>
              <button className="btn ghost" onClick={() => navigate('/ai-training')}>
                AI Training <span className="arrow">→</span>
              </button>
            </motion.div>

            <motion.div className="hero-proof" {...fadeUp(0.56)}>
              <span>40 systems shipped. 3-week average to first result.</span>
              <span>$1,500/mo to start — no lock-in. Everything you own.</span>
            </motion.div>
          </div>

          <div className="hero-topo" aria-hidden="true">
            <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="160" y1="44" x2="68" y2="196" stroke="var(--line-2)" strokeWidth="1" />
              <line x1="160" y1="44" x2="252" y2="196" stroke="var(--line-2)" strokeWidth="1" />
              <line x1="68" y1="196" x2="252" y2="196" stroke="var(--line-2)" strokeWidth="1" />
              <circle cx="160" cy="44" r="16" fill="none" stroke="var(--line-2)" strokeWidth="1" />
              <circle cx="68" cy="196" r="16" fill="none" stroke="var(--line-2)" strokeWidth="1" />
              <circle cx="252" cy="196" r="16" fill="none" stroke="var(--line-2)" strokeWidth="1" />
              <text x="160" y="28" textAnchor="middle" fill="var(--mute)" fontSize="9" fontFamily="monospace" opacity="0.9">HUB</text>
              <text x="68" y="226" textAnchor="middle" fill="var(--mute)" fontSize="9" fontFamily="monospace" opacity="0.9">CLOUD</text>
              <text x="252" y="226" textAnchor="middle" fill="var(--mute)" fontSize="9" fontFamily="monospace" opacity="0.9">LOCAL</text>
              <circle className="topo-traveler" r="3" fill="var(--brand)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M160,44 L68,196" />
              </circle>
              <circle className="topo-traveler" r="3" fill="var(--brand)">
                <animateMotion dur="4.2s" repeatCount="indefinite" begin="1.4s" path="M160,44 L252,196" />
              </circle>
              <circle className="topo-traveler" r="3" fill="var(--brand)">
                <animateMotion dur="3.6s" repeatCount="indefinite" begin="2.1s" path="M68,196 L252,196" />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Two-pillar offering cards ── */}
      <section id="services" ref={servicesRef}>
        <div className="wrap">
          <FadeIn><h2 className="section-title">Two offerings.<br />One focus.</h2></FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Whether you need AI built into your operations or your team trained to use it — we do both, under one roof.
            </p>
          </FadeIn>

          <div className="cb-build-layout" style={{ gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 48 }}>
            {pillars.map((p) => (
              <div key={p.label} className="pillar-anim">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <AuditCTA preset="" accent="blue" />
      <Footer />
    </>
  )
}
