import { useEffect, useState } from 'react';

const CACHE_KEY = 'pv-medium-cache-v1';
const CACHE_TTL = 30 * 60 * 1000; // 30 min
const FEED_URL = 'https://medium.com/feed/@blurred-machine';
const ENDPOINT = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`;

const ENTITIES = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&#8217;': '’',
  '&#8216;': '‘',
  '&#8220;': '“',
  '&#8221;': '”',
  '&#8211;': '–',
  '&#8212;': '—',
  '&#8230;': '…',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
};

const decodeEntities = (s) => {
  let out = s.replace(/&[a-zA-Z]+;|&#\d+;/g, (m) => ENTITIES[m] ?? m);
  // numeric entities not in the map
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
  return out;
};

const stripHtml = (html = '') =>
  decodeEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\s+/g, ' ')
    .trim();

const extractThumb = (item) => {
  if (item.thumbnail && item.thumbnail.startsWith('http')) return item.thumbnail;
  const html = item['content:encoded'] || item.description || '';
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return m ? m[1] : null;
};

/**
 * Fetches @blurred-machine's Medium feed via rss2json.
 * Returns { status, posts, error }. Posts are normalized + cached
 * in sessionStorage so refreshes don't re-fetch.
 */
export default function useMediumPosts(limit = 4) {
  const [state, setState] = useState({ status: 'loading', posts: [], error: null });

  useEffect(() => {
    let cancelled = false;

    const apply = (posts, status = 'ready') => {
      if (cancelled) return;
      setState({ status, posts: posts.slice(0, limit), error: null });
    };

    // 1. cache check
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, posts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && Array.isArray(posts) && posts.length) {
          apply(posts);
          return;
        }
      }
    } catch {
      // ignore
    }

    // 2. live fetch
    (async () => {
      try {
        const res = await fetch(ENDPOINT);
        if (!res.ok) throw new Error(`rss2json ${res.status}`);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error(data.message || 'feed error');

        const posts = (data.items || []).map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          thumbnail: extractThumb(item),
          description: stripHtml(item.description).slice(0, 220),
          categories: Array.isArray(item.categories) ? item.categories : [],
        }));

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), posts }));
        } catch {
          // ignore quota errors
        }
        apply(posts);
      } catch (e) {
        if (cancelled) return;
        setState({ status: 'error', posts: [], error: String(e.message || e) });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}
