import { motion } from 'framer-motion';
import { FiExternalLink, FiFolder, FiArrowUpRight } from 'react-icons/fi';
import Section from './Section.jsx';
import { PROJECTS_FEATURED, PROJECTS_OTHER } from '../data/content.js';

// =====================================================================
// Some Things I've Built — bento 2x2 of featured projects + tight grid
// of "noteworthy" cards below. Compact, glassy, interactive.
// =====================================================================

const easeOut = [0.645, 0.045, 0.355, 1];

// ---- Tiny corner glyph per project (replaces the giant SVG visuals)
function AccentGlyph({ accent }) {
  // 56x56 mark sitting in the top-right of each card — domain hint only.
  const variants = {
    fraud: (
      <svg viewBox="0 0 56 56" className="h-full w-full">
        <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="42" cy="14" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="14" cy="42" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="42" cy="42" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="28" cy="28" r="4" fill="currentColor" />
        <line x1="14" y1="14" x2="28" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="42" y1="14" x2="28" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="14" y1="42" x2="28" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="42" y1="42" x2="28" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
    acoustic: (
      <svg viewBox="0 0 56 56" className="h-full w-full">
        {[...Array(9)].map((_, i) => {
          const h = 14 + Math.abs(Math.sin(i * 0.9) * 28);
          return (
            <rect
              key={i}
              x={6 + i * 5.5}
              y={28 - h / 2}
              width="3"
              height={h}
              rx="1.5"
              fill="currentColor"
              opacity={0.4 + (Math.sin(i * 0.6) + 1) * 0.25}
            />
          );
        })}
      </svg>
    ),
    transport: (
      <svg viewBox="0 0 56 56" className="h-full w-full">
        <path d="M4 18 Q 18 6, 28 22 T 52 18" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
        <path d="M4 38 Q 18 26, 28 42 T 52 38" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
        <circle cx="4" cy="18" r="2.5" fill="currentColor" />
        <circle cx="52" cy="18" r="2.5" fill="currentColor" />
        <circle cx="4" cy="38" r="2.5" fill="currentColor" opacity="0.7" />
        <circle cx="52" cy="38" r="2.5" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    invoice: (
      <svg viewBox="0 0 56 56" className="h-full w-full">
        <rect x="14" y="8" width="28" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
        {[...Array(5)].map((_, i) => (
          <rect
            key={i}
            x="18"
            y={14 + i * 7}
            width={i === 0 ? 20 : i % 2 === 0 ? 14 : 18}
            height="2"
            rx="1"
            fill="currentColor"
            opacity={i === 0 ? 0.9 : 0.5}
          />
        ))}
      </svg>
    ),
  };
  return variants[accent] || variants.fraud;
}

// ---- One featured project card -------------------------------------
function FeaturedCard({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-lightest-navy bg-light-navy/50 p-6 shadow-navy backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-navy-lg md:p-7"
    >
      {/* hover glow halo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle at 80% 0%, rgba(100, 255, 218, 0.10), transparent 50%)',
        }}
      />

      {/* header row: folder + accent glyph + external link */}
      <header className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <FiFolder className="h-7 w-7 text-green" />
          <div className="font-mono text-[11px] uppercase tracking-wider text-green">
            Featured
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 text-green/70 transition-colors duration-300 group-hover:text-green">
            <AccentGlyph accent={project.accent} />
          </div>
          {project.links?.[0]?.href && (
            <a
              href={project.links[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-slate transition-colors hover:text-green"
              aria-label="Open project"
            >
              <FiExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>
      </header>

      {/* title + org */}
      <div className="relative mt-5">
        <h3 className="text-[20px] font-semibold leading-tight text-lightest-slate transition-colors duration-300 group-hover:text-green md:text-[22px]">
          {project.title}
        </h3>
        <p className="mt-1 font-mono text-[11.5px] text-light-slate">{project.org}</p>
      </div>

      {/* description */}
      <p
        className="relative mt-3 text-[14.5px] leading-relaxed text-light-slate"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </p>

      {/* metric callout strip */}
      {project.metrics?.length > 0 && (
        <div className="relative mt-5 grid grid-cols-3 gap-3 border-t border-lightest-navy/60 pt-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex flex-col">
              <span
                className="text-[18px] font-semibold leading-none tracking-tight md:text-[20px]"
                style={{
                  background: 'linear-gradient(135deg, #ccd6f6 0%, #64ffda 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {m.value}
              </span>
              <span className="mt-1 font-mono text-[9.5px] uppercase tracking-wider text-light-slate">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* tech chips */}
      {project.tech?.length > 0 && (
        <ul className="relative mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-md border border-lightest-navy/70 bg-navy/40 px-2 py-0.5 font-mono text-[10.5px] text-light-slate"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {/* bottom-right caret hint */}
      <FiArrowUpRight
        aria-hidden="true"
        className="absolute right-5 bottom-5 h-4 w-4 text-light-slate opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </motion.article>
  );
}

// ---- "Other noteworthy" tile (compact) ------------------------------
function OtherCard({ p, i }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (i % 3) * 0.06, ease: easeOut }}
    >
      <article className="group flex h-full flex-col rounded-lg border border-lightest-navy bg-light-navy/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-green/40">
        <header className="flex items-start justify-between">
          <FiFolder className="h-6 w-6 text-green" />
          {p.links?.length ? (
            <div className="flex items-center gap-2">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-slate transition-colors hover:text-green"
                  aria-label={l.label}
                >
                  <FiExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
        </header>

        <h4 className="mt-4 text-[15px] font-semibold leading-snug text-lightest-slate transition-colors group-hover:text-green">
          {p.title}
        </h4>
        <p
          className="mt-1.5 flex-1 text-[13px] leading-relaxed text-light-slate"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {p.description}
        </p>

        <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] text-light-slate">
          {p.tech.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </article>
    </motion.li>
  );
}

// ---- Main section ---------------------------------------------------
export default function Projects() {
  return (
    <>
      <Section id="work" title="Some Things I’ve Built" wide>
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {PROJECTS_FEATURED.map((p, i) => (
            <FeaturedCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-[1200px] px-1 pb-24 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-lightest-navy" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-green">
            Other Noteworthy
          </h3>
          <span className="h-px w-12 bg-lightest-navy" />
        </div>
        <p className="font-mono text-[11px] text-light-slate">talks · recognition · side work</p>

        <ul className="mt-8 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS_OTHER.map((p, i) => (
            <OtherCard key={p.title} p={p} i={i} />
          ))}
        </ul>
      </section>
    </>
  );
}
