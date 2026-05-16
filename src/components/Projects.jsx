import { motion } from 'framer-motion';
import { FiExternalLink, FiFolder } from 'react-icons/fi';
import Section from './Section.jsx';
import { PROJECTS_FEATURED, PROJECTS_OTHER } from '../data/content.js';

// ----- domain-flavored SVG "visual" per featured project ----------------
function ProjectVisual({ accent }) {
  const variants = {
    fraud: (
      <svg viewBox="0 0 400 280" className="h-full w-full">
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#64ffda" stopOpacity="0.18" />
            <stop offset="1" stopColor="#0a192f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="280" fill="#112240" />
        <rect width="400" height="280" fill="url(#g1)" />
        {[...Array(7)].map((_, i) => (
          <g key={i}>
            <circle
              cx={60 + ((i * 53) % 320)}
              cy={70 + (i % 3) * 70}
              r="5"
              fill="#64ffda"
              opacity={0.28 + (i % 3) * 0.14}
            />
          </g>
        ))}
        {[...Array(10)].map((_, i) => (
          <line
            key={`l${i}`}
            x1={60 + ((i * 33) % 320)}
            y1={70 + (i % 3) * 70}
            x2={60 + (((i + 2) * 53) % 320)}
            y2={70 + ((i + 1) % 3) * 70}
            stroke="#64ffda"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
        <text x="20" y="260" fill="#a8b2d1" opacity="0.45" fontFamily="JetBrains Mono, monospace" fontSize="11">
          risk_score = 0.974
        </text>
      </svg>
    ),
    acoustic: (
      <svg viewBox="0 0 400 280" className="h-full w-full">
        <rect width="400" height="280" fill="#112240" />
        {[...Array(40)].map((_, i) => {
          const h = 30 + Math.abs(Math.sin(i * 0.6) * 110);
          return (
            <rect
              key={i}
              x={20 + i * 9}
              y={140 - h / 2}
              width="4"
              height={h}
              fill="#64ffda"
              opacity={0.18 + (Math.sin(i * 0.4) + 1) * 0.15}
            />
          );
        })}
        <text x="20" y="260" fill="#a8b2d1" opacity="0.45" fontFamily="JetBrains Mono, monospace" fontSize="11">
          silhouette = 0.983 | 4k–500kHz
        </text>
      </svg>
    ),
    transport: (
      <svg viewBox="0 0 400 280" className="h-full w-full">
        <rect width="400" height="280" fill="#112240" />
        {[...Array(8)].map((_, r) =>
          [...Array(11)].map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={20 + c * 35}
              y={20 + r * 30}
              width="28"
              height="22"
              fill="none"
              stroke="#1d3358"
              strokeWidth="1"
            />
          ))
        )}
        <path
          d="M20 80 Q 120 60, 220 130 T 380 110"
          stroke="#64ffda"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M20 200 Q 150 160, 260 220 T 380 200"
          stroke="#64ffda"
          strokeWidth="2"
          fill="none"
          opacity="0.32"
        />
        <text x="20" y="260" fill="#a8b2d1" opacity="0.45" fontFamily="JetBrains Mono, monospace" fontSize="11">
          900k pts/min · 5 smart cities
        </text>
      </svg>
    ),
    invoice: (
      <svg viewBox="0 0 400 280" className="h-full w-full">
        <rect width="400" height="280" fill="#112240" />
        <rect x="80" y="30" width="240" height="220" fill="#0a192f" stroke="#1d3358" />
        {[...Array(8)].map((_, i) => (
          <rect
            key={i}
            x="100"
            y={60 + i * 22}
            width={i % 3 === 0 ? '180' : i % 2 === 0 ? '140' : '160'}
            height="6"
            fill="#a8b2d1"
            opacity={0.18 + (i % 3) * 0.1}
          />
        ))}
        <rect x="100" y="60" width="180" height="6" fill="#64ffda" opacity="0.5" />
        <text x="20" y="270" fill="#a8b2d1" opacity="0.45" fontFamily="JetBrains Mono, monospace" fontSize="11">
          -71% processing time
        </text>
      </svg>
    ),
  };
  return variants[accent] || variants.fraud;
}

function FeaturedCard({ project, index }) {
  const reverse = index % 2 === 1;
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.55, ease: [0.645, 0.045, 0.355, 1] }}
      className="relative grid items-center gap-y-6 md:grid-cols-12 md:gap-x-0 md:gap-y-0"
    >
      {/* image — desktop: row 1, cols 1-8 (or 5-12 reverse). overlaps content by ~2 cols. */}
      <div
        className={[
          'relative md:row-start-1',
          reverse ? 'md:col-start-5 md:col-end-13' : 'md:col-start-1 md:col-end-9',
        ].join(' ')}
      >
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-label={project.title}
          className="group relative block overflow-hidden rounded ring-1 ring-lightest-navy"
        >
          {/* base layer: strong navy darken — keeps text legible by default */}
          <span
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-navy/75 transition-opacity duration-500 group-hover:opacity-0"
          />
          {/* tint layer: subtle teal wash for the Brittany Chiang look */}
          <span
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-green/15 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0"
          />
          <span className="block aspect-[16/10] w-full bg-light-navy">
            <ProjectVisual accent={project.accent} />
          </span>
        </a>
      </div>

      {/* content — desktop: row 1, cols 7-12 (or 1-6 reverse). z-10 sits on top of image. */}
      <div
        className={[
          'relative z-10 md:row-start-1',
          reverse ? 'md:col-start-1 md:col-end-7 md:text-left' : 'md:col-start-7 md:col-end-13 md:text-right',
        ].join(' ')}
      >
        <p className="mb-2 font-mono text-xs text-green">Featured Project</p>
        <h3 className="text-2xl font-semibold text-lightest-slate transition-colors hover:text-green md:text-[26px]">
          {project.title}
        </h3>
        <p className="mt-1 font-mono text-xs text-light-slate">{project.org}</p>

        <div className="my-5 rounded bg-light-navy p-5 text-[15px] leading-relaxed text-light-slate shadow-navy-lg ring-1 ring-lightest-navy/60 backdrop-blur-sm md:p-6 md:text-base">
          {project.description}
        </div>

        <ul
          className={`flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-light-slate ${
            reverse ? 'md:justify-start' : 'md:justify-end'
          }`}
        >
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        {project.links?.length ? (
          <div
            className={`mt-4 flex items-center gap-4 ${
              reverse ? 'md:justify-start' : 'md:justify-end'
            }`}
          >
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lightest-slate transition-colors hover:text-green"
                aria-label={l.label}
              >
                <FiExternalLink className="h-5 w-5" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

function OtherCard({ p, i }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: (i % 3) * 0.08, ease: [0.645, 0.045, 0.355, 1] }}
    >
      <article className="group flex h-full flex-col rounded-md bg-light-navy p-7 shadow-navy transition-transform duration-300 hover:-translate-y-2 hover:shadow-navy-lg">
        <header className="flex items-start justify-between">
          <FiFolder className="h-9 w-9 text-green" />
          {p.links?.length ? (
            <div className="flex items-center gap-3">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lightest-slate transition-colors hover:text-green"
                  aria-label={l.label}
                >
                  <FiExternalLink className="h-5 w-5" />
                </a>
              ))}
            </div>
          ) : null}
        </header>

        <h3 className="mt-6 text-[19px] font-semibold text-lightest-slate transition-colors group-hover:text-green">
          {p.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-light-slate">{p.description}</p>

        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-light-slate">
          {p.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </article>
    </motion.li>
  );
}

export default function Projects() {
  return (
    <>
      <Section id="work" title="Some Things I’ve Built" wide>
        <div className="flex flex-col gap-20 md:gap-28">
          {PROJECTS_FEATURED.map((p, i) => (
            <FeaturedCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-[1200px] pb-24 text-center">
        <h3 className="text-2xl font-semibold text-lightest-slate">Other Noteworthy Things</h3>
        <p className="mt-2 font-mono text-xs text-green">talks, recognition, side work</p>

        <ul className="mt-12 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS_OTHER.map((p, i) => (
            <OtherCard key={p.title} p={p} i={i} />
          ))}
        </ul>
      </section>
    </>
  );
}
