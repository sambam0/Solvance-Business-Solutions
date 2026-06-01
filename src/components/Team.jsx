import FadeIn from './FadeIn.jsx'
import { motion } from 'framer-motion'

const members = [
  {
    initials: 'SB',
    name: 'Sam B.',
    title: 'Founder & AI Engineer',
    bio: '10+ years in software engineering and product. Has built and shipped AI systems across SaaS, e-commerce, and professional services. Former operator — not just a consultant.',
    avStyle: {},
    titleStyle: {},
  },
  {
    initials: 'AM',
    name: 'Alex M.',
    title: 'Lead Solutions Architect',
    bio: 'Specializes in LLM integration, agent design, and enterprise workflow automation. Previously built internal AI tooling at a 500-person tech company before joining Solvance.',
    avStyle: { color: 'var(--brand-2)', background: 'var(--soft-2)' },
    titleStyle: { color: 'var(--brand-2)' },
  },
]

export default function Team() {
  return (
    <section id="team">
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> The team</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">Built by practitioners, not consultants.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">We've shipped production AI systems, not just slide decks. We know what it takes to make this stuff work inside a real business.</p></FadeIn>

        <div className="team-grid">
          {members.map((m, i) => (
            <FadeIn key={m.name} delay={0.08 * i}>
              <motion.div
                className="team-card"
                whileHover={{ y: -3, borderColor: 'var(--line-2)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{ height: '100%' }}
              >
                <div className="team-av" style={m.avStyle}>{m.initials}</div>
                <div className="team-info">
                  <div className="tname">{m.name}</div>
                  <div className="title" style={m.titleStyle}>{m.title}</div>
                  <p className="bio">{m.bio}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
