import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HemoAlerta — Rede Inteligente de Doação de Sangue",
  description: "Conectamos doadores de sangue compatíveis a hemocentros e hospitais em momentos de emergência com total respeito à LGPD.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${hanken.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-[#fcf8f7] text-[#1c1418] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
