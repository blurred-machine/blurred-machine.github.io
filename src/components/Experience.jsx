import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section.jsx';
import { JOBS } from '../data/content.js';

// =====================================================================
// Experience — vertical tabs + richer role panel with metric callouts,
// timeline strip, staggered bullets and tech chips.
// =====================================================================

const easeOut = [0.645, 0.045, 0.355, 1];

export default function Experience() {
  const [active, setActive] = useState(0);
  const job = JOBS[active];

  return (
    <Section id="experience" title="Where I’ve Worked" wide>
      <div className="flex flex-col gap-3 md:flex-row md:gap-10">
        {/* ── tab list ─────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Job tabs"
          className="relative flex shrink-0 overflow-x-auto md:flex-col md:overflow-visible"
        >
          {JOBS.map((j, i) => {
            const isActive = i === active;
            return (
              <button
                key={j.company}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`group relative flex items-center gap-2 whitespace-nowrap border-b-2 border-lightest-navy px-5 py-3.5 text-left font-mono text-[13px] transition-colors duration-200 hover:bg-light-navy/40 hover:text-green md:min-w-[180px] md:border-b-0 md:border-l-2 ${
                  isActive ? 'text-green' : 'text-light-slate'
                }`}
              >
                <span className="truncate">{j.company}</span>
                {j.current && (
                  <span
                    aria-label="currently here"
                    className="relative ml-auto inline-flex h-1.5 w-1.5 shrink-0"
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
                  </span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="active-tab"
                    transition={{ duration: 0.3, ease: easeOut }}
                    className="absolute inset-y-0 left-0 hidden w-[2px] bg-green md:block"
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="active-tab-mobile"
                    transition={{ duration: 0.3, ease: easeOut }}
                    className="absolute inset-x-0 bottom-0 block h-[2px] bg-green md:hidden"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── panel ────────────────────────────────────────────────── */}
        <div className="min-h-[400px] flex-1 pt-2 md:pt-0">
          {/* initial={false} so the first-mount child renders straight to
              its `animate` state (avoids the panel getting stuck at
              opacity 0 on page load). Subsequent tab swaps still animate. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="space-y-5"
            >
              <RoleHeader job={job} />
              {job.metrics?.length > 0 && <MetricStrip metrics={job.metrics} />}
              <BulletList bullets={job.bullets} />
              {job.tech?.length > 0 && <TechChips tech={job.tech} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

// ─── role header (title @ company + team + dates) ────────────────────
function RoleHeader({ job }) {
  return (
    <header>
      <h3 className="text-xl font-medium text-lightest-slate md:text-[24px]">
        {job.title}
        <span className="text-green">
          &nbsp;@&nbsp;
          {job.url ? (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-link"
            >
              {job.fullCompany}
            </a>
          ) : (
            job.fullCompany
          )}
        </span>
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11.5px] text-light-slate">
        {job.team && (
          <span className="rounded-full border border-lightest-navy bg-light-navy/60 px-2.5 py-1 uppercase tracking-wider text-green/90">
            {job.team}
          </span>
        )}
        <DateBar range={job.range} current={job.current} />
      </div>
    </header>
  );
}

// ─── animated date bar: start ─━━━━━━━━━━ end ────────────────────────
function DateBar({ range, current }) {
  return (
    <span className="flex items-center gap-2 text-light-slate">
      <span>{range}</span>
      {current && (
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="relative inline-block h-px w-12 origin-left overflow-hidden bg-lightest-navy"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-green to-green" />
        </motion.span>
      )}
    </span>
  );
}

// ─── metric callout strip ────────────────────────────────────────────
function MetricStrip({ metrics }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: easeOut }}
          className="rounded-lg border border-lightest-navy bg-light-navy/50 p-3 backdrop-blur-sm transition-colors duration-300 hover:border-green/30"
        >
          <div
            className="font-semibold tracking-tight text-[22px] sm:text-[26px]"
            style={{
              background: 'linear-gradient(135deg, #ccd6f6 0%, #64ffda 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {m.value}
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-light-slate">
            {m.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── bullets with stagger animation ──────────────────────────────────
function BulletList({ bullets }) {
  return (
    <ul className="space-y-2.5">
      {bullets.map((b, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.25 + i * 0.06, ease: easeOut }}
          className="relative pl-7 text-[15px] leading-relaxed text-light-slate md:text-[15.5px]"
        >
          <span aria-hidden="true" className="absolute left-0 top-[7px] text-green">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l4 4L19 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {b}
        </motion.li>
      ))}
    </ul>
  );
}

// ─── tech chips ──────────────────────────────────────────────────────
function TechChips({ tech }) {
  return (
    <motion.ul
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="flex flex-wrap gap-1.5 pt-2"
    >
      {tech.map((t) => (
        <li
          key={t}
          className="cursor-default rounded-md border border-lightest-navy bg-navy/40 px-2 py-1 font-mono text-[11px] text-light-slate transition-all duration-200 hover:-translate-y-0.5 hover:border-green/60 hover:bg-green-tint hover:text-green"
        >
          {t}
        </li>
      ))}
    </motion.ul>
  );
}
