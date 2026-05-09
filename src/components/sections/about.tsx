"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "Abu Dhabi", label: "Based in" },
  { value: "6", label: "Service pillars" },
  { value: "24/7", label: "Automations running" },
  { value: "6 weeks", label: "Avg. delivery" },
];

export function AboutSection() {
  return (
    <section className="relative bg-flow-black py-[100px] md:py-[140px]">
      {/* Subtle purple glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[50vh]"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% -5%, rgba(110,86,207,0.09) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="mb-16 md:mb-24">
          <span className="eyebrow">why flow+</span>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-bold tracking-[-0.03em] leading-[1.06] text-flow-cream max-w-3xl">
            We built flow+ to fill a gap.
          </h2>
          <p className="mt-6 text-lg leading-[1.68] text-flow-cream/50 max-w-[600px]">
            A creative technology company born in Abu Dhabi. We build automation
            systems, AI products, digital content engines, and web experiences
            for businesses that want to move faster, look sharper, and grow
            smarter.
          </p>
        </div>

        {/* Philosophy quote */}
        <motion.div
          className="glass-tray-dark p-8 md:p-12 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.025em] leading-[1.2] text-flow-cream">
            &ldquo;The best technology disappears into the experience. The best
            design makes complexity feel simple. The best product makes you
            wonder how you ever lived without it.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm text-flow-cream/40 font-medium tracking-wide">
            — THE FLOW+ PRINCIPLE
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-tray-dark p-6 md:p-8 text-center"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="text-3xl md:text-4xl font-bold text-flow-cream tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-flow-cream/40 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Differentiators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "We ship, not consult.",
              desc: "Every engagement ends with something real and working.",
            },
            {
              title: "We think in systems.",
              desc: "Everything we build compounds over time. Not tasks — systems.",
            },
            {
              title: "Apple-level discipline.",
              desc: "Aesthetic precision in everything we touch. No exceptions.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="glass-tray-dark p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h3 className="text-xl font-bold text-flow-cream mb-2">
                {item.title}
              </h3>
              <p className="text-[17px] leading-[1.68] text-flow-cream/50">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
