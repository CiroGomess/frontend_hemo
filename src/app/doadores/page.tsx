"use client";

import { useEffect, useState } from "react";
import { fetchDonors, fetchStats, Donor, StatsResponse } from "@/services/api";
import { Droplet } from "lucide-react";

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

    const handleUpdate = () => loadData();
    window.addEventListener("focus", handleUpdate);
    window.addEventListener("hemoalerta_donor_updated", handleUpdate);

    const interval = setInterval(loadData, 5000);

    return () => {
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("hemoalerta_donor_updated", handleUpdate);
      clearInterval(interval);
    };
  }, [page, itemsPerPage, tipo]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalCadastrados = stats?.totalDoadores ?? total;
  const comAlertaAtivo = stats?.doadoresAtivos ?? 0;
  const totalTipos = stats ? Object.keys(stats.distribuicaoPorTipo).length : 8;
  const doadoresUniversais = stats?.doadoresUniversais ?? 0;

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "clamp(24px, 4vw, 40px)" }}>
      <div className="panel">
        <div className="panel__head">
          <div>
            <h2>Doadores cadastrados</h2>
            <p id="panelSub">
              Banco de dados relacional SQLite (<code>hemoalerta.db</code>) — consulta e filtros em tempo real.
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
            margin: "20px 20px 0",
            border: "1px solid #e0e0e0",
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
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Página anterior"
            >
              ← Anterior
            </button>
            <button
              id="paginationNext"
              className="pagination-btn"
              style={{ minWidth: "auto", padding: "8px 12px" }}
              disabled={page === totalPages || totalPages === 0}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Próxima página"
            >
              Próximo →
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="table-scroll" style={{ marginTop: "20px" }}>
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
                      <div className="empty__drop" aria-hidden="true" style={{ display: "grid", placeItems: "center" }}>
                        <Droplet size={36} color="var(--blood)" fill="var(--blood)" />
                      </div>
                      <h3>{search || tipo ? "Nenhum resultado" : "Nenhum doador cadastrado ainda"}</h3>
                      <p>
                        {search || tipo
                          ? "Ajuste a busca ou o filtro de tipo sanguíneo."
                          : "Os voluntários aparecerão aqui em tempo real assim que realizarem o cadastro. Vá até a aba Cadastro para começar."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                donors.map((d) => {
                  const isNS = d.tipoSanguineo === "NS";
                  const dateStr = d.dataCadastro
                    ? new Date(d.dataCadastro).toLocaleDateString("pt-BR")
                    : "—";

                  const maskedEmail = d.emailExibicao || (d.email ? d.email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : null);

                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="cell-name">{d.nomeCompleto}</div>
                        {maskedEmail && (
                          <div className="cell-sub" title="E-mail mascarado por LGPD">
                            {maskedEmail}
                          </div>
                        )}
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
                onClick={() => {
                  setPage(pNum);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {pNum}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
