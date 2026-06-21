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

const whoCards = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'You\'re watching hours disappear to work you know AI could handle',
    desc: 'Drafting, summarizing, researching, responding — you\'re doing it manually because you haven\'t had time to set AI up properly. That\'s the problem we fix in a half day.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: 'You\'ve tried ChatGPT but it doesn\'t sound like you or know your business',
    desc: 'Generic AI gives generic output. A second brain configured for your voice, your clients, and your recurring tasks is a different tool entirely — and it takes one session to build.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'You want to run this yourself — not manage a vendor or depend on a tool you don\'t understand',
    desc: 'You\'re not looking for a subscription or a black box. You want Claude set up, explained, and handed to you. You own it completely. We just get you there faster.',
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

const trainingSteps = [
  {
    num: '1', time: 'Session 1 · Free', title: 'Audit',
    body: "A free 30-minute call to map where you're spending time and where AI can give you hours back. You leave with a clear picture of what to tackle first — useful whether or not you work with us.",
    lines: [
      { green: false, text: 'Reviewing your workflows + recurring tasks…' },
      { green: true,  text: 'Top 3 time-drains identified' },
      { green: true,  text: 'Your Claude setup plan ready' },
    ],
  },
  {
    num: '2', time: 'Half-Day · Hands-on', title: 'Setup',
    body: "One session where we configure Claude for your specific voice, role, and recurring tasks. You leave with a working second brain — system prompt tuned, prompt library built, tested on real work.",
    lines: [
      { green: false, text: 'System prompt tuned to your workflow…' },
      { green: true,  text: 'Prompt library built for your top tasks' },
      { green: true,  text: 'Second brain live — tested on real work' },
    ],
  },
  {
    num: '3', time: 'Ongoing · Your pace', title: 'Apply',
    body: "You use it on actual work from day one. We stay available for refinement, questions, and expanding to your team when you're ready.",
    lines: [
      { green: true, text: 'Day 1 — using it on real tasks' },
      { green: true, text: 'Week 1 — prompt library expanding' },
      { green: true, text: 'When ready — team rollout available' },
    ],
  },
]

const trainingProcessHeading = { line1: 'Audit. Setup.', line2: 'Apply.' }
const trainingProcessSubhead = "Three steps to a second brain that actually saves you time. We start free, go hands-on fast, and stay available as you grow."

const offerings = [
  {
    name: 'Second Brain Setup',
    desc: 'One half-day session. Claude configured for your voice, your workflow, and your top recurring tasks. You leave with a working system — prompt library, system prompt, tested on real work.',
    items: ['4-hour hands-on session', 'System prompt tuned to your business', 'Prompt library for your top tasks', '30 days async follow-up', 'You own everything'],
    cta: 'Start with a free audit',
    ctaHref: '#audit',
    featured: true,
    ribbon: 'Start here',
  },
  {
    name: '1-on-1 Coaching',
    desc: 'Ongoing monthly sessions to expand your AI stack as your work evolves. New tools, new workflows, prompt refinement — scoped to what you actually need.',
    items: ['2 sessions per month', 'Prompt library expansion', 'Tool and workflow integration', 'Unlimited async Q&A', 'No long-term commitment'],
    cta: 'Book a call',
    ctaHref: '#audit',
    featured: false,
  },
  {
    name: 'Team Training',
    desc: 'Custom AI training for your whole org — assessment, curriculum, live sessions, and prompt playbooks your team will actually use. Scoped per engagement.',
    items: ['AI readiness assessment', 'Custom curriculum design', 'Live group training', 'Prompt playbooks + documentation', 'Follow-up Q&A and refinement'],
    cta: 'Book a scoping call',
    ctaHref: '#audit',
    featured: false,
  },
]

