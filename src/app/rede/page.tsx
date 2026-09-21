"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStats, StatsResponse } from "@/services/api";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function RedePage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Erro ao carregar estatísticas da rede:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-3xl">🗺️</span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-2">
          Rede Nacional de Cobertura
        </h1>
        <p className="mt-3 text-zinc-600 text-base">
          Distribuição dos doadores voluntários cadastrados nos 27 estados do Brasil.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm text-center">
          <div className="text-4xl font-black text-red-600 mb-1">
            {loading ? "..." : stats?.totalDoadores ?? 0}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Total de Doadores na Rede
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm text-center">
          <div className="text-4xl font-black text-emerald-600 mb-1">
            {loading ? "..." : stats?.doadoresAtivos ?? 0}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Prontos para Alertas Imediatos
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm text-center">
          <div className="text-4xl font-black text-amber-600 mb-1">
            {loading ? "..." : stats?.estadosAtivos ?? 0}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Estados com Voluntários Ativos
          </div>
        </div>
      </div>

      {/* Grid das 27 UFs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3">
        {UFS.map((uf) => {
          const count = stats?.distribuicaoPorEstado[uf] || 0;
          const hasDonors = count > 0;

          return (
            <Link
              key={uf}
              href={`/doadores?estado=${uf}`}
              className={`p-4 rounded-2xl border text-center transition-all transform hover:-translate-y-1 ${
                hasDonors
                  ? "bg-white border-red-200 shadow-sm hover:border-red-400 hover:shadow-md"
                  : "bg-zinc-50 border-zinc-200 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="text-xl font-black text-zinc-900">{uf}</div>
              <div className={`text-2xl font-extrabold my-1 ${hasDonors ? "text-red-600" : "text-zinc-600"}`}>
                {count}
              </div>
              <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-tight">
                {count === 1 ? "Doador" : "Doadores"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
