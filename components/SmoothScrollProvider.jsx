"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // smoothness (higher = smoother)
      smooth: true,
      direction: 'vertical',
      gestureOrientation: 'vertical',
      smoothTouch: true,
      touchMultiplier: 0.1,
      wheelMultiplier: 0.2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Fix: Update Lenis on resize
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    // Fix: Update Lenis on popup/banner open/close (body class change)
    const observer = new MutationObserver(() => {
      lenis.resize();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => {
      lenis.destroy();
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);
  return children;
}