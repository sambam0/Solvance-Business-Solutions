import { useEffect, useRef } from 'react'

/**
 * NeuralNetCanvas — knowledge-graph / synaptic-network background.
 * Renders behind the AI Training section: nodes connected by dim edges,
 * with bright pulses that fire along edges and cascade through the network.
 */
export default function NeuralNetCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DPR = window.devicePixelRatio || 1
    const isTouchDevice = window.matchMedia('(hover: none)').matches

    // --- Config ---
    const NODE_COUNT = 72
    const CONNECT_DIST = 140
    const MAX_CONN = 3
    const NODE_R_MIN = 1.8
    const NODE_R_MAX = 3.5
    const NODE_ALPHA = 0.20
    const EDGE_ALPHA = 0.07
    const EDGE_ALPHA_CURSOR = 0.18
    const CURSOR_RADIUS = 180
    const CURSOR_EDGE_DIST = 120
    const PULSE_INTERVAL_MIN = 800
    const PULSE_INTERVAL_MAX = 1800
    const PULSE_DUR_MIN = 420
    const PULSE_DUR_MAX = 760
    const PULSE_MAX_HOPS = 3
    const PULSE_TRAIL = 10
    const BLOOM_TOTAL_MS = 520

    const BLUE = [59, 158, 255]
    const VIOLET = [157, 111, 255]

    // Pre-allocated edge buffers — no per-frame allocation on hot path
    const MAX_EDGES = NODE_COUNT * MAX_CONN
    const edgeI = new Uint8Array(MAX_EDGES)
    const edgeJ = new Uint8Array(MAX_EDGES)
    const edgeD = new Float32Array(MAX_EDGES)
    const connCount = new Int8Array(NODE_COUNT)
    let edgeCount = 0

    let W = 0, H = 0
    let rafId = null
    let isIntersecting = false
    let mouseX = -9999, mouseY = -9999
    let lastTs = 0
    let nextPulseAt = 0

    // --- Nodes ---
    const nodes = []

    function createNode() {
      const isViolet = Math.random() < 0.1
      return {
        x: Math.random() * (W || 1),
        y: Math.random() * (H || 1),
        baseX: 0,
        baseY: 0,
        r: NODE_R_MIN + Math.random() * (NODE_R_MAX - NODE_R_MIN),
        color: isViolet ? VIOLET : BLUE,
        isViolet,
        // Breathing oscillation
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        freqX: 0.00028 + Math.random() * 0.00022,
        freqY: 0.00028 + Math.random() * 0.00022,
        ampX: 8 + Math.random() * 14,
        ampY: 8 + Math.random() * 14,
        // Bloom state (0 = none, 1 = peak)
        bloomT: 0,
      }
    }

    function initNodes() {
      nodes.length = 0
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = createNode()
        n.baseX = n.x
        n.baseY = n.y
        nodes.push(n)
      }
    }

    // --- Edges ---
    function computeEdges() {
      edgeCount = 0
      connCount.fill(0)
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (connCount[i] >= MAX_CONN || connCount[j] >= MAX_CONN) continue
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECT_DIST) {
            edgeI[edgeCount] = i
            edgeJ[edgeCount] = j
            edgeD[edgeCount] = d
            edgeCount++
            connCount[i]++
            connCount[j]++
          }
        }
      }
    }

    // --- Pulses ---
    const pulses = []

    function spawnPulse(fromIdx, hopsLeft, color) {
      const candidates = []
      for (let j = 0; j < NODE_COUNT; j++) {
        if (j === fromIdx) continue
        const dx = nodes[fromIdx].x - nodes[j].x
        const dy = nodes[fromIdx].y - nodes[j].y
        if (Math.sqrt(dx * dx + dy * dy) < CONNECT_DIST) candidates.push(j)
      }
      if (!candidates.length) return
      const toIdx = candidates[Math.floor(Math.random() * candidates.length)]
      const c = color || (Math.random() < 0.82 ? BLUE : VIOLET)
      pulses.push({
        fromIdx,
        toIdx,
        startTs: lastTs,
        duration: PULSE_DUR_MIN + Math.random() * (PULSE_DUR_MAX - PULSE_DUR_MIN),
        color: c,
        hopsLeft: hopsLeft ?? PULSE_MAX_HOPS,
        trail: [],
      })
    }

    function scheduleNextPulse() {
      nextPulseAt = lastTs + PULSE_INTERVAL_MIN + Math.random() * (PULSE_INTERVAL_MAX - PULSE_INTERVAL_MIN)
    }

    // --- Sizing ---
    function setSize() {
      const parent = canvas.parentElement
      W = parent.offsetWidth
      H = parent.offsetHeight
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function rgba(c, a) {
      return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`
    }

    // --- Draw ---
    function drawFrame(ts) {
      ctx.clearRect(0, 0, W, H)
      const dt = ts - lastTs
      lastTs = ts

      // Drift nodes (sinusoidal breathing)
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i]
        n.x = n.baseX + Math.sin(ts * n.freqX + n.phaseX) * n.ampX
        n.y = n.baseY + Math.cos(ts * n.freqY + n.phaseY) * n.ampY
      }

      computeEdges()

      const hasCursor = !isTouchDevice && mouseX > -999

      // Draw edges
      ctx.lineWidth = 0.6
      for (let e = 0; e < edgeCount; e++) {
        const ni = nodes[edgeI[e]]
        const nj = nodes[edgeJ[e]]
        const prox = 1 - edgeD[e] / CONNECT_DIST

        let alpha = EDGE_ALPHA * prox * 1.6

        if (hasCursor) {
          const mx = (ni.x + nj.x) * 0.5 - mouseX
          const my = (ni.y + nj.y) * 0.5 - mouseY
          const mDist = Math.sqrt(mx * mx + my * my)
          if (mDist < CURSOR_RADIUS) {
            alpha = Math.max(alpha, EDGE_ALPHA_CURSOR * (1 - mDist / CURSOR_RADIUS))
          }
        }

        // Bloom boost from adjacent nodes
        const bloomBoost = Math.max(ni.bloomT, nj.bloomT) * 0.14
        alpha = Math.min(0.38, alpha + bloomBoost)

        const color = ni.isViolet && nj.isViolet ? VIOLET : BLUE
        ctx.beginPath()
        ctx.moveTo(ni.x, ni.y)
        ctx.lineTo(nj.x, nj.y)
        ctx.strokeStyle = rgba(color, alpha)
        ctx.stroke()
      }

      // Cursor dashed edges (cursor as temporary node)
      if (hasCursor) {
        ctx.setLineDash([3, 6])
        ctx.lineWidth = 0.5
        const sorted = []
        for (let i = 0; i < NODE_COUNT; i++) {
          const d = Math.hypot(nodes[i].x - mouseX, nodes[i].y - mouseY)
          if (d < CURSOR_EDGE_DIST) sorted.push({ i, d })
        }
        sorted.sort((a, b) => a.d - b.d)
        for (let k = 0; k < Math.min(3, sorted.length); k++) {
          const { i, d } = sorted[k]
          const alpha = (1 - d / CURSOR_EDGE_DIST) * 0.13
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(mouseX, mouseY)
          ctx.strokeStyle = rgba(BLUE, alpha)
          ctx.stroke()
        }
        ctx.setLineDash([])
      }

      // Draw nodes
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i]
        let alpha = NODE_ALPHA
        let r = n.r

        if (hasCursor) {
          const d = Math.hypot(n.x - mouseX, n.y - mouseY)
          if (d < CURSOR_RADIUS) {
            const prox = 1 - d / CURSOR_RADIUS
            alpha += prox * 0.28
            r += prox * 1.2
          }
        }

        if (n.bloomT > 0) {
          const bScale = n.bloomT
          alpha = Math.min(0.92, alpha + bScale * 0.65)
          r = r + bScale * r * 1.2
          ctx.shadowBlur = 8 + bScale * 18
          ctx.shadowColor = rgba(n.color, 0.85)
        } else {
          ctx.shadowBlur = 4
          ctx.shadowColor = rgba(n.color, 0.25)
        }

        ctx.beginPath()
        ctx.arc(n.x, n.y, Math.max(0.5, r), 0, Math.PI * 2)
        ctx.fillStyle = rgba(n.color, alpha)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Update + draw pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p]
        const from = nodes[pulse.fromIdx]
        const to = nodes[pulse.toIdx]
        const progress = Math.min(1, (ts - pulse.startTs) / pulse.duration)

        const px = from.x + (to.x - from.x) * progress
        const py = from.y + (to.y - from.y) * progress

        pulse.trail.push({ x: px, y: py })
        if (pulse.trail.length > PULSE_TRAIL) pulse.trail.shift()

        // Trail (fading tail)
        for (let t = 0; t < pulse.trail.length; t++) {
          const tp = pulse.trail[t]
          const frac = t / pulse.trail.length
          const tAlpha = Math.pow(frac, 1.6) * 0.65
          const tR = 1.8 * frac
          if (tR < 0.2) continue
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, tR, 0, Math.PI * 2)
          ctx.fillStyle = rgba(pulse.color, tAlpha)
          ctx.fill()
        }

        // Head glow
        ctx.shadowBlur = 14
        ctx.shadowColor = rgba(pulse.color, 1)
        ctx.beginPath()
        ctx.arc(px, py, 2.8, 0, Math.PI * 2)
        ctx.fillStyle = rgba(pulse.color, 0.96)
        ctx.fill()
        ctx.shadowBlur = 0

        if (progress >= 1) {
          // Bloom destination and cascade
          to.bloomT = 1.0
          pulses.splice(p, 1)
          if (pulse.hopsLeft > 0) {
            spawnPulse(pulse.toIdx, pulse.hopsLeft - 1, pulse.color)
          }
        }
      }

      // Decay bloom
      const bloomDecay = dt / BLOOM_TOTAL_MS
      for (let i = 0; i < NODE_COUNT; i++) {
        if (nodes[i].bloomT > 0) {
          nodes[i].bloomT = Math.max(0, nodes[i].bloomT - bloomDecay)
        }
      }

      // Spawn new pulse cascade
      if (ts >= nextPulseAt && pulses.length < 5) {
        spawnPulse(Math.floor(Math.random() * NODE_COUNT), PULSE_MAX_HOPS)
        scheduleNextPulse()
      }
    }

    // --- Animation loop ---
    function frame(ts) {
      if (document.hidden) { rafId = null; return }
      drawFrame(ts)
      rafId = requestAnimationFrame(frame)
    }

    // --- Static snapshot for reduced motion ---
    function drawStatic() {
      setSize()
      ctx.clearRect(0, 0, W, H)
      computeEdges()
      ctx.lineWidth = 0.6
      for (let e = 0; e < edgeCount; e++) {
        const ni = nodes[edgeI[e]], nj = nodes[edgeJ[e]]
        const alpha = EDGE_ALPHA * (1 - edgeD[e] / CONNECT_DIST) * 1.6
        ctx.beginPath()
        ctx.moveTo(ni.x, ni.y)
        ctx.lineTo(nj.x, nj.y)
        ctx.strokeStyle = rgba(BLUE, alpha)
        ctx.stroke()
      }
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = rgba(n.color, NODE_ALPHA)
        ctx.fill()
      }
    }

    // --- Mouse tracking ---
    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    function handleMouseLeave() {
      mouseX = -9999
      mouseY = -9999
    }

    const section = canvas.closest('section')
    if (!isTouchDevice && section) {
      section.addEventListener('mousemove', handleMouseMove)
      section.addEventListener('mouseleave', handleMouseLeave)
    }

    // --- Resize ---
    let resizeTimer
    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const oldW = W, oldH = H
        setSize()
        if (oldW > 0 && oldH > 0) {
          for (const n of nodes) {
            n.baseX = (n.baseX / oldW) * W
            n.baseY = (n.baseY / oldH) * H
          }
        }
        if (reduced) drawStatic()
      }, 150)
    }
    window.addEventListener('resize', handleResize)

    // --- Init ---
    setSize()
    initNodes()
    scheduleNextPulse()

    if (reduced) {
      drawStatic()
      return () => {
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', handleResize)
        if (section) {
          section.removeEventListener('mousemove', handleMouseMove)
          section.removeEventListener('mouseleave', handleMouseLeave)
        }
      }
    }

    // IntersectionObserver gating
    let observer = null
    if (section && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        isIntersecting = entries[0].isIntersecting
        if (isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(frame)
        } else {
          if (rafId) { cancelAnimationFrame(rafId); rafId = null }
        }
      }, { threshold: 0.05 })
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
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove)
        section.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
