import { motion } from 'framer-motion';
import { FaMedium, FaGithub, FaKaggle } from 'react-icons/fa';
import { FiExternalLink, FiStar, FiGitBranch, FiAward } from 'react-icons/fi';
import Section from './Section.jsx';
import useMediumPosts from '../hooks/useMediumPosts.js';
import useGithubRepos from '../hooks/useGithubRepos.js';
import { KAGGLE_HIGHLIGHTS } from '../data/content.js';

// ----- helpers ------------------------------------------------------------
const formatDate = (s) => {
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ----- sub-group wrapper --------------------------------------------------
function SubGroup({ icon, title, subtitle, href, hrefLabel, children }) {
  return (
    <div className="mb-14 last:mb-0 md:mb-20">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-lightest-navy pb-3">
        <div className="flex items-center gap-3">
          <span className="text-green">{icon}</span>
          <h3 className="font-mono text-sm text-green tracking-wide">{title}</h3>
          {subtitle && <span className="font-mono text-xs text-light-slate">&middot; {subtitle}</span>}
        </div>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-light-slate transition-colors hover:text-green"
          >
            {hrefLabel || 'Visit'}
            <FiExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}
      </header>
      {children}
    </div>
  );
}

// ----- skeletons ----------------------------------------------------------
function CardSkeleton({ tall = false }) {
  return (
    <div className={`animate-pulse rounded-md bg-light-navy p-6 shadow-navy ${tall ? 'h-56' : 'h-44'}`}>
      <div className="mb-4 h-4 w-1/3 rounded bg-lightest-navy" />
      <div className="mb-2 h-5 w-3/4 rounded bg-lightest-navy" />
      <div className="mb-2 h-3 w-full rounded bg-lightest-navy/70" />
      <div className="h-3 w-5/6 rounded bg-lightest-navy/70" />
    </div>
  );
}

function ErrorBox({ message, href, label }) {
  return (
    <div className="rounded-md border border-lightest-navy bg-light-navy/40 p-6 text-sm text-light-slate">
      <p className="mb-3">Couldn&rsquo;t load live data {message ? <span className="font-mono text-xs text-light-slate">({message})</span> : null}.</p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-xs text-green hover:underline"
        >
          {label} <FiExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

// ----- cards --------------------------------------------------------------
const cardBase =
  'group flex h-full flex-col gap-3 rounded-md bg-light-navy p-6 shadow-navy transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-navy-lg';

function MediumCard({ post, i }) {
  return (
    <motion.a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
      className={cardBase}
    >
      <div className="flex items-center gap-2 font-mono text-xs text-light-slate">
        <span className="text-green">{formatDate(post.pubDate)}</span>
        {post.categories[0] && (
          <span className="truncate">&middot; #{post.categories[0]}</span>
        )}
      </div>
      <h4 className="text-[17px] font-semibold leading-snug text-lightest-slate transition-colors group-hover:text-green md:text-lg">
        {post.title}
      </h4>
      <p
        className="text-sm leading-relaxed text-light-slate"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-2 font-mono text-xs text-light-slate">
        <span className="flex items-center gap-1.5">
          <FaMedium className="h-4 w-4" /> Medium
        </span>
        <FiExternalLink className="h-4 w-4 text-light-slate transition-colors group-hover:text-green" />
      </div>
    </motion.a>
  );
}

function GithubCard({ repo, i }) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
      className={cardBase}
    >
      <header className="flex items-start justify-between">
        <FaGithub className="h-7 w-7 text-green" />
        <FiExternalLink className="h-5 w-5 text-light-slate transition-colors group-hover:text-green" />
      </header>
      <h4 className="text-[17px] font-semibold leading-snug text-lightest-slate transition-colors group-hover:text-green md:text-lg">
        {repo.name}
      </h4>
      <p
        className="flex-1 text-sm leading-relaxed text-light-slate"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {repo.description || 'No description'}
      </p>
      <footer className="mt-2 flex flex-wrap items-center gap-4 font-mono text-xs text-light-slate">
        <span className="inline-flex items-center gap-1.5">
          <FiStar className="h-3.5 w-3.5" />
          {repo.stars}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiGitBranch className="h-3.5 w-3.5" />
          {repo.forks}
        </span>
        {repo.language && <span className="ml-auto text-light-slate">{repo.language}</span>}
      </footer>
    </motion.a>
  );
}

