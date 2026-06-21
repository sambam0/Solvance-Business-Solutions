import FadeIn from './FadeIn.jsx'
import SpringCard from './SpringCard.jsx'
import { motion } from 'framer-motion'

const defaultHeading = { line1: 'Two ways to work', line2: 'with us.' }
const defaultSubhead = 'A consulting retainer for ongoing strategy and advisory, or a fixed-scope build contract for custom AI solutions. Both are flat, transparent, and cancel-anytime.'
const defaultFootnote = 'No setup fee · Fixed-scope contracts · You own everything we build'

const defaultTiers = [
  {
    name: 'Advisory',
    h3: 'Strategy, guidance, and accountability every month.',
    amount: '$1,500',
    per: '/month · cancel anytime',
    items: ['2 strategy sessions per month', 'AI roadmap + prioritization', 'Unlimited async Q&A', 'Tool & vendor evaluations', 'Monthly written report', 'No long-term commitment'],
    cta: 'Get started',
    ctaHref: '#contact',
    ctaClass: 'ghost',
    featured: false,
  },
  {
    name: 'Full Build',
    h3: 'We scope, build, and deploy your custom AI solution.',
    amount: 'Custom',
    per: '· scoped per project',
    items: ['Everything in Advisory', 'Dedicated build team', 'Custom AI agents & automations', 'Full integration with your stack', 'Team training & documentation', '60-day post-launch support'],
    cta: 'Book a scoping call',
    ctaHref: '#contact',
    ctaClass: 'primary',
    featured: true,
    ribbon: 'Most Popular',
  },
]

export default function Pricing({
  tiers = defaultTiers,
  heading = defaultHeading,
  subhead = defaultSubhead,
  footnote = defaultFootnote,
}) {
  return (
    <section id="pricing" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> Pricing</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">{heading.line1} <br />{heading.line2}</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">{subhead}</p></FadeIn>

        <div className="pricing">
          {tiers.map((tier, i) => (
            <FadeIn key={tier.name} delay={0.05 * (i + 1)}>
              <SpringCard className={`tier${tier.featured ? ' featured' : ''}`} hoverY={-3} style={{ height: '100%' }}>
                {tier.ribbon && <span className="ribbon">{tier.ribbon}</span>}
                <span className="name">{tier.name}</span>
                <h3>{tier.h3}</h3>
                <div className="price"><span className="amt">{tier.amount}</span><span className="per">{tier.per}</span></div>
                <ul>
                  {tier.items.map(item => (
                    <li key={item}><span className="ck">✓</span> {item}</li>
                  ))}
                </ul>
                <motion.a
                  href={tier.ctaHref}
                  className={`btn ${tier.ctaClass}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {tier.cta} <span className="arrow">→</span>
                </motion.a>
              </SpringCard>
            </FadeIn>
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--mute)', fontSize: 13, flexWrap: 'wrap', gap: 12 }}>
          <span>{footnote}</span>
          <span className="mono" style={{ fontSize: 12 }}>USD · Stripe / ACH / wire</span>
        </div>
      </div>
    </section>
  )
}
