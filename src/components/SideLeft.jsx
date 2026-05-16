import { motion } from 'framer-motion';
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
import { PRIMARY_SOCIALS } from '../data/socials.js';

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

/** Fixed left rail with social icons + vertical line going to the bottom. */
export default function SideLeft() {
  return (
    <motion.aside
      aria-label="Social links"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      className="fixed bottom-0 left-6 z-40 hidden md:block xl:left-10"
    >
      <ul className="flex flex-col items-center gap-4 after:mt-5 after:block after:h-24 after:w-px after:bg-light-slate">
        {PRIMARY_SOCIALS.map((s, i) => {
          const Icon = ICONS[s.id];
          return (
            <li key={s.id}>
              <motion.a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                title={s.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.4 + i * 0.08, duration: 0.5 }}
                whileHover={{ y: -3, color: '#64ffda' }}
                className="block text-light-slate transition-colors hover:text-green"
              >
                {Icon ? <Icon className="h-[18px] w-[18px]" /> : <span>{s.name[0]}</span>}
              </motion.a>
            </li>
          );
        })}
      </ul>
    </motion.aside>
  );
}
