import { useEffect, useRef, useState } from 'react';
import { SOCIALS } from '../data/socials.js';

const CACHE_KEY = 'pv-followers-cache-v2';
const CACHE_TTL = 10 * 60 * 1000; // 10 min — reduce proxy load
const REFRESH_INTERVAL = 5 * 60 * 1000; // re-poll every 5 min
const PROXY = 'https://corsproxy.io/?'; // public CORS proxy

// ----- helpers --------------------------------------------------------
const fetchViaProxy = async (url, timeoutMs = 7000) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(PROXY + encodeURIComponent(url), { signal: ctrl.signal });
    if (!res.ok) throw new Error(`proxy ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
};

// Parse "6.13K" / "1.2M" / "12,500" into an integer.
const parseCompactNumber = (s) => {
  if (s == null) return null;
  const cleaned = String(s).replace(/,/g, '').trim();
  const m = cleaned.match(/^([\d.]+)\s*([KkMmBb])?/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return null;
  const suffix = (m[2] || '').toLowerCase();
  const mult = suffix === 'k' ? 1_000 : suffix === 'm' ? 1_000_000 : suffix === 'b' ? 1_000_000_000 : 1;
  return Math.round(n * mult);
};

// ----- strategies ------------------------------------------------------
const strategies = {
  'github-api': async () => {
    const res = await fetch('https://api.github.com/users/blurred-machine', {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`github ${res.status}`);
    const data = await res.json();
    const n = Number(data.followers);
    if (!Number.isFinite(n)) throw new Error('github: no followers field');
    return n;
  },

  // YouTube embeds the sub count in the channel page as
  //   "content":"6.13K subscribers"
  // (also "X thousand subscribers" in the accessibility label).
  'youtube-scrape': async () => {
    const html = await fetchViaProxy('https://www.youtube.com/@blurred_ai');
    const m =
      html.match(/"content":"([\d.,]+[KMB]?)\s*subscribers"/i) ||
      html.match(/([\d.,]+[KMB]?)\s+subscribers/i);
    if (!m) throw new Error('youtube: count not found');
    const n = parseCompactNumber(m[1]);
    if (n == null) throw new Error('youtube: parse fail');
    return n;
  },

  // Medium ships the exact follower count in JSON inside the profile page:
  //   "SocialStats","followerCount":1626,"followingCount":13
  'medium-scrape': async () => {
    const html = await fetchViaProxy('https://medium.com/@blurred-machine');
    const m =
      html.match(/"followerCount":(\d+)/) ||
      html.match(/"socialStats":\{[^}]*"followerCount":(\d+)/);
    if (!m) throw new Error('medium: count not found');
    const n = parseInt(m[1], 10);
    if (!Number.isFinite(n)) throw new Error('medium: parse fail');
    return n;
  },

  // Substack publication pages expose a public approximation in the meta
  // description, e.g. "by Paras Varshney, a Substack publication with
  // thousands of subscribers" plus a literal "Over 2,000 subscribers" badge.
  'substack-scrape': async () => {
    const html = await fetchViaProxy('https://blurredai.substack.com/');
    const m =
      html.match(/Over\s+([\d,.]+[KM]?)\s+subscribers/i) ||
      html.match(/([\d,.]+[KM]?)\s+subscribers/i);
    if (!m) throw new Error('substack: count not found');
    const n = parseCompactNumber(m[1]);
    if (n == null) throw new Error('substack: parse fail');
    return n;
  },

  // Facebook profile/page follower counts are blocked on the main domain,
  // but the public "Page Plugin" widget endpoint returns a tiny HTML stub
  // with the real count rendered, e.g.
  //   <div class="_1drq" style="...">17,872 followers</div>
  'facebook-plugin-scrape': async () => {
    const profileUrl = 'https://www.facebook.com/profile.php?id=100095099018327';
    const pluginUrl = 'https://www.facebook.com/plugins/page.php?href=' + encodeURIComponent(profileUrl);
    const html = await fetchViaProxy(pluginUrl);
    const m = html.match(/([\d,.]+[KM]?)\s+followers/i);
    if (!m) throw new Error('facebook: count not found');
    const n = parseCompactNumber(m[1]);
    if (n == null) throw new Error('facebook: parse fail');
    return n;
  },

  // Instagram via trendhero.io — a free public API endpoint that returns
  // exact follower counts for any public IG profile. No auth, no captcha
  // (the recaptcha_token query param is optional), no key. Returns JSON
  // with `preview.user_info.follower_count` plus other profile stats.
  // Goes through the corsproxy.io proxy because trendhero.io doesn't
  // enable CORS itself.
  'trendhero-instagram': async () => {
    const url = 'https://trendhero.io/api/get_er_reports?username=blurred_ai';
    const text = await fetchViaProxy(url, 12000);
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('trendhero: bad JSON'); }
    const n = data?.preview?.user_info?.follower_count;
    if (!Number.isFinite(n) || n <= 0) throw new Error('trendhero: no follower_count');
    return n;
  },

  // LinkedIn via taplio.com — a free public lookup page that exposes the
  // exact follower count in its hydration JSON, e.g. `"followerCount":11519`.
  // No auth, no key, no captcha. Goes through corsproxy.io since taplio
  // doesn't enable CORS itself.
  'taplio-linkedin': async () => {
    const url = 'https://taplio.com/lookup/blurred-machine';
    const html = await fetchViaProxy(url, 12000);
    const m =
      html.match(/"followerCount"\s*:\s*(\d+)/) ||
      html.match(/"followersCount"\s*:\s*(\d+)/);
    if (!m) throw new Error('taplio: followerCount not found');
    const n = parseInt(m[1], 10);
    if (!Number.isFinite(n) || n <= 0) throw new Error('taplio: parse fail');
    return n;
  },

  'bing-instagram-scrape': async () => {
    const queries = [
      'instagram.com/blurred_ai followers',
      '@blurred_ai instagram followers',
    ];
    for (const q of queries) {
      try {
        const html = await fetchViaProxy('https://www.bing.com/search?q=' + encodeURIComponent(q), 9000);
        const clean = html
          .replace(/<[^>]+>/g, ' ')
          .replace(/&amp;/g, '&').replace(/&#32;/g, ' ').replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ');
        // Try matchers in priority order — most specific first.
        const m =
          clean.match(/@blurred_ai[^.]{0,250}?([\d,.]+\s*[KMB]?)\s+followers/i) ||
          clean.match(/blurred_ai[^.]{0,250}?([\d,.]+\s*[KMB]?)\s+followers/i) ||
          clean.match(/Instagram\s*([\d,.]+\s*[KMB]?)\s*Followers/i);
        if (m) {
          const n = parseCompactNumber(m[1].replace(/\s/g, ''));
          if (n != null && n > 0) return n;
        }
      } catch { /* try next query */ }
    }
    throw new Error('instagram: no Bing snippet matched');
  },

  'bing-linkedin-scrape': async () => {
    const queries = [
      'blurred-machine linkedin',
      'site:linkedin.com/in/blurred-machine',
      'Paras Varshney Fidelity Senior Data Scientist linkedin',
    ];
    for (const q of queries) {
      try {
        const html = await fetchViaProxy('https://www.bing.com/search?q=' + encodeURIComponent(q), 9000);
        const clean = html
          .replace(/<[^>]+>/g, ' ')
          .replace(/&amp;/g, '&').replace(/&#32;/g, ' ').replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ');
        const m =
          clean.match(/Followers:\s*([\d,.]+\s*[KMB]?)/i) ||
          clean.match(/blurred-machine[^.]{0,300}?([\d,.]+\s*[KMB]?)\s+followers/i) ||
          clean.match(/Fidelity[^.]{0,200}?Followers[:\s]+([\d,.]+\s*[KMB]?)/i);
        if (m) {
          const n = parseCompactNumber(m[1].replace(/\s/g, ''));
          if (n != null && n > 0) return n;
        }
      } catch { /* try next query */ }
    }
    throw new Error('linkedin: no Bing snippet matched');
  },
};

// ----- main hook -------------------------------------------------------
const initialState = () => {
  const counts = {};
  const status = {};
  for (const s of SOCIALS) {
    if (s.verified && Number.isFinite(s.verified.count)) {
      counts[s.id] = s.verified.count;
      status[s.id] = { source: 'verified', date: s.verified.date, ok: true };
    } else {
      counts[s.id] = null;
      status[s.id] = s.liveStrategy
        ? { source: 'loading', date: null, ok: false }
        : { source: 'unknown', date: null, ok: false };
    }
  }
  return { counts, status, syncedAt: null };
};

const sumCounts = (counts) => {
  let total = 0;
  let included = 0;
  for (const s of SOCIALS) {
    if (s.excludeFromTotal) continue;
    const v = counts[s.id];
    if (Number.isFinite(v)) {
      total += v;
      included += 1;
    }
  }
  return { total, included };
};

export default function useFollowerCounts() {
  const [state, setState] = useState(() => {
    const init = initialState();
    const { total, included } = sumCounts(init.counts);
    return { ...init, total, includedPlatforms: included };
  });

  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    // hydrate from cache (live values from prior session)
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, counts, status } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setState((prev) => {
            const mergedCounts = { ...prev.counts, ...counts };
            const mergedStatus = { ...prev.status, ...status };
            const { total, included } = sumCounts(mergedCounts);
            return {
              counts: mergedCounts,
              status: mergedStatus,
              syncedAt: ts,
              total,
              includedPlatforms: included,
            };
          });
        }
      }
    } catch {
      // ignore corrupt cache
    }

    const runStrategies = async () => {
      const updates = {};
      const statusUpdates = {};
      await Promise.all(
        SOCIALS.filter((s) => s.liveStrategy && strategies[s.liveStrategy]).map(async (s) => {
          try {
            const n = await strategies[s.liveStrategy]();
            if (Number.isFinite(n) && n >= 0) {
              updates[s.id] = n;
              statusUpdates[s.id] = { source: 'live', date: null, ok: true };
            } else {
              throw new Error('bad number');
            }
          } catch {
            // live failed — fall back to verified, then to nothing
            if (s.verified && Number.isFinite(s.verified.count)) {
              updates[s.id] = s.verified.count;
              statusUpdates[s.id] = { source: 'verified', date: s.verified.date, ok: true };
            } else {
              statusUpdates[s.id] = { source: 'failed', date: null, ok: false };
            }
          }
        })
      );

      if (cancelled.current) return;

      setState((prev) => {
        const counts = { ...prev.counts, ...updates };
        const status = { ...prev.status, ...statusUpdates };
        const { total, included } = sumCounts(counts);
        const next = {
          counts,
          status,
          syncedAt: Date.now(),
          total,
          includedPlatforms: included,
        };
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ ts: next.syncedAt, counts: updates, status: statusUpdates })
          );
        } catch {
          // ignore quota errors
        }
        return next;
      });
    };

    runStrategies();
    const timer = setInterval(runStrategies, REFRESH_INTERVAL);

    return () => {
      cancelled.current = true;
      clearInterval(timer);
    };
  }, []);

  return state;
}
