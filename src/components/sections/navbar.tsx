"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-flow-black/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center">
            <img
              src="/logo-wide-cream.png"
              alt="flow+"
              className="h-7 w-auto"
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-flow-cream/60 hover:text-flow-cream transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#cta"
              className="bg-flow-blue text-white text-[15px] font-semibold px-5 py-2.5 rounded-full hover:bg-[#0056CC] transition-colors duration-200"
            >
              Start the flow
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-flow-cream/60 hover:text-flow-cream"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-flow-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-2xl font-bold text-flow-cream/80 hover:text-flow-cream transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#cta"
              className="bg-flow-blue text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-[#0056CC] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Start the flow
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
