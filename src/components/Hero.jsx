import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

function StatCounter({ target, suffix, label }) {
  const ref = useRef(null)
  const elRef = useRef(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
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
        const val = isDecimal
          ? (eased * target).toFixed(1)
          : Math.floor(eased * target)
        if (elRef.current) {
          elRef.current.innerHTML = val + '<sup>' + suffix + '</sup>'
        }
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, suffix, prefersReduced])

  return (
    <motion.div
      className="stat"
      ref={ref}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <div
        className="n"
        ref={elRef}
        dangerouslySetInnerHTML={{ __html: `${target}<sup>${suffix}</sup>` }}
      />
      <div className="l">{label}</div>
    </motion.div>
  )
}

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const orb1Y = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -60])
  const orb2Y = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -40])
  const headingY = useTransform(scrollY, [0, 400], [0, prefersReduced ? 0 : -30])

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] },
  })

  return (
    <section className="hero" id="hero" ref={containerRef}>
      <div className="hero-orbs" aria-hidden="true">
        <motion.div className="hero-orb hero-orb-1" style={{ y: orb1Y }} />
        <motion.div className="hero-orb hero-orb-2" style={{ y: orb2Y }} />
        <div className="hero-orb hero-orb-3" />
      </div>
      <div className="wrap">
        <motion.a className="ann" href="#services" {...fadeUp(0)}>
          <b>New</b> AI agents that work while your team sleeps →
        </motion.a>

        <motion.h1 style={{ y: headingY }} {...fadeUp(0.1)}>
          Your business, <span className="grad">amplified</span> by AI.
        </motion.h1>

        <motion.p className="lede" {...fadeUp(0.28)}>
          Solvance Business Solutions helps companies consult, contract, and build with AI — from strategy sessions to production-grade agents. No fluff. No vendor lock-in. Just results.
        </motion.p>

        <motion.div className="ctas" {...fadeUp(0.44)}>
          <motion.a
            href="#contact"
            className="btn brand"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Book a discovery call <span className="arrow">→</span>
          </motion.a>
          <motion.a
            href="#services"
            className="btn ghost"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            See our services
          </motion.a>
        </motion.div>

        <motion.div className="micro" {...fadeUp(0.56)}>
          <span><span className="ck">✓</span> No long-term commitments</span>
          <span><span className="ck">✓</span> Works with your existing stack</span>
          <span><span className="ck">✓</span> Results-first, always</span>
        </motion.div>

        <div className="stats">
          <StatCounter target={40} suffix="+" label="AI projects delivered across industries" />
          <StatCounter target={3} suffix="wks" label="Average time to first measurable result" />
          <StatCounter target={4.9} suffix="★" label="Average client satisfaction rating" />
        </div>
      </div>
    </section>
  )
}
