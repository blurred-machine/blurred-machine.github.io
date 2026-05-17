// =====================================================================
// Social platforms — single source of truth.
//
// Honest data model:
//   - liveStrategy: name of the scraper/API used to fetch the count.
//     null = no public way to fetch — value stays as `verified` or null.
//   - verified: { count, date } — manual fallback. Shown with VERIFIED
//     badge when live fails OR when no strategy exists.
//   - metric: what the number represents.
//   - excludeFromTotal: not summed into the aggregate.
//
// Currently fetchable:
//   - GitHub        (api.github.com — official, no key)
//   - YouTube       (scraped from channel page)
//   - Medium        (scraped from profile page, exact count)
//   - Substack      (scraped from publication page meta, "Over X")
//   - Facebook      (scraped from Page Plugin widget, exact count)
//
// Not publicly fetchable (login required):
//   - Instagram     (count hidden from logged-out HTML)
//   - LinkedIn      (proxy + login walls)
//
// For those two: add { count, date } under `verified` to display a
// VERIFIED badge with your real number, or leave verified: null to
// display "—" (no fabricated count).
// =====================================================================

export const SOCIALS = [
  {
    id: 'github',
    name: 'GitHub',
    handle: 'blurred-machine',
    url: 'https://github.com/blurred-machine',
    liveStrategy: 'github-api',
    metric: 'followers',
    verified: null,
    primary: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@blurred_ai',
    url: 'https://www.youtube.com/@blurred_ai',
    liveStrategy: 'youtube-scrape',
    metric: 'subscribers',
    verified: { count: 6220, date: '2026-05-17' },
    primary: true,
  },
  {
    id: 'medium',
    name: 'Medium',
    handle: '@blurred-machine',
    url: 'https://medium.com/@blurred-machine',
    liveStrategy: 'medium-scrape',
    metric: 'followers',
    verified: { count: 1628, date: '2026-05-17' },
    primary: true,
  },
  {
    id: 'substack',
    name: 'Substack',
    handle: 'blurredai',
    url: 'https://blurredai.substack.com',
    liveStrategy: 'substack-scrape',
    metric: 'subscribers',
    verified: { count: 2000, date: '2026-05-16' },
    primary: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Paras Varshney',
    url: 'https://www.facebook.com/profile.php?id=100095099018327',
    liveStrategy: 'facebook-plugin-scrape',
    metric: 'followers',
    verified: { count: 17872, date: '2026-05-16' },
    primary: true,
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    handle: 'blurredmachine',
    url: 'https://www.kaggle.com/blurredmachine',
    liveStrategy: null, // React-rendered, no scrapable count in SSR HTML
    metric: 'rank',
    verified: { count: null, badge: '#63 · Master Tier', date: '2024-04-01' },
    excludeFromTotal: true,
    primary: false,
  },

  // Instagram and LinkedIn both block direct anonymous access to follower
  // counts, but Bing's index of those pages exposes the numbers in its
  // search snippets. We scrape Bing's HTML and parse the follower line
  // out of the relevant profile snippet.
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@blurred_ai',
    url: 'https://www.instagram.com/blurred_ai',
    liveStrategy: 'trendhero-instagram', // free public API, exact count
    metric: 'followers',
    verified: { count: 210691, date: '2026-05-16' },
    primary: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'in/blurred-machine',
    url: 'https://www.linkedin.com/in/blurred-machine',
    liveStrategy: 'taplio-linkedin', // free public API via taplio.com, exact count
    metric: 'followers',
    verified: { count: 11519, date: '2026-05-16' },
    primary: true,
  },
];

export const SOCIALS_BY_ID = Object.fromEntries(SOCIALS.map((s) => [s.id, s]));
export const PRIMARY_SOCIALS = SOCIALS.filter((s) => s.primary);
