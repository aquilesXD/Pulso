import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, Users, Cpu, TrendingUp } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const ABOUT_IMG = "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/bc803fd34_generated_16ef134e.png";

export default function AboutSection() {
  const { t } = useLang();
  const a = t.about;

  const stats = [
    { icon: Target, value: "100%", label: a.stat1 },
    { icon: Users, value: "Sectores", label: a.stat2 },
    { icon: Cpu, value: "Remoto", label: a.stat3 },
    { icon: TrendingUp, value: "Alto", label: a.stat4 },
  ];

  return (
    <section id="nosotros" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0D1F3C]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="line-accent mb-6" />
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
              {a.title}{" "}
              <span className="text-gradient-cyan">{a.titleHighlight}</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              {(() => {
                const parts = a.p1.split("PULSO Information Technology, C.A.");
                return (
                  <>
                    {parts[0]}
                    <strong className="text-white">PULSO Information Technology, C.A.</strong>
                    {parts[1]}
                  </>
                );
              })()}
            </p>
            <p className="text-white/50 text-base leading-relaxed mb-8">{a.p2}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                    <Target size={18} className="text-[#00E5FF]" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">{a.mision}</h3>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{a.misionText}</p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                    <Eye size={18} className="text-[#00E5FF]" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">{a.vision}</h3>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{a.visionText}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#00E5FF]/20 transition-colors"
                >
                  <Icon size={20} className="text-[#00E5FF] mb-2" />
                  <p className="text-white font-bold text-lg">{value}</p>
                  <p className="text-white/40 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden glow-cyan">
              <img
                src={ABOUT_IMG}
                alt="Espacio de trabajo tecnológico"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <img src="https://media.base44.com/images/public/6a3931edbedfeb772a963c37/0630e86cd_Pulsosmbolopararedessociales-Photoroom.png" alt="PULSO IT Logo" className="w-16 h-16 object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}