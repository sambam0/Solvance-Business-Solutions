import { useEffect } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SpringCard from '../components/SpringCard.jsx'
import HeroRainCanvas from '../components/HeroRainCanvas.jsx'
import HeroParticleCanvas from '../components/HeroParticleCanvas.jsx'

const webDesignItems = [
  {
    title: 'Conversion-first landing pages',
    body: 'Not beautiful for its own sake. Every element has a job. Typography, hierarchy, and copy work together to move visitors to the next step.',
  },
  {
    title: 'Brand identity & web systems',
    body: 'From mark to motion. A coherent visual language across breakpoints, device sizes, and contexts. Design tokens that scale.',
  },
  {
    title: 'Interactive prototypes',
    body: 'High-fidelity prototypes before a line of production code ships. Test, iterate, validate — in the browser, not a deck.',
  },
]

const customBuildsItems = [
  {
    title: 'Mobile app design',
    body: 'iOS and Android. Not the same layout on two platforms — native patterns, native feel, native conversion. Built with real screen constraints in mind.',
  },
  {
    title: 'Internal tooling',
    body: 'Dashboards, ops tools, and workflow interfaces for teams who use software all day. Utility that doesn\'t sacrifice craft.',
  },
  {
    title: 'Concept to spec',
    body: 'From rough idea to a buildable specification. Wireframes, flows, and handoff documentation a developer can actually use.',
  },
]

export default function Other() {
  useEffect(() => {
    document.title = 'Other Work — Solvance'
    return () => { document.title = 'Solvance' }
  }, [])

  return (
    <>
      <Nav />

      {/* Ambient particle canvas behind the entire page */}
      <div className="other-particle-bg">
        <HeroParticleCanvas />
      </div>

      {/* Hero */}
      <section className="other-hero" id="hero">
        <HeroRainCanvas />
        <div className="wrap other-hero-wrap">
          <h1>Beyond the<br /><span className="grad">algorithm.</span></h1>
          <p className="lede">Design work and custom builds that live outside the AI consulting brief.</p>
        </div>
      </section>

      {/* Web Design */}
      <section className="other-section" id="web-design">
        <div className="wrap">
          <h2 className="section-title">Web design.</h2>
          <p className="section-sub">Sites built to earn attention, not just exist. Every layout is a layout decision, not a template choice.</p>
          <div className="other-grid">
            {webDesignItems.map(item => (
              <SpringCard key={item.title} className="other-card">
                <h3 className="other-card-title">{item.title}</h3>
                <p className="other-card-body">{item.body}</p>
              </SpringCard>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Builds */}
      <section className="other-section" id="custom-builds">
        <div className="wrap">
          <h2 className="section-title">Custom builds.</h2>
          <p className="section-sub">App design and bespoke digital products. From concept to shipped — opinionated about what ships.</p>
          <div className="other-grid">
            {customBuildsItems.map(item => (
              <SpringCard key={item.title} className="other-card">
                <h3 className="other-card-title">{item.title}</h3>
                <p className="other-card-body">{item.body}</p>
              </SpringCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
