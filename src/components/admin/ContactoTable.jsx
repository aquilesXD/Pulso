import React from "react";
import { Loader2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactoTable({ contactos, loading, onSelect }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#00E5FF]" size={28} />
      </div>
    );
  }

  if (contactos.length === 0) {
    return (
      <div className="text-center py-20 text-white/40 bg-white/[0.03] border border-white/10 rounded-xl">
        No hay solicitudes para mostrar.
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/40">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Servicio</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Fecha</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c)}
                className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-white font-medium">{c.nombre}</p>
                  <p className="text-white/40 text-xs">{c.email}</p>
                </td>
                <td className="px-4 py-3 text-white/60">{c.servicio}</td>
                <td className="px-4 py-3 text-white/60 hidden md:table-cell">{formatDate(c.created_at)}</td>
                <td className="px-4 py-3">
                  <StatusBadge estado={c.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}