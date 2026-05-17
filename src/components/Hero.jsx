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

      <motion.div {...lineUp(2.7)} className="mt-12 flex flex-wrap items-center gap-3">
        <a href={HERO.cta.href} className="btn-outline">
          {HERO.cta.label}
        </a>
        {HERO.resumeCta && (
          <a
            href={HERO.resumeCta.href}
            target={HERO.resumeCta.external ? '_blank' : undefined}
            rel={HERO.resumeCta.external ? 'noopener noreferrer' : undefined}
            className="group inline-flex items-center gap-2 rounded font-mono text-sm text-light-slate transition-all duration-300 hover:text-green"
            style={{
              padding: '1.05rem 1.65rem',
              lineHeight: 1,
              border: '1px solid rgba(168, 178, 209, 0.3)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#64ffda'; e.currentTarget.style.backgroundColor = 'rgba(100, 255, 218, 0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(168, 178, 209, 0.3)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {HERO.resumeCta.label}
          </a>
        )}
      </motion.div>

    </section>
  );
}
