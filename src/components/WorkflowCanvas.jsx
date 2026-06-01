import { useEffect, useRef } from 'react'
import FadeIn from './FadeIn.jsx'

export default function WorkflowCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DPR = window.devicePixelRatio || 1
    let W = 0, H = 0, NS = 0
    let bgCache = null

    const NODES = [
      { id: 'trigger',  label: 'Trigger',        abbr: 'TR', rx: 0.075, ry: 0.50,  color: '#F97316', glow: 0, state: 'dormant' },
      { id: 'orch',     label: 'Orchestrator',   abbr: 'OR', rx: 0.265, ry: 0.50,  color: '#8B5CF6', glow: 0, state: 'dormant' },
      { id: 'data',     label: 'Data Ingestion', abbr: 'DI', rx: 0.490, ry: 0.175, color: '#3B82F6', glow: 0, state: 'dormant' },
      { id: 'memory',   label: 'Memory',         abbr: 'ME', rx: 0.490, ry: 0.800, color: '#06B6D4', glow: 0, state: 'dormant' },
      { id: 'llm',      label: 'LLM Router',     abbr: 'LM', rx: 0.625, ry: 0.375, color: '#A78BFA', glow: 0, state: 'dormant' },
      { id: 'actions',  label: 'Actions',        abbr: 'AC', rx: 0.760, ry: 0.650, color: '#10B981', glow: 0, state: 'dormant' },
      { id: 'response', label: 'Response',       abbr: 'RE', rx: 0.905, ry: 0.240, color: '#60A5FA', glow: 0, state: 'dormant' },
      { id: 'integ',    label: 'Integrations',   abbr: 'IN', rx: 0.905, ry: 0.775, color: '#F59E0B', glow: 0, state: 'dormant' },
    ]
    const nMap = Object.fromEntries(NODES.map(n => [n.id, n]))

    const EDGES = [
      { from: 'trigger', to: 'orch',     lit: 0 },
      { from: 'orch',    to: 'data',     lit: 0 },
      { from: 'orch',    to: 'memory',   lit: 0 },
      { from: 'orch',    to: 'llm',      lit: 0 },
      { from: 'llm',     to: 'response', lit: 0 },
      { from: 'llm',     to: 'actions',  lit: 0 },
      { from: 'actions', to: 'integ',    lit: 0 },
    ]
    const eMap = Object.fromEntries(EDGES.map(e => [`${e.from}→${e.to}`, e]))

    const SEQ = [
      [  400, 'activate', 'trigger'],
      [  900, 'pulse',    'trigger→orch'],
      [ 2600, 'activate', 'orch'],
      [ 3100, 'pulse',    'orch→data'],
      [ 3100, 'pulse',    'orch→memory'],
      [ 3100, 'pulse',    'orch→llm'],
      [ 4700, 'activate', 'data'],
      [ 4700, 'activate', 'memory'],
      [ 4800, 'activate', 'llm'],
      [ 5200, 'pulse',    'llm→response'],
      [ 5200, 'pulse',    'llm→actions'],
      [ 6800, 'activate', 'response'],
      [ 6900, 'activate', 'actions'],
      [ 7200, 'pulse',    'actions→integ'],
      [ 8500, 'activate', 'integ'],
      [ 9100, 'complete', null],
      [10300, 'fadeOut',  null],
      [12000, 'reset',    null],
    ]

    let pulses = [], seqIdx = 0, animStart = null, lastTs = 0, rafId = null
    let fadeAlpha = 1, fadeOutStart = null, currentTs = 0, isIntersecting = false

    function resetState() {
      NODES.forEach(n => { n.state = 'dormant'; n.glow = 0 })
      EDGES.forEach(e => { e.lit = 0 })
      pulses = []; seqIdx = 0; animStart = null
      fadeAlpha = 1; fadeOutStart = null
    }

    const ncx = n => n.rx * W
    const ncy = n => n.ry * H
    const srcX = n => ncx(n) + NS / 2
    const tgtX = n => ncx(n) - NS / 2

    function cubicPt(t, x0, y0, x3, y3) {
      const off = Math.max(Math.abs(x3 - x0) * 0.44, NS * 0.9)
      const x1 = x0 + off, x2 = x3 - off
      const m = 1 - t
      return {
        x: m*m*m*x0 + 3*m*m*t*x1 + 3*m*t*t*x2 + t*t*t*x3,
        y: m*m*m*y0 + 3*m*m*t*y0 + 3*m*t*t*y3 + t*t*t*y3,
      }
    }

    function eio(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t }

    function ca(hex, a) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
      return `rgba(${r},${g},${b},${a})`
    }

    function rrect(x, y, w, h, r) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.arcTo(x + w, y,     x + w, y + r,     r)
      ctx.lineTo(x + w, y + h - r)
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
      ctx.lineTo(x + r, y + h)
      ctx.arcTo(x,     y + h, x,     y + h - r, r)
      ctx.lineTo(x, y + r)
      ctx.arcTo(x,     y,     x + r, y,          r)
      ctx.closePath()
    }

    function rebuildBgCache() {
      const oc = document.createElement('canvas')
      oc.width  = Math.round(W * DPR)
      oc.height = Math.round(H * DPR)
      const oc2 = oc.getContext('2d')
      oc2.scale(DPR, DPR)
      oc2.fillStyle = 'rgba(255,255,255,0.028)'
      const s = 28
      for (let x = s; x < W; x += s)
        for (let y = s; y < H; y += s) {
          oc2.beginPath(); oc2.arc(x, y, 0.75, 0, Math.PI * 2); oc2.fill()
        }
      bgCache = oc
    }

    function drawBgDots() {
      if (!bgCache) rebuildBgCache()
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(bgCache, 0, 0)
      ctx.restore()
    }

    function drawEdges() {
      EDGES.forEach(e => {
        const f = nMap[e.from], t = nMap[e.to]
        const sx = srcX(f), sy = ncy(f), tx = tgtX(t), ty = ncy(t)
        const off = Math.max(Math.abs(tx - sx) * 0.44, NS * 0.9)
        const x1 = sx + off, x2 = tx - off

        if (e.lit > 0.04) {
          ctx.save()
          ctx.shadowBlur = 9; ctx.shadowColor = ca(f.color, 0.7)
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.bezierCurveTo(x1, sy, x2, ty, tx, ty)
          ctx.strokeStyle = ca(f.color, e.lit * 0.5)
          ctx.lineWidth = 2; ctx.stroke()
          ctx.restore()
        }

        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.bezierCurveTo(x1, sy, x2, ty, tx, ty)
        ctx.strokeStyle = e.lit > 0.04 ? ca(f.color, e.lit * 0.28 + 0.07) : 'rgba(255,255,255,0.07)'
        ctx.lineWidth = 1.5; ctx.stroke()

        const aw = 5, ah = 3.5
        const ac = e.lit > 0.04 ? f.color : '#FFFFFF'
        const aa = e.lit > 0.04 ? 0.45 + 0.45 * e.lit : 0.18
        ctx.beginPath()
        ctx.moveTo(tx + 1, ty)
        ctx.lineTo(tx - aw, ty - ah)
        ctx.lineTo(tx - aw, ty + ah)
        ctx.closePath()
        ctx.fillStyle = ca(ac, aa); ctx.fill()
      })
    }

    function drawNode(n) {
      const cx = ncx(n), cy = ncy(n)
      const x = cx - NS / 2, y = cy - NS / 2
      const cr = Math.round(NS * 0.2)
      const g = n.glow
      const pulse = (n.state === 'active' || n.state === 'complete')
        ? 0.5 + 0.5 * Math.sin(currentTs * 0.0018 + n.rx * 7)
        : 0
      const nc = n.state === 'complete' ? '#34D399' : n.color

      if (g > 0.04) {
        const bloomR = NS * (1.35 + 0.12 * pulse * g)
        const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR)
        bloom.addColorStop(0,   ca(nc, (0.18 + 0.07 * pulse) * g))
        bloom.addColorStop(0.6, ca(nc, 0.07 * g))
        bloom.addColorStop(1,   ca(nc, 0))
        ctx.beginPath(); ctx.arc(cx, cy, bloomR, 0, Math.PI * 2)
        ctx.fillStyle = bloom; ctx.fill()
      }

      rrect(x, y, NS, NS, cr)
      ctx.fillStyle = g > 0.1 ? `rgba(16,18,28,${0.97 - 0.04 * g})` : 'rgba(13,14,20,0.97)'
      ctx.fill()

      const stripH = Math.round(NS * 0.28)
      ctx.save()
      rrect(x, y, NS, NS, cr)
      ctx.clip()
      const sg = ctx.createLinearGradient(x, y, x, y + stripH * 1.8)
      sg.addColorStop(0,   ca(nc, 0.30 + 0.30 * g))
      sg.addColorStop(0.6, ca(nc, 0.10 + 0.10 * g))
      sg.addColorStop(1,   ca(nc, 0))
      ctx.fillStyle = sg
      ctx.fillRect(x, y, NS, stripH * 1.8)
      ctx.restore()

      rrect(x, y, NS, NS, cr)
      const borderA = g > 0.08 ? 0.45 + 0.5 * g * (0.85 + 0.15 * pulse) : 0.09
      ctx.strokeStyle = g > 0.08 ? ca(nc, borderA) : 'rgba(255,255,255,0.09)'
      ctx.lineWidth = g > 0.08 ? 1.5 : 1
      if (g > 0.2) { ctx.shadowBlur = (12 + 8 * pulse) * g; ctx.shadowColor = ca(nc, 0.85) }
      ctx.stroke()
      ctx.shadowBlur = 0

      const fsize = Math.max(Math.round(NS * 0.28), 9)
      ctx.font = `700 ${fsize}px 'Geist','Geist Mono',ui-monospace,monospace`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = g > 0.08 ? ca(nc, 0.78 + 0.22 * g) : 'rgba(200,215,235,0.35)'
      if (g > 0.2) { ctx.shadowBlur = 10; ctx.shadowColor = ca(nc, 0.85) }
      ctx.fillText(n.abbr, cx, cy)
      ctx.shadowBlur = 0

      if (NS >= 44) {
        const lsize = Math.max(Math.round(Math.min(NS * 0.185, 12)), 9)
        ctx.font = `500 ${lsize}px 'Geist',system-ui,sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'top'
        const labelY = cy + NS / 2 + 6
        const labelAlpha = 0.35 + 0.55 * g
        const tw = ctx.measureText(n.label).width
        const pw = tw + 12, ph = lsize + 6, px = cx - pw / 2, py = labelY - 2
        ctx.fillStyle = `rgba(10,10,12,${0.55 * g})`
        if (ctx.roundRect) {
          ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 3); ctx.fill()
        } else {
          ctx.fillRect(px, py, pw, ph)
        }
        ctx.fillStyle = `rgba(200,215,235,${labelAlpha})`
        ctx.fillText(n.label, cx, labelY)
      }

      ctx.beginPath(); ctx.arc(cx + NS / 2, cy, 3.5, 0, Math.PI * 2)
      if (g > 0.08) { ctx.shadowBlur = 8; ctx.shadowColor = ca(nc, 0.9) }
      ctx.fillStyle = g > 0.08 ? ca(nc, 0.85) : 'rgba(255,255,255,0.18)'
      ctx.fill(); ctx.shadowBlur = 0

      if (n.id !== 'trigger') {
        ctx.beginPath(); ctx.arc(cx - NS / 2, cy, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = g > 0.08 ? ca(nc, 0.5) : 'rgba(255,255,255,0.12)'
        ctx.fill()
      }
    }

    function drawPulses() {
      pulses.forEach(p => {
        const f = nMap[p.from], t = nMap[p.to]
        const sx = srcX(f), sy = ncy(f), tx2 = tgtX(t), ty = ncy(t)
        const pt = cubicPt(p.t, sx, sy, tx2, ty)
        const nc = f.color

        ctx.beginPath(); ctx.arc(pt.x, pt.y, 11, 0, Math.PI * 2)
        ctx.fillStyle = ca(nc, 0.06); ctx.fill()
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = ca(nc, 0.16); ctx.fill()

        ctx.shadowBlur = 20; ctx.shadowColor = nc
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'; ctx.fill()
        ctx.shadowBlur = 0

        ctx.beginPath(); ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2)
        ctx.strokeStyle = ca(nc, 0.65); ctx.lineWidth = 1.5; ctx.stroke()
      })
    }

    function processSeq(elapsed) {
      while (seqIdx < SEQ.length && elapsed >= SEQ[seqIdx][0]) {
        const [, action, target] = SEQ[seqIdx++]
        if      (action === 'activate') nMap[target].state = 'active'
        else if (action === 'pulse') {
          const [from, to] = target.split('→')
          pulses.push({ from, to, t: 0, start: elapsed, dur: 1650 })
        }
        else if (action === 'complete') NODES.forEach(n => n.state = 'complete')
        else if (action === 'fadeOut')  fadeOutStart = elapsed
        else if (action === 'reset') { resetState(); break }
      }
    }

    function updateGlows(dt) {
      NODES.forEach(n => {
        const target = (n.state === 'active' || n.state === 'complete') ? 1 : 0
        n.glow += (target - n.glow) * Math.min(1, 4.5 * dt / 1000)
      })
    }

    function updatePulses(elapsed) {
      pulses = pulses.filter(p => {
        p.t = eio(Math.min((elapsed - p.start) / p.dur, 1))
        const e = eMap[`${p.from}→${p.to}`]
        if (e) e.lit = Math.max(e.lit, p.t)
        return p.t < 1
      })
    }

    function frame(ts) {
      if (document.hidden) { rafId = null; return }
      currentTs = ts
      if (!animStart) animStart = ts
      const elapsed = ts - animStart
      const dt = Math.min(ts - lastTs, 50)
      lastTs = ts

      if (fadeOutStart !== null) {
        const p = Math.min((elapsed - fadeOutStart) / 1700, 1)
        fadeAlpha = 1 - p * p
      }

      ctx.globalAlpha = 1
      ctx.fillStyle = '#0A0A0C'
      ctx.fillRect(0, 0, W, H)

      ctx.globalAlpha = fadeAlpha
      drawBgDots()
      drawEdges()
      NODES.forEach(drawNode)
      drawPulses()
      ctx.globalAlpha = 1

      updateGlows(dt)
      updatePulses(elapsed)
      processSeq(elapsed)

      rafId = requestAnimationFrame(frame)
    }

    function setSize() {
      bgCache = null
      const mobile = window.innerWidth < 600
      W  = Math.min(canvas.parentElement.offsetWidth, 1200)
      H  = Math.round(W * (mobile ? 0.60 : 0.44))
      NS = Math.max(Math.round(Math.min(W * 0.065, 72)), mobile ? 36 : 44)
      canvas.width  = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function drawStatic() {
      setSize()
      NODES.forEach(n => { n.state = 'complete'; n.glow = 1 })
      EDGES.forEach(e => { e.lit = 1 })
      ctx.fillStyle = '#0A0A0C'
      ctx.fillRect(0, 0, W, H)
      drawBgDots(); drawEdges(); NODES.forEach(drawNode)
    }

    let resizeTimer
    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => { setSize(); if (reduced) drawStatic() }, 120)
    }
    window.addEventListener('resize', handleResize)

    setSize()

    if (reduced) {
      drawStatic()
    } else {
      const section = canvas.closest('#workflow-demo')
      if (section && 'IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
          isIntersecting = entries[0].isIntersecting
          if (isIntersecting) {
            if (!rafId) { resetState(); rafId = requestAnimationFrame(frame) }
          } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null }
          }
        }, { threshold: 0.15 }).observe(section)
      } else {
        isIntersecting = true
        rafId = requestAnimationFrame(frame)
      }
      const handleVisibility = () => {
        if (!document.hidden && isIntersecting && !rafId) {
          rafId = requestAnimationFrame(frame)
        }
      }
      document.addEventListener('visibilitychange', handleVisibility)

      return () => {
        if (rafId) cancelAnimationFrame(rafId)
        window.removeEventListener('resize', handleResize)
        document.removeEventListener('visibilitychange', handleVisibility)
      }
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section id="workflow-demo">
      <div className="wrap">
        <FadeIn><span className="eyebrow"><span className="dot" /> See it in action</span></FadeIn>
        <FadeIn delay={0.05}><h2 className="section-title">An AI agent,<br />doing its job.</h2></FadeIn>
        <FadeIn delay={0.1}><p className="section-sub">From trigger to integration — a real workflow, running autonomously. No humans in the loop.</p></FadeIn>
      </div>
      <div className="canvas-outer">
        <div
          role="img"
          aria-label="Animated diagram of an AI agent workflow: a trigger event flows into an orchestrator, which branches out to data ingestion, memory, and an LLM router. The LLM router connects to response and action nodes, with actions feeding into integrations."
        >
          <canvas id="agentCanvas" ref={canvasRef} />
        </div>
      </div>
    </section>
  )
}
