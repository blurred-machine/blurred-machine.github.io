# Follower-count fetching — the honest setup

The pill at the top of the hero shows follower counts across 8
platforms, all fetched per page load via **100% free, open-source,
client-side approaches** — no API keys, no third-party SaaS, no
backend services.

## What's fetched live on every refresh

| Platform | Source | Reliability |
|---|---|---|
| **GitHub** | Official public API (`api.github.com/users/...`) | Always exact |
| **YouTube** | Scrape channel page meta via [corsproxy.io](https://corsproxy.io) | Exact (matches `"content":"X subscribers"`) |
| **Medium** | Scrape profile page JSON via corsproxy.io | Exact (matches `"followerCount":N`) |
| **Substack** | Scrape publication meta via corsproxy.io | Rounded ("Over X subscribers") |
| **Facebook** | Scrape FB Page Plugin widget via corsproxy.io | Exact |
| **Instagram** | Scrape Bing search snippet via corsproxy.io | **Stale** — see below |
| **LinkedIn** | Scrape Bing search snippet via corsproxy.io | **Stale** — see below |
| **Kaggle** | Manually maintained (#63 Master Tier) | Stable rank, no count |

All scrapers use `corsproxy.io` — a free open-source CORS proxy that
forwards browser requests to platforms that don't enable CORS
themselves. No keys, no auth, no cost.

## The Instagram and LinkedIn problem

Both platforms **gate follower counts behind login** on their own
domains. There is no public anonymous endpoint that returns the
count. I exhausted every free OSS option:

- **RSSHub** (`DIYgod/RSSHub`, 35K stars) — open-source RSS bridge.
  Has IG/LinkedIn routes, but they return feeds of posts, not
  follower counts. The count isn't in any RSS metadata.
- **rss-bridge** (`rss-bridge/rss-bridge`, 9K stars) — same outcome.
- **Instaloader / instagrapi / linkedin-api** — open-source Python
  scrapers, but require login cookies and a Python runtime. Not
  client-side, not lightweight.
- **Bing search scraping** — the current implementation. Bingbot has
  privileged crawl access and exposes counts in snippets. Works, but
  Bing's index of these pages can be **weeks to months stale** and
  Bing rotates which snippets it surfaces, so the numbers drift.

The fundamental problem: the major social platforms intentionally
prevent unauthenticated count fetching. No truly free OSS tool can
work around this.

## So how do you get accurate Instagram and LinkedIn numbers?

**The simplest, lightest path is the `verified` field in
`src/data/socials.js`.** It's literally one line per platform:

```js
{
  id: 'instagram',
  // ...
  verified: { count: 47000, date: '2026-05-16' },  // your real numbers
},
```

When `verified` is set, the pill shows it with a **VERIFIED Jan 2026**
badge — visually distinct from **LIVE**. The number is summed into
the total. You update it whenever your counts change meaningfully
(monthly is plenty for a personal site).

This is:
- **Free** — no service involved
- **Open source** — just data in your repo
- **Lightweight** — one line of JSON
- **Always correct** — you know your own numbers

The Bing scraper still runs in the background; if it manages to
return a sane number, it overrides the verified count and shows
LIVE. If it fails or returns a clearly stale number, the verified
count takes over.

## To update verified counts

1. Open [src/data/socials.js](src/data/socials.js)
2. Find the platform's entry
3. Update `verified: { count: N, date: 'YYYY-MM-DD' }` with your
   actual count and today's date
4. Save — the pill updates on next refresh

That's it. No API keys, no deployments, no rebuilds (Vite HMR picks
it up instantly in dev; build picks it up in production).

## How the fetch chain works (per platform)

```
[live strategy]  →  [verified fallback]  →  ["—" if neither]
       ↓                    ↓                      ↓
   shows LIVE         shows VERIFIED            shows nothing
```

- Each platform tries its live strategy once on mount
- Results cached in `sessionStorage` for 10 minutes
- Background refresh every 5 minutes if the tab stays open
- All fetches happen in parallel — slowest one doesn't block the others
- Graceful: a failed fetch never breaks the pill

## To remove a platform entirely

Delete its entry from the array in `src/data/socials.js`. The pill,
side rail, and footer all update automatically. The total
recalculates correctly.
