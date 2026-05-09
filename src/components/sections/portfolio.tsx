"use client";

import React from "react";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";

const portfolioImages = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Modern architecture — flow+ web project",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Digital dashboard — flow automation",
  },
  {
    src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Code interface — flow AI development",
  },
  {
    src: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Social media content — flow content",
  },
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Analytics dashboard — flow automation",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Team collaboration — flow+ studio",
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Workspace — flow+ creative technology",
  },
];

export function PortfolioSection() {
  React.useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <section id="portfolio" className="relative bg-flow-white">
      {/* Header area */}
      <div className="relative flex h-[50vh] items-center justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full blur-[30px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,122,255,0.07) 0%, transparent 50%)",
          }}
        />
        <div className="text-center px-6">
          <span className="eyebrow">our work</span>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-[64px] font-bold tracking-[-0.03em] leading-[1.06] text-flow-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            What we&apos;ve shipped.
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-flow-muted"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Scroll down to explore our portfolio.
          </motion.p>
        </div>
      </div>

      <ZoomParallax images={portfolioImages} />

      <div className="h-[20vh]" />
    </section>
  );
}
