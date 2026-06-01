import { motion } from 'framer-motion'

/**
 * Reusable scroll-triggered fade-up wrapper.
 * Replaces the old IntersectionObserver + .reveal CSS approach.
 */
export default function FadeIn({ children, delay = 0, className = '', style, ...props }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
