import FadeIn from './FadeIn.jsx'
import SpringCard from './SpringCard.jsx'

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> What we do</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">Four ways we make <br />AI work for you.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">Whether you need a roadmap, a build team, autonomous agents, or training — we cover the full stack. One partner, zero handoffs.</p></FadeIn>

        <div className="feat-grid">
          <FadeIn className="span-8">
            <SpringCard className="card hero-card" hoverY={-4} style={{ height: '100%' }}>
              <div>
                <div className="ic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" /></svg>
                </div>
                <h3 style={{ marginTop: 18 }}>AI Consulting — strategy that actually ships.</h3>
                <p style={{ marginTop: 10 }}>We audit your current operations, identify the highest-ROI automation opportunities, and hand you a prioritized roadmap. No slide decks — a plan you can act on Monday morning.</p>
              </div>
              <div className="badge2w"><span className="num">AI</span><span className="lbl">Strategy</span></div>
            </SpringCard>
          </FadeIn>

          <FadeIn className="span-4" delay={0.05}>
            <SpringCard className="card dark" hoverY={-4} style={{ height: '100%' }}>
              <div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg></div>
              <h3>AI Contracting</h3>
              <p>We embed as your build team. Custom AI solutions — integrations, pipelines, LLM-powered features — scoped, delivered, and production-ready.</p>
            </SpringCard>
          </FadeIn>

          <FadeIn className="span-6" delay={0.08}>
            <SpringCard className="card" hoverY={-4} style={{ height: '100%' }}>
              <div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg></div>
              <h3>AI Agents</h3>
              <p>Autonomous agents that handle research, outreach, data processing, customer support, and more — 24/7, without manual oversight. Built on your data, your tools.</p>
            </SpringCard>
          </FadeIn>

          <FadeIn className="span-6" delay={0.1}>
            <SpringCard className="card" hoverY={-4} style={{ height: '100%' }}>
              <div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
              <h3>Training &amp; Workshops</h3>
              <p>Hands-on sessions for your team — from AI fundamentals to prompt engineering, tool adoption, and building internal workflows. Your people leave knowing how to use this stuff.</p>
            </SpringCard>
          </FadeIn>

          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: 'No vendor lock-in', body: 'You own everything we build. No proprietary platforms, no dependency on us to keep the lights on.' },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>, title: 'Measurable outcomes', body: "Every engagement starts with defined success metrics. If it doesn't move the needle, we don't ship it." },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>, title: 'Stack agnostic', body: 'OpenAI, Anthropic, open-source models, your internal APIs — we work with what you already have.' },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>, title: 'Ongoing support', body: "We don't hand off and disappear. Retainer or project-based — we stay on call as your AI evolves." },
          ].map((c, i) => (
            <FadeIn key={c.title} className="span-3" delay={0.08 * i}>
              <SpringCard className="card" hoverY={-4} style={{ height: '100%' }}>
                <div className="ic">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </SpringCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
