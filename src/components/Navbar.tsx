"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchStats } from "@/services/api";

export default function Navbar() {
  const pathname = usePathname();
  const [totalDoadores, setTotalDoadores] = useState<number | null>(null);

  useEffect(() => {
    fetchStats()
      .then((data) => setTotalDoadores(data.totalDoadores))
      .catch(() => {});
  }, []);

  const navItems = [
    { label: "Início", href: "/" },
    { label: "Cadastro", href: "/cadastro" },
    { label: "Rede", href: "/rede" },
    { label: "Hemocentros", href: "/hemocentros" },
    { 
      label: "Doadores", 
      href: "/doadores", 
      badge: totalDoadores !== null ? totalDoadores : undefined 
    },
    { label: "Meu Perfil", href: "/perfil" },
    { 
      label: "Emergência SOS", 
      href: "/emergencia",
      highlight: true 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-10 h-10 rounded-full bg-linear-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 32" width="20" height="24" fill="currentColor">
              <path d="M12 0C12 0 1 13.5 1 21.5C1 27.85 5.92 32 12 32C18.08 32 23 27.85 23 21.5C23 13.5 12 0 12 0Z" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-zinc-900 leading-tight">
              Hemo<span className="text-red-600">Alerta</span>
            </span>
            <span className="text-xs text-zinc-600 font-medium">
              A pessoa certa. No momento certo.
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="ml-2 px-4 py-2 rounded-full font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5 animate-pulse"
                >
                  <span>🆘</span>
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  isActive
                    ? "text-red-600 bg-red-50 font-bold"
                    : "text-zinc-600 hover:text-red-600 hover:bg-zinc-50"
                }`}
              >
                {item.label}
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-bold border border-zinc-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu link to cadastro */}
        <div className="flex md:hidden">
          <Link
            href="/emergencia"
            className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold"
          >
            🆘 SOS
          </Link>
        </div>
      </div>
    </header>
  );
}
