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
            <p className="text-white/40 text-sm leading-relaxed mb-5">{f.tagline}</p>
            <div className="flex items-center gap-3">
              <a href="https://www.tiktok.com/@pulso.it6" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
              </a>
              <a href="https://www.instagram.com/pulso.it" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
              </a>
              <a href="https://www.facebook.com/people/Pulso-Information-Technology/61591152032942/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
              </a>
              <a href="https://api.whatsapp.com/send?phone=584220075258" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.06 24l1.68-6.16A11.87 11.87 0 0 1 .16 11.9C.16 5.34 5.5 0 12.06 0a11.82 11.82 0 0 1 8.42 3.5 11.82 11.82 0 0 1 3.49 8.42c0 6.56-5.34 11.9-11.9 11.9a11.9 11.9 0 0 1-5.7-1.45L.06 24zm6.6-3.8l.36.22a9.86 9.86 0 0 0 5.03 1.38 9.9 9.9 0 0 0 9.9-9.9 9.86 9.86 0 0 0-2.9-7A9.82 9.82 0 0 0 12.06 2a9.9 9.9 0 0 0-9.9 9.9c0 1.86.52 3.67 1.5 5.24l.24.38-1 3.64 3.76-.97zm11.07-5.46c-.09-.15-.33-.24-.69-.42-.36-.18-2.12-1.05-2.45-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.9-1.79-1.07-.95-1.79-2.13-2-2.49-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.29-.71-.59-.61-.81-.62l-.69-.01c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3 0 1.77 1.29 3.48 1.47 3.72.18.24 2.53 3.86 6.13 5.41.86.37 1.53.59 2.05.76.86.27 1.65.23 2.27.14.69-.1 2.12-.87 2.42-1.71.3-.84.3-1.56.21-1.71z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{f.navigation}</h4>
            <ul className="space-y-2">
              {f.links.map((/** @type {{ href: string; label: string }} */ link) => (
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
              {f.serviceLinks.map((/** @type {string} */ s) => (
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
                <a href="mailto:pulsoit@gmail.com" className="text-white/40 hover:text-[#00E5FF] transition-colors text-sm">pulsoit@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-[#00E5FF] shrink-0" />
                <a href="tel:+584220075258" className="text-white/40 hover:text-[#00E5FF] transition-colors text-sm">+584220075258</a>
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