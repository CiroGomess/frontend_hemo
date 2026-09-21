"use client";

import { useEffect, useState } from "react";
import { fetchHemocentros, Hemocentro } from "@/services/api";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function HemocentrosPage() {
  const [hemocentros, setHemocentros] = useState<Hemocentro[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadoFilter, setEstadoFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [searchCidade, setSearchCidade] = useState("");

  const loadHemocentros = () => {
    setLoading(true);
    fetchHemocentros({
      estado: estadoFilter || undefined,
      tipo: tipoFilter || undefined,
      cidade: searchCidade || undefined,
    })
      .then((data) => setHemocentros(data))
      .catch((err) => console.error("Erro ao carregar hemocentros:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHemocentros();
  }, [estadoFilter, tipoFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-3xl">🏥</span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-2">
          Guia de Hemocentros e Postos de Coleta
        </h1>
        <p className="mt-3 text-zinc-600 text-base">
          Encontre onde doar sangue com segurança perto de você.
        </p>
      </div>

      {/* Controles de Filtro */}
      <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Estado (UF)
            </label>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-zinc-800 font-medium"
            >
              <option value="">Todos os Estados</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Tipo de Unidade
            </label>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-zinc-800 font-medium"
            >
              <option value="">Todos os Tipos</option>
              <option value="hemocentro">Hemocentros Regionais</option>
              <option value="hospital">Hospitais com Coleta</option>
              <option value="clinica">Clínicas e Bancos Privados</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Buscar por Cidade
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCidade}
                onChange={(e) => setSearchCidade(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadHemocentros()}
                placeholder="Ex: Campinas"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-zinc-800"
              />
              <button
                onClick={loadHemocentros}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Hemocentros */}
      {loading ? (
        <div className="text-center py-16 text-zinc-500">Carregando postos de coleta...</div>
      ) : hemocentros.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 text-zinc-500">
          Nenhum hemocentro encontrado com os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hemocentros.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 uppercase">
                    {item.tipo}
                  </span>
                  <span className="text-sm font-extrabold text-zinc-400">
                    {item.estado}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-zinc-900 leading-snug mb-2">
                  {item.nome}
                </h3>

                <p className="text-sm text-zinc-600 mb-2 flex items-start gap-2">
                  <span>📍</span> {item.endereco}, {item.cidade} - {item.estado}
                </p>

                <p className="text-sm text-zinc-600 mb-2 flex items-center gap-2">
                  <span>📞</span> {item.telefone}
                </p>

                <p className="text-xs text-zinc-500 flex items-center gap-2">
                  <span>🕒</span> {item.horario}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${item.nome} ${item.cidade} ${item.estado}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold text-center transition flex items-center justify-center gap-1.5"
                >
                  <span>🗺️</span> Rota Maps
                </a>
                <a
                  href={`tel:${item.telefone.replace(/\D/g, "")}`}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  Ligar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
