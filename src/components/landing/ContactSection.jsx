import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone, Loader2 } from "lucide-react";
// Use the local API endpoint instead of base44 for contact submissions
import { useToast } from "@/components/ui/use-toast";
import { useLang } from "@/lib/LanguageContext";

export default function ContactSection() {
  const { toast } = useToast();
  const { t } = useLang();
  const c = t.contact;
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sending, setSending] = useState(false);

  /** @param {{ target: { name: string, value: any } }} e */
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      /* @ts-ignore: import.meta.env may not be typed in JS files */
      const apiBase = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://127.0.0.1:4000' : '');
      const resp = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          message: form.message,
        })
      });
      if (!resp.ok) throw new Error('Failed to submit');
      toast({ title: c.successTitle, description: c.successDesc });
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch {
      toast({ title: c.errorTitle, description: c.errorDesc, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="py-28 bg-gradient-dark relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="line-accent mb-6" />
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4">
              {c.title} <span className="text-gradient-cyan">{c.titleHighlight}</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-10">{c.subtitle}</p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "pusloit@pulsoit.com", href: "mailto:pusloit@pulsoit.com" },
                { icon: Phone, label: "+584220075258", href: "tel:+584220075258" },
                { icon: MapPin, label: c.location },
              ].map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#00E5FF]" />
                  </div>
                  {href ? (
                    <a href={href} className="text-white/60 hover:text-[#00E5FF] transition-colors text-sm">{label}</a>
                  ) : (
                    <span className="text-white/60 text-sm">{label}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-white/50 text-sm mb-2">{c.name}</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:border-[#00E5FF]/40 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20 transition-colors text-sm"
                    placeholder={c.namePlaceholder} />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-2">{c.email}</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:border-[#00E5FF]/40 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20 transition-colors text-sm"
                    placeholder="tu@email.com" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-white/50 text-sm mb-2">{c.phone}</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:border-[#00E5FF]/40 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20 transition-colors text-sm"
                    placeholder="+58 4XX-XXXXXXX" />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-2">{c.service}</label>
                  <select name="service" value={form.service} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#00E5FF]/40 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20 transition-colors text-sm appearance-none">
                    <option value="" className="bg-[#0A1628]">{c.servicePlaceholder}</option>
                    {c.services.map((/** @type {string} */ s) => (
                      <option key={s} value={s} className="bg-[#0A1628]">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-2">{c.message}</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:border-[#00E5FF]/40 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20 transition-colors text-sm resize-none"
                  placeholder={c.messagePlaceholder} />
              </div>

              <button type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#00E5FF] text-[#0A1628] font-bold rounded-xl hover:bg-[#00B8D4] transition-all duration-300 hover:shadow-lg hover:shadow-[#00E5FF]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                {sending ? (
                  <><Loader2 size={18} className="animate-spin" />{c.sending}</>
                ) : (
                  <><Send size={18} />{c.send}</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}