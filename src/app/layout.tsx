import type { Metadata } from "next";
// Fontes auto-hospedadas (next/font/google falha no build da Square Cloud)
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "HemoAlerta — Cadastro de Doador",
  description: "Conectamos doadores de sangue compatíveis a hemocentros e hospitais em momentos de emergência com total respeito à LGPD.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className="bg-grain" aria-hidden="true"></div>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
