import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Section from './Section.jsx';
import { ABOUT, SITE } from '../data/content.js';

// =====================================================================
// About — bento-style with photo + bio + KPI strip + grouped skill cloud.
// =====================================================================

export default function About() {
  return (
    <Section id="about" title="About Me" wide>
      <div className="grid gap-8 md:grid-cols-[1.4fr,1fr] md:gap-10 lg:gap-14">
        {/* ── left: bio + KPI strip ───────────────────────────────── */}
        <div className="space-y-7">
          <StatusBadge />
          <Bio />
          <KpiStrip />
        </div>

        {/* ── right: photo + currently-at card ─────────────────────── */}
        <div className="space-y-5">
          <PhotoFrame />
          <CurrentlyAtCard />
        </div>

        {/* ── full-width bottom: grouped skill cloud ───────────────── */}
        <div className="md:col-span-2">
          <SkillCloud />
        </div>
      </div>
    </Section>
  );
}

// ─── status badge ────────────────────────────────────────────────────
function StatusBadge() {
  if (!ABOUT.status) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green-tint px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-green"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
      </span>
      {ABOUT.status.label}
      {ABOUT.location && (
        <>
          <span className="mx-1 text-green/40">·</span>
          <span className="text-green/80">{ABOUT.location}</span>
        </>
      )}
    </motion.div>
  );
}

// ─── bio with highlighted tokens ─────────────────────────────────────
function Bio() {
  const highlights = ABOUT.highlights || [];
  // Build a regex once that matches ANY highlight token; longest-first so
  // overlapping tokens (e.g. "Fidelity" vs "Fidelity Investments") match the
  // longer one first.
  const rx = useMemo(() => {
    if (highlights.length === 0) return null;
    const escaped = highlights
      .slice()
      .sort((a, b) => b.length - a.length)
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp('(' + escaped.join('|') + ')', 'g');
  }, [highlights]);

  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-light-slate md:text-[17px]">
      {ABOUT.paragraphs.map((p, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          {rx
            ? p.split(rx).map((seg, j) =>
                highlights.includes(seg) ? (
                  <span key={j} className="font-medium text-lightest-slate">
                    {seg}
                  </span>
                ) : (
                  <span key={j}>{seg}</span>
                )
              )
            : p}
        </motion.p>
      ))}
    </div>
  );
}

// ─── KPI strip ───────────────────────────────────────────────────────
function KpiStrip() {
  if (!ABOUT.stats?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid grid-cols-2 gap-3 rounded-lg border border-lightest-navy bg-light-navy/40 p-4 backdrop-blur-sm sm:grid-cols-4"
    >
      {ABOUT.stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
          className="flex flex-col items-start gap-0.5"
        >
          <span
            className="text-[28px] font-semibold tracking-tight md:text-[32px]"
            style={{
              background: 'linear-gradient(135deg, #ccd6f6 0%, #64ffda 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {s.value}
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-light-slate">
            {s.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── photo frame with animated gradient ring ─────────────────────────
function PhotoFrame() {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <div className="relative mx-auto w-full max-w-[320px] md:mx-0">
      <a
        href={SITE.socials?.[0]?.url || '#'}
        onClick={(e) => { if (!SITE.socials?.[0]?.url) e.preventDefault(); }}
        target={SITE.socials?.[0]?.url ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="group relative block aspect-square rounded-lg"
        aria-label="Photo of Paras Varshney"
      >
        {/* animated gradient halo behind the frame */}
        <span
          aria-hidden="true"
          className="absolute -inset-1.5 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'conic-gradient(from var(--angle, 0deg), #64ffda22, #64ffda88, #64ffda22, #64ffda)',
            filter: 'blur(14px)',
          }}
        />

        {/* foreground frame */}
        <span
          aria-hidden="true"
          className="relative z-10 block h-full w-full overflow-hidden rounded-lg bg-light-navy ring-1 ring-lightest-navy transition-transform duration-300 ease-in-out-soft group-hover:-translate-x-1 group-hover:-translate-y-1"
        >
          {photoOk ? (
            <>
              <img
                src={ABOUT.photo}
                alt="Paras Varshney"
                loading="lazy"
                onError={() => setPhotoOk(false)}
                className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                style={{ objectPosition: 'center center' }}
              />
              {/* default teal wash; fades on hover */}
              <span className="absolute inset-0 bg-green/25 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
              <span className="absolute inset-0 bg-navy/15 transition-opacity duration-500 group-hover:opacity-0" />
              {/* subtle inner highlight */}
              <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/5" />
            </>
          ) : (
            <>
              <span className="absolute inset-0 bg-gradient-to-br from-green-tint via-light-navy to-navy" />
              <span className="absolute inset-0 flex items-center justify-center font-sans text-7xl font-bold text-green/80">
                PV
              </span>
            </>
          )}
        </span>

        {/* offset frame */}
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 z-0 block h-full w-full rounded-lg border-2 border-green transition-transform duration-300 ease-in-out-soft group-hover:left-1.5 group-hover:top-1.5"
        />
      </a>
    </div>
  );
}

// ─── currently-at card ───────────────────────────────────────────────
function CurrentlyAtCard() {
  if (!ABOUT.currentlyAt) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-lg border border-lightest-navy bg-light-navy/60 p-4 backdrop-blur-sm md:mx-0"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-green-tint font-mono text-[11px] font-semibold text-green"
        >
          NOW
        </span>
        <div className="min-w-0">
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-light-slate">
            Currently
          </div>
          <div className="mt-0.5 text-[15px] font-medium text-lightest-slate">
            {ABOUT.currentlyAt.role}
          </div>
          <div className="text-[13px] text-green">
            @ {ABOUT.currentlyAt.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── grouped skill cloud ─────────────────────────────────────────────
function SkillCloud() {
  const groups = ABOUT.skillGroups?.length
    ? ABOUT.skillGroups
    : [{ label: 'Stack', items: ABOUT.skills || [] }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-2 rounded-lg border border-lightest-navy bg-light-navy/30 p-5 md:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-green">
          Stack
        </span>
        <span className="h-px flex-1 bg-lightest-navy" />
        <span className="font-mono text-[10.5px] text-light-slate">
          tools I reach for
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, gi) => (
          <motion.div
            key={g.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: gi * 0.05 }}
          >
            <div className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-light-slate">
              {g.label}
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="cursor-default rounded-md border border-lightest-navy bg-navy/40 px-2 py-1 font-mono text-[11.5px] text-light-slate transition-all duration-200 hover:-translate-y-0.5 hover:border-green/60 hover:bg-green-tint hover:text-green"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
