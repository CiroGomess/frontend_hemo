"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Phone, ChevronRight, Siren, Droplet } from "lucide-react";
import LgpdModal from "./LgpdModal";

export default function Footer() {
  const [showLgpdModal, setShowLgpdModal] = useState(false);

  return (
    <>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Coluna 1: Sobre e LGPD */}
            <div className="footer-col">
              <div className="footer-brand">
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--blood)",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                  }}
                >
                  <Droplet size={18} fill="#fff" />
                </span>
                <span>Hemo<strong style={{ color: "var(--blood-bright)" }}>Alerta</strong></span>
              </div>
              <p className="footer-desc">
                Plataforma de mobilização e conexão de doadores voluntários com hemocentros em todo o território nacional.
              </p>
              <button
                type="button"
                onClick={() => setShowLgpdModal(true)}
                className="footer-badge-lgpd"
              >
                <ShieldCheck size={16} />
                <span>Em conformidade com a LGPD (Lei nº 13.709/2018)</span>
              </button>
            </div>

            {/* Coluna 2: Navegação */}
            <div className="footer-col">
              <h4>Navegação</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/">
                    <ChevronRight size={14} color="var(--blood)" /> Início
                  </Link>
                </li>
                <li>
                  <Link href="/cadastro">
                    <ChevronRight size={14} color="var(--blood)" /> Quero Doar
                  </Link>
                </li>
                <li>
                  <Link href="/rede">
                    <ChevronRight size={14} color="var(--blood)" /> Rede Nacional
                  </Link>
                </li>
                <li>
                  <Link href="/hemocentros">
                    <ChevronRight size={14} color="var(--blood)" /> Guia de Hemocentros
                  </Link>
                </li>
                <li>
                  <Link href="/doadores">
                    <ChevronRight size={14} color="var(--blood)" /> Painel de Doadores
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Urgências */}
            <div className="footer-col">
              <h4>Urgências</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/emergencia" style={{ color: "var(--blood-bright)", fontWeight: 600 }}>
                    <Siren size={14} /> Solicitar Doação (SOS)
                  </Link>
                </li>
                <li>
                  <Link href="/perfil">
                    <ChevronRight size={14} color="var(--blood)" /> Atualizar Meus Dados
                  </Link>
                </li>
                <li style={{ paddingTop: "8px", color: "#8a7a80", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Phone size={14} color="var(--blood)" /> Disque Saúde: 136 (SUS)
                </li>
              </ul>
            </div>

            {/* Coluna 4: Privacidade */}
            <div className="footer-col">
              <h4>Privacidade</h4>
              <p className="footer-desc" style={{ marginBottom: "12px" }}>
                Seus dados telefônicos são preservados sob sigilo e usados estritamente para avisos de necessidade urgente de sangue. Você pode revogar seu consentimento a qualquer momento.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setShowLgpdModal(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--blood-bright)",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  Abrir Política Completa
                </button>
                <span style={{ color: "#6b5c62" }}>·</span>
                <Link
                  href="/privacidade"
                  style={{
                    color: "var(--blood-bright)",
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  Página Dedicada
                </Link>
              </div>
            </div>
          </div>

          {/* Barra inferior */}
          <div className="footer-bottom">
            <span>© 2026 HemoAlerta · Todos os direitos reservados.</span>
            <span>Equipe Hemotech · 2TSCOA · FIAP × Locaweb Challenge 2026</span>
          </div>
        </div>
      </footer>

      {/* Modal Dedicado LGPD */}
      <LgpdModal isOpen={showLgpdModal} onClose={() => setShowLgpdModal(false)} />
    </>
  );
}
