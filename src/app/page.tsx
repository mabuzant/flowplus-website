"use client";

import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { PortfolioSection } from "@/components/sections/portfolio";
import { ProcessSection } from "@/components/sections/process";
import { AboutSection } from "@/components/sections/about";
import { CTASection } from "@/components/sections/cta";

export default function Home() {
  return (
    <main className="flex-1">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <div id="process">
        <ProcessSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="cta">
        <CTASection />
      </div>
    </main>
  );
}
