import { useScroll, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Clients from './components/Clients.jsx'
import Testimonials from './components/Testimonials.jsx'
import Team from './components/Team.jsx'
import AuditCTA from './components/AuditCTA.jsx'
import Footer from './components/Footer.jsx'
import FadeIn from './components/FadeIn.jsx'
import SpringCard from './components/SpringCard.jsx'

function navigate(href) {
  history.pushState({}, '', href)
  window.dispatchEvent(new Event('locationchange'))
}

// ── Animated stat counter ─────────────────────────────────────────
function ResultCounter({ target, suffix, label }) {
  const ref = useRef(null)
  const numRef = useRef(null)

  useEffect(() => {
    const isDecimal = String(target).includes('.')
    let started = false
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || started) return
      started = true
      obs.disconnect()
      const duration = 1300
      const startTime = performance.now()
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
  }, [target, suffix])

  return (
    <div className="result-item" ref={ref}>
      <div className="n" ref={numRef} dangerouslySetInnerHTML={{ __html: `${target}<sup>${suffix}</sup>` }} />
      <div className="l">{label}</div>
    </div>
  )
}

// ── Vertical service cards ────────────────────────────────────────
const verticals = [
  {
    cls: 'vc-green',
    eyebrow: 'For growing businesses',
    name: 'Websites & SEO',
    desc: 'Get found on Google in 14 days. We build your website, claim your Google profile, and run a review funnel — all for one flat monthly fee.',
    features: ['14-day build guarantee', 'Google Business Profile setup', 'Review automation (SMS + QR)', 'Hosting & edits included'],
    link: '/websites-seo',
    linkLabel: 'See packages',
  },
  {
    cls: 'vc-orange',
    eyebrow: 'For scaling businesses',
    name: 'Ads & Marketing',
    desc: 'Fill your pipeline with paid ads, funnels, and creative that converts. We run the campaigns, track the results, and scale what works.',
    features: ['Meta & Google ad management', 'Full-funnel strategy', 'Creative & copywriting included', 'Weekly reporting'],
    link: '/ads-marketing',
    linkLabel: 'See how it works',
  },
  {
    cls: 'vc-blue',
    eyebrow: 'For established businesses',
    name: 'Custom Builds',
    desc: 'Mobile apps, AI agents, and advanced integrations for businesses that have the basics covered and need serious leverage.',
    features: ['Custom AI agents & automation', 'Mobile app development', 'OpenClaw & custom installs', 'AI teaching & training'],
    link: '/custom-builds',
    linkLabel: 'Explore capabilities',
  },
]

export default function App() {
  const { scrollYProgress } = useScroll()

  useEffect(() => {
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
      <Hero />

      {/* ── Three service verticals ── */}
      <section id="services" className="services-intro">
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> What we do</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Three ways to grow<br />your business.</h2></FadeIn>
          <FadeIn delay={0.1}>
            <p className="section-sub">
              Every business is at a different stage. Pick yours — or let a free audit show you the highest-leverage move.
            </p>
          </FadeIn>

          <div className="vertical-cards">
            {verticals.map((v, i) => (
              <FadeIn key={v.name} delay={0.08 * i}>
                <SpringCard
                  className={`vertical-card ${v.cls}`}
                  hoverY={-5}
                  onClick={() => navigate(v.link)}
                  style={{ height: '100%' }}
                >
                  <div className="vc-eyebrow">{v.eyebrow}</div>
                  <div className="vc-name">{v.name}</div>
                  <div className="vc-desc">{v.desc}</div>
                  <ul className="vc-features">
                    {v.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <div className="vc-link">
                    {v.linkLabel} <span>→</span>
                  </div>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clients marquee ── */}
      <Clients />

      {/* ── Results snapshot ── */}
      <div className="results-snapshot">
        <div className="wrap">
          <div className="results-grid">
            <ResultCounter target={40} suffix="+" label="Projects delivered across industries" />
            <ResultCounter target={14} suffix=" days" label="Fastest time from kickoff to live" />
            <ResultCounter target={97} suffix="/mo" label="Starting price — flat, no setup fee" />
            <ResultCounter target={4.9} suffix="★" label="Average client satisfaction rating" />
          </div>
        </div>
      </div>

      <Testimonials />

      {/* ── Chapter break — editorial mid-page nudge ── */}
      <div className="chapter-break">
        <div className="chapter-break-inner">
          <span className="chapter-break-text">Already seen enough?</span>
          <motion.button
            className="btn brand"
            onClick={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Get your free audit <span className="arrow">→</span>
          </motion.button>
        </div>
      </div>

      <Team />
      <AuditCTA preset="" accent="blue" />
      <Footer />
    </>
  )
}
