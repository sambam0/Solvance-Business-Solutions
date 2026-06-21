import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import FadeIn from '../components/FadeIn.jsx'
import AuditCTA from '../components/AuditCTA.jsx'
import SpringCard from '../components/SpringCard.jsx'
import Process from '../components/Process.jsx'
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

const whoCards = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'You\'re using ChatGPT but not getting real results',
    desc: 'You paste prompts and get mediocre output. There\'s a gap between what AI can do and what you\'re getting — we close it.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Your team keeps asking what AI tools to use',
    desc: 'There are hundreds of tools and no clear answer. We cut through the noise and show you exactly which ones fit your workflow.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'You want to use AI without becoming dependent on a vendor',
    desc: 'You want to understand what\'s happening under the hood — not just buy a black box. We teach the fundamentals so you stay in control.',
  },
]

const pillars = [
  {
    num: '01',
    title: 'Prompt Engineering',
    desc: 'Move past trial-and-error. Learn the structures that reliably produce the output you need — for writing, analysis, research, and code.',
  },
  {
    num: '02',
    title: 'AI Workflow Integration',
    desc: 'Map your existing processes and identify exactly where AI fits. Build repeatable workflows your team can follow without your involvement.',
  },
  {
    num: '03',
    title: 'Tool Selection',
    desc: 'Which LLM for which job. When to use GPT-4o vs Claude vs Gemini. Which automation tools connect your stack without engineering overhead.',
  },
  {
    num: '04',
    title: 'Building Without Code',
    desc: 'Create custom GPTs, internal agents, and automated pipelines — no developers required. Ship your first AI tool by the end of the session.',
  },
]

const formats = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: 'Half-Day Workshop',
    duration: '4 hours',
    desc: 'Intensive hands-on session for you or your team. Walk away with prompts, workflows, and tools you\'ll use the next morning.',
    cta: 'Book a workshop',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: '1-on-1 Advisory',
    duration: 'Ongoing',
    desc: 'Monthly sessions tailored to your business. We work through your actual problems, not generic examples.',
    cta: 'Start advising',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Team Training Package',
    duration: '2–5 days',
    desc: 'Full rollout for your organization. Assessment, curriculum design, live training, and follow-up Q&A sessions.',
    cta: 'Train the team',
  },
]

export default function AITraining() {
  const { scrollYProgress } = useScroll()
  const prefersReduced = useReducedMotion()
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const headingY = useTransform(scrollY, [0, 400], [0, prefersReduced ? 0 : -30])

  useEffect(() => {
    document.title = 'AI Teaching & Training — Solvance'
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
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="wrap">
          <motion.a className="ann" href="#audit" {...fadeUp(0)}>
            <b>New</b> Team training packages now available →
          </motion.a>

          <motion.h1 style={{ y: headingY }} {...fadeUp(0.1)}>
            Stop guessing with AI.<br />
            <span className="grad">Start using it right.</span>
          </motion.h1>

          <motion.p className="lede" {...fadeUp(0.28)}>
            Hands-on AI training for business owners and their teams. Learn the tools, workflows, and
            thinking patterns that turn AI from a curiosity into a competitive advantage.
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
              href="#formats"
              className="btn ghost"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              See formats
            </motion.a>
          </motion.div>

          <motion.div className="micro" {...fadeUp(0.56)}>
            <span><span className="ck">✓</span> Hands-on, not theoretical</span>
            <span><span className="ck">✓</span> Your tools, your workflow</span>
            <span><span className="ck">✓</span> Walk away capable</span>
          </motion.div>

          <div className="stats">
            <StatCounter target={3} suffix="+" label="Workshops delivered" />
            <StatCounter target={40} suffix="+" label="Business owners trained" />
            <StatCounter target={12} suffix="+" label="AI tools covered across curricula" />
          </div>
        </div>
      </section>

      {/* ── Who This Is For ── */}
      <section id="who">
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> Who this is for</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Sound familiar?</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">You don't need to be technical. You need to be ready to actually use what you learn.</p></FadeIn>

          <div className="cb-build-layout" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 48 }}>
            {whoCards.map((card, i) => (
              <FadeIn key={card.title} delay={0.08 * i}>
                <SpringCard className="card" hoverY={-4} style={{ height: '100%', padding: '28px 24px' }}>
                  <div className="ic" style={{ marginBottom: 16 }}>{card.icon}</div>
                  <div className="cb-item-title" style={{ fontSize: 16, marginBottom: 10 }}>{card.title}</div>
                  <p className="cb-item-desc">{card.desc}</p>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You'll Learn ── */}
      <section id="curriculum">
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> Curriculum</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">What you'll learn.<br /><span className="grad">What you'll actually use.</span></h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">Every session is tailored to your business. These are the four pillars every engagement covers.</p></FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 48 }}>
            {pillars.map((p, i) => (
              <FadeIn key={p.num} delay={0.08 * i}>
                <div style={{ padding: '28px 24px', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-2)' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--brand)', letterSpacing: '0.1em', marginBottom: 12 }}>{p.num}</div>
                  <div className="cb-item-title" style={{ fontSize: 17, marginBottom: 10 }}>{p.title}</div>
                  <p className="cb-item-desc">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Teach ── */}
      <section id="formats">
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> How we teach</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Three formats.<br />One outcome.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">Every format ends the same way: you leave knowing how to use AI in your business, not just knowing that you should.</p></FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 48 }}>
            {formats.map((f, i) => (
              <FadeIn key={f.title} delay={0.08 * i}>
                <SpringCard className="card" hoverY={-4} style={{ height: '100%', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="ic">{f.icon}</div>
                  <div>
                    <div className="cb-item-title" style={{ fontSize: 17, marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--brand)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{f.duration}</div>
                  </div>
                  <p className="cb-item-desc" style={{ flex: 1 }}>{f.desc}</p>
                  <a href="#audit" className="btn ghost" style={{ fontSize: 13, padding: '8px 16px', alignSelf: 'flex-start' }}>
                    {f.cta} →
                  </a>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <Process />

      {/* ── Pricing ── */}
      <Pricing />

      {/* ── FAQ ── */}
      <FAQ />

      <AuditCTA preset="ai-training" accent="blue" />
      <Footer />
    </>
  )
}
