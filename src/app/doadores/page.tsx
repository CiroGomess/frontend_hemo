"use client";

import { useEffect, useState } from "react";
import { fetchDonors, fetchStats, Donor, StatsResponse } from "@/services/api";

const TIPOS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "NS"];

export default function DoadoresPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");

  const loadData = () => {
    setLoading(true);
    fetchDonors({
      search: search || undefined,
      tipo: tipo || undefined,
      page,
      pageSize: itemsPerPage,
    })
      .then((res) => {
        setDonors(res.items);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch((err) => console.error("Erro ao carregar doadores:", err))
      .finally(() => setLoading(false));

    fetchStats()
      .then((s) => setStats(s))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [page, itemsPerPage, tipo]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleExportJSON = () => {
    const payload = {
      tabela: "DOADORES",
      sistema: "HemoAlerta",
      geradoEm: new Date().toISOString(),
      total: donors.length,
      doadores: donors,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "doadores.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const totalCadastrados = stats?.totalDoadores ?? total;
  const comAlertaAtivo = stats?.doadoresAtivos ?? 0;
  const totalTipos = stats ? Object.keys(stats.distribuicaoPorTipo).length : 8;
  const doadoresUniversais = stats?.doadoresUniversais ?? 0;

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "clamp(20px, 4vw, 40px)" }}>
      <div className="panel">
        <div className="panel__head">
          <div>
            <h2>Doadores cadastrados</h2>
            <p id="panelSub">
              Banco de dados relacional SQLite (<code>hemoalerta.db</code>) — pronto para exportar em <code>doadores.json</code>.
            </p>
          </div>
          <div className="panel__tools">
            <label className="filter">
              <span>Tipo</span>
              <div className="select-wrap select-wrap--sm">
                <select
                  id="filterTipo"
                  value={tipo}
                  onChange={(e) => {
                    setTipo(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Todos</option>
                  <option value="A+">A+</option>
                  <option value="A-">A−</option>
                  <option value="B+">B+</option>
                  <option value="B-">B−</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB−</option>
                  <option value="O+">O+</option>
                  <option value="O-">O−</option>
                </select>
              </div>
            </label>
            <input
              type="search"
              id="searchInput"
              className="search"
              placeholder="Buscar nome ou cidade…"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && loadData()}
            />
            <button
              type="button"
              onClick={handleExportJSON}
              className="btn btn--primary"
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              Exportar JSON
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats" id="stats">
          <div className="stat">
            <div className="stat__num">{totalCadastrados}</div>
            <div className="stat__label">Doadores cadastrados</div>
          </div>
          <div className="stat">
            <div className="stat__num">{comAlertaAtivo}</div>
            <div className="stat__label">Com alertas ativos</div>
          </div>
          <div className="stat">
            <div className="stat__num">{totalTipos}</div>
            <div className="stat__label">Tipos sanguíneos</div>
          </div>
          <div className="stat">
            <div className="stat__num">{doadoresUniversais}</div>
            <div className="stat__label">Doadores O− (universal)</div>
          </div>
        </div>

        {/* Controles de Paginação */}
        <div
          style={{
            padding: "18px 20px",
            background: "#fafafa",
            borderRadius: "8px",
            marginBottom: "0",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label htmlFor="itemsPerPage" style={{ fontSize: "0.9rem", fontWeight: 500, color: "#666" }}>
              Mostrar:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "8px 12px",
                border: "1.5px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "0.9rem",
                cursor: "pointer",
                background: "white",
                color: "#333",
              }}
            >
              <option value="10">10 por página</option>
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
              <option value="100">100 por página</option>
            </select>
          </div>

          <div id="paginationInfo" style={{ fontSize: "0.9rem", color: "#666", fontWeight: 500 }}>
            Página {page} de {totalPages || 1} • {total} doador{total === 1 ? "" : "es"}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              id="paginationPrev"
              className="pagination-btn"
              style={{ minWidth: "auto", padding: "8px 12px" }}
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              title="Página anterior"
            >
              ← Anterior
            </button>
            <button
              id="paginationNext"
              className="pagination-btn"
              style={{ minWidth: "auto", padding: "8px 12px" }}
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              title="Próxima página"
            >
              Próximo →
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="table-scroll">
          <table className="table" id="donorTable">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Cidade / UF</th>
                <th>WhatsApp</th>
                <th>Alertas</th>
                <th>Cadastro</th>
              </tr>
            </thead>
            <tbody id="donorTbody">
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
                    Carregando doadores...
                  </td>
                </tr>
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty show" id="emptyState">
                      <div className="empty__drop" aria-hidden="true">🩸</div>
                      <h3>Nenhum resultado</h3>
                      <p>Ajuste a busca ou o filtro de tipo sanguíneo.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                donors.map((d) => {
                  const isNS = d.tipoSanguineo === "NS";
                  const dateStr = d.dataCadastro
                    ? new Date(d.dataCadastro).toLocaleDateString("pt-BR")
                    : "—";

                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="cell-name">{d.nomeCompleto}</div>
                        {d.email && <div className="cell-sub">••••••••••••</div>}
                      </td>
                      <td>
                        <span className={`bt ${isNS ? "bt--ns" : ""}`}>
                          {isNS ? "—" : d.tipoSanguineo}
                        </span>
                      </td>
                      <td>
                        {d.cidade} <span className="cell-sub">/ {d.estado}</span>
                      </td>
                      <td title="Telefone mascarado por LGPD">
                        {d.whatsappExibicao || d.whatsapp}
                      </td>
                      <td>
                        {d.optInAlertas ? (
                          <span className="pill pill--on">Ativo</span>
                        ) : (
                          <span className="pill pill--off">Inativo</span>
                        )}
                      </td>
                      <td className="cell-sub">{dateStr}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação Inferior Numerada */}
        <div id="paginationControls" className="pagination-controls">
          {totalPages > 1 &&
            Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                type="button"
                className={`pagination-btn ${pNum === page ? "active" : ""}`}
                onClick={() => setPage(pNum)}
              >
                {pNum}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
