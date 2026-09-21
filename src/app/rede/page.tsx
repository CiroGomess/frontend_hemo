"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchStats, StatsResponse } from "@/services/api";
import { Globe, Users, Bell, MapPin } from "lucide-react";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function RedePage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    fetchStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Erro ao carregar estatísticas da rede:", err));
  }, []);

  const totalDoadores = stats?.totalDoadores ?? 0;
  const doadoresAtivos = stats?.doadoresAtivos ?? 0;
  const estadosAtivos = stats?.estadosAtivos ?? 0;

  const handleCardClick = (uf: string, count: number) => {
    if (count > 0) {
      router.push(`/emergencia?estado=${uf}`);
    }
  };

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "clamp(20px, 4vw, 40px)" }}>
      <div className="rede-container">
        {/* Header com KPIs */}
        <div className="rede-header">
          <div className="rede-title">
            <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Globe size={32} color="var(--blood)" />
              <span>Rede Nacional de Doadores</span>
            </h1>
            <p>Mapa interativo da cobertura HemoAlerta em tempo real</p>
          </div>
          <div className="rede-stats">
            <div className="stat-card">
              <div className="stat-value" id="statTotal">{totalDoadores}</div>
              <div className="stat-label">Doadores Cadastrados</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="statAtivos">{doadoresAtivos}</div>
              <div className="stat-label">Com Alertas Ativos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="statEstados">{estadosAtivos}</div>
              <div className="stat-label">Estados Cobertos</div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="rede-legend">
          <span className="legend-item">
            <span className="legend-color" style={{ background: "#1e7a4d" }}></span>
            <span>Muitos doadores (10+)</span>
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: "#42b881" }}></span>
            <span>Bom (5-9)</span>
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: "#f2b705" }}></span>
            <span>Poucos (1-4)</span>
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: "#e0e0e0" }}></span>
            <span>Nenhum</span>
          </span>
        </div>

        {/* Grid de Estados */}
        <div className="rede-grid" id="redeGrid">
          {UFS.map((uf) => {
            const count = stats?.distribuicaoPorEstado?.[uf] || 0;
            let level = 0;
            if (count > 0 && count <= 4) level = 1;
            else if (count >= 5 && count <= 9) level = 2;
            else if (count >= 10) level = 3;

            return (
              <button
                key={uf}
                type="button"
                className={`state-card level-${level}`}
                title={count > 0 ? `${uf}: ${count} doador${count === 1 ? "" : "es"} com alertas ativos` : `${uf}: Sem doadores cadastrados`}
                onClick={() => handleCardClick(uf, count)}
              >
                <div className="state-code">{uf}</div>
                <div className="state-count">{count}</div>
                <div className="state-label">doador{count === 1 ? "" : "es"}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
