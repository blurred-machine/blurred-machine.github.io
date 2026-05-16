import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gradient progress bar pinned to the very top of the viewport.
 * Tracks page scroll via Framer Motion's `useScroll` and smooths with a spring.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-green via-green to-green/40"
    />
  );
}
