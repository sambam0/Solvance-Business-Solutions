import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import FadeIn from './FadeIn.jsx'
import SpringCard from './SpringCard.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const steps = [
  {
    num: '1', time: 'Week 1 · Discovery', title: 'Discover',
    body: "We map your operations, interview your team, and identify the highest-leverage AI opportunities. You leave with a prioritized roadmap — useful whether or not you hire us.",
    lines: [
      { green: false, text: 'Auditing current workflows + tools…' },
      { green: true,  text: '3 high-ROI automation targets found' },
      { green: true,  text: 'Roadmap ready — ranked by impact' },
    ],
  },
  {
    num: '2', time: 'Weeks 2–4 · Build', title: 'Build',
    body: "One dedicated builder. Weekly demos, tight feedback loops. We scope the solution, build it against your real data, and iterate until it works — not just in theory.",
    lines: [
      { green: false, text: 'Week 2 — prototype live in staging' },
      { green: false, text: 'Week 3 — integrated with your systems' },
      { green: true,  text: 'Week 4 — accuracy benchmarks passing' },
    ],
  },
  {
    num: '3', time: 'Week 5+ · Deploy', title: 'Deploy',
    body: "We ship to production, train your team, monitor performance, and stay on call. The work is yours. We stick around to make sure it keeps working as your needs grow.",
    lines: [
      { green: true, text: 'Production deploy · zero downtime' },
      { green: true, text: 'Team trained · documentation handed off' },
      { green: true, text: 'Monitoring active · first report sent' },
    ],
  },
]

export default function Process() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const el = sectionRef.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const line = el.querySelector('.steps-line')
      const stepAnims = el.querySelectorAll('.step-anim')
      const stepsContainer = el.querySelector('.steps')

      if (line) {
        gsap.from(line, {
          scaleX: 0,
          opacity: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      }

      if (stepAnims.length && stepsContainer) {
        gsap.from(stepAnims, {
          opacity: 0,
          y: 32,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: stepsContainer,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        })
      }
    })
  })

  return (
    <section id="process" ref={sectionRef}>
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> How it works</span></FadeIn>
        <FadeIn delay={0.05}>
          <h2 className="section-title">
            Discover. Build. <br />
            <span style={{ background: 'linear-gradient(90deg,#3B9EFF,#9D6FFF)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Deploy.</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">Three steps, no surprises. We move fast, keep you in the loop, and don't disappear after launch.</p></FadeIn>

        <div className="steps-line" />

        <div className="steps">
          {steps.map((s) => (
            <div key={s.num} className="step-anim">
              <SpringCard className="step" hoverY={-3} style={{ height: '100%' }}>
                <div className="head">
                  <span className="badge">{s.num}</span>
                  <span className="time">{s.time}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="demo">
                  {s.lines.map(l => (
                    <div key={l.text} className={`ln${l.green ? ' gn' : ''}`}>{l.text}</div>
                  ))}
                </div>
              </SpringCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
