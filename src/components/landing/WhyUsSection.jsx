import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, Lightbulb, HeartHandshake, Rocket, Lock } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const icons = [ShieldCheck, Clock, Lightbulb, HeartHandshake, Rocket, Lock];

export default function WhyUsSection() {
  const { t } = useLang();

  return (
    <section className="py-28 bg-gradient-dark relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="line-accent mx-auto mb-6" />
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            {t.whyUs.title} <span className="text-gradient-cyan">{t.whyUs.titleHighlight}</span>{t.whyUs.titleEnd}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {t.whyUs.subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.whyUs.reasons.map(({ title, description }, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00E5FF]/20 hover:bg-white/[0.05] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#00E5FF]/20 transition-colors">
                  <Icon size={22} className="text-[#00E5FF]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}