function KaggleCard({ item, i }) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: i * 0.06 }}
      className={cardBase}
    >
      <header className="flex items-start justify-between">
        <FaKaggle className="h-7 w-7 text-green" />
        <FiExternalLink className="h-5 w-5 text-light-slate transition-colors group-hover:text-green" />
      </header>
      <h4 className="text-[17px] font-semibold leading-snug text-lightest-slate transition-colors group-hover:text-green md:text-lg">
        {item.title}
      </h4>
      <p className="flex-1 text-sm leading-relaxed text-light-slate">{item.description}</p>
      {item.badge && (
        <footer className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-green/30 bg-green/10 px-2.5 py-1 font-mono text-[11px] text-green">
          <FiAward className="h-3 w-3" /> {item.badge}
        </footer>
      )}
    </motion.a>
  );
}

// ----- main ----------------------------------------------------------------
export default function AroundTheWeb() {
  const { status: mStatus, posts, error: mErr } = useMediumPosts(4);
  const { status: gStatus, repos, error: gErr } = useGithubRepos(6);

  return (
    <Section id="around" title="Around the Web" wide>
      <p className="-mt-2 mb-12 max-w-[65ch] text-base leading-relaxed text-light-slate md:text-[17px]">
        A live feed of the public record &mdash; the cards below are pulled in real time
        from Medium and GitHub each session. Kaggle is curated (no public API).
      </p>

      {/* ----- Writing ----- */}
      <SubGroup
        icon={<FaMedium className="h-5 w-5" />}
        title="Writing"
        subtitle="latest from Medium"
        href="https://medium.com/@blurred-machine"
        hrefLabel="All posts"
      >
        {mStatus === 'loading' && (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}
        {mStatus === 'error' && (
          <ErrorBox
            message={mErr}
            href="https://medium.com/@blurred-machine"
            label="Read on Medium"
          />
        )}
        {mStatus === 'ready' && posts.length === 0 && (
          <ErrorBox message="no posts returned" href="https://medium.com/@blurred-machine" label="Visit profile" />
        )}
        {mStatus === 'ready' && posts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {posts.map((p, i) => <MediumCard key={p.link} post={p} i={i} />)}
          </div>
        )}
      </SubGroup>

      {/* ----- Open Source ----- */}
      <SubGroup
        icon={<FaGithub className="h-5 w-5" />}
        title="Open Source"
        subtitle="top GitHub repos by stars"
        href="https://github.com/blurred-machine"
        hrefLabel="All repos"
      >
        {gStatus === 'loading' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}
        {gStatus === 'error' && (
          <ErrorBox
            message={gErr}
            href="https://github.com/blurred-machine"
            label="Visit GitHub"
          />
        )}
        {gStatus === 'ready' && repos.length === 0 && (
          <ErrorBox message="no public repos returned" href="https://github.com/blurred-machine" label="Visit GitHub" />
        )}
        {gStatus === 'ready' && repos.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((r, i) => <GithubCard key={r.name} repo={r} i={i} />)}
          </div>
        )}
      </SubGroup>

      {/* ----- Kaggle ----- */}
      <SubGroup
        icon={<FaKaggle className="h-5 w-5" />}
        title="Competitions"
        subtitle="Kaggle highlights"
        href="https://www.kaggle.com/blurredmachine"
        hrefLabel="Profile"
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {KAGGLE_HIGHLIGHTS.map((item, i) => <KaggleCard key={item.title} item={item} i={i} />)}
        </div>
      </SubGroup>
    </Section>
  );
}
