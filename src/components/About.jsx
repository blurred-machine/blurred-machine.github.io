import { useState } from 'react';
import Section from './Section.jsx';
import { ABOUT, SITE } from '../data/content.js';

export default function About() {
  return (
    <Section id="about" title="About Me" wide>
      <div className="grid gap-12 md:grid-cols-[3fr,2fr] md:gap-16">
        {/* left: bio */}
        <div className="text-base leading-relaxed text-light-slate md:text-[17px]">
          {ABOUT.paragraphs.map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p}
            </p>
          ))}

          <p className="mt-6">Here are a few technologies I&rsquo;ve been working with recently:</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2 font-mono text-sm text-light-slate">
            {ABOUT.skills.map((s) => (
              <li key={s} className="relative pl-5 before:absolute before:left-0 before:top-1 before:text-green before:content-['▹']">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* right: photo (or PV fallback until /me.jpg is added) */}
        <PhotoFrame />
      </div>
    </Section>
  );
}

function PhotoFrame() {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <div className="relative mx-auto w-full max-w-[300px] md:mx-0">
      <a
        href={SITE.socials?.[0]?.url || '#'}
        onClick={(e) => {
          if (!SITE.socials?.[0]?.url) e.preventDefault();
        }}
        target={SITE.socials?.[0]?.url ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="group relative block aspect-square rounded"
        aria-label="Photo of Paras Varshney"
      >
        <span
          aria-hidden="true"
          className="relative z-10 block h-full w-full overflow-hidden rounded bg-light-navy ring-1 ring-lightest-navy transition-transform duration-300 ease-in-out-soft group-hover:-translate-x-1.5 group-hover:-translate-y-1.5"
        >
          {photoOk ? (
            <>
              <img
                src={ABOUT.photo}
                alt="Paras Varshney"
                loading="lazy"
                onError={() => setPhotoOk(false)}
                className="block h-full w-full object-cover"
                style={{ objectPosition: '60% 22%' }}
              />
              {/* teal wash by default; fades on hover to reveal the photo */}
              <span className="absolute inset-0 bg-green/30 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0" />
              <span className="absolute inset-0 bg-navy/20 transition-opacity duration-300 group-hover:opacity-0" />
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

        {/* background offset frame */}
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 z-0 block h-full w-full rounded border-2 border-green transition-transform duration-300 ease-in-out-soft group-hover:left-2 group-hover:top-2"
        />
      </a>
    </div>
  );
}
