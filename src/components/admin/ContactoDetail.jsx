// @ts-nocheck
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const estadoOptions = [
  { value: "new", label: "Nueva" },
  { value: "contacted", label: "Contactada" },
  { value: "resolved", label: "Resuelta" },
];

export default function ContactoDetail({ contacto, onClose, onUpdateEstado, onDelete }) {
  const [updating, setUpdating] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState(contacto?.estado || "new");

  if (!contacto) return null;

  const handleEstadoChange = async (newEstado) => {
    setUpdating(true);
    try {
      await onUpdateEstado(contacto.id, newEstado);
      setSelectedEstado(newEstado);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) return;
    setUpdating(true);
    try {
      await onDelete(contacto.id);
      onClose();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={!!contacto} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0F172A] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detalle de Solicitud</DialogTitle>
          <DialogDescription className="text-white/60">
            Información completa del contacto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/40 mb-1 block">Nombre</label>
              <p className="text-white font-medium">{contacto.nombre}</p>
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">Email</label>
              <p className="text-white font-medium">{contacto.email}</p>
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">Teléfono</label>
              <p className="text-white font-medium">{contacto.phone || "—"}</p>
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">Servicio</label>
              <p className="text-white font-medium">{contacto.servicio}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-white/40 mb-1 block">Mensaje</label>
              <p className="text-white/80 bg-white/5 p-3 rounded-lg border border-white/10">
                {contacto.mensaje || "Sin mensaje"}
              </p>
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">Fecha</label>
              <p className="text-white font-medium">{formatDate(contacto.created_at)}</p>
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">Estado</label>
              <div className="flex items-center gap-2">
                <StatusBadge estado={contacto.estado} />
                <span className="text-xs text-white/40">({selectedEstado})</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <label className="text-sm text-white/40 mb-2 block">Cambiar Estado</label>
            <Select value={selectedEstado} onValueChange={handleEstadoChange} disabled={updating}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-white/10">
                {estadoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={updating}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
            >
              {updating ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Eliminar Solicitud
            </Button>
            <Button onClick={onClose} variant="outline" className="border-white/10 text-white hover:bg-white/5">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
