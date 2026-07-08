import React from "react";
import { Search } from "lucide-react";

const filters = [
  { key: "all", label: "Todas" },
  { key: "new", label: "Nuevas" },
  { key: "contacted", label: "Contactadas" },
  { key: "resolved", label: "Resueltas" },
];

export default function FilterBar({ estado, setEstado, searchInput, setSearchInput }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setEstado(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              estado === f.key
                ? "bg-[#00E5FF] text-[#0A1628]"
                : "bg-white/5 text-white/60 border border-white/10 hover:border-[#00E5FF]/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="relative sm:w-72">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar nombre o email..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:border-[#00E5FF]/40 focus:outline-none"
        />
      </div>
    </div>
  );
}