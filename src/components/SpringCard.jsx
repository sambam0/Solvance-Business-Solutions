import { useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Wrapper that adds spring hover lift + cursor-tracked glow to any card.
 */
export default function SpringCard({ children, className = '', style, hoverY = -4, ...props }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const r = card.getBoundingClientRect()
    card.style.setProperty('--glow-x', ((e.clientX - r.left) / r.width * 100) + '%')
    card.style.setProperty('--glow-y', ((e.clientY - r.top) / r.height * 100) + '%')
  }

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      whileHover={{ y: hoverY, boxShadow: '0 0 0 1px var(--line-2), var(--shadow-lg)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
