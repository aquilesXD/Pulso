import React, { useState } from "react";
import { X, Mail, Phone, Calendar, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const estados = [
  { key: "new", label: "Nueva" },
  { key: "contacted", label: "Contactada" },
  { key: "resolved", label: "Resuelta" },
];

export default function ContactoDetail({ contacto, onClose, onUpdateEstado, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0D1F3C] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-heading font-bold text-xl text-white">{contacto.nombre}</h2>
            <div className="mt-2">
              <StatusBadge estado={contacto.estado} />
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <a
            href={`mailto:${contacto.email}`}
            className="flex items-center gap-3 text-white/60 text-sm hover:text-[#00E5FF] transition-colors"
          >
            <Mail size={16} className="text-[#00E5FF]" />
            {contacto.email}
          </a>
          {contacto.telefono && (
            <a
              href={`tel:${contacto.telefono}`}
              className="flex items-center gap-3 text-white/60 text-sm hover:text-[#00E5FF] transition-colors"
            >
              <Phone size={16} className="text-[#00E5FF]" />
              {contacto.telefono}
            </a>
          )}
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <Calendar size={16} className="text-[#00E5FF]" />
            {new Date(contacto.created_at).toLocaleString("es-VE")}
          </div>

          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Servicio</p>
            <p className="text-white text-sm">{contacto.servicio}</p>
          </div>

          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Mensaje</p>
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {contacto.mensaje}
            </p>
          </div>

          <div className="pt-2">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Cambiar estado</p>
            <div className="flex flex-wrap gap-2">
              {estados.map((e) => (
                <button
                  key={e.key}
                  onClick={() => onUpdateEstado(contacto.id, e.key)}
                  disabled={contacto.estado === e.key}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    contacto.estado === e.key
                      ? "bg-[#00E5FF] text-[#0A1628] border-[#00E5FF]"
                      : "bg-white/5 text-white/60 border-white/10 hover:border-[#00E5FF]/30"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">¿Confirmar eliminación?</span>
              <button
                onClick={() => onDelete(contacto.id)}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-white/40 text-xs hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-red-400/70 hover:text-red-400 text-sm transition-colors"
            >
              <Trash2 size={16} />
              Eliminar solicitud
            </button>
          )}
        </div>
      </div>
    </div>
  );
}