import React from "react";

const config = {
  new: { label: "Nueva", classes: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  contacted: { label: "Contactada", classes: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  resolved: { label: "Resuelta", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

export default function StatusBadge({ estado }) {
  const c = config[estado] || config.new;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${c.classes}`}
    >
      {c.label}
    </span>
  );
}