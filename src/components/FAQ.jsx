import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn.jsx'

const defaultFaqs = [
  {
    q: 'How long does a typical project take?',
    a: 'Most engagements run 4–8 weeks from kickoff to production deploy. Discovery is week one. Build is two to four weeks depending on scope. We don\'t pad timelines — if something can ship faster, it does. Complex multi-system integrations may run longer, and we\'ll scope those honestly upfront.',
  },
  {
    q: 'Do we need technical staff to work with you?',
    a: "No. We've worked with teams that have zero technical staff and teams with full engineering departments. We adapt. If you don't have devs, we handle everything end-to-end. If you do, we work alongside them. The only thing we need is access to your relevant tools and a point person who understands your operations.",
  },
  {
    q: 'What happens after the 60-day support period?',
    a: "You own everything we build — the code, the prompts, the infrastructure. After the support window closes, you can maintain it yourself, hire someone else, or keep us on retainer for ongoing monitoring and updates. We document everything thoroughly so handoff is clean no matter what you choose.",
  },
  {
    q: 'Can you work with our existing tools?',
    a: "Yes — stack-agnostic is a core principle. We've integrated with Salesforce, HubSpot, Notion, Airtable, Slack, Zapier, custom APIs, and internal databases. We don't require you to adopt new tools unless the existing ones genuinely can't support what you need.",
  },
  {
    q: 'How is pricing determined for Full Build?',
    a: "We scope every Full Build project individually before quoting. The scoping call is free, and you'll get a written scope with a fixed price — no hourly billing, no surprise overages. Price depends on complexity, integrations required, and number of systems involved. Simple automations start around $5K; production-grade agent systems typically run $15K–$50K+.",
  },
  {
    q: 'Do you sign NDAs?',
    a: "Yes, always. We're happy to sign your NDA before any detailed conversation, or use our standard mutual NDA. Confidentiality is non-negotiable — we treat every client's data, processes, and IP with strict discretion.",
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <div className="faq-summary" onClick={() => setOpen(o => !o)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}>
        {q}
        <motion.span
          className="faq-icon"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ({ faqs = defaultFaqs }) {
  return (
    <section id="faq">
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> FAQ</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">Common questions.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">Straight answers to the things people actually ask before signing.</p></FadeIn>

        <div className="faq-list">
          {faqs.map((f, i) => (
            <FadeIn key={f.q} delay={0.04 * i}>
              <FAQItem q={f.q} a={f.a} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
