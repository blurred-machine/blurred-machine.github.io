import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMedium,
  FaGithub,
  FaFacebookF,
  FaKaggle,
} from 'react-icons/fa';
import { SiSubstack } from 'react-icons/si';
import useFollowerCounts from '../hooks/useFollowerCounts.js';
import { SOCIALS } from '../data/socials.js';

const ICONS = {
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  medium: FaMedium,
  github: FaGithub,
  facebook: FaFacebookF,
  kaggle: FaKaggle,
  substack: SiSubstack,
};

const compact = (n) => {
  if (n == null || !Number.isFinite(n)) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 2) + 'M';
  if (n >= 10_000) return Math.round(n / 1000) + 'K';
  if (n >= 1_000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
};

const fullFormat = (n) => (Number.isFinite(n) ? n.toLocaleString('en-US') : '—');

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(target ?? 0);
  const prevRef = useRef(target ?? 0);

  useEffect(() => {
    const from = prevRef.current;
    const to = target ?? 0;
    if (from === to) return;
    let raf = 0;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * ease(t);
      setVal(v);
      if (t < 1) raf = requestAnimationFrame(step);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return Math.round(val);
}

function useTimeAgo(ts) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);
  if (!ts) return 'syncing…';
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

const SOURCE_BADGE = {
  live:     { label: 'LIVE',     cls: 'bg-green/15 text-green' },
  verified: { label: 'VERIFIED', cls: 'bg-light-slate/15 text-light-slate' },
  loading:  { label: '…',        cls: 'bg-slate/15 text-light-slate' },
  failed:   { label: 'OFFLINE',  cls: 'bg-slate/15 text-light-slate' },
  unknown:  { label: 'PRIVATE',  cls: 'bg-slate/15 text-light-slate' },
};

export default function ReachCounter() {
  const { counts, status, total, includedPlatforms, syncedAt } = useFollowerCounts();
  const [open, setOpen] = useState(false);
  const animated = useCountUp(total);
  const timeAgo = useTimeAgo(syncedAt);

  // count of platforms with live OK + verified
  const liveCount = Object.values(status).filter((s) => s.source === 'live').length;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Total reach: ${fullFormat(total)} across ${includedPlatforms} verified platforms`}
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-3 rounded-full border border-green/30 bg-light-navy/90 px-4 py-2 font-mono text-xs text-light-slate backdrop-blur-md transition-all duration-300 hover:border-green/60 hover:bg-light-navy hover:text-lightest-slate sm:text-[13px]"
        style={{
          boxShadow:
            '0 0 0 1px rgba(100, 255, 218, 0.08), 0 8px 24px -8px rgba(100, 255, 218, 0.25), 0 0 40px -10px rgba(100, 255, 218, 0.15)',
        }}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
        </span>

        <span className="text-green">LIVE</span>

        <span className="hidden h-3 w-px bg-lightest-navy sm:block" />

        <span className="flex items-baseline gap-1.5">
          <span className="font-semibold tabular-nums text-lightest-slate text-sm sm:text-base">
            {compact(animated)}
          </span>
          <span className="text-light-slate">active followers</span>
        </span>

        <span className="hidden h-3 w-px bg-lightest-navy md:block" />
        <span className="hidden text-light-slate md:inline">
          {liveCount} live
        </span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`ml-0.5 text-light-slate transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.645, 0.045, 0.355, 1] }}
            className="absolute left-0 top-full z-40 mt-3 w-[340px] origin-top-left rounded-md border border-lightest-navy bg-light-navy/95 p-3 shadow-navy-lg backdrop-blur-md"
            role="dialog"
            aria-label="Per-platform follower breakdown"
          >
            <div className="mb-2 flex items-center justify-between border-b border-lightest-navy pb-2 font-mono text-[11px] uppercase tracking-wider text-light-slate">
              <span>Per-platform</span>
              <span className="text-green">synced {timeAgo}</span>
            </div>

            <ul className="grid grid-cols-1 gap-0.5">
              {SOCIALS.filter((s) => !s.excludeFromTotal).map((s) => {
                const Icon = ICONS[s.id];
                const st = status[s.id] || { source: 'unknown' };
                const badge = SOURCE_BADGE[st.source] || SOURCE_BADGE.unknown;
                const valueDisplay = fullFormat(counts[s.id]);

                return (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/row flex items-center justify-between gap-3 rounded px-2 py-1.5 transition-colors hover:bg-lightest-navy/40"
                    >
                      <span className="flex min-w-0 items-center gap-2.5 text-light-slate group-hover/row:text-green">
                        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
                        <span className="font-mono text-[12px]">{s.name}</span>
                        <span className={`shrink-0 rounded-sm px-1 py-px font-mono text-[9px] uppercase tracking-wider ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[12px] tabular-nums text-lightest-slate">
                        {valueDisplay}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
