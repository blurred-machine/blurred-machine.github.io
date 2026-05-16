import { motion } from 'framer-motion';
import { CONTACT } from '../data/content.js';

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[700px] py-32 text-center md:py-40">
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="font-mono text-sm text-green"
      >
        05. {CONTACT.heading}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className="mt-4 font-semibold tracking-tight text-lightest-slate"
        style={{ fontSize: 'clamp(36px, 6vw, 60px)' }}
      >
        {CONTACT.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="mx-auto mt-6 max-w-[560px] text-[17px] leading-relaxed text-lightest-slate/85"
      >
        {CONTACT.body}
      </motion.p>

      {CONTACT.email && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, delay: 0.13 }}
          className="mt-10 flex justify-center"
        >
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2.5 rounded-full border border-green/40 bg-green-tint px-5 py-2.5 font-mono text-[15px] text-green transition-all duration-300 hover:-translate-y-0.5 hover:border-green hover:text-lightest-slate"
            style={{
              boxShadow:
                '0 0 0 1px rgba(100, 255, 218, 0.12), 0 10px 30px -12px rgba(100, 255, 218, 0.55), 0 0 50px -12px rgba(100, 255, 218, 0.35)',
            }}
            aria-label={`Email ${CONTACT.email} via Gmail`}
          >
            {/* shimmer sweep */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            >
              <span
                className="absolute -inset-y-1 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-green/30 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
              />
            </span>

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 7l9 6 9-6M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7a2 2 0 012-2h14a2 2 0 012 2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative">{CONTACT.email}</span>
          </a>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, delay: 0.18 }}
        className="mt-6 flex justify-center"
      >
        <a
          href={CONTACT.cta.href}
          target={CONTACT.cta.external ? '_blank' : undefined}
          rel={CONTACT.cta.external ? 'noopener noreferrer' : undefined}
          className="group relative inline-flex items-center gap-2.5 rounded-full border border-green/60 bg-green/15 px-6 py-3 font-mono text-[15px] text-green transition-all duration-300 hover:-translate-y-0.5 hover:border-green hover:bg-green/25 hover:text-lightest-slate"
          style={{
            boxShadow:
              '0 0 0 1px rgba(100, 255, 218, 0.18), 0 12px 36px -12px rgba(100, 255, 218, 0.70), 0 0 60px -14px rgba(100, 255, 218, 0.45)',
          }}
          aria-label={CONTACT.cta.label}
        >
          {/* shimmer sweep */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute -inset-y-1 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-green/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100" />
          </span>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          </svg>
          <span className="relative">{CONTACT.cta.label}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="relative transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
