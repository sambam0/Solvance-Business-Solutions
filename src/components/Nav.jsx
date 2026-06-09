import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    if (!sections.length || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id)
      })
    }, { rootMargin: '-35% 0px -55% 0px' })
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const links = [
    { href: '#services', label: 'Services' },
    { href: '#process', label: 'Process' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#proof', label: 'Proof' },
    { href: '#contact', label: 'Contact' },
  ]

  const close = () => setOpen(false)

  return (
    <>
      <nav className="top">
        <div className="wrap row">
          <div className="brand">
            <span className="mk" />
            Solvance
          </div>
          <div className="nav-links">
            {links.map(l => {
              const isActive = active === l.href.slice(1)
              return (
                <a key={l.href} href={l.href} className={isActive ? 'active' : ''}>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="nav-label">{l.label}</span>
                </a>
              )
            })}
          </div>
          <div className="nav-cta">
            <span className="pill"><span className="dot" /> Taking clients</span>
            <motion.a
              href="#contact"
              className="btn primary"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Book a call <span className="arrow">→</span>
            </motion.a>
            <button
              className={`hamburger${open ? ' open' : ''}`}
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav open"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            aria-hidden={!open}
          >
            {links.map(l => (
              <a key={l.href} href={l.href} className="mobile-link" onClick={close}>
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
