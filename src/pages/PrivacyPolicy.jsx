import { useEffect } from 'react'
import Lenis from 'lenis'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import FadeIn from '../components/FadeIn.jsx'

function Section({ number, title, children }) {
  return (
    <FadeIn>
      <div className="privacy-section">
        <h2>{number}. {title}</h2>
        {children}
      </div>
    </FadeIn>
  )
}

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Solvance Business Solutions'
    return () => { document.title = 'Solvance Business Solutions' }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Nav />
      <main className="privacy-page">
        <div className="wrap">
          <FadeIn>
            <span className="eyebrow"><span className="dot" /> Legal</span>
            <h1 className="section-title" style={{ marginTop: 14 }}>Privacy Policy</h1>
            <p className="section-sub">Effective date: June 1, 2026</p>
          </FadeIn>

          <div className="privacy-body">

            <Section number="1" title="Overview">
              <p>Solvance Business Solutions ("Solvance," "we," "us," or "our") operates this website to provide information about our AI consulting and contracting services. This Privacy Policy explains how we collect, use, and protect information when you visit our website or contact us through it.</p>
              <p>We believe in data minimization — we collect only what is necessary to respond to your inquiry and operate our business. We do not sell personal information, run advertising networks, or use behavioral tracking.</p>
            </Section>

            <Section number="2" title="Information We Collect">
              <p><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Information you provide directly.</strong> When you submit the contact form on this website, we collect the information you enter: your name, email address, company name, and the content of your message. This is the only way we collect personal information directly from you.</p>
              <p><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Information collected automatically.</strong> When you visit this site, our web server may log standard technical information including your IP address, browser type and version, referring URL, pages visited, and timestamps. This data is used solely for security and operational purposes and is not linked to your identity.</p>
              <p>We do not use tracking pixels, advertising cookies, fingerprinting scripts, or any third-party analytics platforms. No cookies are set by this website.</p>
            </Section>

            <Section number="3" title="How We Use Your Information">
              <p>We use the information you submit through our contact form to:</p>
              <ul>
                <li>Respond to your inquiry and answer your questions</li>
                <li>Evaluate whether our services are a good fit for your needs</li>
                <li>Schedule discovery calls or follow-up conversations related to your inquiry</li>
                <li>Comply with applicable legal obligations</li>
              </ul>
              <p>We do not send unsolicited marketing emails. Any follow-up communication will be directly related to your original inquiry.</p>
            </Section>

            <Section number="4" title="AI Tools & Data Processing">
              <p>As an AI consulting firm, we use AI tools internally as part of our work. Here is how that relates to your data:</p>
              <ul>
                <li>Information submitted through the public contact form on this website is not used to train or fine-tune any AI model.</li>
                <li>We may use AI-assisted tools internally to help draft responses or organize our work, but we treat all client communications with the same confidentiality as any professional services firm.</li>
                <li>When Solvance builds AI systems for clients as part of an engagement, the data handling practices for those systems are governed by the applicable service agreement or statement of work between Solvance and that client — not this policy.</li>
                <li>We do not share contact form submissions with any large language model provider in a way that would make your data available for their training purposes.</li>
              </ul>
            </Section>

            <Section number="5" title="Sharing of Information">
              <p>We do not sell, rent, or trade your personal information. We may share information only in the following limited circumstances:</p>
              <ul>
                <li><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Service providers:</strong> We may use third-party vendors (such as hosting providers or email services) who process information on our behalf under confidentiality obligations. These vendors are not permitted to use your information for any purpose other than providing services to us.</li>
                <li><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Legal requirements:</strong> We may disclose information if required to do so by law, court order, or government authority, or if we believe in good faith that disclosure is necessary to protect our rights or the safety of others.</li>
                <li><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to the same privacy protections described here.</li>
              </ul>
            </Section>

            <Section number="6" title="Data Retention">
              <p>We retain contact form submissions for as long as necessary to respond to your inquiry and for a reasonable business record-keeping period — generally no longer than two years from the date of submission. After that period, submissions are deleted from active systems.</p>
              <p>If you become a client of Solvance, your information may be retained for the duration of the engagement and for the period required by applicable law or professional obligations thereafter.</p>
            </Section>

            <Section number="7" title="Cookies & Tracking">
              <p>This website does not set any cookies. We do not use first-party or third-party cookies for analytics, advertising, session tracking, or any other purpose.</p>
              <p>If we add analytics or other tools in the future that use cookies or tracking technologies, we will update this policy before doing so and, where required by law, obtain your consent.</p>
            </Section>

            <Section number="8" title="Your Rights">
              <p>Depending on where you are located, you may have certain rights regarding your personal information:</p>
              <ul>
                <li><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>California residents (CCPA):</strong> You have the right to know what personal information we have collected about you, request deletion of your information, and opt out of the sale of your information (we do not sell data).</li>
                <li><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>EU and UK residents (GDPR/UK GDPR):</strong> You have the right to access, correct, or erase your personal data; to restrict or object to its processing; and to data portability. Our legal basis for processing contact form data is legitimate interest in responding to business inquiries. You also have the right to lodge a complaint with your local data protection authority.</li>
              </ul>
              <p>To exercise any of these rights, contact us at <a href="mailto:privacy@solvance.com">privacy@solvance.com</a>. We will respond within 30 days.</p>
            </Section>

            <Section number="9" title="Data Security">
              <p>All data transmitted between your browser and this website is encrypted via HTTPS. We implement reasonable administrative and technical safeguards to protect information against unauthorized access, disclosure, or misuse.</p>
              <p>Please note that the contact form on this website currently does not persist submissions to a long-term server-side database — inquiries are processed and forwarded without being stored indefinitely. No transmission over the internet can be guaranteed to be 100% secure, and we cannot warrant absolute security of any information you send us.</p>
            </Section>

            <Section number="10" title="Children's Privacy">
              <p>This website is intended for business professionals and is not directed at individuals under the age of 16. We do not knowingly collect personal information from anyone under 16. If you believe we have inadvertently collected such information, please contact us at <a href="mailto:privacy@solvance.com">privacy@solvance.com</a> and we will delete it promptly.</p>
            </Section>

            <Section number="11" title="Changes to This Policy">
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or applicable law. When we do, we will update the effective date at the top of this page. We encourage you to review this policy periodically.</p>
              <p>Your continued use of this website after any changes to this policy constitutes your acceptance of the updated terms.</p>
            </Section>

            <Section number="12" title="Contact Us">
              <p>If you have questions about this Privacy Policy or how we handle your information, please reach out:</p>
              <ul>
                <li><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Email:</strong> <a href="mailto:privacy@solvance.com">privacy@solvance.com</a></li>
                <li><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>LinkedIn:</strong> <a href="https://linkedin.com/company/solvance" target="_blank" rel="noopener noreferrer">linkedin.com/company/solvance</a></li>
              </ul>
              <p style={{ marginTop: 16 }}>Solvance Business Solutions</p>
            </Section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
