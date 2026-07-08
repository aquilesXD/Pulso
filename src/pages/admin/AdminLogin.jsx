import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Lock, Mail, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";

const LOGO =
  "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/0630e86cd_Pulsosmbolopararedessociales-Photoroom.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={LOGO} alt="PULSO IT" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="font-heading font-black text-2xl text-white">Panel de Administración</h1>
          <p className="text-white/40 text-sm mt-1">Inicia sesión para gestionar las solicitudes</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-white/50 text-sm mb-2">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:border-[#00E5FF]/40 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20 text-sm"
                placeholder="admin@pulsoit.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/50 text-sm mb-2">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:border-[#00E5FF]/40 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-[#00E5FF] text-[#0A1628] font-bold rounded-xl hover:bg-[#00B8D4] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : "Iniciar sesión"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#00E5FF] text-sm transition-colors">
            <ArrowLeft size={14} /> Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}