import FadeIn from './FadeIn.jsx'
import SpringCard from './SpringCard.jsx'

const cases = [
  {
    tag: 'SaaS / Operations',
    label: 'Challenge',
    title: 'Weekly reporting took 6 hours of manual work across three separate tools.',
    metric: '70%',
    metricSub: 'time saved',
    quote: '"The agent just runs — we don\'t touch it. Our ops team got half their week back."',
  },
  {
    tag: 'Professional Services',
    label: 'Challenge',
    title: 'Sales proposals required 3+ hours of research and custom drafting per client.',
    metric: '4×',
    metricSub: 'faster proposals',
    quote: '"Every agency gave us a deck. Solvance had a working prototype by end of week two."',
  },
  {
    tag: 'E-commerce',
    label: 'Challenge',
    title: 'Customer support was backlogged 48+ hours with repetitive tier-1 queries.',
    metric: '80%',
    metricSub: 'deflection rate',
    quote: '"My whole team went from skeptical to building their own workflows in a week."',
  },
]

export default function CaseStudies() {
  return (
    <section style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> Work</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">Results that speak for themselves.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">A sample of what we've built — and the outcomes that followed.</p></FadeIn>

        <div className="case-grid">
          {cases.map((c, i) => (
            <FadeIn key={c.tag} delay={0.08 * i}>
              <SpringCard className="case-card" hoverY={-4} style={{ height: '100%' }}>
                <div className="case-tag">{c.tag}</div>
                <div className="case-label">{c.label}</div>
                <h3>{c.title}</h3>
                <div className="case-metric">{c.metric}<span>{c.metricSub}</span></div>
                <p className="case-quote">{c.quote}</p>
                <span className="case-soon">↗ Full case study coming soon</span>
              </SpringCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
