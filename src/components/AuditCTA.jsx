import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn.jsx'

function validate(fields) {
  const errs = {}
  if (!fields.name.trim()) errs.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errs.email = 'Please enter a valid email.'
  return errs
}

const btnClass = {
  blue:   'btn brand',
  green:  'btn green',
  orange: 'btn orange',
}

export default function AuditCTA({ preset = '', accent = 'blue' }) {
  const [fields, setFields] = useState({ name: '', email: '', url: '', service: preset })
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
    setTimeout(() => { setSubmitting(false); setSuccess(true) }, 1600)
  }

  return (
    <section className="audit-cta" id="audit">
      <div className="wrap">
        <div className="audit-layout">
          <div>
            <FadeIn>
              <span className="eyebrow"><span className="dot" /> Free audit</span>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="section-title" style={{ marginTop: 16 }}>
                30 minutes to<br />a clear AI plan.
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p style={{ marginTop: 18, color: 'var(--mute)', fontSize: 17, maxWidth: '46ch', lineHeight: 1.55 }}>
                We map your biggest manual bottleneck — specific to your business — and show you
                exactly where AI fits. No pitch, no pressure, no obligation.
              </p>
            </FadeIn>
            <FadeIn delay={0.18}>
              <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'We map your exact bottleneck — not a generic report',
                  'You get a prioritized action plan you can use immediately',
                  'Whether or not you hire us',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: 'var(--ink-2)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <div className="audit-form-card">
              <span className="eyebrow" style={{ marginBottom: 6 }}><span className="dot" /> Request your audit</span>
              <p style={{ color: 'var(--mute)', fontSize: 14, marginTop: 6, marginBottom: 4 }}>
                We'll get back to you within one business day.
              </p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="aname">Name</label>
                    <input
                      id="aname"
                      type="text"
                      placeholder="Your name"
                      autoComplete="name"
                      value={fields.name}
                      onChange={set('name')}
                      className={errors.name ? 'error' : ''}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.span className="field-err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          {errors.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="field">
                    <label htmlFor="aemail">Email</label>
                    <input
                      id="aemail"
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      value={fields.email}
                      onChange={set('email')}
                      className={errors.email ? 'error' : ''}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span className="field-err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="field full">
                    <label htmlFor="aurl">Business website <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(optional)</span></label>
                    <input
                      id="aurl"
                      type="url"
                      placeholder="https://yourbusiness.com"
                      autoComplete="url"
                      value={fields.url}
                      onChange={set('url')}
                    />
                  </div>
                  <div className="field full">
                    <label htmlFor="aservice">What are you looking for?</label>
                    <select
                      id="aservice"
                      className="audit-service-select"
                      value={fields.service}
                      onChange={set('service')}
                    >
                      <option value="">Not sure yet — help me figure it out</option>
                      <option value="ai-agents">AI Agents & Automation — build it for me</option>
                      <option value="ai-training">AI Teaching & Training — teach me how</option>
                      <option value="both">Both — let's map it out together</option>
                    </select>
                  </div>
                </div>

                <div className="form-submit">
                  <AnimatePresence mode="wait">
                    {!success && (
                      <motion.button
                        key="submit"
                        type="submit"
                        className={`${btnClass[accent] || 'btn brand'}${submitting ? ' submitting' : ''}`}
                        whileHover={submitting ? {} : { y: -2 }}
                        whileTap={submitting ? {} : { scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        {submitting ? <span className="spin-icon" /> : null}
                        Request free audit
                        {!submitting ? <span className="arrow">→</span> : null}
                      </motion.button>
                    )}
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Audit request received — we'll reach out within one business day.
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
