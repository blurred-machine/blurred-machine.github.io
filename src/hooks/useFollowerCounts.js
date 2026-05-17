import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { SOCIALS } from '../data/socials.js';

// =====================================================================
// useFollowerCounts
//
// Client-side fetch of all social follower counts. On first call,
// kicks off parallel requests to each platform through a CORS-proxy
// fallback chain. Results stream into a module-level store so multiple
// hook consumers share one fetch.
//
// Design: pre-warmed by App so the requests start while the Loader is
// animating; by the time the page renders, most counts are already in.
// No server, no cron, no committed JSON — pure on-demand fetch.
// =====================================================================

const CACHE_KEY = 'pv-followers-cache-v3';
const CACHE_TTL = 10 * 60 * 1000; // 10 min — survives navigations / refreshes

// ----- CORS-proxy fallback chain -------------------------------------
const PROXIES = [
  (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
  (u) => `https://api.cors.lol/?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
];
let preferredProxyIdx = 0;

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
      if (text.length < 40 && /error|unauthor|blocked/i.test(text)) {
        throw new Error('proxy error page');
      }
      preferredProxyIdx = (preferredProxyIdx + i) % PROXIES.length;
      return text;
    } catch (e) {
      lastErr = e;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error('all proxies failed: ' + String(lastErr?.message || lastErr));
};

// ----- helpers --------------------------------------------------------
const parseCompactNumber = (s) => {
  if (s == null) return null;
  const cleaned = String(s).replace(/[,\s  ]/g, '').trim();
  const m = cleaned.match(/^([\d.]+)\s*([KkMmBb])?/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return null;
  const suffix = (m[2] || '').toLowerCase();
  const mult = suffix === 'k' ? 1_000 : suffix === 'm' ? 1_000_000 : suffix === 'b' ? 1_000_000_000 : 1;
  return Math.round(n * mult);
};

// ----- per-platform scrapers -----------------------------------------
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
  'youtube-scrape': async () => {
    const html = await fetchViaProxy('https://www.youtube.com/@blurred_ai', 15000);
    const m =
      html.match(/"content":"([\d.,]+[KMB]?)\s*subscribers"/i) ||
      html.match(/([\d.,]+[KMB]?)\s+subscribers/i);
    if (!m) throw new Error('youtube: count not found');
    return parseCompactNumber(m[1]);
  },
  'medium-scrape': async () => {
    const html = await fetchViaProxy('https://medium.com/@blurred-machine', 15000);
    const m =
      html.match(/"followerCount":(\d+)/) ||
      html.match(/"socialStats":\{[^}]*"followerCount":(\d+)/);
    if (!m) throw new Error('medium: count not found');
    return parseInt(m[1], 10);
  },
  'substack-scrape': async () => {
    const html = await fetchViaProxy('https://blurredai.substack.com/about');
    const m =
      html.match(/Over\s+([\d,.]+[KM]?)\s+subscribers/i) ||
      html.match(/([\d,.]+[KM]?)\s+subscribers/i);
    if (!m) throw new Error('substack: count not found');
    return parseCompactNumber(m[1]);
  },
  'facebook-plugin-scrape': async () => {
    const profileUrl = 'https://www.facebook.com/profile.php?id=100095099018327';
    const pluginUrl = 'https://www.facebook.com/plugins/page.php?href=' + encodeURIComponent(profileUrl);
    const html = await fetchViaProxy(pluginUrl);
    const m = html.match(/(\d[\d,.\s  ]*[KM]?)\s+followers/i);
    if (!m) throw new Error('facebook: count not found');
    const n = parseCompactNumber(m[1]);
    if (n == null || n < 100) throw new Error('facebook: implausible');
    return n;
  },
  'trendhero-instagram': async () => {
    const text = await fetchViaProxy('https://trendhero.io/api/get_er_reports?username=blurred_ai', 12000);
    const data = JSON.parse(text);
    const n = data?.preview?.user_info?.follower_count;
    if (!Number.isFinite(n) || n <= 0) throw new Error('trendhero: no follower_count');
    return n;
  },
  'taplio-linkedin': async () => {
    const html = await fetchViaProxy('https://taplio.com/lookup/blurred-machine', 12000);
    const m =
      html.match(/"followerCount"\s*:\s*(\d+)/) ||
      html.match(/"followersCount"\s*:\s*(\d+)/);
    if (!m) throw new Error('taplio: followerCount not found');
    return parseInt(m[1], 10);
  },
};

// ----- module-level singleton store -----------------------------------
// One fetch shared across all consumers. The App pre-warms it during the
// Loader animation so counts are ready when the page renders.

const buildInitialState = () => {
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

const makeFullState = (partial) => {
  const { total, included } = sumCounts(partial.counts);
  return { ...partial, total, includedPlatforms: included };
};

let store = makeFullState(buildInitialState());
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => store;

// hydrate from cache eagerly (sync)
try {
  if (typeof sessionStorage !== 'undefined') {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, counts, status } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) {
        const init = buildInitialState();
        store = makeFullState({
          counts: { ...init.counts, ...counts },
          status: { ...init.status, ...status },
          syncedAt: ts,
        });
      }
    }
  }
} catch {
  // ignore corrupt cache
}

// run the fetches at most once per page load (re-runs only after cache TTL)
let inflight = null;
export const warmFollowerCounts = () => {
  if (inflight) return inflight;
  if (store.syncedAt && Date.now() - store.syncedAt < CACHE_TTL) return Promise.resolve(store);

  inflight = (async () => {
    const updates = {};
    const statusUpdates = {};

    await Promise.all(
      SOCIALS
        .filter((s) => s.liveStrategy && strategies[s.liveStrategy])
        .map(async (s) => {
          try {
            const n = await strategies[s.liveStrategy]();
            if (Number.isFinite(n) && n >= 0) {
              updates[s.id] = n;
              statusUpdates[s.id] = { source: 'live', date: null, ok: true };
            } else {
              throw new Error('bad number');
            }
          } catch {
            if (s.verified && Number.isFinite(s.verified.count)) {
              updates[s.id] = s.verified.count;
              statusUpdates[s.id] = { source: 'verified', date: s.verified.date, ok: true };
            } else {
              statusUpdates[s.id] = { source: 'failed', date: null, ok: false };
            }
          }
          // stream each result into the store as it lands so the pill
          // ticks up live instead of waiting for the slowest fetch
          store = makeFullState({
            counts: { ...store.counts, [s.id]: updates[s.id] ?? store.counts[s.id] },
            status: { ...store.status, [s.id]: statusUpdates[s.id] },
            syncedAt: store.syncedAt,
          });
          notify();
        })
    );

    const syncedAt = Date.now();
    store = makeFullState({ counts: { ...store.counts, ...updates }, status: { ...store.status, ...statusUpdates }, syncedAt });
    notify();
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: syncedAt, counts: updates, status: statusUpdates }));
    } catch { /* ignore quota */ }

    return store;
  })().finally(() => { inflight = null; });

  return inflight;
};

// ----- the hook ------------------------------------------------------
export default function useFollowerCounts() {
  // useSyncExternalStore gives every consumer the same module-level state
  // without re-fetching per component instance.
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
