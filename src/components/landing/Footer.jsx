import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer className="bg-[#060E1A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="https://media.base44.com/images/public/6a3931edbedfeb772a963c37/0630e86cd_Pulsosmbolopararedessociales-Photoroom.png" alt="PULSO IT Logo" className="w-10 h-10 object-contain" />
              <span className="font-heading font-bold text-lg text-white tracking-tight">
                PULSO<span className="text-[#00E5FF] ml-1">IT</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">{f.tagline}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{f.navigation}</h4>
            <ul className="space-y-2">
              {f.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-white/40 hover:text-[#00E5FF] transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{f.services}</h4>
            <ul className="space-y-2">
              {f.serviceLinks.map((s) => (
                <li key={s}>
                  <a href="#servicios" className="text-white/40 hover:text-[#00E5FF] transition-colors text-sm">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{f.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-[#00E5FF] shrink-0" />
                <a href="mailto:info@pulsoit.com" className="text-white/40 hover:text-[#00E5FF] transition-colors text-sm">info@pulsoit.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-[#00E5FF] shrink-0" />
                <a href="tel:+584120000000" className="text-white/40 hover:text-[#00E5FF] transition-colors text-sm">+58 412-0000000</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#00E5FF] shrink-0 mt-0.5" />
                <span className="text-white/40 text-sm">Venezuela</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} PULSO Information Technology, C.A. {f.rights}
          </p>
          <p className="text-[#00E5FF]/40 text-xs font-medium">{f.slogan}</p>
        </div>
      </div>
    </footer>
  );
}