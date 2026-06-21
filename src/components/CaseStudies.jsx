import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import FadeIn from './FadeIn.jsx'
import SpringCard from './SpringCard.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const cases = [
  {
    tag: 'SaaS / Operations',
    label: 'Challenge',
    title: 'Weekly reporting took 6 hours of manual work across three separate tools.',
    metric: '70%',
    metricSub: 'time saved',
    quote: '"The agent just runs — we don\'t touch it. Our ops team got half their week back."',
  },
  {
    tag: 'Professional Services',
    label: 'Challenge',
    title: 'Sales proposals required 3+ hours of research and custom drafting per client.',
    metric: '4×',
    metricSub: 'faster proposals',
    quote: '"Every agency gave us a deck. Solvance had a working prototype by end of week two."',
  },
  {
    tag: 'E-commerce',
    label: 'Challenge',
    title: 'Customer support was backlogged 48+ hours with repetitive tier-1 queries.',
    metric: '80%',
    metricSub: 'deflection rate',
    quote: '"My whole team went from skeptical to building their own workflows in a week."',
  },
]

export default function CaseStudies() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const el = sectionRef.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const grid = el.querySelector('.case-grid')
      const cards = Array.from(el.querySelectorAll('.case-anim'))
      if (!grid || cards.length < 3) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
      tl.from(cards[0], { opacity: 0, x: -40, y: 20, duration: 0.65, ease: 'power3.out' }, 0)
      tl.from(cards[1], { opacity: 0, y: 40,        duration: 0.65, ease: 'power3.out' }, 0.12)
      tl.from(cards[2], { opacity: 0, x: 40,  y: 20, duration: 0.65, ease: 'power3.out' }, 0.24)
    })
  })

  return (
    <section style={{ background: 'var(--bg-2)' }} ref={sectionRef}>
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> Work</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">Results that speak for themselves.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">A sample of what we've built — and the outcomes that followed.</p></FadeIn>

        <div className="case-grid">
          {cases.map((c) => (
            <div key={c.tag} className="case-anim">
              <SpringCard className="case-card" hoverY={-4} style={{ height: '100%' }}>
                <div className="case-tag">{c.tag}</div>
                <div className="case-label">{c.label}</div>
                <h3>{c.title}</h3>
                <div className="case-metric">{c.metric}<span>{c.metricSub}</span></div>
                <p className="case-quote">{c.quote}</p>
                <span className="case-soon">↗ Full case study coming soon</span>
              </SpringCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
