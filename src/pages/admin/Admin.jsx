import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/adminApi";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, ChevronLeft, ChevronRight, Search } from "lucide-react";
import StatsCards from "@/components/admin/StatsCards";
import ContactoTable from "@/components/admin/ContactoTable";
import ContactoDetail from "@/components/admin/ContactoDetail";
import FilterBar from "@/components/admin/FilterBar";

const LOGO =
  "https://media.base44.com/images/public/6a3931edbedfeb772a963c37/0630e86cd_Pulsosmbolopararedessociales-Photoroom.png";

export default function Admin() {
  const { user, logout } = useAdminAuth();
  const { toast } = useToast();

  const [contactos, setContactos] = useState([]);
  const [stats, setStats] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [estado, setEstado] = useState("all");

  // Debounce de la búsqueda
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset de página al cambiar búsqueda
  useEffect(() => {
    setPage(1);
  }, [search]);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await adminApi.getStats();
      setStats(data);
    } catch {
      // silencioso
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadContactos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getContactos({ search, page, estado });
      setContactos(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [search, page, estado, toast]);

  useEffect(() => {
    loadContactos();
  }, [loadContactos]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleUpdateEstado = async (id, nuevoEstado) => {
    try {
      await adminApi.updateEstado(id, nuevoEstado);
      toast({ title: "Estado actualizado" });
      loadContactos();
      loadStats();
      setSelected((s) => (s && s.id === id ? { ...s, estado: nuevoEstado } : s));
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteContacto(id);
      toast({ title: "Solicitud eliminada" });
      setSelected(null);
      loadContactos();
      loadStats();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="border-b border-white/5 bg-[#0A1628]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="PULSO IT" className="w-9 h-9 object-contain" />
            <div>
              <h1 className="font-heading font-bold text-white leading-tight">PULSO IT — Admin</h1>
              <p className="text-white/40 text-xs">Gestión de solicitudes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-sm hidden sm:block">{user?.email}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-[#00E5FF]/30 text-sm transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <StatsCards stats={stats} loading={statsLoading} />
        <FilterBar
          estado={estado}
          setEstado={setEstado}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        <ContactoTable contactos={contactos} loading={loading} onSelect={setSelected} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-white/40 text-sm">{total} solicitudes en total</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-white/50 text-sm">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {selected && (
        <ContactoDetail
          contacto={selected}
          onClose={() => setSelected(null)}
          onUpdateEstado={handleUpdateEstado}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}