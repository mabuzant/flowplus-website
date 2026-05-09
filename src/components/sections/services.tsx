"use client";

import { motion } from "framer-motion";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import {
  Workflow,
  Globe,
  PenTool,
  Brain,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";

const services = [
  {
    eyebrow: "flow automation",
    title: "Stop doing manually what machines can do better.",
    description:
      "n8n workflows, AI agents, CRM pipelines, business process automation. We map your workflows and replace repetitive touchpoints with intelligent automations that run 24/7.",
    icon: Workflow,
  },
  {
    eyebrow: "flow web",
    title: "Websites that convert. Not just exist.",
    description:
      "Fast, clean, conversion-focused websites, landing pages, and web apps. Every pixel deliberate. Every interaction intentional.",
    icon: Globe,
  },
  {
    eyebrow: "flow content",
    title: "Content that flows. Consistently.",
    description:
      "AI-assisted content creation, UGC strategy, bilingual campaigns. Posting consistently while maintaining quality and voice — solved.",
    icon: PenTool,
  },
  {
    eyebrow: "flow AI",
    title: "Custom intelligence. Built for your business.",
    description:
      "Custom AI tools, LLM integrations, AI-powered product features. We build the tool. We train the model. We ship it.",
    icon: Brain,
  },
  {
    eyebrow: "flow order",
    title: "WhatsApp commerce. Automated.",
    description:
      "WhatsApp-based ordering and commerce automation. Your customers already live on WhatsApp. Now your business does too.",
    icon: MessageSquare,
  },
  {
    eyebrow: "flow grid",
    title: "Your content engine. Managed.",
    description:
      "Content agency and UGC management. Strategy, production, scheduling — the full pipeline, handled.",
    icon: LayoutGrid,
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-flow-white py-[100px] md:py-[140px]"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section opener */}
        <div className="mb-16 md:mb-24">
          <span className="eyebrow">what we build</span>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-bold tracking-[-0.03em] leading-[1.06] text-flow-text max-w-3xl">
            What flows when we
            <br />
            work{" "}
            <PointerHighlight
              rectangleClassName="border-flow-blue"
              pointerClassName="text-flow-blue"
            >
              <span>together.</span>
            </PointerHighlight>
          </h2>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.eyebrow}
                className="pento-card group"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-flow-off mb-5">
                  <Icon className="w-5 h-5 text-flow-blue" strokeWidth={1.5} />
                </div>
                <span className="eyebrow !mb-3">{service.eyebrow}</span>
                <h3 className="text-xl md:text-2xl font-bold tracking-[-0.02em] leading-[1.15] text-flow-text mb-3">
                  {service.title}
                </h3>
                <p className="text-[17px] leading-[1.68] text-flow-muted">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
