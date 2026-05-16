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
import { SOCIALS } from '../data/socials.js';
import { SITE } from '../data/content.js';

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

export default function Footer() {
  return (
    <footer className="px-6 py-8 text-center text-xs text-light-slate sm:px-12">
      {/* all socials on mobile; desktop has side rails covering primaries */}
      <ul className="mb-5 flex flex-wrap items-center justify-center gap-4">
        {SOCIALS.map((s) => {
          const Icon = ICONS[s.id];
          return (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                title={s.name}
                className="block text-light-slate transition-colors hover:text-green"
              >
                {Icon ? <Icon className="h-[18px] w-[18px]" /> : <span>{s.name[0]}</span>}
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href="https://github.com/blurred-machine"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] leading-relaxed transition-colors hover:text-green"
      >
        Designed &amp; built by {SITE.name} &middot; {new Date().getFullYear()}
      </a>
    </footer>
  );
}
