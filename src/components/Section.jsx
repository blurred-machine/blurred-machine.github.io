import { motion } from 'framer-motion';

/**
 * Numbered, scroll-revealed section wrapper.
 * Children render below the "01. Heading" bar.
 */
export default function Section({ id, title, className = '', wide = false, children }) {
  return (
    <section
      id={id}
      className={`mx-auto py-24 md:py-28 ${wide ? 'max-w-[1200px]' : 'max-w-[900px]'} ${className}`}
    >
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.645, 0.045, 0.355, 1] }}
        className="numbered-heading"
      >
        {title}
      </motion.h2>
      {/* No motion wrapper here — each section's inner components handle
          their own reveal animations. The whileInView on a wrapper this
          high in the tree was flaky on programmatic scroll (would stay
          stuck at opacity:0). Children render at full opacity by default. */}
      <div>{children}</div>
    </section>
  );
}
