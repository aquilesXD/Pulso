import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Monitor } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const HERO_BG = "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/abc766b28_generated_086e6ce4.png";

export default function HeroSection() {
  const { t } = useLang();

  /** @param {string} id */
  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#/${id}`;
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="Fondo tecnológico" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 via-[#0A1628]/50 to-[#0A1628]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-[#00E5FF] text-sm font-medium tracking-wide">
              {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-black text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6"
          >
            {t.hero.title1}{" "}
            <span className="text-gradient-cyan">{t.hero.title2}</span>
            <br />
            <span className="text-white/90 text-3xl sm:text-4xl lg:text-5xl font-bold">
              {t.hero.title3}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed mb-10"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <button
              onClick={() => handleNavigate("contacto")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00E5FF] text-[#0A1628] font-bold text-base rounded-xl hover:bg-[#00B8D4] transition-all duration-300 hover:shadow-xl hover:shadow-[#00E5FF]/25 group"
            >
              {t.hero.cta}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleNavigate("servicios")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold text-base rounded-xl border border-white/10 hover:border-[#00E5FF]/30 hover:bg-white/10 transition-all duration-300"
            >
              {t.hero.ctaSecondary}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-8"
          >
            {[
              { icon: Shield, label: t.hero.badge1 },
              { icon: Zap, label: t.hero.badge2 },
              { icon: Monitor, label: t.hero.badge3 },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                  <Icon size={18} className="text-[#00E5FF]" />
                </div>
                <span className="text-white/50 text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A1628] to-transparent" />
    </section>
  );
}