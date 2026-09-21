"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchStats } from "@/services/api";
import { Siren, Shield } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [totalDoadores, setTotalDoadores] = useState<number>(0);

  const loadStats = () => {
    fetchStats()
      .then((data) => setTotalDoadores(data.totalDoadores))
      .catch(() => {});
  };

  useEffect(() => {
    loadStats();

    const handleUpdate = () => loadStats();
    window.addEventListener("focus", handleUpdate);
    window.addEventListener("hemoalerta_donor_updated", handleUpdate);

    const interval = setInterval(loadStats, 4000);

    return () => {
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("hemoalerta_donor_updated", handleUpdate);
      clearInterval(interval);
    };
  }, [pathname]);

  return (
    <header className="topbar">
      <div className="brand">
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "14px", color: "inherit" }}>
          <span className="brand__drop" aria-hidden="true">
            <svg viewBox="0 0 24 32" width="22" height="28">
              <path d="M12 0C12 0 1 13.5 1 21.5C1 27.85 5.92 32 12 32C18.08 32 23 27.85 23 21.5C23 13.5 12 0 12 0Z" />
            </svg>
          </span>
          <div className="brand__text">
            <strong>Hemo<span>Alerta</span></strong>
            <small>A pessoa certa. No momento certo.</small>
          </div>
        </Link>
      </div>

      <nav className="tabs" id="tabs">
        <Link href="/" className={`tab ${pathname === "/" ? "is-active" : ""}`}>
          Início
        </Link>
        <Link href="/cadastro" className={`tab ${pathname === "/cadastro" ? "is-active" : ""}`}>
          Cadastro
        </Link>
        <Link href="/rede" className={`tab ${pathname === "/rede" ? "is-active" : ""}`}>
          Rede <span className="tab__count" id="navCountRede">{totalDoadores}</span>
        </Link>
        <Link href="/hemocentros" className={`tab ${pathname === "/hemocentros" ? "is-active" : ""}`}>
          Hemocentros
        </Link>
        <Link href="/doadores" className={`tab ${pathname === "/doadores" ? "is-active" : ""}`}>
          Doadores <span className="tab__count" id="navCount">{totalDoadores}</span>
        </Link>
        <Link href="/perfil" className={`tab ${pathname === "/perfil" ? "is-active" : ""}`}>
          Meu Perfil
        </Link>
        <Link href="/admin" className={`tab ${pathname === "/admin" ? "is-active" : ""}`} style={{ color: "#d71e3a", fontWeight: 700 }}>
          <Shield size={15} style={{ marginRight: "4px", verticalAlign: "middle" }} />
          ADM
        </Link>
        <Link href="/emergencia" className="tab-sos">
          <Siren size={16} />
          <span>Emergência SOS</span>
        </Link>
      </nav>
    </header>
  );
}
