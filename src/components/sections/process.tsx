"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Discover.",
    description:
      "We listen. We map your workflows, pain points, and goals. No template decks — just real understanding.",
  },
  {
    number: "02",
    title: "Design.",
    description:
      "We architect the system. Every automation, interface, and integration planned before a line of code is written.",
  },
  {
    number: "03",
    title: "Build.",
    description:
      "We ship. Fast iteration, modern tooling, no bureaucracy. Something real and working — every sprint.",
  },
  {
    number: "04",
    title: "Flow.",
    description:
      "We launch, monitor, and optimize. Your system runs 24/7. We stay until everything flows.",
  },
];

export function ProcessSection() {
  return (
    <section className="relative bg-flow-off py-[100px] md:py-[140px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16 md:mb-24">
          <span className="eyebrow">how we flow</span>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-bold tracking-[-0.03em] leading-[1.06] text-flow-text max-w-3xl">
            From idea to flow.
            <br />
            In four steps.
          </h2>
        </div>

        {/* Horizontal timeline on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Connector line — desktop only */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(100%+2px)] w-[calc(100%-36px)] h-px bg-flow-stroke" />
              )}

              <div className="flat-tray">
                <div className="text-4xl font-bold text-flow-blue/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold tracking-[-0.02em] text-flow-text mb-3">
                  {step.title}
                </h3>
                <p className="text-[17px] leading-[1.68] text-flow-muted">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
