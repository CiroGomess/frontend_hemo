"use client";

import { useEffect, useState } from "react";
import { fetchDonors, Donor } from "@/services/api";

const TIPOS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "NS"];
const UFS = [
  "", "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function DoadoresPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filtros
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");

  const loadData = () => {
    setLoading(true);
    fetchDonors({
      search: search || undefined,
      tipo: tipo || undefined,
      estado: estado || undefined,
      page,
      pageSize: 10,
    })
      .then((res) => {
        setDonors(res.items);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch((err) => console.error("Erro ao carregar doadores:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page, tipo, estado]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleExportJSON = () => {
    // Exporta todos os doadores carregados em formato JSON estruturado
    const payload = {
      tabela: "DOADORES",
      sistema: "HemoAlerta",
      exportadoEm: new Date().toISOString(),
      total: donors.length,
      doadores: donors,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hemoalerta-doadores-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            Painel de Voluntários
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Total de {total} voluntários cadastrados. Dados protegidos por sigilo LGPD.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-2 shadow-xs w-fit"
        >
          <span>📥</span> Exportar Dados (JSON)
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Buscar Voluntário ou Cidade
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex: Carlos ou Campinas..."
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
              >
                Filtrar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Tipo Sanguíneo
            </label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800 font-bold"
            >
              <option value="">Todos os tipos</option>
              {TIPOS.filter(Boolean).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Estado (UF)
            </label>
            <select
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
            >
              <option value="">Todos os estados</option>
              {UFS.filter(Boolean).map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Tabela de Doadores */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-extrabold uppercase tracking-wider text-zinc-600">
                <th className="py-4 px-6">Doador</th>
                <th className="py-4 px-4 text-center">Tipo</th>
                <th className="py-4 px-6">Cidade / UF</th>
                <th className="py-4 px-6">WhatsApp (LGPD)</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-600 font-medium">
                    Carregando voluntários da base...
                  </td>
                </tr>
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-600 font-medium">
                    Nenhum doador encontrado para os filtros informados.
                  </td>
                </tr>
              ) : (
                donors.map((d) => (
                  <tr key={d.id} className="hover:bg-rose-50/30 transition">
                    <td className="py-4 px-6 font-bold text-zinc-900">
                      <div>{d.nomeCompleto}</div>
                      {d.emailExibicao && (
                        <div className="text-xs text-zinc-600 font-normal font-mono">
                          {d.emailExibicao}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-red-100 text-red-700 font-black text-xs border border-red-200">
                        {d.tipoSanguineo}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-700 font-medium">
                      {d.cidade} <span className="text-zinc-600 font-bold">/ {d.estado}</span>
                    </td>
                    <td className="py-4 px-6 text-zinc-600 font-mono text-xs" title="Protegido por LGPD">
                      {d.whatsappExibicao || d.whatsapp}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {d.optInAlertas ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600">
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right text-xs text-zinc-600">
                      {d.dataCadastro ? new Date(d.dataCadastro).toLocaleDateString("pt-BR") : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between">
          <div className="text-xs text-zinc-600 font-medium">
            Página {page} de {totalPages} • Total: {total} voluntários
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-4 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
