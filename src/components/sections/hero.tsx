"use client";

import { GravitationalMesh } from "@/components/ui/gravitational-mesh";
import { GlassButton, GlassFilter } from "@/components/ui/liquid-glass";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-flow-black">
      {/* Interactive gravitational mesh — replaces the previous shader background */}
      <GravitationalMesh />
      <GlassFilter />

      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo */}
        <motion.img
          src="/logo-wide-cream.png"
          alt="flow+"
          className="h-12 md:h-16 w-auto mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Cinematic headline */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-[96px] font-bold tracking-[-0.04em] leading-[0.95] text-flow-cream max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          Everything your business
          <br />
          needs to move.
        </motion.h1>

        {/* Sub-text */}
        <motion.p
          className="text-lg md:text-xl text-flow-cream/50 max-w-[600px] leading-[1.68]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Automation. AI. Web. Content.
          <br />
          We build systems that think, move, and grow with you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="pointer-events-auto flex flex-wrap items-center justify-center gap-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassButton>
            <span className="text-base font-semibold text-white whitespace-nowrap">
              Start the flow
            </span>
          </GlassButton>

          <a
            href="#services"
            className="text-flow-cream/70 text-[15px] font-medium hover:text-flow-cream transition-colors duration-200"
          >
            See what we build &darr;
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: { delay: 1.5, duration: 2, repeat: Infinity },
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F5F1E8"
          strokeWidth="1.5"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
