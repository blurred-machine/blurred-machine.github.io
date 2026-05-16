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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.645, 0.045, 0.355, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
