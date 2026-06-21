import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import AIAgents from './pages/AIAgents.jsx'
import AITraining from './pages/AITraining.jsx'

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

  if (path === '/websites-seo' || path === '/ads-marketing') {
    history.replaceState({}, '', '/')
    return <App />
  }
  if (path === '/custom-builds') {
    history.replaceState({}, '', '/ai-agents')
    return <AIAgents />
  }
  if (path === '/ai-agents') return <AIAgents />
  if (path === '/ai-training') return <AITraining />
  if (path === '/privacy') return <PrivacyPolicy />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Router /></StrictMode>
)
