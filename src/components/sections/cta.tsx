"use client";

import { motion } from "framer-motion";
import { GlassButton, GlassFilter } from "@/components/ui/liquid-glass";
import { Phone } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export function CTASection() {
  return (
    <section className="relative bg-flow-black py-[120px] md:py-[160px] overflow-hidden">
      <GlassFilter />

      {/* Subtle purple glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[50vh]"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% -5%, rgba(110,86,207,0.09) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 text-center">
        <motion.img
          src="/logo-wide-cream.png"
          alt="flow+"
          className="h-10 md:h-14 w-auto mx-auto mb-10"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.h2
          className="text-4xl md:text-5xl lg:text-[72px] font-bold tracking-[-0.035em] leading-[1.02] text-flow-cream max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Ready to flow?
        </motion.h2>

        <motion.p
          className="mt-6 text-lg leading-[1.68] text-flow-cream/50 max-w-[500px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Let&apos;s talk about what we can build, automate, or launch together.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <GlassButton href="https://instagram.com/itsflowplus">
            <span className="flex items-center gap-2 text-base font-semibold text-white whitespace-nowrap">
              <InstagramIcon className="w-4 h-4" />
              @itsflowplus
            </span>
          </GlassButton>

          <GlassButton href="tel:+971558461197">
            <span className="flex items-center gap-2 text-base font-semibold text-white whitespace-nowrap">
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              +971 55 846 1197
            </span>
          </GlassButton>
        </motion.div>

        {/* Footer credit */}
        <motion.p
          className="mt-16 text-[13px] text-flow-cream/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.5 }}
        >
          Prepared by Mohammad Abu Zant &middot; flow+
        </motion.p>
      </div>
    </section>
  );
}
