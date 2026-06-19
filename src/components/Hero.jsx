import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

function navigate(href) {
  history.pushState({}, '', href)
  window.dispatchEvent(new Event('locationchange'))
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] },
})

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const orb1Y = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -60])
  const orb2Y = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -40])
  const headingY = useTransform(scrollY, [0, 400], [0, prefersReduced ? 0 : -30])

  const goAudit = () => {
    document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero" ref={containerRef}>
      <div className="hero-orbs" aria-hidden="true">
        <motion.div className="hero-orb hero-orb-1" style={{ y: orb1Y }} />
        <motion.div className="hero-orb hero-orb-2" style={{ y: orb2Y }} />
        <div className="hero-orb hero-orb-3" />
      </div>

      <div className="wrap">
        <motion.button
          className="ann"
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          {...fadeUp(0)}
        >
          <b>New</b> From your first website to your first AI agent →
        </motion.button>

        <motion.h1 style={{ y: headingY }} {...fadeUp(0.1)}>
          Get found.<br />
          Get clients.<br />
          <span className="grad">Get ahead.</span>
        </motion.h1>

        <motion.p className="lede" {...fadeUp(0.28)}>
          Solvance works with businesses at every stage — from getting found on Google to running
          custom AI systems. Pick your level, tell us your goal, and we'll show you exactly what moves the needle.
        </motion.p>

        <motion.div className="ctas" {...fadeUp(0.44)}>
          <motion.button
            className="btn brand"
            onClick={goAudit}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Get a free audit <span className="arrow">→</span>
          </motion.button>
          <motion.button
            className="btn ghost"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Explore services ↓
          </motion.button>
        </motion.div>

        <motion.div className="micro" {...fadeUp(0.56)}>
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> No long-term commitments</span>
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> Results-first, always</span>
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> You own everything we build</span>
        </motion.div>
      </div>
    </section>
  )
}
