import { useEffect, useState } from 'react';
import Loader from './components/Loader.jsx';
import Nav from './components/Nav.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SideLeft from './components/SideLeft.jsx';
import SideRight from './components/SideRight.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import AroundTheWeb from './components/AroundTheWeb.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('pv-loaded') !== '1';
  });

  useEffect(() => {
    if (!isLoading) return;
    const t = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('pv-loaded', '1');
    }, 2000);
    return () => clearTimeout(t);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isLoading]);

  if (isLoading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-navy text-slate font-sans selection:bg-green selection:text-navy">
      {/* ---------- global background — fixed in viewport, behind everything ---------- */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* dotted mesh with combined edge fades (top + bottom + sides) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(100, 255, 218, 0.45) 1.3px, transparent 1.5px)',
            backgroundSize: '26px 26px',
            // mask = vertical fade × horizontal fade — dots dissolve at all 4 edges
            WebkitMaskImage: [
              'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            ].join(', '),
            WebkitMaskComposite: 'source-in',
            maskImage: [
              'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            ].join(', '),
            maskComposite: 'intersect',
          }}
        />

        {/* global ambient green — one soft uniform gradient covering the whole
            viewport. No localized hotspots, no visible edges. */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(circle at 85% 15%, rgba(100, 255, 218, 0.16) 0%, transparent 55%)',
              'radial-gradient(circle at 15% 85%, rgba(100, 255, 218, 0.10) 0%, transparent 55%)',
              'radial-gradient(circle at 50% 50%, rgba(100, 255, 218, 0.05) 0%, transparent 75%)',
            ].join(', '),
            filter: 'blur(40px)',
          }}
        />
      </div>

      <ScrollProgress />
      <Nav />
      <SideLeft />
      <SideRight />
      <main id="content" className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-12 md:px-24 lg:px-32">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <AroundTheWeb />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
