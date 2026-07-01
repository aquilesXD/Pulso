import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Cog, Rocket } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const icons = [MessageSquare, Search, Cog, Rocket];

export default function ProcessSection() {
  const { t } = useLang();

  return (
    <section id="proceso" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0D1F3C]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="line-accent mx-auto mb-6" />
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            {t.process.title} <span className="text-gradient-cyan">{t.process.titleHighlight}</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {t.process.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-14 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />

          {t.process.steps.map(({ title, description }, i) => {
            const Icon = icons[i];
            const number = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="text-center relative"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center mx-auto">
                    <Icon size={26} className="text-[#00E5FF]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#00E5FF] text-[#0A1628] text-xs font-bold flex items-center justify-center">
                    {number}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}