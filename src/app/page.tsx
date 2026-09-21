import Link from "next/link";
import { fetchStats } from "@/services/api";
import { Star, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  let stats = {
    totalDoadores: 28,
    doadoresAtivos: 23,
    vidasSalvasEstimadas: 112,
    doadoresUniversais: 3,
    estadosAtivos: 12,
  };

  try {
    const data = await fetchStats();
    stats = { ...stats, ...data };
  } catch {
    // Caso a API esteja iniciando
  }

  return (
    <div style={{ fontFamily: "var(--font-body), sans-serif", color: "#1c1418" }}>
      {/* ========================= HERO SECTION ========================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #d71e3a 0%, #8b0000 100%)",
          color: "white",
          padding: 0,
          marginBottom: 0,
          position: "relative",
          overflow: "hidden",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background Pattern */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-50px",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }}
        ></div>

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 40px", position: "relative", zIndex: 1, width: "100%" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE */}
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  padding: "10px 24px",
                  borderRadius: "50px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  marginBottom: "32px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#ff3d5a",
                      borderRadius: "50%",
                      boxShadow: "0 0 10px #ff3d5a",
                    }}
                  ></span>
                  Plataforma Líder em Doações de Sangue
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                  fontWeight: 900,
                  marginBottom: "28px",
                  fontFamily: "var(--font-display), sans-serif",
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              >
                Salve Vidas em <span style={{ color: "#ff3d5a" }}>Minutos</span>
              </h1>

              <p
                style={{
                  fontSize: "1.25rem",
                  opacity: 0.95,
                  marginBottom: "50px",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  maxWidth: "500px",
                }}
              >
                Conecte-se a uma rede nacional de doadores voluntários. Sua doação pode salvar até <strong>4 vidas</strong>. Cadastre-se em 60 segundos.
              </p>

              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "60px" }}>
                <Link
                  href="/cadastro"
                  style={{
                    background: "#ff3d5a",
                    color: "white",
                    border: "none",
                    padding: "18px 50px",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "var(--font-display), sans-serif",
                    transition: "all 0.3s ease",
                    boxShadow: "0 10px 30px rgba(255, 61, 90, 0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                  className="hover:scale-105"
                >
                  Começar Agora
                </Link>

                <a
                  href="#vantagens"
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "2px solid white",
                    padding: "16px 40px",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "var(--font-display), sans-serif",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                  className="hover:bg-white/10"
                >
                  Saiba Mais
                </a>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg style={{ width: "24px", height: "24px", color: "#ff3d5a" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>LGPD Compliant</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg style={{ width: "24px", height: "24px", color: "#ff3d5a" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                  <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>100% Seguro</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg style={{ width: "24px", height: "24px", color: "#ff3d5a" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>Voluntário & Gratuito</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Illustration */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <svg
                style={{ width: "100%", maxWidth: "450px", filter: "drop-shadow(0 30px 70px rgba(0,0,0,0.4))" }}
                viewBox="0 0 400 550"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#ff5a7e", stopOpacity: 0.95 }} />
                    <stop offset="100%" style={{ stopColor: "#e63354", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#f5f5f5", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* IV Tube */}
                <path d="M 200 80 Q 180 120 160 180 Q 150 210 145 250" stroke="rgba(200,200,200,0.8)" strokeWidth="6" strokeLinecap="round" />
                <path d="M 200 80 Q 220 120 240 180 Q 250 210 255 250" stroke="rgba(200,200,200,0.8)" strokeWidth="6" strokeLinecap="round" />

                {/* Needle connection points */}
                <circle cx="160" cy="250" r="8" fill="rgba(180,180,180,0.6)" />
                <circle cx="240" cy="250" r="8" fill="rgba(180,180,180,0.6)" />

                {/* Blood bag main body */}
                <rect x="110" y="120" width="180" height="240" rx="24" fill="url(#bagGradient)" stroke="rgba(150,150,150,0.3)" strokeWidth="1.5" />

                {/* Blood inside bag */}
                <rect x="120" y="140" width="160" height="200" rx="18" fill="url(#bloodGradient)" />

                {/* Shine effect on blood */}
                <ellipse cx="160" cy="160" rx="45" ry="35" fill="rgba(255,255,255,0.25)" />

                {/* Medical Cross Icon */}
                <g transform="translate(200, 150)">
                  <rect x="-10" y="-22" width="20" height="44" fill="white" />
                  <rect x="-22" y="-10" width="44" height="20" fill="white" />
                </g>

                {/* Decorative dots in blood */}
                <circle cx="170" cy="200" r="5" fill="rgba(255,255,255,0.4)" />
                <circle cx="145" cy="230" r="4" fill="rgba(255,255,255,0.3)" />
                <circle cx="210" cy="210" r="3.5" fill="rgba(255,255,255,0.35)" />

                {/* Bag bottom port */}
                <ellipse cx="200" cy="360" rx="22" ry="16" fill="rgba(200,50,70,0.8)" />
                <path d="M 185 360 Q 185 375 200 385 Q 215 375 215 360" fill="rgba(180,40,60,0.9)" />

                {/* Top connection port */}
                <rect x="190" y="110" width="20" height="15" rx="3" fill="rgba(180,180,180,0.7)" />
                <circle cx="200" cy="108" r="4" fill="rgba(150,150,150,0.8)" />

                {/* Shadow under bag */}
                <ellipse cx="200" cy="365" rx="95" ry="12" fill="rgba(0,0,0,0.08)" />

                {/* Decorative hearts */}
                <g transform="translate(80, 420)" opacity="0.5">
                  <path d="M 0 -6 C -4 -9 -11 -9 -13 -4 C -15 0 -11 9 0 15 C 11 9 15 0 13 -4 C 11 -9 4 -9 0 -6" fill="rgba(255, 61, 90, 0.6)" />
                </g>
                <g transform="translate(320, 420)" opacity="0.5">
                  <path d="M 0 -6 C -4 -9 -11 -9 -13 -4 C -15 0 -11 9 0 15 C 11 9 15 0 13 -4 C 11 -9 4 -9 0 -6" fill="rgba(255, 61, 90, 0.6)" />
                </g>

                {/* Decorative circles */}
                <circle cx="70" cy="180" r="28" fill="rgba(255,255,255,0.08)" />
                <circle cx="330" cy="220" r="40" fill="rgba(255,255,255,0.06)" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= STATS SECTION ========================= */}
      <div style={{ background: "linear-gradient(180deg, #f8e8ec 0%, white 100%)", padding: "80px 40px", borderBottom: "1px solid #e5e5e5" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px" }}>
            {/* Stat 1 */}
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#d71e3a", fontFamily: "var(--font-display), sans-serif", marginBottom: "8px" }}>
                {stats.totalDoadores}
              </div>
              <p style={{ color: "#1c1418", fontSize: "1.05rem", fontWeight: 600, margin: 0 }}>Doadores Cadastrados</p>
              <div style={{ width: "50px", height: "3px", background: "linear-gradient(90deg, #d71e3a, #ff3d5a)", margin: "16px auto 0" }}></div>
            </div>

            {/* Stat 2 */}
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#d71e3a", fontFamily: "var(--font-display), sans-serif", marginBottom: "8px" }}>
                27
              </div>
              <p style={{ color: "#1c1418", fontSize: "1.05rem", fontWeight: 600, margin: 0 }}>Estados Cobertos</p>
              <div style={{ width: "50px", height: "3px", background: "linear-gradient(90deg, #d71e3a, #ff3d5a)", margin: "16px auto 0" }}></div>
            </div>

            {/* Stat 3 */}
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#d71e3a", fontFamily: "var(--font-display), sans-serif", marginBottom: "8px" }}>
                {stats.vidasSalvasEstimadas}
              </div>
              <p style={{ color: "#1c1418", fontSize: "1.05rem", fontWeight: 600, margin: 0 }}>Vidas Salvas</p>
              <div style={{ width: "50px", height: "3px", background: "linear-gradient(90deg, #d71e3a, #ff3d5a)", margin: "16px auto 0" }}></div>
            </div>

            {/* Stat 4 */}
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#d71e3a", fontFamily: "var(--font-display), sans-serif", marginBottom: "8px" }}>
                100%
              </div>
              <p style={{ color: "#1c1418", fontSize: "1.05rem", fontWeight: 600, margin: 0 }}>Voluntário e Gratuito</p>
              <div style={{ width: "50px", height: "3px", background: "linear-gradient(90deg, #d71e3a, #ff3d5a)", margin: "16px auto 0" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= FEATURES SECTION ========================= */}
      <div id="vantagens" style={{ padding: "100px 40px", background: "white" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <span style={{ display: "inline-block", color: "#d71e3a", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
              Vantagens
            </span>
            <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontFamily: "var(--font-display), sans-serif", marginBottom: "20px", color: "#1c1418", fontWeight: 900 }}>
              Por que HemoAlerta?
            </h2>
            <p style={{ color: "#897b80", fontSize: "1.15rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              Plataforma segura, rápida e confiável para conectar doadores voluntários com quem mais precisa.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
            {/* Card 1 */}
            <div className="p-10 bg-white border border-zinc-100 rounded-2xl hover:shadow-xl hover:border-red-100 transition-all duration-300">
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #d71e3a, #ff3d5a)", borderRadius: "12px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg style={{ width: "32px", height: "32px", color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px", color: "#1c1418" }}>Alertas Instantâneos</h3>
              <p style={{ color: "#897b80", lineHeight: 1.7, fontSize: "0.95rem" }}>Receba notificações em tempo real via WhatsApp quando há emergências de doação.</p>
            </div>

            {/* Card 2 */}
            <div className="p-10 bg-white border border-zinc-100 rounded-2xl hover:shadow-xl hover:border-red-100 transition-all duration-300">
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #d71e3a, #ff3d5a)", borderRadius: "12px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg style={{ width: "32px", height: "32px", color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px", color: "#1c1418" }}>Cobertura Nacional</h3>
              <p style={{ color: "#897b80", lineHeight: 1.7, fontSize: "0.95rem" }}>Presente em 27 estados. Rede em constante expansão para cobrir todo o país.</p>
            </div>

            {/* Card 3 */}
            <div className="p-10 bg-white border border-zinc-100 rounded-2xl hover:shadow-xl hover:border-red-100 transition-all duration-300">
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #d71e3a, #ff3d5a)", borderRadius: "12px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg style={{ width: "32px", height: "32px", color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px", color: "#1c1418" }}>Proteção Total</h3>
              <p style={{ color: "#897b80", lineHeight: 1.7, fontSize: "0.95rem" }}>Conformidade LGPD. Dados criptografados e protegidos com os melhores padrões.</p>
            </div>

            {/* Card 4 */}
            <div className="p-10 bg-white border border-zinc-100 rounded-2xl hover:shadow-xl hover:border-red-100 transition-all duration-300">
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #d71e3a, #ff3d5a)", borderRadius: "12px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg style={{ width: "32px", height: "32px", color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px", color: "#1c1418" }}>Total Controle</h3>
              <p style={{ color: "#897b80", lineHeight: 1.7, fontSize: "0.95rem" }}>Você decide tudo. Controle quando quer ser contatado e edite seu perfil a qualquer hora.</p>
            </div>

            {/* Card 5 */}
            <div className="p-10 bg-white border border-zinc-100 rounded-2xl hover:shadow-xl hover:border-red-100 transition-all duration-300">
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #d71e3a, #ff3d5a)", borderRadius: "12px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg style={{ width: "32px", height: "32px", color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 4l-8.5 17" /><path d="M10 19l4-11" /><path d="M2 5h20" /><path d="M5 2l-1 5h16l-1-5" /></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px", color: "#1c1418" }}>Impacto Real</h3>
              <p style={{ color: "#897b80", lineHeight: 1.7, fontSize: "0.95rem" }}>Acompanhe o impacto das suas doações. Cada ação salva vidas verificáveis.</p>
            </div>

            {/* Card 6 */}
            <div className="p-10 bg-white border border-zinc-100 rounded-2xl hover:shadow-xl hover:border-red-100 transition-all duration-300">
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #d71e3a, #ff3d5a)", borderRadius: "12px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg style={{ width: "32px", height: "32px", color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px", color: "#1c1418" }}>Simples & Intuitivo</h3>
              <p style={{ color: "#897b80", lineHeight: 1.7, fontSize: "0.95rem" }}>Cadastro em 60 segundos. Interface clean e amigável para qualquer pessoa.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= HOW IT WORKS ========================= */}
      <div style={{ padding: "100px 40px", background: "linear-gradient(to right, rgba(200, 30, 60, 0.04), transparent)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.8rem", fontFamily: "var(--font-display), sans-serif", marginBottom: "60px", color: "#1c1418", fontWeight: 800 }}>
            Como Funciona?
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px", marginBottom: "60px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #d71e3a, #8b0000)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 20px", fontWeight: 700 }}>1</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px" }}>Cadastro Rápido</h4>
              <p style={{ color: "#897b80", lineHeight: 1.6, fontSize: "0.95rem" }}>Preencha seus dados essenciais: tipo sanguíneo, contato e localização.</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #d71e3a, #8b0000)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 20px", fontWeight: 700 }}>2</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px" }}>Perfil Ativo</h4>
              <p style={{ color: "#897b80", lineHeight: 1.6, fontSize: "0.95rem" }}>Sua informação integra nossa rede nacional de doadores.</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #d71e3a, #8b0000)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 20px", fontWeight: 700 }}>3</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px" }}>Alerta Recebido</h4>
              <p style={{ color: "#897b80", lineHeight: 1.6, fontSize: "0.95rem" }}>Quando há emergência compatível com seu tipo, recebe notificação.</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #d71e3a, #8b0000)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 20px", fontWeight: 700 }}>4</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px" }}>Vida Salva</h4>
              <p style={{ color: "#897b80", lineHeight: 1.6, fontSize: "0.95rem" }}>Você decide ajudar. Sua doação pode salvar até 4 vidas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= IMPACT SECTION ========================= */}
      <div style={{ padding: "100px 40px", background: "white" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.8rem", fontFamily: "var(--font-display), sans-serif", marginBottom: "60px", color: "#1c1418", fontWeight: 800 }}>
            Impacto Social
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "24px", color: "#1c1418" }}>
                Uma Única Doação Salva Vidas
              </h3>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#d71e3a" }}>1 Bolsa = 4 Vidas</h4>
                </div>
                <p style={{ color: "#897b80", lineHeight: 1.7 }}>O sangue é separado em componentes: hemácias, plaquetas e plasma. Cada um pode ajudar diferentes pacientes.</p>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#d71e3a" }}>Contra o Relógio</h4>
                </div>
                <p style={{ color: "#897b80", lineHeight: 1.7 }}>Emergências não esperam. Com HemoAlerta, encontramos doadores em minutos, não horas.</p>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#d71e3a" }}>Cobertura Total</h4>
                </div>
                <p style={{ color: "#897b80", lineHeight: 1.7 }}>Hospitais, hemocentros e urgências em todo o país podem ativar nossa rede.</p>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(200,30,60,0.1), rgba(200,30,60,0.05))", padding: "50px", borderRadius: "24px", border: "1px solid rgba(28, 20, 24, 0.1)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "4.5rem", fontWeight: 900, color: "#d71e3a", fontFamily: "var(--font-display), sans-serif", marginBottom: "10px" }}>
                  {stats.vidasSalvasEstimadas}
                </div>
                <p style={{ color: "#897b80", fontSize: "1.15rem", fontWeight: 600 }}>Vidas potencialmente salvas com nossa rede</p>
                <hr style={{ border: "none", borderTop: "2px solid rgba(28, 20, 24, 0.1)", margin: "30px 0" }} />
                <p style={{ color: "#897b80", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Cada novo doador aumenta a chance de salvar vidas em emergências. Seja parte dessa rede de solidariedade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= TESTIMONIALS ========================= */}
      <div style={{ padding: "100px 40px", background: "linear-gradient(to right, rgba(200, 30, 60, 0.04), transparent)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.8rem", fontFamily: "var(--font-display), sans-serif", marginBottom: "60px", color: "#1c1418", fontWeight: 800 }}>
            Histórias que Transformam
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
            <div style={{ padding: "40px", background: "white", borderRadius: "16px", border: "1px solid rgba(28, 20, 24, 0.1)" }}>
              <div style={{ display: "flex", gap: "4px", color: "#d71e3a", marginBottom: "16px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#d71e3a" color="#d71e3a" />
                ))}
              </div>
              <p style={{ color: "#1c1418", marginBottom: "24px", lineHeight: 1.7 }}>
                &ldquo;Meu filho precisava urgentemente de sangue. HemoAlerta nos ajudou a encontrar doadores em 20 minutos. Salvou a vida dele.&rdquo;
              </p>
              <p style={{ fontWeight: 700, color: "#1c1418" }}>Marina Silva</p>
              <p style={{ color: "#897b80", fontSize: "0.9rem" }}>São Paulo, SP</p>
            </div>

            <div style={{ padding: "40px", background: "white", borderRadius: "16px", border: "1px solid rgba(28, 20, 24, 0.1)" }}>
              <div style={{ display: "flex", gap: "4px", color: "#d71e3a", marginBottom: "16px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#d71e3a" color="#d71e3a" />
                ))}
              </div>
              <p style={{ color: "#1c1418", marginBottom: "24px", lineHeight: 1.7 }}>
                &ldquo;Como doador, fiquei surpreso com o impacto direto. Saber que minha doação salvou 4 vidas é transformador.&rdquo;
              </p>
              <p style={{ fontWeight: 700, color: "#1c1418" }}>Carlos Mendes</p>
              <p style={{ color: "#897b80", fontSize: "0.9rem" }}>Rio de Janeiro, RJ</p>
            </div>

            <div style={{ padding: "40px", background: "white", borderRadius: "16px", border: "1px solid rgba(28, 20, 24, 0.1)" }}>
              <div style={{ display: "flex", gap: "4px", color: "#d71e3a", marginBottom: "16px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#d71e3a" color="#d71e3a" />
                ))}
              </div>
              <p style={{ color: "#1c1418", marginBottom: "24px", lineHeight: 1.7 }}>
                &ldquo;A plataforma é segura e tranquila. Recomendo para todos que querem ajudar sem burocracias.&rdquo;
              </p>
              <p style={{ fontWeight: 700, color: "#1c1418" }}>Ana Tavares</p>
              <p style={{ color: "#897b80", fontSize: "0.9rem" }}>Belo Horizonte, MG</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= FAQ SECTION ========================= */}
      <div style={{ padding: "100px 40px", background: "white" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.8rem", fontFamily: "var(--font-display), sans-serif", marginBottom: "60px", color: "#1c1418", fontWeight: 800 }}>
            Perguntas Frequentes
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <details style={{ padding: "24px", background: "white", border: "1px solid rgba(28, 20, 24, 0.1)", borderRadius: "12px", cursor: "pointer" }}>
              <summary style={{ fontWeight: 700, color: "#1c1418", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Preciso de alguma documentação especial?
              </summary>
              <p style={{ color: "#897b80", marginTop: "16px", lineHeight: 1.7 }}>Não. Apenas seus dados básicos (nome, tipo sanguíneo, contato e localização) são necessários. Tudo é seguro e criptografado.</p>
            </details>

            <details style={{ padding: "24px", background: "white", border: "1px solid rgba(28, 20, 24, 0.1)", borderRadius: "12px", cursor: "pointer" }}>
              <summary style={{ fontWeight: 700, color: "#1c1418", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="4" r="1" /><circle cx="5" cy="20" r="1" /><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6" /></svg>
                Tem algum custo?
              </summary>
              <p style={{ color: "#897b80", marginTop: "16px", lineHeight: 1.7 }}>Não. HemoAlerta é 100% gratuito para doadores. É um serviço voluntário sem fins lucrativos.</p>
            </details>

            <details style={{ padding: "24px", background: "white", border: "1px solid rgba(28, 20, 24, 0.1)", borderRadius: "12px", cursor: "pointer" }}>
              <summary style={{ fontWeight: 700, color: "#1c1418", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                Tenho que responder a todos os alertas?
              </summary>
              <p style={{ color: "#897b80", marginTop: "16px", lineHeight: 1.7 }}>Não. Você escolhe. Pode ignorar alertas sem problema. Não há obrigações ou consequências.</p>
            </details>

            <details style={{ padding: "24px", background: "white", border: "1px solid rgba(28, 20, 24, 0.1)", borderRadius: "12px", cursor: "pointer" }}>
              <summary style={{ fontWeight: 700, color: "#1c1418", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Meus dados estão seguros?
              </summary>
              <p style={{ color: "#897b80", marginTop: "16px", lineHeight: 1.7 }}>Sim. Somos conformes com LGPD. Seus dados são criptografados e você controla quem pode acessá-los.</p>
            </details>

            <details style={{ padding: "24px", background: "white", border: "1px solid rgba(28, 20, 24, 0.1)", borderRadius: "12px", cursor: "pointer" }}>
              <summary style={{ fontWeight: 700, color: "#1c1418", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Como funciona o contato?
              </summary>
              <p style={{ color: "#897b80", marginTop: "16px", lineHeight: 1.7 }}>Via WhatsApp. Quando há uma emergência compatível, você recebe uma mensagem com os detalhes e pode responder.</p>
            </details>

            <details style={{ padding: "24px", background: "white", border: "1px solid rgba(28, 20, 24, 0.1)", borderRadius: "12px", cursor: "pointer" }}>
              <summary style={{ fontWeight: 700, color: "#1c1418", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <svg style={{ width: "20px", height: "20px", color: "#d71e3a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Posso editar meu perfil depois?
              </summary>
              <p style={{ color: "#897b80", marginTop: "16px", lineHeight: 1.7 }}>Sim. Acesse a aba &ldquo;Meu Perfil&rdquo; com email e telefone para atualizar qualquer informação a qualquer momento.</p>
            </details>
          </div>
        </div>
      </div>

      {/* ========================= FINAL CTA ========================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #d71e3a 0%, #8b0000 100%)",
          color: "white",
          padding: "120px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-50px",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }}
        ></div>

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontFamily: "var(--font-display), sans-serif", marginBottom: "24px", fontWeight: 900, lineHeight: 1.1 }}>
            Pronto para <span style={{ color: "#ff3d5a" }}>salvar vidas</span>?
          </h2>
          <p style={{ fontSize: "1.3rem", opacity: 0.95, marginBottom: "60px", lineHeight: 1.8, fontWeight: 300 }}>
            Junte-se a uma rede nacional de doadores voluntários. Seu cadastro leva apenas 60 segundos e pode salvar até 4 vidas.
          </p>
          <Link
            href="/cadastro"
            style={{
              background: "#ff3d5a",
              color: "white",
              border: "none",
              padding: "20px 70px",
              fontSize: "1.15rem",
              fontWeight: 700,
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "var(--font-display), sans-serif",
              transition: "all 0.3s ease",
              boxShadow: "0 12px 40px rgba(255, 61, 90, 0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "inline-block",
              textDecoration: "none",
            }}
            className="hover:scale-105"
          >
            Cadastrar Agora
          </Link>
          <p style={{ marginTop: "40px", opacity: 0.85, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <CheckCircle2 size={18} color="#42b881" />
            <span>100% seguro e voluntário • Sem compromissos</span>
          </p>
        </div>
      </div>
    </div>
  );
}
