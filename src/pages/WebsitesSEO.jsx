import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import FadeIn from '../components/FadeIn.jsx'
import AuditCTA from '../components/AuditCTA.jsx'
import SpringCard from '../components/SpringCard.jsx'
import Process from '../components/Process.jsx'

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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] },
})

// ── Included feature cards ────────────────────────────────────────
const includedCards = [
  {
    icon: <path d="M12 8v4l3 2"/>,
    iconCircle: true,
    title: 'Live in 14 days. Or you don\'t pay.',
    desc: 'Day 1 we kick off. Day 14 you\'re on Google, on the map, and in your customers\' phones. Miss the deadline and the meter doesn\'t start.',
    hero: true,
    badge: true,
  },
  { title: 'On Google in 2 weeks', desc: 'Your business appears in local search and Google Maps — we claim, verify, and optimize your Business Profile.', icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>, span: 'span-4' },
  { title: 'Hosting + security included', desc: 'SSL, daily backups, uptime monitoring — all included. No Bluehost, no GoDaddy, no separate invoice.', icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>, span: 'span-4' },
  { title: 'Edits always included', desc: 'Update your hours, swap a photo, change a price — text us, done same day. No ticket system, no extra charge.', icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>, span: 'span-4' },
  { title: 'Review automation', desc: 'Auto-send SMS + QR code review requests after every job. More 5-star reviews, on autopilot.', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>, span: 'span-4' },
  { title: 'Local SEO + schema', desc: 'On-page SEO, structured data markup, and local citation building so Google knows exactly what you do and where.', icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>, span: 'span-4' },
  { title: 'Photo gallery', desc: 'Showcase your work. Upload photos, we\'ll lay them out professionally and keep the gallery fresh.', icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>, span: 'span-4' },
  { title: 'No contracts, ever', desc: 'Month-to-month. Cancel with 30 days notice. We keep clients because the product works, not because of fine print.', icon: <><polyline points="20 6 9 17 4 12"/></>, span: 'span-4' },
]

// ── Interactive Blueprint ─────────────────────────────────────────
const trades = [
  {
    id: 'barbershop',
    label: 'Barbershop',
    logo: 'Atlas Cuts',
    domain: 'atlascuts.com',
    headline: 'Sharp fades. Same-day chairs.',
    sub: 'Walk-ins welcome. Online booking available. Austin\'s most-rated barbershop.',
    cta: 'Book a chair',
    rating: '4.9★  (214 reviews)',
    chips: ['Walk-ins welcome', 'Online booking', 'Same-day availability'],
  },
  {
    id: 'hvac',
    label: 'HVAC',
    logo: 'Northwind HVAC',
    domain: 'northwindhvac.com',
    headline: 'Heating out at midnight? We pick up.',
    sub: '24/7 emergency dispatch. 47-min average response time. Denver metro.',
    cta: 'Call now — 24/7',
    rating: '4.8★  (312 reviews)',
    chips: ['24/7 emergency', '47-min response', 'Free estimates'],
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    logo: 'Briggs & Sons',
    domain: 'briggsandsons.com',
    headline: 'Leak at 2am? We\'re on the way.',
    sub: 'Flat-rate emergency service. Family-owned since 1996. No surprise charges.',
    cta: 'Get flat-rate quote',
    rating: '4.9★  (188 reviews)',
    chips: ['Flat-rate pricing', 'Family-owned', 'Emergency service'],
  },
  {
    id: 'roofing',
    label: 'Roofing',
    logo: 'RoofKraft',
    domain: 'roofkraft.com',
    headline: 'Storm hit your roof? We hit back.',
    sub: 'Free drone inspection. Insurance liaison included. Atlanta metro.',
    cta: 'Book free inspection',
    rating: '4.9★  (97 reviews)',
    chips: ['Free drone inspection', 'Insurance liaison', 'Same-week scheduling'],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    logo: 'Volt & Co.',
    domain: 'voltandco.com',
    headline: 'Panel from 1978? Time to upgrade.',
    sub: 'Text a photo, get a quote same hour. Phoenix metro. Licensed & insured.',
    cta: 'Text for a quote',
    rating: '4.8★  (143 reviews)',
    chips: ['Same-hour quotes', 'Licensed & insured', 'Panel upgrades'],
  },
]

const viewports = [
  { id: 'desktop', label: 'Desktop', maxWidth: '100%' },
  { id: 'tablet', label: 'Tablet', maxWidth: '640px' },
  { id: 'mobile', label: 'Mobile', maxWidth: '375px' },
]

