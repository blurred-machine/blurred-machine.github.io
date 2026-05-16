import { motion } from 'framer-motion';
import { HERO } from '../data/content.js';
import ReachCounter from './ReachCounter.jsx';

const lineUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.645, 0.045, 0.355, 1] },
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[90vh] flex-col justify-center pt-32 md:min-h-screen"
    >
      {/* hero-specific glows removed — page now relies on the global ambient
          in App.jsx for a single uniform hue with no visible segregation. */}

      <motion.div {...lineUp(2.0)} className="mb-6">
        <ReachCounter />
      </motion.div>

      <motion.p {...lineUp(2.1)} className="mb-4 font-mono text-sm text-green md:text-base">
        {HERO.intro}
      </motion.p>

      <motion.h1
        {...lineUp(2.2)}
        className="text-lightest-slate font-semibold leading-[1.05] tracking-tight"
        style={{ fontSize: 'clamp(40px, 9vw, 84px)' }}
      >
        {HERO.name}
      </motion.h1>

      <motion.h2
        {...lineUp(2.3)}
        className="mt-3 text-light-slate font-medium leading-[1.1] tracking-tight"
        style={{ fontSize: 'clamp(28px, 5.5vw, 56px)' }}
      >
        {HERO.tagline}
      </motion.h2>

      <motion.p
        {...lineUp(2.5)}
        className="mt-6 max-w-[600px] text-base leading-relaxed text-light-slate md:text-lg"
      >
        {HERO.description}
      </motion.p>

      <motion.div {...lineUp(2.7)} className="mt-12">
        <a href={HERO.cta.href} className="btn-outline">
          {HERO.cta.label}
        </a>
      </motion.div>

    </section>
  );
}
