import React from "react";
import { Inbox, MessageCircle, CheckCircle2, Layers } from "lucide-react";

export default function StatsCards({ stats, loading }) {
  const cards = [
    { key: "new", label: "Nuevas", icon: Inbox, color: "text-blue-400", bg: "bg-blue-500/10" },
    { key: "contacted", label: "Contactadas", icon: MessageCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
    { key: "resolved", label: "Resueltas", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { key: "total", label: "Total", icon: Layers, color: "text-[#00E5FF]", bg: "bg-[#00E5FF]/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.key} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-sm">{c.label}</span>
              <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                <Icon size={16} className={c.color} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{loading ? "—" : stats[c.key] ?? 0}</p>
          </div>
        );
      })}
    </div>
  );
}