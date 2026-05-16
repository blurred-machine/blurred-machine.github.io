import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently in the viewport.
 * Uses IntersectionObserver with a band near the top of the screen so the
 * "active" section flips when the user crosses into it from above.
 */
export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry highest on the page that is currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        // A horizontal band near the top of the viewport — when a section
        // crosses this band it becomes "active". Bottom margin clipped so
        // only the top portion of the screen counts.
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
