import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Other from './pages/Other.jsx'

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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  // Legacy and old page redirects — all go to home
  if (['/websites-seo', '/ads-marketing', '/custom-builds', '/ai-agents', '/ai-training'].includes(path)) {
    history.replaceState({}, '', '/')
    return <App />
  }

  if (path === '/other') return <Other />
  if (path === '/privacy') return <PrivacyPolicy />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Router /></StrictMode>
)
