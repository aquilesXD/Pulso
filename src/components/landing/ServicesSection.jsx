import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Globe, Bot, MonitorCog, ChevronDown, CheckCircle2, Shield, Headphones, Lightbulb, Code, Network } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const services = [
  {
    icon: Wrench,
    title: "Soporte Técnico",
    subtitle: "Especializado y preventivo",
    description:
      "Garantizamos la continuidad operativa con soporte técnico de alto nivel para los sectores comercial e industrial.",
    features: [
      "Soporte técnico especializado y mantenimiento preventivo",
      "Desarrollo de software a medida y APIs",
      "Diseño de redes y consultoría tecnológica",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/09cecdc1b_10.png",
  },
  {
    icon: Globe,
    title: "Desarrollo Web",
    subtitle: "Sitios profesionales",
    description:
      "Creamos sitios web responsivos, optimizados para SEO y velocidad, con integración de e-commerce y pasarelas de pago.",
    features: [
      "Diseño UI/UX personalizado",
      "Desarrollo de sitio web responsivo",
      "Integración de CMS (WordPress, etc.)",
      "Optimización SEO y de velocidad",
      "Integración de e-commerce y pasarelas de pago",
      "Autenticación segura",
      "Despliegue en la nube y mantenimiento",
    ],
    ideal: [
      "Emprendedores y startups",
      "Empresas que buscan presencia digital",
      "Negocios e-commerce",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/396c82d96_4.png",
  },
  {
    icon: Bot,
    title: "Automatizaciones",
    subtitle: "Optimiza tu negocio",
    description:
      "Implementamos flujos de trabajo automatizados con tecnologías líderes como N8N, Microsoft Power Platform y agentes de IA.",
    features: [
      "Flujos de trabajo automatizados (e-commerce, CRM)",
      "Workflows de procesos empresariales end-to-end",
      "Desarrollo robusto en N8N (soluciones Open-Source)",
      "Microsoft Power Platform: PowerBI, PowerApps, PowerAutomate",
      "Integraciones con Agentes de IA",
    ],
    ideal: [
      "Dueños de negocios que buscan eficiencia",
      "Gerentes de operaciones con cuellos de botella",
      "Startups en crecimiento",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/fe5dfd68a_3.png",
  },
  {
    icon: MonitorCog,
    title: "Reparación y Diagnóstico",
    subtitle: "Presencial",
    description:
      "Evaluación completa de equipos, limpieza de hardware, resolución de errores de software e instalación de programas.",
    features: [
      "Evaluación completa del equipo",
      "Limpieza básica de hardware",
      "Resolución de errores de software",
      "Instalación de programas básicos",
    ],
    modal: "Presencial (en domicilio o empresa)",
    ideal: [
      "Usuarios con equipos lentos",
      "Fallos recurrentes",
      "Pantallas congeladas",
      "Software que no inicia",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/fd15148c0_2.png",
  },
  {
    icon: Shield,
    title: "Mantenimiento Preventivo",
    subtitle: "Presencial",
    description:
      "Limpieza y optimización profunda del sistema para extender la vida útil de tu equipo y mantenerlo libre de virus.",
    features: [
      "Limpieza profunda del sistema operativo",
      "Eliminación de archivos basura y cachés",
      "Actualización y optimización de antivirus",
    ],
    modal: "Presencial (en domicilio o empresa)",
    ideal: [
      "Para quienes desean extender la vida útil de su PC",
      "Usuarios que notan lentitud y quieren recuperar velocidad",
      "Personas que buscan un rendimiento óptimo y sin virus",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/4b01d63a0_7.png",
  },
  {
    icon: Headphones,
    title: "Plan de Soporte Remoto Mensual",
    subtitle: "100% remoto",
    description:
      "Hasta 3 sesiones de soporte remoto al mes con resolución de problemas comunes, optimización y soporte multi-dispositivo.",
    features: [
      "Hasta 3 sesiones de soporte remoto al mes",
      "Resolución de problemas comunes: lentitud, errores, actualizaciones",
      "Optimización y mantenimiento del sistema",
      "Soporte multi-dispositivo",
    ],
    modal: "Soporte 100% remoto (vía control remoto)",
    ideal: [
      "Negocios con 1 a 5 equipos",
      "Empresas sin personal técnico interno",
      "Usuarios que necesitan soporte rápido y flexible",
      "Quienes buscan mantenimiento preventivo y correctivo de bajo costo",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/593329531_8.png",
  },
  {
    icon: Lightbulb,
    title: "Asesoría Tecnológica",
    subtitle: "Presencial o remoto",
    description:
      "Recomendaciones personalizadas de compra, configuración avanzada de sistemas y asesoría sobre uso seguro de la tecnología.",
    features: [
      "Recomendaciones de compra personalizadas",
      "Configuración avanzada de sistemas y dispositivos",
      "Asesoría especializada sobre uso seguro de tecnología",
    ],
    modal: "Presencial o remoto (a elección)",
    ideal: [
      "Personas por adquirir nuevos equipos y quieren invertir bien",
      "Usuarios que buscan mejorar y proteger su entorno digital",
      "Emprendedores que necesitan optimizar sus herramientas",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/34268f578_5.jpg",
  },
  {
    icon: Code,
    title: "Desarrollo de API REST",
    subtitle: "Personalizadas",
    description:
      "Diseño y arquitectura de APIs robustas con autenticación OAuth2/JWT, documentación Swagger y despliegue en la nube.",
    features: [
      "Diseño y arquitectura de API REST",
      "Integración de bases de datos segura",
      "Documentación interactiva (Swagger)",
      "Pruebas de rendimiento y seguridad",
      "Autenticación (OAuth2, JWT)",
      "Despliegue en la nube",
      "Escalabilidad y mantenimiento continuo",
    ],
    ideal: [
      "Startups que necesitan un backend robusto",
      "Empresas integrando múltiples sistemas",
      "Desarrolladores que buscan un API de terceros",
      "E-commerce y aplicaciones móviles",
      "Negocios con necesidad de automatización",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/c9f6bc6cd_APIrest.png",
  },
  {
    icon: Network,
    title: "Configuración de Red Básica",
    subtitle: "Presencial",
    description:
      "Instalación de router de alto rendimiento, conexión para todos los dispositivos, impresoras compartidas y red local optimizada.",
    features: [
      "Instalación de un router de alto rendimiento",
      "Conexión para todos los dispositivos",
      "Configuración de impresoras compartidas",
      "Creación y optimización de una red local",
    ],
    modal: "Presencial (diseñado para empresas y hogares)",
    ideal: [
      "Hogares que necesitan cobertura Wi-Fi completa (sin zonas muertas)",
      "Empresas que requieren un trabajo en red eficiente",
      "Personas que buscan compartir archivos y equipos fácilmente",
      "Usuarios que deseen una conexión a internet más rápida y estable",
    ],
    image: "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/d890b1c80_6.png",
  },
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
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}