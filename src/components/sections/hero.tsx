"use client";

import LiquidMetalHero from "@/components/ui/liquid-metal-hero";

export function HeroSection() {
  return (
    <LiquidMetalHero
      badge="✦ Abu Dhabi · Built for the Region"
      title={<>Everything your business<br />needs to move.</>}
      subtitle="Automation. AI. Web. Content. We build systems that think, move, and grow with you."
      primaryCtaLabel="Start the flow"
      secondaryCtaLabel="See what we build"
      onPrimaryCtaClick={() => {
        const el = document.getElementById("cta");
        el?.scrollIntoView({ behavior: "smooth" });
      }}
      onSecondaryCtaClick={() => {
        const el = document.getElementById("services");
        el?.scrollIntoView({ behavior: "smooth" });
      }}
      features={[
        "Automation & AI Systems",
        "Web & Digital Products",
        "Content & Growth Engines",
      ]}
    />
  );
}
