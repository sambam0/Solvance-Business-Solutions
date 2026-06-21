import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function navigate(href) {
  history.pushState({}, '', href)
  window.dispatchEvent(new Event('locationchange'))
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onNav = () => { setPath(window.location.pathname); setOpen(false) }
    window.addEventListener('popstate', onNav)
    window.addEventListener('locationchange', onNav)
    return () => {
      window.removeEventListener('popstate', onNav)
      window.removeEventListener('locationchange', onNav)
    }
  }, [])

  const links = [
    { href: '/ai-agents',  label: 'AI Agents'  },
    { href: '/ai-training', label: 'AI Training' },
  ]

  const goAudit = () => {
    if (path !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' }), 300)
    } else {
      document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })
    }
    setOpen(false)
  }

  return (
    <>
      <nav className="top">
        <div className="wrap row">
          <button
            className="brand nav-home-btn"
            onClick={() => navigate('/')}
            aria-label="Solvance home"
          >
            <span className="mk" />
            Solvance
          </button>

          <div className="nav-links">
            {links.map(l => {
              const isActive = path === l.href
              return (
                <button
                  key={l.href}
                  onClick={() => navigate(l.href)}
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
              Free Audit <span className="arrow">→</span>
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
              <button key={l.href} className="mobile-link" onClick={() => navigate(l.href)}>
                {l.label}
              </button>
            ))}
            <motion.button
              className="btn brand"
              style={{ marginTop: 8, justifyContent: 'center' }}
              onClick={goAudit}
              whileTap={{ scale: 0.97 }}
            >
              Free Audit →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
