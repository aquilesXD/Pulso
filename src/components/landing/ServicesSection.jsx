import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Globe, Bot, MonitorCog, ChevronDown, CheckCircle2, Shield, Headphones, Lightbulb, Code, Network } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const services = [
  { id: "soporte", icon: Wrench, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/09cecdc1b_10.png" },
  { id: "web", icon: Globe, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/396c82d96_4.png" },
  { id: "automatizaciones", icon: Bot, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/fe5dfd68a_3.png" },
  { id: "reparacion", icon: MonitorCog, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/fd15148c0_2.png" },
  { id: "mantenimiento", icon: Shield, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/4b01d63a0_7.png" },
  { id: "soporte-remoto", icon: Headphones, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/593329531_8.png" },
  { id: "asesoria", icon: Lightbulb, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/34268f578_5.jpg" },
  { id: "api-rest", icon: Code, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/c9f6bc6cd_APIrest.png" },
  { id: "red", icon: Network, image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/d890b1c80_6.png" },
];

function ServiceCard({ service }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLang();
  const s = t.services;
  const Icon = service.icon;

  return (
    <div className="group relative rounded-2xl bg-gradient-card border-glow hover:border-[#00E5FF]/30 transition-all duration-500">
      <div className="relative h-52 overflow-hidden rounded-t-2xl">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/60 to-transparent" />
        <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-[#0A1628]/80 backdrop-blur-sm border border-[#00E5FF]/20 flex items-center justify-center">
          <Icon size={22} className="text-[#00E5FF]" />
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-heading font-bold text-xl text-white mb-1">{service.title}</h3>
        <p className="text-[#00E5FF] text-sm font-medium mb-3">{service.subtitle}</p>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{service.description}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-[#00E5FF] text-sm font-medium hover:text-[#00B8D4] transition-colors"
        >
          {expanded ? s.verMenos : s.verDetalles}
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-wider mb-3">
              {s.queIncluye}
            </p>
            <ul className="space-y-2 mb-4">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-white/60 text-sm">
                  <CheckCircle2 size={14} className="text-[#00E5FF] mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {service.modal && (
              <div className="mb-4">
                <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-wider mb-1">
                  {s.modalidad}
                </p>
                <p className="text-white/50 text-sm">{service.modal}</p>
              </div>
            )}
            {service.ideal && (
              <>
                <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-wider mb-2">
                  {s.paraQuien}
                </p>
                <ul className="space-y-1">
                  {service.ideal.map((i) => (
                    <li key={i} className="text-white/40 text-sm">
                      — {i}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const { t } = useLang();
  const merged = services.map((s) => {
    const tr = t.services.items.find((i) => i.id === s.id);
    return { ...s, ...tr };
  });
  return (
    <section id="servicios" className="py-28 bg-gradient-dark relative">
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
            {t.services.title} <span className="text-gradient-cyan">{t.services.titleHighlight}</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merged.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}