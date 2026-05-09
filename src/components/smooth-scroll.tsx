"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

/**
 * Global smooth-scroll provider.
 * Mounts Lenis once on the client so the eased, continuous scrolling
 * applies to every section of the site (not just one).
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // lerp-based config feels snappier than duration-based.
      // Higher lerp = more responsive (less inertia). 0.12-0.15 is a good
      // "premium but snappy" range.
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
