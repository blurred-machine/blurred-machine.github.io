import { motion } from 'framer-motion';
import { SITE } from '../data/content.js';

/** Fixed right rail with vertical email + line going to the bottom. */
export default function SideRight() {
  return (
    <motion.aside
      aria-label="Email"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      className="fixed bottom-0 right-6 z-40 hidden md:block xl:right-10"
    >
      <div className="flex flex-col items-center gap-6 after:mt-6 after:block after:h-24 after:w-px after:bg-light-slate">
        <motion.a
          href={`mailto:${SITE.email}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          whileHover={{ y: -3, color: '#64ffda' }}
          className="font-mono text-xs tracking-[0.2em] text-light-slate transition-colors hover:text-green"
          style={{ writingMode: 'vertical-rl' }}
        >
          {SITE.email}
        </motion.a>
      </div>
    </motion.aside>
  );
}