function Blueprint() {
  const [trade, setTrade] = useState('barbershop')
  const [viewport, setViewport] = useState('desktop')
  const current = trades.find(t => t.id === trade)
  const vp = viewports.find(v => v.id === viewport)

  return (
    <section className="blueprint-section" id="blueprint">
      <div className="wrap">
        <FadeIn><span className="eyebrow-green"><span className="dot" /> Live preview</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">See your trade's site.<br />Before you even sign up.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">Pick your industry, preview the layout we'd build for you — across every device.</p></FadeIn>

        <div className="blueprint-tabs">
          {trades.map(t => (
            <button key={t.id} className={`bp-tab${trade === t.id ? ' active' : ''}`} onClick={() => setTrade(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="viewport-controls">
          {viewports.map(v => (
            <button key={v.id} className={`vp-btn${viewport === v.id ? ' active' : ''}`} onClick={() => setViewport(v.id)}>
              {v.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            className="blueprint-frame"
            key={trade}
            style={{ maxWidth: vp.maxWidth }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="blueprint-browser-bar">
              <div className="browser-dots">
                <div className="browser-dot" style={{ background: '#ff5f57' }} />
                <div className="browser-dot" style={{ background: '#febc2e' }} />
                <div className="browser-dot" style={{ background: '#28c840' }} />
              </div>
              <div className="browser-url">{current.domain}</div>
            </div>

            <div className="bp-mini-hero">
              <div className="bp-mini-nav">
                <div className="bp-mini-logo">{current.logo}</div>
                <div className="bp-mini-cta">{current.cta}</div>
              </div>
              <div className="bp-mini-headline">{current.headline}</div>
              <div className="bp-mini-sub">{current.sub}</div>
              <div className="bp-mini-rating">
                <span className="bp-stars">★★★★★</span>
                <span>{current.rating}</span>
              </div>
              <div className="bp-mini-services">
                {current.chips.map(c => <span key={c} className="bp-chip">{c}</span>)}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ── Trade testimonials ────────────────────────────────────────────
const tradeQuotes = [
  {
    text: '"I was invisible on Google for 6 years. Solvance had me showing up in the map pack within a month. Four chairs booked solid every Saturday now."',
    name: 'Marco D.', role: 'Owner · Atlas Cuts, Austin TX', initial: 'M',
    avStyle: { background: 'linear-gradient(135deg, #34d399, #059669)' },
  },
  {
    text: '"They had our site live in two weeks, no exaggeration. Google reviews started coming in automatically after that. Our call volume tripled."',
    name: 'Dale R.', role: 'Owner · Northwind HVAC, Denver CO', initial: 'D',
    avStyle: { background: 'linear-gradient(135deg, #3B9EFF, #1a7de0)' },
  },
  {
    text: '"We\'d been on the same broken website since 2017. Now we rank above competitors who\'ve been in business twice as long. Best $107 we spend every month."',
    name: 'Tasha & Lou', role: 'Co-owners · Briggs & Sons Plumbing', initial: 'T',
    avStyle: { background: 'linear-gradient(135deg, #9D6FFF, #7c3aed)' },
  },
]

const Star = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// ── Main page component ───────────────────────────────────────────
export default function WebsitesSEO() {
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    document.title = 'Websites & SEO — Solvance'
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
      <section className="page-hero green-page">
        <div className="page-orbs" aria-hidden="true">
          <div className="page-orb-green-1" />
        </div>
        <div className="wrap">
          <motion.a className="ann" href="#included" {...fadeUp(0)} style={{ color: 'var(--green)', borderColor: 'rgba(52,211,153,.2)', background: 'rgba(13,46,31,.8)' }}>
            <b style={{ background: 'linear-gradient(135deg,#34d399,#059669)', color: '#0A0A0C' }}>New</b>
            The 14-day build, walked through end-to-end →
          </motion.a>

          <motion.h1 {...fadeUp(0.1)}>
            Your competitors are{' '}
            <span className="grad-green">showing up</span>{' '}
            on Google.<br />
            <span className="strike">You're</span> not.
          </motion.h1>

          <motion.p className="lede" {...fadeUp(0.28)}>
            Solvance builds and runs the website, Google profile, and review funnel for local trades —
            barbershops, HVAC, plumbing, roofing, electrical. Two-week build. One flat monthly fee. Cancel anytime.
          </motion.p>

          <motion.div className="ctas" {...fadeUp(0.44)}>
            <motion.a
              href="#audit"
              className="btn green"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Book a strategy call <span className="arrow">→</span>
            </motion.a>
            <motion.a
              href="#included"
              className="btn ghost"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              See what's included
            </motion.a>
          </motion.div>

          <motion.div className="micro" {...fadeUp(0.56)}>
            <span><span className="ck" style={{ background: 'var(--soft-green)', color: 'var(--green)' }}>✓</span> 14-day build guarantee</span>
            <span><span className="ck" style={{ background: 'var(--soft-green)', color: 'var(--green)' }}>✓</span> No long-term contracts</span>
            <span><span className="ck" style={{ background: 'var(--soft-green)', color: 'var(--green)' }}>✓</span> Hosting + edits included</span>
          </motion.div>

          <div className="stats">
            <StatItem target={14} suffix="days" label="Average build time, start to launch" />
            <StatItem target={97} suffix="/mo" label="Starting price — flat, no setup fee" />
            <StatItem target={4.9} suffix="★" label="Average client rating across reviews" />
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section id="included">
        <div className="wrap">
          <FadeIn><span className="eyebrow-green"><span className="dot" /> What's included</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Everything in the box.<br />No upsells, no surprise invoices.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">One flat fee covers the whole stack — design, build, hosting, security, troubleshooting, and every future edit.</p></FadeIn>

          <div className="feat-grid" style={{ marginTop: 48 }}>
            {/* Hero card */}
            <FadeIn delay={0.05}>
              <SpringCard className="card hero-card span-8" hoverY={-4} style={{ background: 'linear-gradient(140deg,#064e3b,#065f46,#1a3a5c)' }}>
                <div>
                  <div className="ic" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/>
                    </svg>
                  </div>
                  <h3 style={{ marginTop: 18, fontSize: 36, letterSpacing: '-.03em', fontWeight: 700 }}>Live in 14 days.<br />Or you don't pay.</h3>
                  <p style={{ marginTop: 10, color: 'rgba(255,255,255,.78)', maxWidth: '44ch' }}>
                    Day 1 we kick off. Day 14 you're on Google, on the map, and in your customers' phones.
                    Miss the deadline and the meter doesn't start.
                  </p>
                </div>
                <div className="badge2w">
                  <span className="num">14</span>
                  <span className="lbl">Day build</span>
                </div>
              </SpringCard>
            </FadeIn>

            {/* Small cards */}
            {[
              { title: 'On Google in 14 days', desc: 'We claim, verify, and fully optimize your Google Business Profile so you show up where customers search.', pathD: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
              { title: 'Hosting + SSL included', desc: 'Secure, fast hosting with SSL certificate and daily backups — no third-party bills, ever.', pathD: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
              { title: 'Review automation', desc: 'Auto-send review requests via SMS and QR codes after every service. More 5-star reviews on autopilot.', pathD: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
              { title: 'Edits always included', desc: 'Text us any change — hours, photos, pricing. Done same day, no tickets, no extra charges.', pathD: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' },
              { title: 'Local SEO + schema', desc: 'Structured data markup, on-page SEO, and citation building so Google ranks you for local searches.', pathD: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' },
              { title: 'Photo gallery', desc: 'Showcase your work professionally. Upload photos, we lay them out and keep the gallery current.', pathD: 'M3 3h18v18H3z M3 9h18 M9 3v18' },
              { title: 'Mobile + responsive', desc: 'Your site looks and works perfectly on phones, tablets, and desktop. Always.', pathD: 'M12 18h.01 M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z' },
              { title: 'No contracts, ever', desc: 'Month-to-month, cancel anytime with 30 days notice. We keep clients because the product works.', pathD: 'M20 6 9 17l-5-5' },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={0.06 * i} className="span-4">
                <SpringCard className="card" hoverY={-3} style={{ height: '100%' }}>
                  <div className="ic" style={{ color: 'var(--green)', background: 'var(--soft-green)', border: '1px solid rgba(52,211,153,.2)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={card.pathD} />
                    </svg>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Blueprint ── */}
      <Blueprint />

      {/* ── Process ── */}
      <section id="how-it-works">
        <div className="wrap">
          <FadeIn><span className="eyebrow-green"><span className="dot" /> How it works</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Call. Build. Live.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">From first conversation to ranking on Google in 14 days flat.</p></FadeIn>

          <div className="steps-line" style={{ background: 'linear-gradient(90deg, transparent, #34d399 25%, #059669 75%, transparent)' }} />
          <div className="steps">
            {[
              { num: '01', time: 'Day 0', title: 'Strategy call', desc: 'A 20-minute call where we screen-share your competitors\' Google profiles and sites. You leave with the exact ranking gap and a build plan — useful regardless of whether you hire us.', lines: ['Pulling top 3 competitors in your zip…', 'Identifying ranking gaps…', 'Building your roadmap…'] },
              { num: '02', time: 'Days 1–13', title: 'Build phase', desc: 'We build your site, claim your Google Business Profile, configure your review funnel, and set up local SEO. You get daily progress updates and can request changes at any step.', lines: ['Building your 5-page site…', 'Google Business Profile claimed ✓', 'Review SMS flow configured ✓'] },
              { num: '03', time: 'Day 14+', title: 'Live & growing', desc: 'Your site goes live, Google profile is active, and reviews start flowing in automatically. We maintain everything — you just run your business.', lines: ['Site live on Google ✓', 'First review request sent ✓', 'Monitoring rank position…'] },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={0.08 * i}>
                <SpringCard className="step" hoverY={-3}>
                  <div className="head">
                    <div className="badge" style={{ background: 'var(--soft-green)', color: 'var(--green)', border: '1px solid rgba(52,211,153,.2)' }}>{step.num}</div>
                    <div className="time">{step.time}</div>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <div className="demo">
                    {step.lines.map(l => <div key={l} className="ln gn">{l}</div>)}
                  </div>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ background: 'var(--bg-2)' }}>
        <div className="wrap">
          <FadeIn><span className="eyebrow-green"><span className="dot" /> Pricing</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Two plans. Both flat.<br />Cancel anytime.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">No setup fee. No contracts. No surprise overages. Ever.</p></FadeIn>

          <div className="seo-pricing">
            <FadeIn delay={0.08}>
              <SpringCard className="tier" hoverY={-4} style={{ height: '100%' }}>
                <div className="name">Local Presence</div>
                <h3>Website + hosting + edits. Everything to get online.</h3>
                <div className="price">
                  <span style={{ fontSize: 18, color: 'var(--mute)', alignSelf: 'flex-end', marginBottom: 6 }}>$</span>
                  <span className="amt">97</span>
                  <span className="per">/month</span>
                </div>
                <ul>
                  {['5-page professional website', '14-day build guarantee', 'Hosting, SSL + daily backups', 'Unlimited future edits', 'Mobile + tablet + desktop', 'Photo gallery', 'No setup fee', 'No contracts'].map(f => (
                    <li key={f}><span className="ck">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="#audit" className="btn ghost">Get started →</a>
              </SpringCard>
            </FadeIn>

            <FadeIn delay={0.12}>
              <SpringCard className="tier green-featured" hoverY={-4} style={{ height: '100%' }}>
                <div className="ribbon">Most popular</div>
                <div className="name">Local Visibility</div>
                <h3>Everything in Local Presence, plus Google domination.</h3>
                <div className="price">
                  <span style={{ fontSize: 18, color: 'var(--mute)', alignSelf: 'flex-end', marginBottom: 6 }}>$</span>
                  <span className="amt">107</span>
                  <span className="per">/month</span>
                </div>
                <ul>
                  {['Everything in Local Presence', 'Google Business Profile build', 'GBP optimization + monitoring', 'Review funnel (SMS + QR code)', 'Local SEO + schema markup', 'Map-pack monitoring', 'Monthly performance email', 'Priority same-day support'].map(f => (
                    <li key={f}><span className="ck">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="#audit" className="btn green">Get started →</a>
              </SpringCard>
            </FadeIn>
          </div>

          <FadeIn delay={0.16}>
            <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--mute)' }}>
              No setup fee · No contract · 14-day build guarantee or you don't pay · Billed monthly via Stripe / ACH
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Chapter break ── */}
      <div className="chapter-break">
        <div className="chapter-break-inner">
          <span className="chapter-break-text">Ready to get online in 14 days?</span>
          <motion.button
            className="btn green"
            onClick={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Get your free audit <span className="arrow">→</span>
          </motion.button>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <section id="proof">
        <div className="wrap">
          <FadeIn><span className="eyebrow-green"><span className="dot" /> Client results</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Real shops. Real results.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">Businesses that were invisible on Google — now ranking, booking, and growing.</p></FadeIn>

          <div className="quotes desktop-quotes">
            {tradeQuotes.map((q, i) => (
              <FadeIn key={q.name} delay={0.08 * i}>
                <SpringCard className="qcard" hoverY={-3} style={{ height: '100%' }}>
                  <div className="stars">{[...Array(5)].map((_, j) => <Star key={j} />)}</div>
                  <blockquote>{q.text}</blockquote>
                  <div className="who">
                    <div className="av" style={q.avStyle}>{q.initial}</div>
                    <div>
                      <div className="name">{q.name}</div>
                      <div className="trade">{q.role}</div>
                    </div>
                  </div>
                </SpringCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <AuditCTA preset="websites-seo" accent="green" />
      <Footer />
    </>
  )
}
