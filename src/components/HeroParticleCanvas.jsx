import { useEffect, useRef } from 'react'

/**
 * HeroParticleCanvas — constellation / neural-network particle field.
 * Renders behind hero content as an ambient, cursor-reactive star field.
 * CHIC version: subtle, dim, elegant. Not a screensaver.
 */
export default function HeroParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DPR = window.devicePixelRatio || 1
    const isTouchDevice = window.matchMedia('(hover: none)').matches

    // --- Config ---
    const PARTICLE_COUNT = 160
    const CONNECTION_DIST = 150
    const CURSOR_RADIUS = 200
    const BASE_SPEED_MIN = 0.1
    const BASE_SPEED_MAX = 0.3
    const PARTICLE_R_MIN = 1.2
    const PARTICLE_R_MAX = 2.8
    const BASE_PARTICLE_ALPHA = 0.22
    const BASE_LINE_ALPHA_MAX = 0.14
    const CURSOR_PARTICLE_ALPHA = 0.55
    const CURSOR_LINE_ALPHA = 0.20
    const VIOLET_CHANCE = 0.1

    // Signal colors
    const BLUE = { r: 59, g: 158, b: 255 }   // #3B9EFF
    const VIOLET = { r: 157, g: 111, b: 255 } // #9D6FFF
    const WHITE = { r: 255, g: 255, b: 255 }

    let W = 0, H = 0
    let rafId = null
    let isIntersecting = false
    let mouseX = -9999, mouseY = -9999

    // --- Spatial hash grid ---
    const CELL_SIZE = CONNECTION_DIST + 10
    let gridCols = 0, gridRows = 0
    /** @type {Int16Array} */
    let gridCells = null
    /** @type {Int16Array} */
    let gridNext = null

    function rebuildGrid() {
      gridCols = Math.ceil(W / CELL_SIZE) || 1
      gridRows = Math.ceil(H / CELL_SIZE) || 1
      gridCells = new Int16Array(gridCols * gridRows).fill(-1)
      gridNext = new Int16Array(PARTICLE_COUNT).fill(-1)
    }

    function clearGrid() {
      gridCells.fill(-1)
      gridNext.fill(-1)
    }

    function insertIntoGrid(i, x, y) {
      const col = Math.min(Math.floor(x / CELL_SIZE), gridCols - 1)
      const row = Math.min(Math.floor(y / CELL_SIZE), gridRows - 1)
      const cellIdx = row * gridCols + col
      gridNext[i] = gridCells[cellIdx]
      gridCells[cellIdx] = i
    }

    // --- Particles ---
    const particles = []

    function createParticle() {
      const angle = Math.random() * Math.PI * 2
      const speed = BASE_SPEED_MIN + Math.random() * (BASE_SPEED_MAX - BASE_SPEED_MIN)
      const isViolet = Math.random() < VIOLET_CHANCE
      return {
        x: Math.random() * (W || 1),
        y: Math.random() * (H || 1),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: PARTICLE_R_MIN + Math.random() * (PARTICLE_R_MAX - PARTICLE_R_MIN),
        color: isViolet ? VIOLET : WHITE,
        isViolet,
      }
    }

    function initParticles() {
      particles.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle())
      }
    }

    // --- Sizing ---
    function setSize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      rebuildGrid()
    }

    // --- Drawing ---
    function rgba(c, a) {
      return `rgba(${c.r},${c.g},${c.b},${a})`
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H)

      // Build spatial grid
      clearGrid()
      for (let i = 0; i < particles.length; i++) {
        insertIntoGrid(i, particles[i].x, particles[i].y)
      }

      const hasCursor = !isTouchDevice && mouseX > -999
      const dSq = CONNECTION_DIST * CONNECTION_DIST
      const cursorSq = CURSOR_RADIUS * CURSOR_RADIUS

      // Draw connections — iterate via spatial grid for O(n)
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const col = Math.min(Math.floor(p.x / CELL_SIZE), gridCols - 1)
        const row = Math.min(Math.floor(p.y / CELL_SIZE), gridRows - 1)

        // Check neighboring cells (3x3 block)
        for (let dr = -1; dr <= 1; dr++) {
          const nr = row + dr
          if (nr < 0 || nr >= gridRows) continue
          for (let dc = -1; dc <= 1; dc++) {
            const nc = col + dc
            if (nc < 0 || nc >= gridCols) continue
            let j = gridCells[nr * gridCols + nc]
            while (j !== -1) {
              if (j > i) {
                const q = particles[j]
                const dx = p.x - q.x
                const dy = p.y - q.y
                const distSq = dx * dx + dy * dy
                if (distSq < dSq) {
                  const dist = Math.sqrt(distSq)
                  const proximity = 1 - dist / CONNECTION_DIST

                  // Check if midpoint is near cursor
                  let lineAlpha = proximity * BASE_LINE_ALPHA_MAX
                  let lineColor = WHITE
                  if (hasCursor) {
                    const mx = (p.x + q.x) * 0.5 - mouseX
                    const my = (p.y + q.y) * 0.5 - mouseY
                    const mDistSq = mx * mx + my * my
                    if (mDistSq < cursorSq) {
                      const cursorProx = 1 - Math.sqrt(mDistSq) / CURSOR_RADIUS
                      lineAlpha = Math.max(lineAlpha, proximity * CURSOR_LINE_ALPHA * cursorProx)
                      lineColor = BLUE
                    }
                  }

                  ctx.beginPath()
                  ctx.moveTo(p.x, p.y)
                  ctx.lineTo(q.x, q.y)
                  ctx.strokeStyle = rgba(lineColor, lineAlpha)
                  ctx.stroke()
                }
              }
              j = gridNext[j]
            }
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        let alpha = BASE_PARTICLE_ALPHA
        let color = p.color

        if (hasCursor) {
          const dx = p.x - mouseX
          const dy = p.y - mouseY
          const distSq = dx * dx + dy * dy
          if (distSq < cursorSq) {
            const cursorProx = 1 - Math.sqrt(distSq) / CURSOR_RADIUS
            alpha = BASE_PARTICLE_ALPHA + (CURSOR_PARTICLE_ALPHA - BASE_PARTICLE_ALPHA) * cursorProx
            // Violet particles stay violet near cursor, white particles go blue
            if (!p.isViolet) color = BLUE
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = rgba(color, alpha)
        ctx.fill()
      }
    }

    function updateParticles() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -2) p.x += W + 4
        else if (p.x > W + 2) p.x -= W + 4
        if (p.y < -2) p.y += H + 4
        else if (p.y > H + 2) p.y -= H + 4
      }
    }

    // --- Animation loop ---
    function frame() {
      if (document.hidden) { rafId = null; return }
      updateParticles()
      drawFrame()
      rafId = requestAnimationFrame(frame)
    }

    // --- Static frame for reduced motion ---
    function drawStatic() {
      setSize()
      // Redistribute particles across current dimensions
      for (let i = 0; i < particles.length; i++) {
        particles[i].x = Math.random() * W
        particles[i].y = Math.random() * H
      }
      drawFrame()
    }

    // --- Mouse tracking ---
    // Canvas has pointer-events: none, so we listen on the hero section
    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    function handleMouseLeave() {
      mouseX = -9999
      mouseY = -9999
    }

    const heroSection = canvas.closest('section')
    if (!isTouchDevice && heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove)
      heroSection.addEventListener('mouseleave', handleMouseLeave)
    }

    // --- Resize ---
    let resizeTimer
    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const oldW = W, oldH = H
        setSize()
        // Rescale particle positions to new dimensions
        if (oldW > 0 && oldH > 0) {
          for (let i = 0; i < particles.length; i++) {
            particles[i].x = (particles[i].x / oldW) * W
            particles[i].y = (particles[i].y / oldH) * H
          }
        }
        if (reduced) drawStatic()
      }, 100)
    }
    window.addEventListener('resize', handleResize)

    // --- Init ---
    setSize()
    initParticles()

    if (reduced) {
      drawStatic()
    } else {
      // IntersectionObserver gating
      let observer = null
      if (heroSection && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => {
          isIntersecting = entries[0].isIntersecting
          if (isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(frame)
          } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null }
          }
        }, { threshold: 0.05 })
        observer.observe(heroSection)
      } else {
        isIntersecting = true
        rafId = requestAnimationFrame(frame)
      }

      // Visibility change handling
      const handleVisibility = () => {
        if (!document.hidden && isIntersecting && !rafId) {
          rafId = requestAnimationFrame(frame)
        }
      }
      document.addEventListener('visibilitychange', handleVisibility)

      // Cleanup
      return () => {
        if (rafId) cancelAnimationFrame(rafId)
        clearTimeout(resizeTimer)
        observer?.disconnect()
        window.removeEventListener('resize', handleResize)
        document.removeEventListener('visibilitychange', handleVisibility)
        if (heroSection) {
          heroSection.removeEventListener('mousemove', handleMouseMove)
          heroSection.removeEventListener('mouseleave', handleMouseLeave)
        }
      }
    }

    // Cleanup for reduced motion path
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      if (heroSection) {
        heroSection.removeEventListener('mousemove', handleMouseMove)
        heroSection.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-particle-canvas"
      aria-hidden="true"
    />
  )
}
