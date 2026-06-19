import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import WebsitesSEO from './pages/WebsitesSEO.jsx'
import AdsMarketing from './pages/AdsMarketing.jsx'
import CustomBuilds from './pages/CustomBuilds.jsx'

function Router() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onNav = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onNav)
    window.addEventListener('locationchange', onNav)
    return () => {
      window.removeEventListener('popstate', onNav)
      window.removeEventListener('locationchange', onNav)
    }
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  if (path === '/websites-seo') return <WebsitesSEO />
  if (path === '/ads-marketing') return <AdsMarketing />
  if (path === '/custom-builds') return <CustomBuilds />
  if (path === '/privacy') return <PrivacyPolicy />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Router /></StrictMode>
)