const trainingFaqs = [
  {
    q: "What's included in the Second Brain Setup?",
    a: "The Second Brain Setup is a 4-hour hands-on session where we configure Claude specifically for your role, voice, and recurring tasks. You leave with a tuned system prompt, a prompt library for your most common workflows, and a setup you use from the next morning. We include 30 days of async follow-up so you can ask questions as you build the habit.",
  },
  {
    q: "Do I need technical skills to get started?",
    a: "None. Claude works in plain language — no code, no configuration files, no developer required. If you can write an email, you can use Claude. The session is built around your actual work, not abstract concepts.",
  },
  {
    q: "Which AI tools do you cover?",
    a: "Sessions are built around Claude as the primary tool — it's the most capable for business writing, research, and reasoning tasks. Depending on your workflow, we also cover GPT-4o, Perplexity, Notion AI, and automation tools like Make or Zapier. We teach you which tool to use when, so you stop guessing.",
  },
  {
    q: "How quickly will I see results?",
    a: "Most people leave the first session with time already saved — because we work on real tasks during the session, not hypotheticals. Within a week of daily use, the habits start to compound. The owners who get the most out of it are the ones who use it immediately on real work, not in test mode.",
  },
  {
    q: "Can you train my whole team?",
    a: "Yes. Team Training Packages include an AI readiness assessment across your team, custom curriculum design, live group sessions, and prompt playbooks everyone can follow. We scope these individually — reach out and we'll design something specific to your org.",
  },
  {
    q: "What makes this different from just reading the Claude docs?",
    a: "The docs tell you what Claude can do. We show you what it does for your business, in your workflow, on your actual recurring tasks. The difference is between knowing how a tool works and knowing how to use it to get an hour back by Thursday.",
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
  const whoRef = useRef(null)
  const curriculumRef = useRef(null)
  const formatsRef = useRef(null)
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

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (whoRef.current) {
        gsap.from(whoRef.current.querySelectorAll('.who-anim'), {
          opacity: 0, y: 32, duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: whoRef.current, start: 'top 78%', toggleActions: 'play none none none' },
        })
      }
      if (curriculumRef.current) {
        gsap.from(curriculumRef.current.querySelectorAll('.pillar-item-anim'), {
          opacity: 0, y: 28, duration: 0.55, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: curriculumRef.current, start: 'top 78%', toggleActions: 'play none none none' },
        })
      }
      if (formatsRef.current) {
        gsap.from(formatsRef.current.querySelectorAll('.format-anim'), {
          opacity: 0, y: 28, duration: 0.55, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: formatsRef.current, start: 'top 78%', toggleActions: 'play none none none' },
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
            <StatCounter target={4} suffix="hr" label="Half-day workshop to your second brain" />
            <StatCounter target={40} suffix="+" label="Business owners trained" />
            <StatCounter target={12} suffix="+" label="AI tools covered across curricula" />
          </div>
        </div>
      </section>

      {/* ── Who This Is For ── */}
      <section id="who" ref={whoRef}>
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> Who this is for</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Sound familiar?</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">You don't need to be technical. You need to be ready to actually use what you learn.</p></FadeIn>

          <div className="cb-build-layout" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 48 }}>
            {whoCards.map((card) => (
              <div key={card.title} className="who-anim">
                <SpringCard className="card" hoverY={-4} style={{ height: '100%', padding: '28px 24px' }}>
                  <div className="ic" style={{ marginBottom: 16 }}>{card.icon}</div>
                  <div className="cb-item-title" style={{ fontSize: 16, marginBottom: 10 }}>{card.title}</div>
                  <p className="cb-item-desc">{card.desc}</p>
                </SpringCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You'll Learn ── */}
      <section id="curriculum" ref={curriculumRef}>
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> Curriculum</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">What you'll learn.<br /><span className="grad">What you'll actually use.</span></h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">Every session is tailored to your business. These are the four pillars every engagement covers.</p></FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 48 }}>
            {pillars.map((p) => (
              <div key={p.num} className="pillar-item-anim">
                <div style={{ padding: '28px 24px', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-2)' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--brand)', letterSpacing: '0.1em', marginBottom: 12 }}>{p.num}</div>
                  <div className="cb-item-title" style={{ fontSize: 17, marginBottom: 10 }}>{p.title}</div>
                  <p className="cb-item-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Teach ── */}
      <section id="formats" ref={formatsRef}>
        <div className="wrap">
          <FadeIn><span className="eyebrow"><span className="dot" /> How we teach</span></FadeIn>
          <FadeIn delay={0.05}><h2 className="section-title">Three formats.<br />One outcome.</h2></FadeIn>
          <FadeIn delay={0.1}><p className="section-sub">Every format ends the same way: you leave knowing how to use AI in your business, not just knowing that you should.</p></FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 48 }}>
            {formats.map((f) => (
              <div key={f.title} className="format-anim">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <Process steps={trainingSteps} heading={trainingProcessHeading} subhead={trainingProcessSubhead} />

      {/* ── Pricing ── */}
      <Pricing tiers={trainingTiers} heading={trainingPricingHeading} subhead={trainingPricingSubhead} footnote={trainingPricingFootnote} />

      {/* ── FAQ ── */}
      <FAQ faqs={trainingFaqs} />

      <AuditCTA preset="ai-training" accent="blue" />
      <Footer />
    </>
  )
}
