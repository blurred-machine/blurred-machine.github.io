import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section.jsx';
import { JOBS } from '../data/content.js';

export default function Experience() {
  const [active, setActive] = useState(0);
  const job = JOBS[active];

  return (
    <Section id="experience" title="Where I’ve Worked">
      <div className="flex flex-col gap-2 md:flex-row md:gap-8">
        {/* tab list */}
        <div
          role="tablist"
          aria-label="Job tabs"
          className="relative flex overflow-x-auto md:flex-col md:overflow-visible"
        >
          {JOBS.map((j, i) => {
            const isActive = i === active;
            return (
              <button
                key={j.company}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`relative whitespace-nowrap border-b-2 border-lightest-navy px-5 py-3 text-left font-mono text-[13px] transition-colors duration-200 hover:bg-light-navy/40 hover:text-green md:border-b-0 md:border-l-2 ${
                  isActive ? 'text-green' : 'text-light-slate'
                }`}
              >
                {j.company}
                {isActive && (
                  <motion.span
                    layoutId="active-tab"
                    transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
                    className="absolute inset-y-0 left-0 hidden w-[2px] bg-green md:block"
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="active-tab-mobile"
                    transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
                    className="absolute inset-x-0 bottom-0 block h-[2px] bg-green md:hidden"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* panel */}
        <div className="min-h-[320px] flex-1 pt-4 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.645, 0.045, 0.355, 1] }}
            >
              <h3 className="text-xl font-medium text-lightest-slate md:text-[22px]">
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
              <p className="mt-1 font-mono text-xs tracking-wide text-light-slate">
                {job.range} &middot; {job.team}
              </p>
              <ul className="mt-5 space-y-3">
                {job.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="relative pl-7 text-[15px] leading-relaxed text-light-slate md:text-base"
                  >
                    <span className="absolute left-0 top-1 text-green">▹</span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
