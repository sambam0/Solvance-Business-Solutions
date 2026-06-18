import { useEffect, useRef } from 'react'
import { motion, useScroll, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import FadeIn from '../components/FadeIn.jsx'
import AuditCTA from '../components/AuditCTA.jsx'
import SpringCard from '../components/SpringCard.jsx'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] },
})

// ── Animated stat counter ─────────────────────────────────────────
function StatItem({ target, suffix, label }) {
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

// ── Animated funnel diagram ───────────────────────────────────────
function FunnelDiagram() {
  const prefersReduced = useReducedMotion()
  const nodes = [
    { label: 'Audience', accent: false, metric: 'Targeted reach' },
    { label: 'Ad creative', accent: true, metric: 'Click-through' },
    { label: 'Landing page', accent: false, metric: 'Conversion' },
    { label: 'Closed client', accent: true, metric: '↑ Revenue' },
  ]

  return (
    <div className="funnel-diagram">
      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          initial={prefersReduced ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className={`funnel-node${node.accent ? ' accent' : ''}`}>{node.label}</div>
          <div className="funnel-metric">{node.metric}</div>
          {i < nodes.length - 1 && (
            <motion.div
              className="funnel-connector"
              initial={prefersReduced ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.35 + i * 0.12 }}
              style={{ transformOrigin: 'top' }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

const Star = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// ── What We Do cards ──────────────────────────────────────────────
const services = [
  {
    icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    title: 'Paid Ads (Meta & Google)',
    desc: 'We write the copy, design the creative, build the audiences, and run the campaigns — then optimize weekly until your cost per lead drops and ROAS climbs.',
    stat: '2.4×',
    statLabel: 'avg ROAS',
  },
  {
    icon: <><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></>,
    title: 'Funnel Strategy',
    desc: 'Full-funnel architecture: top-of-funnel awareness, mid-funnel nurture, and bottom-funnel conversion. We map the journey before we spend a dollar of your budget.',
    stat: '3×',
    statLabel: 'lead quality',
  },
  {
    icon: <><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="13" x2="19" y2="19"/><line x1="16" y1="16" x2="20" y2="20"/></>,
    title: 'Content & Creative',
    desc: 'Copy, images, video scripts, and ad variants — all produced in-house. We A/B test everything and scale what converts.',
    stat: '40+',
    statLabel: 'creative assets/mo',
  },
  {
    icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    title: 'Analytics & Reporting',
    desc: 'Weekly performance reports in plain English. No vanity metrics — just cost per lead, ROAS, pipeline added, and what we\'re doing about it next week.',
    stat: '100%',
    statLabel: 'transparent',
  },
]

// ── Case studies ──────────────────────────────────────────────────
const cases = [
  {
    tag: 'E-commerce',
    label: 'Challenge',
    title: 'Customer acquisition costs were rising 40% month-over-month. No visibility into what was working.',
    metric: '3.1×',
    metricLabel: 'ROAS in 90 days',
    quote: '"Within six weeks they\'d cut our cost per purchase in half. By week 12 we were scaling into new markets."',
  },
  {
    tag: 'Professional Services',
    label: 'Challenge',
    title: 'Sales proposals took 3+ hours to research and draft. Pipeline was unpredictable.',
    metric: '4×',
    metricLabel: 'faster lead response',
    quote: '"Every agency gave us a deck. Solvance had an ad live and a lead in the pipeline by day seven."',
  },
  {
    tag: 'Local Services',
    label: 'Challenge',
    title: 'Word-of-mouth only. No paid channel. Revenue was capped by referral volume.',
    metric: '80%',
    metricLabel: 'more inbound leads',
    quote: '"First month running ads through them, we booked more new clients than the entire prior quarter."',
  },
]

// ── FAQ items ─────────────────────────────────────────────────────
import { useState } from 'react'

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-summary" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {q}
        <span className="faq-icon">
          <motion.svg
            width="10" height="10" viewBox="0 0 10 10"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.5" />
          </motion.svg>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingTop: 2 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { AnimatePresence } from 'framer-motion'

const faqItems = [
  { q: 'Do you manage our ad spend?', a: 'Yes — we handle the full campaign setup and ongoing management. You set the monthly budget, we allocate it across platforms and campaigns for maximum return. Our management fee is separate from your ad spend.' },
  { q: 'What platforms do you run ads on?', a: 'Primarily Meta (Facebook + Instagram) and Google (Search + Display + YouTube), based on where your audience actually is. We also work with TikTok and LinkedIn depending on your target customer.' },
  { q: 'How quickly will we see results?', a: 'Most clients see initial data within 2 weeks and meaningful leads within the first month. Full optimization typically takes 60–90 days as the algorithm learns. We set honest expectations upfront and share weekly progress.' },
  { q: 'Do you handle the creative (copy, images, video)?', a: 'Yes, completely. We write the ad copy, design static and animated creatives, and produce video scripts. Everything is produced in-house and tested against each other so we always know what\'s working.' },
  { q: 'What\'s the minimum monthly budget?', a: 'We typically work with clients spending $1,500–$3,000/month in ad spend at minimum. Below that threshold, the data signals are too thin to optimize effectively. We\'ll be upfront if your budget isn\'t a fit.' },
]

// ── Main page ─────────────────────────────────────────────────────
export default function AdsMarketing() {
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    document.title = 'Ads & Marketing — Solvance'
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
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #F97316, #dc2626)' }} />
      <Nav />

      {/* ── Hero ── */}
      <section className="page-hero orange-page">
        <div className="page-orbs" aria-hidden="true">
          <div className="page-orb-orange-1" />
        </div>
        <div className="wrap">
          <div className="funnel-hero-layout">
            <div>
              <motion.div {...fadeUp(0)}>
                <span className="eyebrow-orange"><span className="dot" /> Ads & full-stack marketing</span>
              </motion.div>

              <motion.h1 style={{ textAlign: 'left' }} {...fadeUp(0.1)}>
                More clients.<br />More revenue.<br />
                <span className="grad-orange">Less guesswork.</span>
              </motion.h1>

              <motion.p className="lede" style={{ textAlign: 'left', marginLeft: 0 }} {...fadeUp(0.28)}>
                Solvance runs your paid ads, builds your funnels, and handles the creative —
                so your pipeline fills while you run the business. No agency fluff. Just growth.
              </motion.p>

              <motion.div className="ctas" style={{ justifyContent: 'flex-start' }} {...fadeUp(0.44)}>
                <motion.a
                  href="#audit"
                  className="btn orange"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  Get a free audit <span className="arrow">→</span>
                </motion.a>
                <motion.a
                  href="#process"
                  className="btn ghost"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  See how it works
                </motion.a>
              </motion.div>

              <motion.div className="micro" style={{ justifyContent: 'flex-start' }} {...fadeUp(0.56)}>
                <span><span className="ck" style={{ background: 'var(--soft-orange)', color: 'var(--orange)' }}>✓</span> No retainer lock-in</span>
                <span><span className="ck" style={{ background: 'var(--soft-orange)', color: 'var(--orange)' }}>✓</span> Full creative included</span>
                <span><span className="ck" style={{ background: 'var(--soft-orange)', color: 'var(--orange)' }}>✓</span> Results-first always</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <FunnelDiagram />
            </motion.div>
          </div>

          <div className="stats" style={{ marginTop: 72 }}>
            <StatItem target={40} suffix="+" label="Campaigns launched across industries" />
            <StatItem target={2.4} suffix="×" label="Average ROAS across active clients" />
            <StatItem target={4.9} suffix="★" label="Average client satisfaction rating" />
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section id="services">
        <div className="wrap">
          <FadeIn><span className="eyebrow-orange"><span className="dot" /> What we do</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Full-funnel. Full ownership.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">We don't manage one piece. We own the whole growth engine — from creative to conversion.</p></FadeIn>

          <div className="wwd-grid">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={0.08 * i}>
                <SpringCard className="card" hoverY={-4} style={{ height: '100%' }}>
                  <div className="ic" style={{ color: 'var(--orange)', background: 'var(--soft-orange)', border: '1px solid rgba(249,115,22,.2)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {s.icon}
                    </svg>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ flex: 1 }}>{s.title}</h3>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--orange)', letterSpacing: '-.03em' }}>{s.stat}</div>
                      <div style={{ fontSize: 11, color: 'var(--mute)', fontFamily: 'Geist Mono, monospace', textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.statLabel}</div>
                    </div>
                  </div>
                  <p>{s.desc}</p>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" style={{ background: 'var(--bg-2)' }}>
        <div className="wrap">
          <FadeIn><span className="eyebrow-orange"><span className="dot" /> Our process</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Audit. Launch. Scale.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">No 3-month strategy phase. We move fast, test early, and optimize based on real data.</p></FadeIn>

          <div className="steps-line" style={{ background: 'linear-gradient(90deg, transparent, #F97316 25%, #dc2626 75%, transparent)' }} />
          <div className="steps">
            {[
              { num: '01', time: 'Week 1', title: 'Strategy audit', desc: 'We audit your current traffic, competitors\' ad angles, and highest-ROI channel. You leave with a channel strategy and creative brief — useful regardless of whether you hire us.', lines: ['Auditing competitor ad library…', 'Identifying highest-ROI channel…', 'Drafting creative brief…'] },
              { num: '02', time: 'Weeks 2–4', title: 'Launch & test', desc: 'Campaigns live within 2 weeks. We run 3–5 creative variants simultaneously, gather data, and start identifying what\'s converting. Weekly updates, zero jargon.', lines: ['Campaigns live on Meta + Google…', 'A/B testing 4 ad variants…', 'First leads coming in…'] },
              { num: '03', time: 'Week 5+', title: 'Optimize & scale', desc: 'We cut losers, scale winners, and compound results monthly. As costs drop and ROAS climbs, we expand to new channels, audiences, or markets.', lines: ['Cutting underperformers…', 'Scaling top variant 3×…', 'Cost per lead ↓ 34% this week'] },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={0.08 * i}>
                <SpringCard className="step" hoverY={-3}>
                  <div className="head">
                    <div className="badge" style={{ background: 'var(--soft-orange)', color: 'var(--orange)', border: '1px solid rgba(249,115,22,.2)' }}>{step.num}</div>
                    <div className="time">{step.time}</div>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <div className="demo">
                    {step.lines.map(l => (
                      <div key={l} className="ln" style={{ '--ln-dot': 'var(--orange)' }}>
                        {l}
                      </div>
                    ))}
                  </div>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case studies ── */}
      <section>
        <div className="wrap">
          <FadeIn><span className="eyebrow-orange"><span className="dot" /> Results</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Growth that shows up<br />in the numbers.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">Real results from real clients — tracked, reported, and compounding.</p></FadeIn>

          <div className="case-grid">
            {cases.map((c, i) => (
              <FadeIn key={c.tag} delay={0.08 * i}>
                <SpringCard className="case-card" hoverY={-3} style={{ borderLeftColor: ['var(--orange)', '#dc2626', '#F97316'][i] }}>
                  <span className="case-tag" style={{ color: 'var(--orange)', background: 'var(--soft-orange)' }}>{c.tag}</span>
                  <div className="case-label">{c.label}</div>
                  <h3>{c.title}</h3>
                  <div className="case-metric">{c.metric}<span>{c.metricLabel}</span></div>
                  <p className="case-quote">{c.quote}</p>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter break ── */}
      <div className="chapter-break">
        <div className="chapter-break-inner">
          <span className="chapter-break-text">Like what you see in the numbers?</span>
          <motion.button
            className="btn orange"
            onClick={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Get your free audit <span className="arrow">→</span>
          </motion.button>
        </div>
      </div>

      {/* ── FAQ ── */}
      <section style={{ background: 'var(--bg-2)' }}>
        <div className="wrap">
          <FadeIn><span className="eyebrow-orange"><span className="dot" /> Common questions</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Straight answers.</h2></FadeIn>

          <div className="faq-list" style={{ marginTop: 40 }}>
            {faqItems.map((item, i) => (
              <FadeIn key={item.q} delay={0.05 * i}>
                <FAQItem q={item.q} a={item.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <AuditCTA preset="ads-marketing" accent="orange" />
      <Footer />
    </>
  )
}
