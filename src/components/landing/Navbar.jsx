import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const navLinks = [
    { label: t.nav.inicio, href: "#inicio" },
    { label: t.nav.servicios, href: "#servicios" },
    { label: t.nav.nosotros, href: "#nosotros" },
    { label: t.nav.proceso, href: "#proceso" },
    { label: t.nav.contacto, href: "#contacto" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A1628]/95 backdrop-blur-xl border-b border-[#00E5FF]/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        <a href="#inicio" className="flex items-center gap-3 group">
          <img src="https://media.base44.com/images/public/6a3931edbedfeb772a963c37/0630e86cd_Pulsosmbolopararedessociales-Photoroom.png" alt="PULSO IT Logo" className="w-10 h-10 object-contain" />
          <span className="font-heading font-bold text-lg text-white tracking-tight hidden sm:block">
            PULSO<span className="text-[#00E5FF] ml-1">IT</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-[#00E5FF] transition-colors duration-300 rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 transition-all text-sm font-semibold text-white/70 hover:text-[#00E5FF]"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white/80 hover:text-[#00E5FF] transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A1628]/98 backdrop-blur-xl border-t border-[#00E5FF]/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-white/80 hover:text-[#00E5FF] hover:bg-white/5 rounded-lg transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}