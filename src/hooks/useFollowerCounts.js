import { useEffect, useRef, useState } from 'react';
import { SOCIALS } from '../data/socials.js';

const CACHE_KEY = 'pv-followers-cache-v2';
const CACHE_TTL = 10 * 60 * 1000; // 10 min — reduce proxy load
const REFRESH_INTERVAL = 5 * 60 * 1000; // re-poll every 5 min

// ----- proxy fallback chain ------------------------------------------
// Multiple free CORS proxies tried in sequence. corsproxy.io now charges
// for production origins, so we put codetabs (most reliable) first and
// keep corsproxy.io last as a fallback for localhost dev.
const PROXIES = [
  (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
  (u) => `https://api.cors.lol/?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
];

// Track which proxy worked last so subsequent fetches skip dead ones first.
let preferredProxyIdx = 0;

// ----- helpers --------------------------------------------------------
const fetchViaProxy = async (url, timeoutMs = 9000) => {
  const order = PROXIES.slice(preferredProxyIdx).concat(PROXIES.slice(0, preferredProxyIdx));
  let lastErr;
  for (let i = 0; i < order.length; i++) {
    const wrap = order[i];
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(wrap(url), { signal: ctrl.signal });
      if (!res.ok) throw new Error(`proxy ${res.status}`);
      const text = await res.text();
      // tiny sanity check — some proxies return HTML error pages with 200
      if (text.length < 40 && /error|unauthor|blocked/i.test(text)) {
        throw new Error('proxy returned error page');
      }
      // remember the proxy that worked
      const winnerIdx = (preferredProxyIdx + i) % PROXIES.length;
      preferredProxyIdx = winnerIdx;
      return text;
    } catch (e) {
      lastErr = e;
      // continue to next proxy
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error('all proxies failed: ' + String(lastErr?.message || lastErr));
};

// Parse "6.13K" / "1.2M" / "12,500" / "17 882" (European space-sep) into int.
const parseCompactNumber = (s) => {
  if (s == null) return null;
  // strip commas, thin spaces, non-breaking spaces, regular spaces used as
  // thousand separators (European locales / some proxy responses)
  const cleaned = String(s).replace(/[,\s  ]/g, '').trim();
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
    const html = await fetchViaProxy('https://www.youtube.com/@blurred_ai', 15000);
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
    const html = await fetchViaProxy('https://medium.com/@blurred-machine', 15000);
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
    // FB renders the count with locale-dependent thousand separator:
    // "17,872 followers" (US) or "17 882 followers" (EU). Accept either.
    const m = html.match(/(\d[\d,.\s  ]*[KM]?)\s+followers/i);
    if (!m) throw new Error('facebook: count not found');
    const n = parseCompactNumber(m[1]);
    if (n == null || n < 100) throw new Error('facebook: implausible value');
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

      // 1) Prefer same-origin JSON (committed by the GitHub Action every 4h)
      //    It's always reachable in prod, no CORS, and reflects a real
      //    server-side fetch. Falls through to browser scrapers below if
      //    missing (e.g. localhost dev, or before first Action run).
      let jsonPayload = null;
      try {
        const res = await fetch('/follower-counts.json', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.counts && typeof data.counts === 'object') {
            jsonPayload = data;
          }
        }
      } catch {
        // ignore — fall through to client scrapers
      }

      if (jsonPayload) {
        for (const s of SOCIALS) {
          const v = jsonPayload.counts[s.id];
          if (Number.isFinite(v) && v >= 0) {
            updates[s.id] = v;
            statusUpdates[s.id] = { source: 'live', date: jsonPayload._updated, ok: true };
          }
        }
      }

      // 2) For platforms still missing a value, try the browser scrapers
      //    (useful for localhost dev or first-deploy bootstrap)
      await Promise.all(
        SOCIALS.filter((s) => s.liveStrategy && strategies[s.liveStrategy] && !(s.id in updates)).map(async (s) => {
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
