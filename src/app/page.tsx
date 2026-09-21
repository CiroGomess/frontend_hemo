import Link from "next/link";
import { fetchStats } from "@/services/api";
import {
  Heart,
  Droplet,
  Users,
  Bell,
  ShieldCheck,
  Activity,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  Siren,
  CheckCircle2,
  Lock,
  Smartphone,
  Hospital,
  AlertCircle,
} from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  let stats = {
    totalDoadores: 0,
    doadoresAtivos: 0,
    vidasSalvasEstimadas: 0,
    doadoresUniversais: 0,
    estadosAtivos: 0,
  };

  try {
    const data = await fetchStats();
    stats = { ...stats, ...data };
  } catch {
    // API fallback
  }

  const bloodTypes = [
    { type: "O-", label: "Doador Universal", desc: "Compatível com todos os 8 tipos sanguíneos" },
    { type: "O+", label: "Mais Frequente", desc: "Compatível com todos os tipos positivos" },
    { type: "A-", label: "Compatibilidade Alta", desc: "Doa para A+, A-, AB+ e AB-" },
    { type: "A+", label: "Alta Demanda", desc: "Doa para A+ e AB+" },
    { type: "B-", label: "Tipo Raro", desc: "Doa para B+, B-, AB+ e AB-" },
    { type: "B+", label: "Demanda Contínua", desc: "Doa para B+ e AB+" },
    { type: "AB-", label: "Extremamente Raro", desc: "Doa para AB+ e AB-" },
    { type: "AB+", label: "Receptor Universal", desc: "Recebe de todos os tipos sanguíneos" },
  ];

  return (
    <div style={{ background: "#fafaf9", color: "#1e1e24", overflowX: "hidden" }}>
      {/* ========================= HERO SECTION PREMIUM ========================= */}
      <section
        style={{
          position: "relative",
          background: "radial-gradient(120% 120% at 50% -10%, #fff1f2 0%, #fafaf9 60%, #f4f4f5 100%)",
          padding: "clamp(48px, 8vw, 84px) clamp(20px, 4vw, 48px) clamp(60px, 10vw, 100px)",
          borderBottom: "1px solid #e4e4e7",
          overflow: "hidden",
        }}
      >
        {/* Glow de fundo */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(225, 29, 72, 0.12) 0%, rgba(225, 29, 72, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "48px",
              alignItems: "center",
            }}
          >
            {/* Lado Esquerdo: Mensagem e CTAs */}
            <div>
              {/* Badge de Destaque */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#fff",
                  border: "1px solid #fecdd3",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#be123c",
                  boxShadow: "0 2px 6px rgba(225, 29, 72, 0.08)",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#e11d48",
                    display: "inline-block",
                    boxShadow: "0 0 8px #e11d48",
                  }}
                />
                <span>Rede Nacional de Doação de Sangue • Conexão em Tempo Real</span>
              </div>

              {/* Título Principal */}
              <h1
                style={{
                  fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                  fontWeight: 800,
                  fontFamily: "var(--font-display), sans-serif",
                  lineHeight: 1.12,
                  letterSpacing: "-0.03em",
                  color: "#0f172a",
                  marginBottom: "20px",
                }}
              >
                A pessoa certa. <br />
                No momento certo. <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #e11d48 0%, #be123c 50%, #881337 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Salvando vidas em minutos.
                </span>
              </h1>

              {/* Subtítulo */}
              <p
                style={{
                  fontSize: "1.12rem",
                  lineHeight: 1.65,
                  color: "#475569",
                  marginBottom: "36px",
                  maxWidth: "540px",
                }}
              >
                Conectamos doadores de sangue voluntários a hemocentros e hospitais em situações críticas através do WhatsApp. Sua doação pode salvar até <strong>4 vidas</strong> com total segurança e respeito à LGPD.
              </p>

              {/* Ações Principais */}
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "40px" }}>
                <Link
                  href="/cadastro"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "linear-gradient(135deg, #e11d48, #be123c)",
                    color: "#fff",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    textDecoration: "none",
                    boxShadow: "0 6px 20px rgba(225, 29, 72, 0.28)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Heart size={18} fill="#fff" />
                  <span>Cadastrar como Doador</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/emergencia"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#fff",
                    color: "#be123c",
                    border: "1.5px solid #fecdd3",
                    padding: "14px 24px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Siren size={18} />
                  <span>Emergência SOS</span>
                </Link>
              </div>

              {/* Selos de Confiança */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  paddingTop: "20px",
                  borderTop: "1px solid #e4e4e7",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
                  <ShieldCheck size={18} color="#16a34a" />
                  <span>LGPD Compliant</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span>100% Gratuito</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
                  <Smartphone size={18} color="#16a34a" />
                  <span>WhatsApp Oficial</span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Card Interativo de Impacto e Compatibilidade */}
            <div>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "24px",
                  padding: "32px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0,0,0,0.02)",
                  position: "relative",
                }}
              >
                {/* Header do Card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: "#fee2e2",
                        display: "grid",
                        placeItems: "center",
                        color: "#e11d48",
                      }}
                    >
                      <Activity size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "#0f172a" }}>
                        Rede Ativa HemoAlerta
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        Dados em tempo real • SQLite integrado
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
                    Online
                  </span>
                </div>

                {/* Grid dos Tipos Sanguíneos */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "10px" }}>
                    Selecione o tipo sanguíneo para ver o impacto:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {bloodTypes.map((b) => (
                      <div
                        key={b.type}
                        style={{
                          background: b.type === "O-" ? "linear-gradient(135deg, #e11d48, #be123c)" : "#f8fafc",
                          color: b.type === "O-" ? "#fff" : "#1e293b",
                          border: b.type === "O-" ? "none" : "1px solid #e2e8f0",
                          borderRadius: "12px",
                          padding: "10px 6px",
                          textAlign: "center",
                          cursor: "default",
                          boxShadow: b.type === "O-" ? "0 4px 12px rgba(225, 29, 72, 0.25)" : "none",
                        }}
                      >
                        <div style={{ fontSize: "1.15rem", fontWeight: 800 }}>{b.type}</div>
                        <div style={{ fontSize: "0.68rem", opacity: 0.9, marginTop: "2px" }}>
                          {b.type === "O-" ? "Universal" : "Disponível"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Destaque do Doador Universal O- */}
                <div
                  style={{
                    background: "#fff1f2",
                    borderRadius: "14px",
                    padding: "16px",
                    border: "1px solid #fecdd3",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <Droplet size={20} color="#e11d48" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ fontSize: "0.85rem", color: "#9f1239", lineHeight: 1.5 }}>
                      <strong>Doador O- Negativo</strong> é a reserva de ouro dos hospitais em casos de emergência extrema, pois qualquer pessoa pode receber seu sangue sem testes prévios demorados.
                    </div>
                  </div>
                </div>

                {/* Mini Estatísticas Rápidas */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    paddingTop: "16px",
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#e11d48" }}>
                      {stats.totalDoadores}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                      Doadores Ativos
                    </div>
                  </div>
                  <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#e11d48" }}>
                      {stats.vidasSalvasEstimadas}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                      Vidas Salvas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= MÉTRICAS CONSOLIDADAS ========================= */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "-40px auto 60px",
          padding: "0 20px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "32px 28px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.06)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
          }}
        >
          <div style={{ textAlign: "center", borderRight: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#be123c", fontFamily: "var(--font-display)" }}>
              {stats.totalDoadores}
            </div>
            <div style={{ color: "#475569", fontWeight: 600, fontSize: "0.9rem", marginTop: "4px" }}>
              Doadores Cadastrados
            </div>
          </div>

          <div style={{ textAlign: "center", borderRight: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#be123c", fontFamily: "var(--font-display)" }}>
              {stats.doadoresAtivos}
            </div>
            <div style={{ color: "#475569", fontWeight: 600, fontSize: "0.9rem", marginTop: "4px" }}>
              Alertas WhatsApp Ativos
            </div>
          </div>

          <div style={{ textAlign: "center", borderRight: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#be123c", fontFamily: "var(--font-display)" }}>
              {stats.estadosAtivos} <span style={{ fontSize: "1.2rem", fontWeight: 600, opacity: 0.7 }}>/ 27</span>
            </div>
            <div style={{ color: "#475569", fontWeight: 600, fontSize: "0.9rem", marginTop: "4px" }}>
              Estados Cobertos
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#be123c", fontFamily: "var(--font-display)" }}>
              {stats.vidasSalvasEstimadas}
            </div>
            <div style={{ color: "#475569", fontWeight: 600, fontSize: "0.9rem", marginTop: "4px" }}>
              Vidas Salvas (Estimadas)
            </div>
          </div>
        </div>
      </section>

      {/* ========================= COMO FUNCIONA ========================= */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 80px", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#be123c",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Fluxo Ágil & Seguro
          </span>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: "#0f172a",
              marginTop: "8px",
            }}
          >
            Como o HemoAlerta funciona na prática
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.05rem", maxWidth: "600px", margin: "12px auto 0" }}>
            Três etapas simples entre a solicitação hospitalar e a vida salva.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
          {/* Passo 1 */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "32px 26px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#be123c",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "1.2rem",
                marginBottom: "20px",
              }}
            >
              01
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
              Você se cadastra
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Informa seu tipo sanguíneo, cidade e WhatsApp em menos de 1 minuto. Seus dados são protegidos por criptografia e LGPD.
            </p>
          </div>

          {/* Passo 2 */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "32px 26px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#be123c",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "1.2rem",
                marginBottom: "20px",
              }}
            >
              02
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
              Hospitais acionam SOS
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Quando um paciente precisa de sangue urgente, o hospital cadastra a emergência. O algoritmo cruza tipos compatíveis e localização.
            </p>
          </div>

          {/* Passo 3 */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "32px 26px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#be123c",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "1.2rem",
                marginBottom: "20px",
              }}
            >
              03
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
              Alerta no seu WhatsApp
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Você recebe uma mensagem oficial informando onde e quando doar. Você só doa se puder e tiver disponibilidade.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= CRITÉRIOS DE DOAÇÃO ========================= */}
      <section style={{ background: "#ffffff", padding: "80px 20px", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "48px",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#be123c",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Requisitos Oficiais
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  color: "#0f172a",
                  marginTop: "8px",
                  marginBottom: "18px",
                }}
              >
                Quem pode ser um doador de sangue?
              </h2>
              <p style={{ color: "#64748b", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "28px" }}>
                Doar sangue é um processo seguro e indolor. Confira os requisitos básicos estabelecidos pelo Ministério da Saúde:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Ter entre 16 e 69 anos de idade (menores de 18 com autorização)",
                  "Pesar no mínimo 50 kg em boas condições gerais de saúde",
                  "Estar descansado (ter dormido pelo menos 6 horas nas últimas 24h)",
                  "Estar alimentado (evitar alimentos gordurosos 4 horas antes)",
                  "Apresentar documento original com foto emitido por órgão oficial",
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#dcfce7",
                        display: "grid",
                        placeItems: "center",
                        color: "#16a34a",
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: "0.95rem", color: "#334155", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #1e293b, #0f172a)",
                borderRadius: "24px",
                padding: "36px",
                color: "#ffffff",
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
              }}
            >
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "14px", color: "#fecdd3" }}>
                Por que a sua doação importa tanto?
              </h3>
              <p style={{ color: "#cbd5e1", lineHeight: 1.65, fontSize: "0.95rem", marginBottom: "24px" }}>
                O sangue humano não pode ser fabricado artificialmente. Nos momentos de cirurgias, acidentes e tratamentos contra o câncer, a única esperança de quem precisa é a solidariedade de pessoas como você.
              </p>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
                <Link
                  href="/cadastro"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#e11d48",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    textDecoration: "none",
                  }}
                >
                  <span>Cadastre-se Agora Gratuitamente</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= CTA FINAL IMPACTANTE ========================= */}
      <section style={{ maxWidth: "1200px", margin: "80px auto", padding: "0 20px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #be123c 0%, #881337 100%)",
            borderRadius: "28px",
            padding: "clamp(40px, 6vw, 64px) clamp(24px, 5vw, 48px)",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 20px 50px rgba(190, 18, 60, 0.28)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            Faça parte da maior rede de solidariedade do Brasil
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
              maxWidth: "640px",
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            Cadastre-se em 60 segundos e esteja pronto para salvar vidas quando um hospital da sua cidade precisar.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/cadastro"
              style={{
                background: "#ffffff",
                color: "#be123c",
                padding: "16px 36px",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "1.05rem",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Heart size={18} fill="#be123c" />
              <span>Quero Salvar Vidas</span>
            </Link>

            <Link
              href="/rede"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                border: "1.5px solid rgba(255,255,255,0.4)",
                padding: "16px 28px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "1.05rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>Ver Mapa da Rede</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
