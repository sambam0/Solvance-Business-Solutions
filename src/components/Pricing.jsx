import FadeIn from './FadeIn.jsx'
import SpringCard from './SpringCard.jsx'
import { motion } from 'framer-motion'

export default function Pricing() {
  return (
    <section id="pricing" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> Pricing</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">Two ways to work <br />with us.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">A consulting retainer for ongoing strategy and advisory, or a fixed-scope build contract for custom AI solutions. Both are flat, transparent, and cancel-anytime.</p></FadeIn>

        <div className="pricing">
          <FadeIn delay={0.05}>
            <SpringCard className="tier" hoverY={-3} style={{ height: '100%' }}>
              <span className="name">Advisory</span>
              <h3>Strategy, guidance, and accountability every month.</h3>
              <div className="price"><span className="amt">$1,500</span><span className="per">/month · cancel anytime</span></div>
              <ul>
                {['2 strategy sessions per month', 'AI roadmap + prioritization', 'Unlimited async Q&A', 'Tool & vendor evaluations', 'Monthly written report', 'No long-term commitment'].map(item => (
                  <li key={item}><span className="ck">✓</span> {item}</li>
                ))}
              </ul>
              <motion.a
                href="#contact"
                className="btn ghost"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                Get started <span className="arrow">→</span>
              </motion.a>
            </SpringCard>
          </FadeIn>

          <FadeIn delay={0.1}>
            <SpringCard className="tier featured" hoverY={-3} style={{ height: '100%' }}>
              <span className="ribbon">Most Popular</span>
              <span className="name">Full Build</span>
              <h3>We scope, build, and deploy your custom AI solution.</h3>
              <div className="price"><span className="amt">Custom</span><span className="per">· scoped per project</span></div>
              <ul>
                {['Everything in Advisory', 'Dedicated build team', 'Custom AI agents & automations', 'Full integration with your stack', 'Team training & documentation', '60-day post-launch support'].map(item => (
                  <li key={item}><span className="ck">✓</span> {item}</li>
                ))}
              </ul>
              <motion.a
                href="#contact"
                className="btn primary"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                Book a scoping call <span className="arrow">→</span>
              </motion.a>
            </SpringCard>
          </FadeIn>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--mute)', fontSize: 13, flexWrap: 'wrap', gap: 12 }}>
          <span>No setup fee · Fixed-scope contracts · You own everything we build</span>
          <span className="mono" style={{ fontSize: 12 }}>USD · Stripe / ACH / wire</span>
        </div>
      </div>
    </section>
  )
}
