import { motion } from 'framer-motion';

/** Hex-frame monogram that draws on, then fades out. */
export default function Loader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.645, 0.045, 0.355, 1] }}
        className="relative h-32 w-32"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {/* hex frame */}
          <motion.polygon
            points="50,3 92,25 92,75 50,97 8,75 8,25"
            fill="transparent"
            stroke="#64ffda"
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </svg>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center font-sans text-3xl font-bold text-green"
        >
          P
        </motion.span>
      </motion.div>
    </div>
  );
}
