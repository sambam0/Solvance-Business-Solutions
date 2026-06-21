import { useEffect, useRef } from 'react'

/*
 * HeroRainCanvas
 * ──────────────
 * A "data rain" canvas effect — vertical columns of falling monospace glyphs
 * rendered in Bay Signal Blue / Studio Violet at very low opacity. Sits behind
 * hero content as an absolutely-positioned, pointer-events-none layer.
 *
 * Performance: requestAnimationFrame, IntersectionObserver gating,
 * visibilitychange pause, devicePixelRatio-aware sizing.
 *
 * Accessibility: respects prefers-reduced-motion (single static frame).
 */

// Character pool: katakana subset, latin, digits, code symbols
const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789' +
  '{}[]<>/=;:.|&@#$%^*+-~'

const BLUE = [59, 158, 255]   // #3B9EFF — Bay Signal Blue
const VIOLET = [157, 111, 255] // #9D6FFF — Studio Violet

const FONT_SIZE = 14
const COL_SPACING = 22

export default function HeroRainCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DPR = window.devicePixelRatio || 1

    let W = 0
    let H = 0
    let columns = []
    let rafId = null
    let isIntersecting = false

    // ── Column factory ──
    function createColumn(x, colIndex) {
      const maxChars = Math.ceil(H / FONT_SIZE) + 4
      // Stagger initial positions: some columns start off-screen above
      const startY = -Math.random() * H * 1.4
      const speed = 0.3 + Math.random() * 0.7 // px per frame (~18-60fps-adjusted)
      // ~18% of columns are violet
      const isViolet = Math.random() < 0.18
      const rgb = isViolet ? VIOLET : BLUE
      // Pre-generate character sequence
      const chars = Array.from({ length: maxChars }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]
      )
      // Randomize character change interval (frames between swaps)
      const swapRate = 6 + Math.floor(Math.random() * 14)

      return {
        x,
        y: startY,
        speed,
        chars,
        rgb,
        maxChars,
        swapRate,
        frameCount: Math.floor(Math.random() * 20),
        trailLength: 8 + Math.floor(Math.random() * 16), // visible trail length
      }
    }

    // ── Resize / init ──
    function setSize() {
      const parent = canvas.parentElement
      W = parent.offsetWidth
      H = parent.offsetHeight
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

      // Rebuild column array
      const numCols = Math.floor(W / COL_SPACING)
      columns = []
      for (let i = 0; i < numCols; i++) {
        const x = i * COL_SPACING + (COL_SPACING / 2)
        columns.push(createColumn(x, i))
      }
    }

    // ── Draw a single static frame (for reduced motion) ──
    function drawStatic() {
      setSize()
      ctx.fillStyle = 'rgba(10, 10, 12, 1)'
      ctx.fillRect(0, 0, W, H)
      ctx.font = `400 ${FONT_SIZE}px 'Geist Mono', ui-monospace, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      for (const col of columns) {
        // Place the column at a random mid-screen position
        const baseY = Math.random() * H * 0.6
        const visibleChars = Math.min(col.trailLength, Math.floor((H - baseY) / FONT_SIZE))
        for (let j = 0; j < visibleChars; j++) {
          const cy = baseY + j * FONT_SIZE
          if (cy < -FONT_SIZE || cy > H) continue
          // Leading char is brightest, fade out down the trail
          const progress = j / visibleChars
          const alpha = j === 0
            ? 0.25 + Math.random() * 0.1
            : Math.max(0.03, 0.12 * (1 - progress))
          const [r, g, b] = col.rgb
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.fillText(col.chars[j % col.chars.length], col.x, cy)
        }
      }
    }

    // ── Animation loop ──
    let lastTime = 0

    function frame(ts) {
      if (document.hidden) { rafId = null; return }

      const dt = lastTime ? Math.min(ts - lastTime, 50) : 16
      lastTime = ts

      // Semi-transparent overlay for trail effect
      ctx.fillStyle = 'rgba(10, 10, 12, 0.07)'
      ctx.fillRect(0, 0, W, H)

      ctx.font = `400 ${FONT_SIZE}px 'Geist Mono', ui-monospace, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      const speedMult = dt / 16 // normalise to ~60fps

      for (const col of columns) {
        col.frameCount++

        // Advance position
        col.y += col.speed * FONT_SIZE * 0.12 * speedMult

        // Swap a random character in the trail periodically
        if (col.frameCount % col.swapRate === 0) {
          const swapIdx = Math.floor(Math.random() * col.chars.length)
          col.chars[swapIdx] = CHARS[Math.floor(Math.random() * CHARS.length)]
        }

        // Draw visible characters in this column
        const headRow = Math.floor(col.y / FONT_SIZE)
        for (let j = 0; j < col.trailLength; j++) {
          const row = headRow - j
          const cy = row * FONT_SIZE
          if (cy < -FONT_SIZE || cy > H) continue

          // Opacity: head is brightest, trail fades out
          let alpha
          if (j === 0) {
            // Leading character — bright pulse
            alpha = 0.28 + 0.12 * Math.sin(ts * 0.003 + col.x * 0.1)
          } else if (j === 1) {
            alpha = 0.16
          } else {
            // Exponential falloff through the trail
            const t = (j - 1) / (col.trailLength - 2)
            alpha = 0.11 * Math.pow(1 - t, 1.8)
            alpha = Math.max(alpha, 0.025)
          }

          // Further dim characters near bottom of canvas (vertical gradient)
          const verticalFade = 1 - (cy / H) * 0.35

          const [r, g, b] = col.rgb
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * verticalFade})`
          ctx.fillText(col.chars[Math.abs(row) % col.chars.length], col.x, cy)
        }

        // Reset column when head scrolls past bottom
        if ((headRow - col.trailLength) * FONT_SIZE > H) {
          col.y = -FONT_SIZE * (2 + Math.random() * 8)
          col.speed = 0.3 + Math.random() * 0.7
          col.trailLength = 8 + Math.floor(Math.random() * 16)
          // Small chance to flip color on reset
          if (Math.random() < 0.15) {
            col.rgb = col.rgb === VIOLET ? BLUE : (Math.random() < 0.22 ? VIOLET : BLUE)
          }
        }
      }

      rafId = requestAnimationFrame(frame)
    }

    // ── Resize handling ──
    let resizeTimer
    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setSize()
        if (reduced) drawStatic()
      }, 120)
    }
    window.addEventListener('resize', handleResize)

    // ── Bootstrap ──
    setSize()

    if (reduced) {
      drawStatic()
      return () => {
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', handleResize)
      }
    }

    // ── IntersectionObserver gating ──
    let observer = null
    const section = canvas.closest('section')
    if (section && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          isIntersecting = entries[0].isIntersecting
          if (isIntersecting) {
            if (!rafId) {
              lastTime = 0
              // Clear canvas fully before starting so old trails don't linger
              ctx.fillStyle = 'rgba(10, 10, 12, 1)'
              ctx.fillRect(0, 0, W, H)
              rafId = requestAnimationFrame(frame)
            }
          } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null }
          }
        },
        { threshold: 0.05 }
      )
      observer.observe(section)
    } else {
      isIntersecting = true
      rafId = requestAnimationFrame(frame)
    }

    // ── Visibility change ──
    const handleVisibility = () => {
      if (!document.hidden && isIntersecting && !rafId) {
        lastTime = 0
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
