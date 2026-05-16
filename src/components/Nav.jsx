import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS, SITE } from '../data/content.js';
import useScrollDirection from '../hooks/useScrollDirection.js';
import useActiveSection from '../hooks/useActiveSection.js';

export default function Nav() {
  const { direction, scrolled } = useScrollDirection(80);
  const [open, setOpen] = useState(false);
  const sectionIds = useMemo(() => NAV_LINKS.map((l) => l.href.replace('#', '')), []);
  const activeId = useActiveSection(sectionIds);

  // hide when scrolling down past threshold; otherwise show
  const hidden = scrolled && direction === 'down' && !open;

  return (
    <motion.header
      animate={{
        y: hidden ? -120 : 0,
        boxShadow: scrolled ? '0 10px 30px -10px rgba(2, 12, 27, 0.7)' : 'none',
        background: scrolled ? 'rgba(10, 25, 47, 0.85)' : 'rgba(10, 25, 47, 0)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        height: scrolled ? 70 : 100,
      }}
      transition={{ duration: 0.35, ease: [0.645, 0.045, 0.355, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex items-center"
      style={{ WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)' }}
    >
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 sm:px-12 md:px-16 lg:px-20">
        {/* logo */}
        <motion.a
          href="#"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5 }}
          className="group relative"
          aria-label="Home"
        >
          <svg viewBox="0 0 50 50" className="h-11 w-11 text-green transition-transform duration-300 group-hover:-translate-y-0.5">
            <polygon
              points="25,2 46,13.5 46,36.5 25,48 4,36.5 4,13.5"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Inter, sans-serif"
              fontSize="18"
              fontWeight="700"
              fill="currentColor"
            >
              P
            </text>
          </svg>
        </motion.a>

        {/* desktop links */}
        <ul className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link, i) => {
            const id = link.href.replace('#', '');
            const isActive = activeId === id;
            return (
              <motion.li
                key={link.name}
                initial={{ y: -14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.05 + i * 0.08, duration: 0.5 }}
              >
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group relative inline-flex items-baseline gap-1.5 px-3 py-2 font-mono text-[13px] transition-colors hover:text-green ${
                    isActive ? 'text-green' : 'text-lightest-slate'
                  }`}
                >
                  <span className="text-green">{link.num}.</span>
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav"
                      transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-green"
                    />
                  )}
                </a>
              </motion.li>
            );
          })}
          <motion.li
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.05 + NAV_LINKS.length * 0.08, duration: 0.5 }}
            className="ml-3"
          >
            {SITE.resumeUrl ? (
              <a
                href={SITE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-mini"
              >
                Resume
              </a>
            ) : null}
          </motion.li>
        </ul>

        {/* mobile menu trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="relative z-50 md:hidden"
        >
          <span className="flex h-10 w-10 flex-col items-end justify-center gap-1.5">
            <span
              className={`block h-px bg-green transition-all duration-300 ${open ? 'w-7 translate-y-2 rotate-45' : 'w-7'}`}
            />
            <span
              className={`block h-px bg-green transition-all duration-300 ${open ? 'opacity-0' : 'w-5 opacity-100'}`}
            />
            <span
              className={`block h-px bg-green transition-all duration-300 ${open ? 'w-7 -translate-y-2 -rotate-45' : 'w-6'}`}
            />
          </span>
        </button>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.645, 0.045, 0.355, 1] }}
            className="fixed inset-y-0 right-0 z-40 flex w-3/4 max-w-sm flex-col items-center justify-center bg-light-navy shadow-navy-lg md:hidden"
          >
            <ul className="flex flex-col items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center gap-1 font-mono text-lightest-slate transition-colors hover:text-green"
                  >
                    <span className="text-green text-sm">{link.num}.</span>
                    <span className="text-xl">{link.name}</span>
                  </a>
                </li>
              ))}
              {SITE.resumeUrl ? (
                <li className="mt-6">
                  <a
                    href={SITE.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="btn-outline"
                  >
                    Resume
                  </a>
                </li>
              ) : null}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
