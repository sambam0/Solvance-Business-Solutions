import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import SpringCard from './SpringCard.jsx'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

const LINES = [
  { id: 'cmd',   type: 'command', text: 'run-agent intake-qualifier --client mara-staffing' },
  { id: 'init1', type: 'meta',    text: '[12:47:03] Agent initialized — intake-qualifier v2.1' },
  { id: 'init2', type: 'meta',    text: '[12:47:03] Listening on webhook: /forms/contact' },
  { id: 'gap1',  type: 'gap',     text: '' },
  { id: 'sub',   type: 'output',  text: '> New submission received — mara-staffing.com/contact' },
  { id: 'n1',    type: 'data',    text: '  Name:     Daniel Reyes' },
  { id: 'n2',    type: 'data',    text: '  Email:    d.reyes@marastaffing.com' },
  { id: 'n3',    type: 'data',    text: '  Message:  "40+ inbound calls/week and my team is' },
  { id: 'n4',    type: 'data',    text: '             drowning in manual follow-up..."' },
  { id: 'gap2',  type: 'gap',     text: '' },
  { id: 'class', type: 'meta',    text: '[12:47:04] Classifying lead...' },
  { id: 'v1',    type: 'success', text: '✓ ICP match: ops-overload / ready-to-automate (94%)' },
  { id: 'v2',    type: 'success', text: '✓ Slack → @sam  "High-priority: Daniel Reyes, Mara Staffing"' },
  { id: 'v3',    type: 'success', text: '✓ Cal.com → Tuesday 2pm  AI Strategy Call (30 min)' },
  { id: 'v4',    type: 'success', text: '✓ Email queued → d.reyes@marastaffing.com' },
  { id: 'gap3',  type: 'gap',     text: '' },
  { id: 'done',  type: 'meta',    text: '[12:47:05] Intake complete. Response time: 1.9s' },
]

const outputLines = LINES.filter(l => l.type !== 'command')

export default function TerminalPane() {
  const rootRef = useRef(null)
  const cmdTextRef = useRef(null)
  const lineRefs = useRef([])
  const cursorRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
        delay: 0.3,
      })

      // 1. Type the command
      tl.to(cmdTextRef.current, {
        duration: 1.4,
        text: { value: LINES[0].text, delimiter: '' },
        ease: 'none',
      })

      // 2. Reveal output lines
      tl.to(
        lineRefs.current.filter(Boolean),
        {
          opacity: 1,
          y: 0,
          duration: 0.18,
          stagger: 0.09,
          ease: 'power2.out',
        },
        '+=0.15'
      )

      // 3. Show cursor
      tl.to(cursorRef.current, { opacity: 1, duration: 0.1 }, '+=0.2')
    })
  }, { scope: rootRef })

  return (
    <SpringCard className="card terminal-pane" hoverY={-3}>
      <div ref={rootRef}>
        {/* Chrome bar */}
        <div className="tp-chrome">
          <div className="tp-dots">
            <span className="tp-dot" />
            <span className="tp-dot" />
            <span className="tp-dot" />
          </div>
          <span className="tp-title">intake-qualifier — bash</span>
        </div>

        {/* Body */}
        <div className="tp-body">
          <div className="tp-line tp-line--prompt">
            <span className="tp-prompt">solvance@studio:~$ </span>
            <span ref={cmdTextRef} className="tp-cmd-text" />
          </div>

          {outputLines.map((line, i) => (
            <div
              key={line.id}
              ref={el => lineRefs.current[i] = el}
              className={`tp-line tp-line--${line.type}`}
              style={{ opacity: 0, transform: 'translateY(4px)' }}
            >
              {line.text}
            </div>
          ))}

          <div className="tp-line tp-line--prompt" style={{ opacity: 0 }} ref={cursorRef}>
            <span className="tp-prompt">solvance@studio:~$ </span>
            <span className="tp-cursor">█</span>
          </div>
        </div>
      </div>
    </SpringCard>
  )
}
