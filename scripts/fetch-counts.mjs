// =====================================================================
// scripts/fetch-counts.mjs
//
// Runs server-side (in GitHub Actions) every few hours. Fetches the live
// follower counts for every social platform directly — no CORS proxy
// needed since we're running in Node, not a browser. Writes results to
// public/follower-counts.json, which the React app loads at runtime.
//
// Why this exists: free public CORS proxies are unreliable from prod
// (rate-limited, Cloudflare-blocked, paywalled). Doing the fetch at
// build time on a schedule is the only reliable, free, OSS approach.
// =====================================================================

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const OUT = 'public/follower-counts.json';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// ---- helpers --------------------------------------------------------
const parseCompact = (s) => {
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

// Full browser fingerprint — Cloudflare-protected sites (Substack) require
// the Sec-Fetch-* signals to pass their bot check. With just UA + Accept,
// they 403 GitHub Actions IPs.
const BROWSER_HEADERS = {
  'User-Agent': UA,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

const fetchText = async (url, opts = {}) => {
  const res = await fetch(url, {
    headers: { ...BROWSER_HEADERS, ...(opts.headers || {}) },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
};

// ---- scrapers -------------------------------------------------------
const scrapers = {
  github: async () => {
    const r = await fetch('https://api.github.com/users/blurred-machine', {
      headers: { 'User-Agent': UA, Accept: 'application/vnd.github+json' },
    });
    if (!r.ok) throw new Error(`github ${r.status}`);
    const d = await r.json();
    return d.followers;
  },

  youtube: async () => {
    const html = await fetchText('https://www.youtube.com/@blurred_ai');
    const m =
      html.match(/"content":"([\d.,]+[KMB]?)\s*subscribers"/i) ||
      html.match(/([\d.,]+[KMB]?)\s+subscribers/i);
    if (!m) throw new Error('youtube: count not found');
    return parseCompact(m[1]);
  },

  medium: async () => {
    const html = await fetchText('https://medium.com/@blurred-machine');
    const m =
      html.match(/"followerCount":(\d+)/) ||
      html.match(/"socialStats":\{[^}]*"followerCount":(\d+)/);
    if (!m) throw new Error('medium: count not found');
    return parseInt(m[1], 10);
  },

  substack: async () => {
    // The main `/` is Cloudflare-blocked from CI runner IPs, but `/about`
    // serves the same "Over N subscribers" badge and is accessible.
    const html = await fetchText('https://blurredai.substack.com/about');
    const m =
      html.match(/Over\s+([\d,.]+[KM]?)\s+subscribers/i) ||
      html.match(/([\d,.]+[KM]?)\s+subscribers/i);
    if (!m) throw new Error('substack: count not found');
    return parseCompact(m[1]);
  },

  facebook: async () => {
    const profileUrl = 'https://www.facebook.com/profile.php?id=100095099018327';
    const pluginUrl = 'https://www.facebook.com/plugins/page.php?href=' + encodeURIComponent(profileUrl);
    const html = await fetchText(pluginUrl);
    const m = html.match(/(\d[\d,.\s  ]*[KM]?)\s+followers/i);
    if (!m) throw new Error('facebook: count not found');
    const n = parseCompact(m[1]);
    if (n == null || n < 100) throw new Error('facebook: implausible');
    return n;
  },

  instagram: async () => {
    const html = await fetchText('https://trendhero.io/api/get_er_reports?username=blurred_ai');
    const data = JSON.parse(html);
    const n = data?.preview?.user_info?.follower_count;
    if (!Number.isFinite(n) || n <= 0) throw new Error('instagram: no count');
    return n;
  },

  linkedin: async () => {
    const html = await fetchText('https://taplio.com/lookup/blurred-machine');
    const m =
      html.match(/"followerCount"\s*:\s*(\d+)/) ||
      html.match(/"followersCount"\s*:\s*(\d+)/);
    if (!m) throw new Error('linkedin: count not found');
    return parseInt(m[1], 10);
  },
};

// ---- driver ---------------------------------------------------------
const PLATFORMS = Object.keys(scrapers);

const main = async () => {
  console.log(`Fetching ${PLATFORMS.length} platforms…`);
  const result = { _updated: new Date().toISOString(), counts: {}, errors: {} };

  await Promise.all(
    PLATFORMS.map(async (id) => {
      try {
        const n = await scrapers[id]();
        if (Number.isFinite(n) && n >= 0) {
          result.counts[id] = n;
          console.log(`  ✓ ${id.padEnd(10)} ${n.toLocaleString('en-US')}`);
        } else {
          throw new Error('bad number');
        }
      } catch (e) {
        const msg = String(e?.message || e).slice(0, 100);
        result.errors[id] = msg;
        console.error(`  ✗ ${id.padEnd(10)} ${msg}`);
      }
    })
  );

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(result, null, 2) + '\n');
  console.log(`\nWrote ${OUT}`);
  console.log(`OK: ${Object.keys(result.counts).length} / ${PLATFORMS.length}`);

  // Exit non-zero only if EVERY platform failed (otherwise let CI commit
  // whatever partial result we have)
  if (Object.keys(result.counts).length === 0) {
    process.exit(1);
  }
};

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
