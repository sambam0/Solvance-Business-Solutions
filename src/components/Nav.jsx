import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#systems',  label: 'AI Systems' },
  { href: '#training', label: 'AI Training' },
  { href: '#team',     label: 'Team' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const observerRef = useRef(null)

  // Track which section is in view
  useEffect(() => {
    const ids = links.map(l => l.href.slice(1))
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return

    observerRef.current = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive('#' + entry.target.id)
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    sections.forEach(s => observerRef.current.observe(s))
    return () => observerRef.current?.disconnect()
  }, [])

  const goAudit = useCallback(() => {
    scrollTo('audit')
    setOpen(false)
  }, [])

  const handleLink = useCallback((href) => {
    scrollTo(href.slice(1))
    setOpen(false)
  }, [])

  return (
    <>
      <nav className="top">
        <div className="wrap row">
          <button
            className="brand nav-home-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Solvance home"
          >
            <span className="mk" />
            Solvance
          </button>

          <div className="nav-links">
            {links.map(l => {
              const isActive = active === l.href
              return (
                <button
                  key={l.href}
                  onClick={() => handleLink(l.href)}
                  className={isActive ? 'active' : ''}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="nav-label">{l.label}</span>
                </button>
              )
            })}
          </div>

          <div className="nav-cta">
            <span className="pill"><span className="dot" /> Taking 3 AI projects this quarter</span>
            <motion.button
              className="btn brand"
              onClick={goAudit}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Get started <span className="arrow">→</span>
            </motion.button>
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
            className="mobile-nav"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          >
            {links.map(l => (
              <button key={l.href} className="mobile-link" onClick={() => handleLink(l.href)}>
                {l.label}
              </button>
            ))}
            <motion.button
              className="btn brand"
              style={{ marginTop: 8, justifyContent: 'center' }}
              onClick={goAudit}
              whileTap={{ scale: 0.97 }}
            >
              Get started →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
