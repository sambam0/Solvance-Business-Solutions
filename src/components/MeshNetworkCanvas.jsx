import { useEffect, useRef } from 'react'

export default function MeshNetworkCanvas({ highlightNodes = [] }) {
  const canvasRef = useRef(null)
  const nodesRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DPR = window.devicePixelRatio || 1
    let W = 0, H = 0, NS = 0
    let bgCache = null

    const NODES = [
      {
        id: 'hub', label: 'Mesh Controller', sub: 'Tailscale VPN Hub', abbr: 'VPN',
        agents: ['Secure Tunnel', 'Smart Routing'],
        rx: 0.50, ry: 0.14, color: '#3B82F6', glow: 0, state: 'dormant', boostGlow: 0,
      },
      {
        id: 'cloud', label: 'Cloud Node', sub: 'Always-on VPS', abbr: 'VPS',
        agents: ['Intake Agent', 'Operations Agent'],
        rx: 0.15, ry: 0.74, color: '#8B5CF6', glow: 0, state: 'dormant', boostGlow: 0,
      },
      {
        id: 'local', label: 'Private Node', sub: 'Local Mac Mini', abbr: 'MAC',
        agents: ['Main Agent', 'Librarian', 'Matching (Hermes)'],
        rx: 0.85, ry: 0.74, color: '#22C55E', glow: 0, state: 'dormant', boostGlow: 0,
      },
    ]
    const nMap = Object.fromEntries(NODES.map(n => [n.id, n]))
    nodesRef.current = NODES

    // 6 directional edges — 3 bidirectional pairs
    const EDGES = [
      { from: 'hub',   to: 'cloud', lit: 0 },
      { from: 'cloud', to: 'hub',   lit: 0 },
      { from: 'hub',   to: 'local', lit: 0 },
      { from: 'local', to: 'hub',   lit: 0 },
      { from: 'cloud', to: 'local', lit: 0 },
      { from: 'local', to: 'cloud', lit: 0 },
    ]
    const eMap = Object.fromEntries(EDGES.map(e => [`${e.from}→${e.to}`, e]))

    const SEQ = [
      [400,  'activate', 'hub'],
      [1200, 'pulse',    'hub→cloud'],
      [1400, 'pulse',    'hub→local'],
      [2500, 'activate', 'cloud'],
      [3300, 'activate', 'local'],
      [3700, 'pulse',    'cloud→hub'],
      [3900, 'pulse',    'local→hub'],
      [4200, 'pulse',    'cloud→local'],
      [4400, 'pulse',    'local→cloud'],
      [5200, 'complete', null],
      [5500, 'pulse',    'hub→cloud'],
      [5700, 'pulse',    'hub→local'],
      [5900, 'pulse',    'cloud→local'],
      [6100, 'pulse',    'local→hub'],
      [6300, 'pulse',    'local→cloud'],
      [6500, 'pulse',    'cloud→hub'],
      [9200, 'fadeOut',  null],
      [10800,'reset',    null],
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

    function ca(hex, a) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r},${g},${b},${a})`
    }

    function eio(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

    function cubicPtFull(t, x0, y0, x1, y1, x2, y2, x3, y3) {
      const m = 1 - t
      return {
        x: m*m*m*x0 + 3*m*m*t*x1 + 3*m*t*t*x2 + t*t*t*x3,
        y: m*m*m*y0 + 3*m*m*t*y1 + 3*m*t*t*y2 + t*t*t*y3,
      }
    }

    // Returns start, end, and control points for an edge between two circular nodes.
    // Edges attach at the circle perimeters. Bidirectional pairs bow opposite directions
    // via alphabetical string comparison — ensuring both directions are always visible.
    function edgeCtrlPts(f, t) {
      const r = NS / 2
      const fcx = ncx(f), fcy = ncy(f)
      const tcx = ncx(t), tcy = ncy(t)
      const dx = tcx - fcx, dy = tcy - fcy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const ux = dx / dist, uy = dy / dist

      const sx = fcx + ux * r
      const sy = fcy + uy * r
      const ex = tcx - ux * r
      const ey = tcy - uy * r

      const edx = ex - sx, edy = ey - sy
      const edist = Math.sqrt(edx * edx + edy * edy) || 1
      const bow = edist * 0.24
      // Perpendicular direction: (-edy, edx) rotated. Alphabetical ID comparison
      // gives a stable, consistent bow side for each edge pair.
      const bowDir = f.id < t.id ? 1 : -1
      const px = (-edy / edist) * bow * bowDir
      const py = (edx / edist) * bow * bowDir

      return {
        sx, sy, ex, ey,
        cx1: sx + edx * 0.33 + px,
        cy1: sy + edy * 0.33 + py,
        cx2: sx + edx * 0.67 + px,
        cy2: sy + edy * 0.67 + py,
      }
    }

    function rebuildBgCache() {
      const oc = document.createElement('canvas')
      oc.width = Math.round(W * DPR)
      oc.height = Math.round(H * DPR)
      const oc2 = oc.getContext('2d')
      oc2.scale(DPR, DPR)
      oc2.fillStyle = 'rgba(255,255,255,0.024)'
      const s = 28
      for (let x = s; x < W; x += s)
        for (let y = s; y < H; y += s) {
          oc2.beginPath(); oc2.arc(x, y, 0.7, 0, Math.PI * 2); oc2.fill()
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
        const { sx, sy, ex, ey, cx1, cy1, cx2, cy2 } = edgeCtrlPts(f, t)

        if (e.lit > 0.04) {
          ctx.save()
          ctx.shadowBlur = 10
          ctx.shadowColor = ca(f.color, 0.75)
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.lineTo(ex, ey)
          ctx.strokeStyle = ca(f.color, e.lit * 0.5)
          ctx.lineWidth = 2.5
          ctx.stroke()
          ctx.restore()
        }

        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = e.lit > 0.04 ? ca(f.color, e.lit * 0.28 + 0.07) : 'rgba(255,255,255,0.07)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Arrowhead tangent along straight edge
        const tanX = ex - sx, tanY = ey - sy
        const aw = 5, ah = 3.2
        const ac = e.lit > 0.04 ? f.color : '#FFFFFF'
        const aa = e.lit > 0.04 ? 0.42 + 0.48 * e.lit : 0.14
        ctx.save()
        ctx.translate(ex, ey)
        ctx.rotate(Math.atan2(tanY, tanX))
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-aw, -ah)
        ctx.lineTo(-aw, ah)
        ctx.closePath()
        ctx.fillStyle = ca(ac, aa)
        ctx.fill()
        ctx.restore()
      })
    }

    function drawNode(n) {
      const cx = ncx(n), cy = ncy(n)
      const r = NS / 2
      const g = n.glow
      const pulse = (n.state === 'active' || n.state === 'complete')
        ? 0.5 + 0.5 * Math.sin(currentTs * 0.0018 + n.rx * 7)
        : 0
      // Keep each node's semantic color — do NOT override to green on complete
      const nc = n.color

      // 1. Radial bloom glow
      if (g > 0.04) {
        const bloomR = r * (2.8 + 0.4 * pulse * g)
        const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR)
        bloom.addColorStop(0, ca(nc, (0.22 + 0.08 * pulse) * g))
        bloom.addColorStop(0.5, ca(nc, 0.09 * g))
        bloom.addColorStop(1, ca(nc, 0))
        ctx.beginPath()
        ctx.arc(cx, cy, bloomR, 0, Math.PI * 2)
        ctx.fillStyle = bloom
        ctx.fill()
      }

      // 2. Pulsing outer ring
      if (g > 0.2) {
        const ringR = r + 8 + 5 * pulse * g
        ctx.beginPath()
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2)
        ctx.strokeStyle = ca(nc, 0.28 * g)
        ctx.lineWidth = 1.5
        ctx.shadowBlur = 12 * g
        ctx.shadowColor = ca(nc, 0.7)
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // 3. Dark circle fill
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = g > 0.1 ? `rgba(8,10,20,${0.96 - 0.04 * g})` : 'rgba(6,7,16,0.97)'
      ctx.fill()

      // 4. Color cap gradient (clipped to circle)
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.clip()
      const capGrad = ctx.createLinearGradient(cx, cy - r, cx, cy + r * 0.6)
      capGrad.addColorStop(0, ca(nc, 0.34 + 0.34 * g))
      capGrad.addColorStop(1, ca(nc, 0))
      ctx.fillStyle = capGrad
      ctx.fillRect(cx - r, cy - r, NS, NS)
      ctx.restore()

      // 5. Colored border with glow
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      const borderA = g > 0.08 ? 0.45 + 0.5 * g * (0.85 + 0.15 * pulse) : 0.10
      ctx.strokeStyle = g > 0.08 ? ca(nc, borderA) : 'rgba(255,255,255,0.10)'
      ctx.lineWidth = g > 0.08 ? 2 : 1
      if (g > 0.2) {
        ctx.shadowBlur = (14 + 9 * pulse) * g
        ctx.shadowColor = ca(nc, 0.9)
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // 6. Abbreviation text
      const fsize = Math.max(Math.round(r * 0.50), 10)
      ctx.font = `700 ${fsize}px 'Geist Mono','Geist',ui-monospace,monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = g > 0.08 ? ca(nc, 0.82 + 0.18 * g) : 'rgba(200,215,235,0.30)'
      if (g > 0.2) {
        ctx.shadowBlur = 12
        ctx.shadowColor = ca(nc, 0.9)
      }
      ctx.fillText(n.abbr, cx, cy - fsize * 0.08)
      ctx.shadowBlur = 0

      // 7. Labels below circle
      if (r >= 24) {
        const labelY = cy + r + 11
        const lsize = Math.max(Math.round(Math.min(r * 0.27, 13)), 9)
        const alpha = 0.30 + 0.60 * g

        ctx.font = `600 ${lsize}px 'Geist',system-ui,sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = `rgba(238,242,250,${alpha})`
        ctx.fillText(n.label, cx, labelY)

        const slsize = Math.max(lsize - 1, 8)
        ctx.font = `400 ${slsize}px 'Geist Mono',monospace`
        ctx.fillStyle = `rgba(120,132,160,${Math.max(alpha - 0.20, 0.10)})`
        ctx.fillText(n.sub, cx, labelY + lsize + 4)

        // Agent names fade in as node activates
        if (g > 0.38 && n.agents && n.agents.length > 0) {
          const asize = Math.max(slsize - 1, 7)
          const agentAlpha = (g - 0.38) / 0.62
          ctx.font = `400 ${asize}px 'Geist Mono',monospace`
          n.agents.forEach((agent, idx) => {
            ctx.fillStyle = ca(nc, agentAlpha * 0.52)
            ctx.fillText(agent, cx, labelY + lsize + 4 + slsize + 6 + idx * (asize + 3))
          })
        }
      }
    }

    function drawPulses() {
      pulses.forEach(p => {
        const f = nMap[p.from], t = nMap[p.to]
        const { sx, sy, ex, ey, cx1, cy1, cx2, cy2 } = edgeCtrlPts(f, t)
        const pt = cubicPtFull(p.t, sx, sy, cx1, cy1, cx2, cy2, ex, ey)
        const nc = f.color

        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 13, 0, Math.PI * 2)
        ctx.fillStyle = ca(nc, 0.05)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2)
        ctx.fillStyle = ca(nc, 0.14)
        ctx.fill()

        ctx.shadowBlur = 24
        ctx.shadowColor = nc
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2)
        ctx.strokeStyle = ca(nc, 0.68)
        ctx.lineWidth = 1.5
        ctx.stroke()
      })
    }

    function processSeq(elapsed) {
      while (seqIdx < SEQ.length && elapsed >= SEQ[seqIdx][0]) {
        const [, action, target] = SEQ[seqIdx++]
        if (action === 'activate') {
          nMap[target].state = 'active'
        } else if (action === 'pulse') {
          const [from, to] = target.split('→')
          pulses.push({ from, to, t: 0, start: elapsed, dur: 1800 })
        } else if (action === 'complete') {
          NODES.forEach(n => { n.state = 'complete' })
        } else if (action === 'fadeOut') {
          fadeOutStart = elapsed
        } else if (action === 'reset') {
          resetState(); break
        }
      }
    }

    function updateGlows(dt) {
      NODES.forEach(n => {
        const baseTarget = (n.state === 'active' || n.state === 'complete') ? 1 : 0
        // 0.55 floor: visible highlight without reaching fully-active (sequence still surges to 1.0)
        const target = Math.max(baseTarget, n.boostGlow * 0.55)
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
      ctx.fillStyle = '#050B18'
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
      W = Math.min(canvas.parentElement.offsetWidth, 1200)
      H = Math.round(W * (mobile ? 0.74 : 0.54))
      NS = Math.max(Math.round(Math.min(W * 0.092, 96)), mobile ? 54 : 66)
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function drawStatic() {
      setSize()
      NODES.forEach(n => { n.state = 'complete'; n.glow = 1 })
      EDGES.forEach(e => { e.lit = 1 })
      currentTs = 0
      ctx.fillStyle = '#050B18'
      ctx.fillRect(0, 0, W, H)
      drawBgDots()
      drawEdges()
      NODES.forEach(drawNode)
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
      return () => {
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', handleResize)
      }
    } else {
      let observer = null
      const section = canvas.closest('section')
      if (section && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => {
          isIntersecting = entries[0].isIntersecting
          if (isIntersecting) {
            if (!rafId) { resetState(); rafId = requestAnimationFrame(frame) }
          } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null }
          }
        }, { threshold: 0.15 })
        observer.observe(section)
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
        clearTimeout(resizeTimer)
        observer?.disconnect()
        window.removeEventListener('resize', handleResize)
        document.removeEventListener('visibilitychange', handleVisibility)
      }
    }
  }, [])

  // Sync prop → ref WITHOUT triggering canvas re-mount
  useEffect(() => {
    if (!nodesRef.current) return
    const boostSet = new Set(highlightNodes)
    nodesRef.current.forEach(n => { n.boostGlow = boostSet.has(n.id) ? 1 : 0 })
  }, [highlightNodes])

  return (
    <div className="canvas-outer mesh-canvas-outer">
      <div
        role="img"
        aria-label="Animated diagram: a Tailscale VPN hub at top connects to a cloud VPS on the lower-left and a local Mac Mini on the lower-right — an Open Claw mesh network with bidirectional encrypted data flows between all three nodes."
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
