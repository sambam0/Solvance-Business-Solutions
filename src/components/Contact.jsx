import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn.jsx'

function validate(fields) {
  const errs = {}
  if (!fields.name.trim()) errs.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errs.email = 'Please enter a valid email address.'
  if (fields.message.trim().length <= 10) errs.message = 'Please tell us a bit about your situation.'
  return errs
}

export default function Contact() {
  const [fields, setFields] = useState({ name: '', company: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k) => (e) => {
    setFields(f => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors(er => ({ ...er, [k]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setFields({ name: '', company: '', email: '', message: '' })
    }, 1600)
  }

  return (
    <section className="final" id="contact">
      <div className="wrap">
        <div className="contact-layout">
          <div>
            <FadeIn>
              <h2>Stop leaving AI on the <span className="grad">table</span>.</h2>
            </FadeIn>
            <FadeIn delay={0.08}>
              <p style={{ marginTop: 18, color: 'var(--mute)', fontSize: 17, maxWidth: '48ch', lineHeight: 1.55 }}>
                30-minute discovery call. We'll map your biggest bottlenecks and tell you exactly where AI can move the needle — whether or not you hire us.
              </p>
            </FadeIn>
            <FadeIn delay={0.14}>
              <div className="ctas">
                <motion.a
                  href="mailto:hello@solvance.co"
                  className="btn brand"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  Book a discovery call <span className="arrow">→</span>
                </motion.a>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="cta-strip">
                {[['40+','AI projects delivered and in production.'],['3 wks','Average time to first result.'],['100%','Client ownership of all work.'],['4.9★','Average satisfaction rating.']].map(([n, l]) => (
                  <div className="it" key={n}><div className="n">{n}</div><div className="l">{l}</div></div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <div className="contact-form">
              <span className="eyebrow" style={{ marginBottom: 6 }}><span className="dot" /> Get in touch</span>
              <p style={{ color: 'var(--mute)', fontSize: 14, marginTop: 6, marginBottom: 4 }}>We'll get back to you within one business day.</p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="fname">Name</label>
                    <input id="fname" type="text" placeholder="Your name" autoComplete="name" value={fields.name} onChange={set('name')} className={errors.name ? 'error' : ''} />
                    <AnimatePresence>
                      {errors.name && <motion.span className="field-err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors.name}</motion.span>}
                    </AnimatePresence>
                  </div>
                  <div className="field">
                    <label htmlFor="fcompany">Company</label>
                    <input id="fcompany" type="text" placeholder="Company name" autoComplete="organization" value={fields.company} onChange={set('company')} />
                  </div>
                  <div className="field full">
                    <label htmlFor="femail">Email</label>
                    <input id="femail" type="email" placeholder="you@company.com" autoComplete="email" value={fields.email} onChange={set('email')} className={errors.email ? 'error' : ''} />
                    <AnimatePresence>
                      {errors.email && <motion.span className="field-err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors.email}</motion.span>}
                    </AnimatePresence>
                  </div>
                  <div className="field full">
                    <label htmlFor="fmessage">What are you looking to solve?</label>
                    <textarea id="fmessage" placeholder="Tell us about your current bottlenecks or the outcome you're working toward…" value={fields.message} onChange={set('message')} className={errors.message ? 'error' : ''} />
                    <AnimatePresence>
                      {errors.message && <motion.span className="field-err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors.message}</motion.span>}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="form-submit">
                  <AnimatePresence mode="wait">
                    {!success ? (
                      <motion.button
                        key="btn"
                        type="submit"
                        className={`btn brand${submitting ? ' submitting' : ''}`}
                        whileHover={submitting ? {} : { y: -2 }}
                        whileTap={submitting ? {} : { scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        {submitting ? <span className="spin-icon" /> : null}
                        Send message
                        {!submitting ? <span className="arrow">→</span> : null}
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {success && (
                    <motion.div
                      className="form-success"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Message sent — we'll be in touch within one business day.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
