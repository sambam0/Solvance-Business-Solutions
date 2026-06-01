import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Clients from './components/Clients.jsx'
import Services from './components/Services.jsx'
import WorkflowCanvas from './components/WorkflowCanvas.jsx'
import CaseStudies from './components/CaseStudies.jsx'
import Process from './components/Process.jsx'
import Pricing from './components/Pricing.jsx'
import FAQ from './components/FAQ.jsx'
import Testimonials from './components/Testimonials.jsx'
import Team from './components/Team.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Clients />
      <Services />
      <WorkflowCanvas />
      <CaseStudies />
      <Process />
      <Pricing />
      <FAQ />
      <Testimonials />
      <Team />
      <Contact />
      <Footer />
    </>
  )
}
