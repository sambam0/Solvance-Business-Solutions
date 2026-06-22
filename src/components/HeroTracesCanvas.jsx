import { useEffect, useRef } from 'react'

/**
 * HeroTracesCanvas — streaming data-trace lines behind the hero section.
 *
 * Visual: 15-25 short light traces (40-120 px) with a bright head and
 * gradient-fading tail, moving at varied speeds across the viewport.
 * Mostly left-to-right (data forward), a handful right-to-left (return
 * signals). Every ~3-5 s one trace pulses brighter.
 *
 * A faint dot-grid sits underneath for spatial reference.
 */
export default function HeroTracesCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DPR = window.devicePixelRatio || 1

    let W = 0
    let H = 0
    let rafId = null
    let bgCache = null
    let isIntersecting = false

    /* ── Color helpers ── */
    const BLUE   = [59, 158, 255]   // #3B9EFF
    const VIOLET = [157, 111, 255]  // #9D6FFF
    const WHITE  = [240, 240, 245]  // #F0F0F5

    function rgba(rgb, a) {
      return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`
    }

    /* ── Trace factory ── */
    const TRACE_COUNT = 40

    function pickColor() {
      const r = Math.random()
      if (r < 0.60) return BLUE
      if (r < 0.90) return WHITE
      return VIOLET
    }

    function degToRad(deg) { return (deg * Math.PI) / 180 }

    function createTrace(seedX) {
      // Direction: 80 % left-to-right, 20 % right-to-left
      const ltr = Math.random() < 0.80
      const angleDeg = (Math.random() < 0.65)
        ? (Math.random() * 6 - 3)                     // mostly horizontal (±3°)
        : (15 + Math.random() * 15) * (Math.random() < 0.5 ? 1 : -1) // diagonal ±15-30°
      const angle = degToRad(ltr ? angleDeg : 180 + angleDeg)

      const speed = 0.8 + Math.random() * 2.8   // 0.8–3.6 px / frame
      const length = 40 + Math.random() * 80     // 40-120 px
      const baseOpacity = 0.15 + Math.random() * 0.20  // 0.15–0.35

      // Start position
      const x = seedX !== undefined ? seedX : randomStartX(ltr)
      const y = Math.random() * H

      return {
        x, y,
        angle,
        speed,
        length,
        color: pickColor(),
        baseOpacity,
        ltr,
        // pulse state
        pulseT: 0,        // 0 = not pulsing, 0→1 during pulse
        pulsing: false,
      }
    }

    function randomStartX(ltr) {
      // Place off the entering edge
      return ltr ? -60 - Math.random() * 200 : W + 60 + Math.random() * 200
    }

    let traces = []

    function initTraces() {
      traces = []
      for (let i = 0; i < TRACE_COUNT; i++) {
        // Scatter across canvas initially
        traces.push(createTrace(Math.random() * (W + 200) - 100))
      }
    }

    /* ── Pulse scheduling ── */
    let nextPulseTime = 3000 + Math.random() * 2000 // first pulse in 3-5 s
    let elapsed = 0

    /* ── Background dot grid (cached) ── */
    function rebuildBgCache() {
      const oc = document.createElement('canvas')
      oc.width = Math.round(W * DPR)
      oc.height = Math.round(H * DPR)
      const oc2 = oc.getContext('2d')
      oc2.scale(DPR, DPR)
      oc2.fillStyle = 'rgba(255,255,255,0.02)'
      const spacing = 32
      for (let x = spacing; x < W; x += spacing) {
        for (let y = spacing; y < H; y += spacing) {
          oc2.beginPath()
          oc2.arc(x, y, 0.6, 0, Math.PI * 2)
          oc2.fill()
        }
      }
      bgCache = oc
    }

    /* ── Draw a single trace ── */
    function drawTrace(t) {
      const dx = Math.cos(t.angle)
      const dy = Math.sin(t.angle)

      // Pulse intensity: makes head brighter + trail longer
      const pulseBoost = t.pulseT
      const headOpacity = t.baseOpacity + pulseBoost * (0.50 - t.baseOpacity)
      const trailLen = t.length * (1 + pulseBoost * 0.8)

      // Head position
      const hx = t.x
      const hy = t.y
      // Tail position (behind the head)
      const tx = hx - dx * trailLen
      const ty = hy - dy * trailLen

      // Gradient along the trace: bright head → transparent tail
      const grad = ctx.createLinearGradient(tx, ty, hx, hy)
      grad.addColorStop(0, rgba(t.color, 0))
      grad.addColorStop(0.5, rgba(t.color, headOpacity * 0.25))
      grad.addColorStop(0.85, rgba(t.color, headOpacity * 0.7))
      grad.addColorStop(1, rgba(t.color, headOpacity))

      ctx.beginPath()
      ctx.moveTo(tx, ty)
      ctx.lineTo(hx, hy)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.2 + pulseBoost * 0.8
      ctx.lineCap = 'round'
      ctx.stroke()

      // Bright head dot with subtle glow
      if (headOpacity > 0.12) {
        ctx.save()
        ctx.shadowBlur = 6 + pulseBoost * 10
        ctx.shadowColor = rgba(t.color, headOpacity * 0.8)
        ctx.beginPath()
        ctx.arc(hx, hy, 1.0 + pulseBoost * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = rgba(t.color, headOpacity * 1.1)
        ctx.fill()
        ctx.restore()
      }
    }

    /* ── Sizing ── */
    function setSize() {
      bgCache = null
      const parent = canvas.parentElement || canvas.closest('section')
      W = parent ? parent.offsetWidth : window.innerWidth
      H = parent ? parent.offsetHeight : window.innerHeight
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    /* ── Animation loop ── */
    let lastTs = 0

    function frame(ts) {
      if (document.hidden) { rafId = null; return }

      const dt = lastTs ? Math.min(ts - lastTs, 50) : 16
      lastTs = ts
      elapsed += dt

      // Clear
      ctx.clearRect(0, 0, W, H)

      // Dot grid
      if (!bgCache) rebuildBgCache()
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(bgCache, 0, 0)
      ctx.restore()

      // Pulse trigger
      if (elapsed >= nextPulseTime) {
        // Pick a random non-pulsing trace
        const candidates = traces.filter(t => !t.pulsing)
        if (candidates.length > 0) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)]
          pick.pulsing = true
          pick.pulseT = 0
        }
        nextPulseTime = elapsed + 3000 + Math.random() * 2000
      }

      // Update + draw traces
      const margin = 200
      for (let i = 0; i < traces.length; i++) {
        const t = traces[i]

        // Move
        t.x += Math.cos(t.angle) * t.speed
        t.y += Math.sin(t.angle) * t.speed

        // Pulse envelope: quick brighten (0.3 s), slow fade (0.8 s)
        if (t.pulsing) {
          const pulseDur = 1100 // ms
          t.pulseT += dt / pulseDur
          if (t.pulseT >= 1) {
            t.pulseT = 0
            t.pulsing = false
          } else {
            // Triangle envelope: peak at 0.27
            t.pulseT = Math.min(t.pulseT, 1)
            const raw = t.pulseT < 0.27
              ? t.pulseT / 0.27
              : 1 - (t.pulseT - 0.27) / 0.73
            // Store the display value separately so pulseT still tracks progress
            t._pulseDisplay = Math.max(0, raw)
          }
        }
        // Use display value for rendering
        const savedPulseT = t.pulseT
        t.pulseT = t.pulsing ? (t._pulseDisplay || 0) : 0

        drawTrace(t)

        t.pulseT = savedPulseT

        // Out-of-bounds check: respawn from opposite edge
        const outLeft = t.x < -margin && t.ltr === false
        const outRight = t.x > W + margin && t.ltr === true
        const outTop = t.y < -margin
        const outBottom = t.y > H + margin
        // Also check if non-LTR went off the left, or LTR went off the right
        const outLTR = t.ltr && (t.x > W + margin)
        const outRTL = !t.ltr && (t.x < -margin)

        if (outLTR || outRTL || outTop || outBottom) {
          // Recycle: new trace from entry edge
          const replacement = createTrace(undefined)
          replacement.y = Math.random() * H
          traces[i] = replacement
        }
      }

      rafId = requestAnimationFrame(frame)
    }

    /* ── Static snapshot for reduced motion ── */
    function drawStatic() {
      setSize()
      initTraces()
      // Place traces at varied positions across the canvas
      for (const t of traces) {
        t.x = Math.random() * W * 0.9 + W * 0.05
        t.y = Math.random() * H
      }
      ctx.clearRect(0, 0, W, H)
      if (!bgCache) rebuildBgCache()
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(bgCache, 0, 0)
      ctx.restore()
      for (const t of traces) {
        t.pulseT = 0
        drawTrace(t)
      }
    }

    /* ── Resize handling ── */
    let resizeTimer
    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setSize()
        if (reduced) {
          drawStatic()
        } else {
          initTraces()
        }
      }, 120)
    }
    window.addEventListener('resize', handleResize)

    /* ── Init ── */
    setSize()

    if (reduced) {
      drawStatic()
      return () => {
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', handleResize)
      }
    }

    // Animated path with IntersectionObserver + visibilitychange gating
    initTraces()

    let observer = null
    const section = canvas.closest('section')
    if (section && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          isIntersecting = entries[0].isIntersecting
          if (isIntersecting) {
            if (!rafId) { rafId = requestAnimationFrame(frame) }
          } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null }
          }
        },
        { threshold: 0.05 },
      )
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
