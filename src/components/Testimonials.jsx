import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import FadeIn from './FadeIn.jsx'
import SpringCard from './SpringCard.jsx'

const Star = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const quotes = [
  {
    text: '"Onboarded Monday. Working prototype Thursday. In production the following week. No other firm operates like this."',
    name: 'Jordan M.',
    role: 'Head of Ops · SaaS company, Series A',
    initial: 'J',
    avStyle: {},
  },
  {
    text: '"We\'ve worked with AI vendors before — all talk, no results. Solvance was different from day one. Zero fluff, one working system."',
    name: 'Rachel T.',
    role: 'CEO · Professional services firm',
    initial: 'R',
    avStyle: { background: 'linear-gradient(135deg,#ff9500,#ff3b30)' },
  },
  {
    text: '"They mapped our entire operations in the first call, identified three automations we hadn\'t considered, and delivered all three. Remarkable team."',
    name: 'David K.',
    role: 'VP Engineering · E-commerce, 80-person team',
    initial: 'D',
    avStyle: { background: 'linear-gradient(135deg,#3B9EFF,#9D6FFF)' },
  },
]

function QuoteCard({ q }) {
  return (
    <SpringCard className="qcard" hoverY={-3} style={{ height: '100%' }}>
      <div className="stars">{Array.from({ length: 5 }).map((_, j) => <Star key={j} />)}</div>
      <blockquote>{q.text}</blockquote>
      <div className="who">
        <div className="av" style={q.avStyle}>{q.initial}</div>
        <div>
          <div className="name">{q.name}</div>
          <div className="trade">{q.role}</div>
        </div>
      </div>
    </SpringCard>
  )
}

export default function Testimonials() {
  const trackRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const handleScroll = () => {
      const idx = Math.round(track.scrollLeft / track.offsetWidth)
      setActiveIdx(idx)
    }
    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => track.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (i) => {
    trackRef.current?.scrollTo({ left: i * trackRef.current.offsetWidth, behavior: 'smooth' })
  }

  return (
    <section id="proof" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> Proof</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">What clients say.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">Real results from real companies — not cherry-picked edge cases.</p></FadeIn>

        {/* Desktop grid */}
        <div className="quotes desktop-quotes">
          {quotes.map((q, i) => (
            <FadeIn key={q.name} delay={0.08 * i}>
              <QuoteCard q={q} />
            </FadeIn>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="quotes-mobile" ref={trackRef}>
          {quotes.map(q => (
            <div key={q.name} className="qcard-wrap">
              <QuoteCard q={q} />
            </div>
          ))}
        </div>

        <div className="carousel-dots">
          {quotes.map((_, i) => (
            <motion.button
              key={i}
              className="carousel-dot"
              onClick={() => scrollTo(i)}
              animate={{
                scale: activeIdx === i ? 1.4 : 1,
                opacity: activeIdx === i ? 1 : 0.35,
                background: activeIdx === i ? 'var(--brand)' : 'var(--mute-2)',
              }}
              transition={{ duration: 0.2 }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
