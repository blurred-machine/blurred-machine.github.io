import { useEffect, useState } from 'react';

/**
 * Returns scroll direction and a "scrolled past threshold" flag.
 * Used by the nav to hide on scroll-down / reveal on scroll-up.
 */
export default function useScrollDirection(threshold = 50) {
  const [direction, setDirection] = useState('up');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > threshold);
      if (Math.abs(y - lastY) > 6) {
        setDirection(y > lastY ? 'down' : 'up');
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { direction, scrolled };
}
