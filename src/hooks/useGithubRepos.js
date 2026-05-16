import { useEffect, useState } from 'react';

const CACHE_KEY = 'pv-github-cache-v1';
const CACHE_TTL = 30 * 60 * 1000; // 30 min
const USER = 'blurred-machine';
const API = `https://api.github.com/users/${USER}/repos?per_page=100&type=owner`;

/**
 * Fetches blurred-machine's public repos, filters forks/archives,
 * sorts by stars desc, normalizes the shape, and caches in sessionStorage.
 */
export default function useGithubRepos(limit = 6) {
  const [state, setState] = useState({ status: 'loading', repos: [], error: null });

  useEffect(() => {
    let cancelled = false;

    const apply = (repos, status = 'ready') => {
      if (cancelled) return;
      setState({ status, repos: repos.slice(0, limit), error: null });
    };

    // cache
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, repos } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && Array.isArray(repos) && repos.length) {
          apply(repos);
          return;
        }
      }
    } catch {
      // ignore
    }

    // live fetch
    (async () => {
      try {
        const res = await fetch(API, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) throw new Error(`github ${res.status}`);
        const data = await res.json();

        const repos = (Array.isArray(data) ? data : [])
          .filter((r) => !r.fork && !r.archived && !r.private)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 12)
          .map((r) => ({
            name: r.name,
            description: r.description || '',
            url: r.html_url,
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            language: r.language || '',
            topics: Array.isArray(r.topics) ? r.topics.slice(0, 4) : [],
            updated: r.pushed_at,
          }));

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), repos }));
        } catch {
          // ignore
        }
        apply(repos);
      } catch (e) {
        if (cancelled) return;
        setState({ status: 'error', repos: [], error: String(e.message || e) });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}
