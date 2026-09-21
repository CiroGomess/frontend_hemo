"use client";

import { useEffect, useState } from "react";
import { fetchHemocentros, Hemocentro } from "@/services/api";
import { MapPin, Building2, Search, Phone, Clock, Navigation } from "lucide-react";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function HemocentrosPage() {
  const [hemocentros, setHemocentros] = useState<Hemocentro[]>([]);
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");

  const handleSearch = () => {
    setLoading(true);
    fetchHemocentros({
      estado: estado || undefined,
      tipo: tipo || undefined,
    })
      .then((data) => setHemocentros(data))
      .catch((err) => console.error("Erro ao buscar hemocentros:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleSearch();
  }, [estado, tipo]);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--ink)", margin: "0 0 12px", fontFamily: "var(--font-display)" }}>
          Encontre Hemocentros Próximos
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--muted)", margin: 0, maxWidth: "600px", lineHeight: 1.6 }}>
          Localize hemocentros, hospitais, clínicas e postos de doação de sangue próximos a você. Acesse informações de contato, horários e serviços disponíveis.
        </p>
      </div>

      {/* CONTROLES */}
      <div
        style={{
          background: "white",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", alignItems: "end" }}>
          {/* ESTADO */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", color: "var(--ink)", fontWeight: 700, fontSize: "0.95rem" }}>
              <MapPin size={18} color="var(--blood)" /> Estado
            </label>
            <div className="select-wrap">
              <select
                id="estadoFilter"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--line)", borderRadius: "8px", fontSize: "0.95rem", background: "white", color: "var(--ink)", cursor: "pointer", fontWeight: 500 }}
              >
                <option value="">Todos os estados</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TIPO */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", color: "var(--ink)", fontWeight: 700, fontSize: "0.95rem" }}>
              <Building2 size={18} color="var(--blood)" /> Tipo
            </label>
            <div className="select-wrap">
              <select
                id="tipoFilter"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--line)", borderRadius: "8px", fontSize: "0.95rem", background: "white", color: "var(--ink)", cursor: "pointer", fontWeight: 500 }}
              >
                <option value="">Todos</option>
                <option value="hemocentro">Hemocentros</option>
                <option value="hospital">Hospitais</option>
                <option value="clinica">Clínicas</option>
              </select>
            </div>
          </div>

          {/* BOTÃO */}
          <button
            id="btnLocalizarHemo"
            onClick={handleSearch}
            className="btn btn--primary"
            style={{
              padding: "14px 40px",
              borderRadius: "8px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: "1rem",
              height: "fit-content",
              justifyContent: "center",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Search size={18} />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {/* RESULTADOS GRID */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>Buscando hemocentros...</p>
        </div>
      ) : hemocentros.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ display: "grid", placeItems: "center", marginBottom: "16px", color: "var(--muted)" }}>
            <Building2 size={54} />
          </div>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem", margin: "0 auto", maxWidth: "500px", lineHeight: 1.6 }}>
            Nenhum estabelecimento encontrado para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {hemocentros.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background: "rgba(200, 30, 60, 0.1)",
                      color: "var(--blood-dark)",
                    }}
                  >
                    {item.tipo}
                  </span>
                  <span style={{ fontWeight: 800, color: "var(--muted)", fontSize: "0.9rem" }}>
                    {item.estado}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", marginBottom: "12px", lineHeight: 1.3 }}>
                  {item.nome}
                </h3>

                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "10px", lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <MapPin size={16} color="var(--blood)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span>{item.endereco}, {item.cidade} - {item.estado}</span>
                </p>

                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Phone size={16} color="var(--blood)" style={{ flexShrink: 0 }} />
                  <span>{item.telefone}</span>
                </p>

                <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={16} color="var(--blood)" style={{ flexShrink: 0 }} />
                  <span>{item.horario}</span>
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--line-2)" }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${item.nome} ${item.cidade} ${item.estado}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost"
                  style={{ flex: 1, justifyContent: "center", fontSize: "0.85rem", padding: "10px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Navigation size={15} />
                  <span>Rota Maps</span>
                </a>
                <a
                  href={`tel:${item.telefone.replace(/\D/g, "")}`}
                  className="btn btn--primary"
                  style={{ fontSize: "0.85rem", padding: "10px 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Phone size={14} />
                  <span>Ligar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
