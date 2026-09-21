"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  sendEmergency,
  checkCompatibility,
  fetchRegionAvailability,
  EmergencyResponse,
  CompatibilityResponse,
  RegionalAvailabilityResponse,
} from "@/services/api";
import ConfirmModal from "@/components/ConfirmModal";
import {
  Siren,
  Zap,
  Globe,
  Activity,
  Droplet,
  MapPin,
  Phone,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Building2,
  Clock,
  ShieldCheck,
  Send,
  RotateCcw,
  Sparkles,
  Check,
  Plus,
  Minus,
  ExternalLink,
  Info,
  ShieldAlert,
  Users,
  Image as ImageIcon,
} from "lucide-react";

const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const URGENCIAS = [
  {
    id: "CRÍTICA",
    titulo: "Crítica",
    tempo: "Até 6 horas",
    desc: "Trauma grave, choque hemorrágico ou cirurgia de urgência imediata",
    cor: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
  },
  {
    id: "ALTA",
    titulo: "Alta",
    tempo: "Até 24 horas",
    desc: "Internação em UTI, reposição oncológica ou procedimento agendado",
    cor: "#ea580c",
    bg: "#fff7ed",
    border: "#fdba74",
  },
  {
    id: "MÉDIA",
    titulo: "Moderada",
    tempo: "48 a 72 horas",
    desc: "Estoque preventivo ou cirurgia eletiva com previsão de transfusão",
    cor: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

function maskPhone(v: string) {
  let clean = v.replace(/\D/g, "");
  if (clean.length > 11) clean = clean.slice(0, 11);
  if (clean.length > 6) return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  if (clean.length > 2) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
  if (clean.length > 0) return `(${clean}`;
  return "";
}

function EmergenciaContent() {
  const searchParams = useSearchParams();
  const ufParam = searchParams.get("estado") || "";

  const [formData, setFormData] = useState({
    ajudaEstado: ufParam || "PB",
    ajudaCidade: "João Pessoa",
    ajudaHospital: "Hospital Estadual de Emergência e Trauma Senador Humberto Lucena",
    ajudaTipo: "O+",
    ajudaQuantidade: 2,
    ajudaUrgencia: "CRÍTICA",
    ajudaPaciente: "Paciente em Terapia Intensiva / Leito 14",
    ajudaContato: "",
    ajudaMensagem: "Doação urgente. Apresentar-se na recepção do hemocentro informando o código do alerta.",
  });

  const [regionalData, setRegionalData] = useState<RegionalAvailabilityResponse | null>(null);
  const [loadingRegion, setLoadingRegion] = useState(false);
  const [compatibility, setCompatibility] = useState<CompatibilityResponse | null>(null);
  const [loadingCompat, setLoadingCompat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdEmergency, setCreatedEmergency] = useState<EmergencyResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (ufParam) {
      setFormData((prev) => ({ ...prev, ajudaEstado: ufParam }));
    }
  }, [ufParam]);

  // Consulta disponibilidade regional sempre que Estado ou Cidade mudarem
  useEffect(() => {
    if (formData.ajudaEstado) {
      setLoadingRegion(true);
      fetchRegionAvailability(formData.ajudaEstado, formData.ajudaCidade || undefined)
        .then((data) => {
          setRegionalData(data);
          // Se o tipo atual não tem doadores na região mas outros têm, auto-seleciona o primeiro disponível
          if (data.tiposComDoadores && data.tiposComDoadores.length > 0) {
            if (!data.tiposComDoadores.includes(formData.ajudaTipo)) {
              setFormData((prev) => ({ ...prev, ajudaTipo: data.tiposComDoadores[0] }));
            }
          }
        })
        .catch((err) => {
          console.warn("Erro ao buscar disponibilidade regional:", err);
        })
        .finally(() => setLoadingRegion(false));
    }
  }, [formData.ajudaEstado, formData.ajudaCidade]);

  // Consulta compatibilidade em tempo real ao mudar tipo, UF ou cidade
  useEffect(() => {
    if (formData.ajudaTipo && formData.ajudaEstado) {
      setLoadingCompat(true);
      checkCompatibility(
        formData.ajudaTipo,
        formData.ajudaEstado,
        formData.ajudaCidade || undefined
      )
        .then((data) => setCompatibility(data))
        .catch(() => {})
        .finally(() => setLoadingCompat(false));
    }
  }, [formData.ajudaTipo, formData.ajudaEstado, formData.ajudaCidade]);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.ajudaEstado) errs.ajudaEstado = "Selecione a UF.";
    if (!formData.ajudaCidade.trim()) errs.ajudaCidade = "Informe a cidade.";
    if (!formData.ajudaHospital.trim()) errs.ajudaHospital = "Informe o Hospital ou Hemocentro onde será a doação.";
    if (!formData.ajudaTipo) errs.ajudaTipo = "Selecione o tipo de sangue.";
    if (!formData.ajudaQuantidade || formData.ajudaQuantidade < 1) errs.ajudaQuantidade = "Informe ao menos 1 bolsa.";
    if (!formData.ajudaPaciente.trim()) errs.ajudaPaciente = "Informe o paciente ou leito.";
    if (!formData.ajudaContato.trim() || formData.ajudaContato.replace(/\D/g, "").length < 10) {
      errs.ajudaContato = "Informe um telefone válido com DDD (WhatsApp).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleExecuteSend = async () => {
    setLoading(true);
    try {
      const res = await sendEmergency({
        tipo: formData.ajudaTipo,
        quantidade: formData.ajudaQuantidade,
        paciente: formData.ajudaPaciente,
        hospital: formData.ajudaHospital,
        cidade: formData.ajudaCidade,
        estado: formData.ajudaEstado,
        urgencia: formData.ajudaUrgencia,
        contato: formData.ajudaContato,
        mensagem: formData.ajudaMensagem,
      });

      setCreatedEmergency(res.emergencia);
      setErrors({});
      window.scrollTo({ top: 250, behavior: "smooth" });
    } catch (err: any) {
      alert("Erro ao registrar chamado de emergência: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ajudaEstado: "PB",
      ajudaCidade: "João Pessoa",
      ajudaHospital: "Hospital Estadual de Emergência e Trauma Senador Humberto Lucena",
      ajudaTipo: "O+",
      ajudaQuantidade: 1,
      ajudaUrgencia: "CRÍTICA",
      ajudaPaciente: "",
      ajudaContato: "",
      ajudaMensagem: "",
    });
    setCreatedEmergency(null);
    setErrors({});
  };

  const previewMessage = `🚨 *[ALERTA DE EMERGÊNCIA — HEMOALERTA]*

⚠️ *Nível de Urgência:* ${formData.ajudaUrgencia}
🩸 *Tipo Sanguíneo Necessário:* ${formData.ajudaTipo}
📦 *Demanda:* ${formData.ajudaQuantidade} bolsa(s)
🏥 *Hospital / Hemocentro:* ${formData.ajudaHospital || "Hospital Regional"}
👤 *Paciente / Ala:* ${formData.ajudaPaciente || "Paciente em Atendimento"}
📍 *Localização:* ${formData.ajudaCidade || "Cidade"}, ${formData.ajudaEstado}
📞 *Contato Direto:* ${formData.ajudaContato || "(XX) XXXXX-XXXX"}
${formData.ajudaMensagem ? `\n📝 *Observações:* ${formData.ajudaMensagem}` : ""}

_Sua doação pode salvar uma vida agora mesmo. Compareça ao local informado ou responda esta mensagem se puder doar!_`;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "clamp(20px, 3.5vw, 48px) clamp(16px, 2.5vw, 32px)" }}>
      {/* ======================= HERO BANNER PROFISSIONAL ======================= */}
      <section
        style={{
          background: "linear-gradient(135deg, #881337 0%, #9f1239 50%, #4c0519 100%)",
          color: "#ffffff",
          padding: "clamp(28px, 4vw, 44px)",
          borderRadius: "24px",
          marginBottom: "32px",
          boxShadow: "0 20px 40px -15px rgba(136, 19, 55, 0.4)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244, 63, 94, 0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "780px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)", padding: "6px 14px", borderRadius: "30px", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "16px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px #ef4444" }} />
              <Siren size={15} color="#fecdd3" />
              <span>Rede de Atendimento & Triagem SOS</span>
            </div>

            <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)", fontWeight: 900, lineHeight: 1.15, fontFamily: "var(--font-display)", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
              Solicitação de Emergência Sanguínea
            </h1>

            <p style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.12rem)", opacity: 0.92, lineHeight: 1.6, margin: 0, maxWidth: "680px" }}>
              Cadastre a demanda crítica de bolsas de sangue. O chamado é filtrado pelos doadores reais disponíveis na região e submetido para moderação do administrador do Hemocentro antes do disparo 1 a 1 via WhatsApp.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              padding: "16px 22px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              minWidth: "220px",
            }}
          >
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "#fecdd3", fontWeight: 700 }}>
              Suporte Clínico & Hemorrede
            </span>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
              Disque Saúde: 136
            </span>
            <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
              Orientação pública do Ministério da Saúde
            </span>
          </div>
        </div>

        {/* Pilares do Fluxo com Moderação */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginTop: "28px", position: "relative", zIndex: 1 }}>
          <div style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(8px)", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.2)", display: "grid", placeItems: "center" }}>
              <Globe size={20} color="#fbbf24" />
            </div>
            <div>
              <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>Filtro Regional</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Tipos sanguíneos validados por região</div>
            </div>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(8px)", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.2)", display: "grid", placeItems: "center" }}>
              <ShieldCheck size={20} color="#93c5fd" />
            </div>
            <div>
              <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>Moderação pelo Admin</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Validação antes de qualquer disparo</div>
            </div>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(8px)", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(34, 197, 94, 0.2)", display: "grid", placeItems: "center" }}>
              <MessageSquare size={20} color="#4ade80" />
            </div>
            <div>
              <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>Envio 1 a 1 com Imagem</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Arte oficial enviada no WhatsApp</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= TELA DE CONFIRMAÇÃO PÓS-ENVIO ======================= */}
      {createdEmergency && (
        <div
          style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
            border: "2px solid #86efac",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "32px",
            boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                display: "grid",
                placeItems: "center",
                color: "#ffffff",
                flexShrink: 0,
                boxShadow: "0 6px 16px rgba(22, 163, 74, 0.28)",
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#dcfce7", border: "1px solid #86efac", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
                <span>Enviado para o Sistema — Aguardando Triagem</span>
              </div>

              <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#14532d", margin: "0 0 8px 0" }}>
                Solicitação #{createdEmergency.id} Enviada com Sucesso!
              </h2>

              <p style={{ color: "#166534", fontSize: "0.98rem", margin: "0 0 16px 0", lineHeight: 1.6, maxWidth: "800px" }}>
                Sua solicitação já está registrada em nosso sistema. Nossa equipe do Hemocentro / Central SOS está conferindo as informações médicas e, <strong>em breve, realizará o aviso e a mobilização direta dos doadores compatíveis da região via WhatsApp</strong> com a arte oficial de convocação.
              </p>

              {/* Detalhes do Chamado Registrado */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #bbf7d0",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  marginBottom: "20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  fontSize: "0.86rem",
                  color: "#334155",
                }}
              >
                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700 }}>Hospital de Atendimento:</span>
                  <strong style={{ color: "#0f172a" }}>{createdEmergency.hospital || "Hospital de Referência"}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700 }}>Tipo & Quantidade:</span>
                  <strong style={{ color: "#dc2626", fontSize: "0.98rem" }}>{createdEmergency.tipo}</strong> ({createdEmergency.quantidade} bolsa(s))
                </div>
                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700 }}>Localidade:</span>
                  <strong style={{ color: "#0f172a" }}>{createdEmergency.cidade}, {createdEmergency.estado}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700 }}>Doadores Mapeados:</span>
                  <strong style={{ color: "#166534" }}>{createdEmergency.doadoresAptosNotificados} {createdEmergency.doadoresAptosNotificados === 1 ? "voluntário apto" : "voluntários aptos"}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: "#16a34a",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 22px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
                  }}
                >
                  <Plus size={16} />
                  <span>Cadastrar Outra Solicitação</span>
                </button>

                <a
                  href="/"
                  style={{
                    background: "#ffffff",
                    color: "#166534",
                    border: "1.5px solid #86efac",
                    padding: "11px 20px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>Voltar para a Página Inicial</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= LAYOUT PRINCIPAL EM 2 COLUNAS ======================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 540px), 1fr))",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* ===================== COLUNA ESQUERDA: FORMULÁRIO SOS ===================== */}
        <div>
          <form onSubmit={handleOpenConfirm} noValidate style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* CARD 1: REGIÃO & HOSPITAL (PASSO 1) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "26px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#e0f2fe", display: "grid", placeItems: "center", color: "#0284c7" }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    1. Região & Local de Atendimento
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Defina a localização para filtrar os doadores disponíveis nessa localidade
                  </p>
                </div>
              </div>

              {/* Seletor Estado e Cidade */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "14px", marginBottom: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Estado (UF) *
                  </label>
                  <select
                    value={formData.ajudaEstado}
                    onChange={(e) => setFormData({ ...formData, ajudaEstado: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: "10px",
                      border: errors.ajudaEstado ? "1.5px solid #dc2626" : "1.5px solid #cbd5e1",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      background: "#ffffff",
                    }}
                  >
                    {UFS.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                  {errors.ajudaEstado && <small style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{errors.ajudaEstado}</small>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.ajudaCidade}
                    onChange={(e) => setFormData({ ...formData, ajudaCidade: e.target.value })}
                    placeholder="Ex: João Pessoa"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: errors.ajudaCidade ? "1.5px solid #dc2626" : "1.5px solid #cbd5e1",
                      fontSize: "0.92rem",
                    }}
                  />
                  {errors.ajudaCidade && <small style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{errors.ajudaCidade}</small>}
                </div>
              </div>

              {/* Campo Hospital / Hemocentro */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Hospital / Hemocentro de Doação *
                </label>
                <div style={{ position: "relative" }}>
                  <Building2 size={18} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    value={formData.ajudaHospital}
                    onChange={(e) => setFormData({ ...formData, ajudaHospital: e.target.value })}
                    placeholder="Ex: Hospital Estadual de Emergência e Trauma Senador Humberto Lucena"
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 38px",
                      borderRadius: "10px",
                      border: errors.ajudaHospital ? "1.5px solid #dc2626" : "1.5px solid #cbd5e1",
                      fontSize: "0.92rem",
                    }}
                  />
                </div>
                <small style={{ display: "block", color: "#64748b", fontSize: "0.78rem", marginTop: "4px" }}>
                  Este nome será enviado aos voluntários para saberem onde comparecer para doar
                </small>
                {errors.ajudaHospital && <small style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{errors.ajudaHospital}</small>}
              </div>

              {/* Banner Dinâmico de Disponibilidade Regional */}
              <div
                style={{
                  background: loadingRegion
                    ? "#f8fafc"
                    : (regionalData?.totalDoadores ?? 0) > 0
                    ? "#f0fdf4"
                    : "#fff7ed",
                  border: loadingRegion
                    ? "1px solid #e2e8f0"
                    : (regionalData?.totalDoadores ?? 0) > 0
                    ? "1px solid #86efac"
                    : "1px solid #fdba74",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.85rem",
                  color: loadingRegion
                    ? "#64748b"
                    : (regionalData?.totalDoadores ?? 0) > 0
                    ? "#166534"
                    : "#9a3412",
                }}
              >
                {loadingRegion ? (
                  <>
                    <Clock size={16} className="animate-spin" />
                    <span>Consultando doadores registrados na região...</span>
                  </>
                ) : (regionalData?.totalDoadores ?? 0) > 0 ? (
                  <>
                    <Users size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>{regionalData?.totalDoadores} doadores cadastrados</strong> em{" "}
                      {formData.ajudaCidade ? `${formData.ajudaCidade}, ` : ""}
                      {formData.ajudaEstado}. Apenas tipos com voluntários registrados estão habilitados no passo seguinte.
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} color="#ea580c" style={{ flexShrink: 0 }} />
                    <div>
                      Nenhum doador específico encontrado para esta cidade. O sistema estenderá a busca para todo o estado de <strong>{formData.ajudaEstado}</strong>.
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CARD 2: TIPO SANGUÍNEO & PRIORIDADE (HABILITA APENAS COM DOADORES NA REGIÃO) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "26px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fee2e2", display: "grid", placeItems: "center", color: "#dc2626" }}>
                  <Droplet size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    2. Tipo Sanguíneo & Nível de Urgência
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Habilitados apenas os tipos sanguíneos com doadores reais na região
                  </p>
                </div>
              </div>

              {/* Seletor Visual com Restrição Regional */}
              <div style={{ marginBottom: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label style={{ fontSize: "0.84rem", fontWeight: 700, color: "#334155" }}>
                    Tipo Sanguíneo Necessário *
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Baseado nos cadastros de {formData.ajudaEstado}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {TIPOS_SANGUINEOS.map((tipo) => {
                    const countInRegion = regionalData?.porTipo?.[tipo] ?? 0;
                    // Habilitado se tiver doador na região ou enquanto não carregou
                    const hasDonors = regionalData ? countInRegion > 0 : true;
                    const isSelected = formData.ajudaTipo === tipo;

                    return (
                      <button
                        key={tipo}
                        type="button"
                        disabled={!hasDonors}
                        onClick={() => hasDonors && setFormData({ ...formData, ajudaTipo: tipo })}
                        title={hasDonors ? `${countInRegion} doador(es) na região` : "Sem doadores cadastrados nesta região"}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "12px",
                          border: isSelected
                            ? "2px solid #dc2626"
                            : hasDonors
                            ? "1.5px solid #cbd5e1"
                            : "1.5px dashed #e2e8f0",
                          background: isSelected
                            ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                            : hasDonors
                            ? "#ffffff"
                            : "#f8fafc",
                          color: isSelected
                            ? "#ffffff"
                            : hasDonors
                            ? "#1e293b"
                            : "#94a3b8",
                          opacity: hasDonors ? 1 : 0.45,
                          fontSize: "1.1rem",
                          fontWeight: 800,
                          cursor: hasDonors ? "pointer" : "not-allowed",
                          transition: "all 0.18s ease",
                          boxShadow: isSelected ? "0 6px 16px rgba(220, 38, 38, 0.3)" : "none",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "3px",
                          position: "relative",
                        }}
                      >
                        <span>{tipo}</span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "6px",
                            background: isSelected
                              ? "rgba(255,255,255,0.25)"
                              : hasDonors
                              ? "#ecfdf5"
                              : "#f1f5f9",
                            color: isSelected
                              ? "#ffffff"
                              : hasDonors
                              ? "#15803d"
                              : "#94a3b8",
                          }}
                        >
                          {hasDonors ? `${countInRegion} apto${countInRegion === 1 ? "" : "s"}` : "0 na região"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.ajudaTipo && <small style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{errors.ajudaTipo}</small>}
              </div>

              {/* Quantidade de bolsas com Stepper moderno */}
              <div style={{ marginBottom: "22px" }}>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                  Quantidade de Bolsas Estimada *
                </label>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: "#f1f5f9",
                      borderRadius: "12px",
                      padding: "4px",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, ajudaQuantidade: Math.max(1, p.ajudaQuantidade - 1) }))}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#ffffff",
                        color: "#334155",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Minus size={16} />
                    </button>

                    <span style={{ minWidth: "60px", textAlign: "center", fontWeight: 800, fontSize: "1.15rem", color: "#0f172a" }}>
                      {formData.ajudaQuantidade} {formData.ajudaQuantidade === 1 ? "bolsa" : "bolsas"}
                    </span>

                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, ajudaQuantidade: Math.min(50, p.ajudaQuantidade + 1) }))}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#ffffff",
                        color: "#334155",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Atalhos rápidos de quantidade */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[1, 2, 4, 8].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setFormData({ ...formData, ajudaQuantidade: qty })}
                        style={{
                          background: formData.ajudaQuantidade === qty ? "#fee2e2" : "#f8fafc",
                          border: formData.ajudaQuantidade === qty ? "1px solid #fca5a5" : "1px solid #e2e8f0",
                          color: formData.ajudaQuantidade === qty ? "#991b1b" : "#475569",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.ajudaQuantidade && <small style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{errors.ajudaQuantidade}</small>}
              </div>

              {/* Nível de Urgência com Cards Explicativos */}
              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                  Nível de Urgência da Transfusão *
                </label>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {URGENCIAS.map((urg) => {
                    const isSelected = formData.ajudaUrgencia === urg.id;
                    return (
                      <div
                        key={urg.id}
                        onClick={() => setFormData({ ...formData, ajudaUrgencia: urg.id })}
                        style={{
                          border: isSelected ? `2px solid ${urg.cor}` : "1.5px solid #e2e8f0",
                          background: isSelected ? urg.bg : "#ffffff",
                          borderRadius: "12px",
                          padding: "14px 16px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: urg.cor }}>
                              {urg.titulo}
                            </span>
                            <span
                              style={{
                                background: urg.cor,
                                color: "#ffffff",
                                padding: "2px 8px",
                                borderRadius: "20px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                              }}
                            >
                              {urg.tempo}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "3px" }}>
                            {urg.desc}
                          </div>
                        </div>

                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: isSelected ? `6px solid ${urg.cor}` : "2px solid #cbd5e1",
                            background: "#ffffff",
                            flexShrink: 0,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CARD 3: PACIENTE & CONTATO OFICIAL (PASSO 3) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "26px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f0fdf4", display: "grid", placeItems: "center", color: "#16a34a" }}>
                  <Phone size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    3. Paciente & Contato Oficial
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Dados de referência médica e telefone de confirmação dos voluntários
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Paciente / Ala Hospitalar / Leito *
                </label>
                <input
                  type="text"
                  value={formData.ajudaPaciente}
                  onChange={(e) => setFormData({ ...formData, ajudaPaciente: e.target.value })}
                  placeholder="Ex: Paciente Maria Silva / UTI Geral Leito 08"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: errors.ajudaPaciente ? "1.5px solid #dc2626" : "1.5px solid #cbd5e1",
                    fontSize: "0.92rem",
                  }}
                />
                {errors.ajudaPaciente && <small style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{errors.ajudaPaciente}</small>}
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Telefone / WhatsApp de Contato Oficial *
                </label>
                <div style={{ position: "relative" }}>
                  <Phone size={18} color="#16a34a" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={formData.ajudaContato}
                    onChange={(e) => setFormData({ ...formData, ajudaContato: maskPhone(e.target.value) })}
                    placeholder="(83) 99999-9999"
                    maxLength={16}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 38px",
                      borderRadius: "10px",
                      border: errors.ajudaContato ? "1.5px solid #dc2626" : "1.5px solid #cbd5e1",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                    }}
                  />
                </div>
                <small style={{ display: "block", color: "#64748b", fontSize: "0.78rem", marginTop: "4px" }}>
                  Os voluntários que receberem o alerta responderão diretamente para este número
                </small>
                {errors.ajudaContato && <small style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{errors.ajudaContato}</small>}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Instruções Clínicas ou Observações <span style={{ color: "#94a3b8", fontWeight: 400 }}>(opcional)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.ajudaMensagem}
                  onChange={(e) => setFormData({ ...formData, ajudaMensagem: e.target.value })}
                  placeholder="Ex: Levar documento oficial com foto e informar na recepção que a doação é para o paciente..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.88rem",
                    resize: "vertical",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Box Informativo de Moderação Prévia */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <ShieldAlert size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.5 }}>
                  <strong style={{ color: "#0f172a" }}>Processo de Triagem e Moderação Ativa:</strong> Ao submeter o formulário, o chamado será gravado com status <strong>PENDENTE</strong>. O administrador do Hemocentro fará a checagem médica e acionará o envio 1 a 1 via WhatsApp para os voluntários aptos da região junto com a imagem oficial do alerta.
                </div>
              </div>
            </div>

            {/* Ações do Formulário */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  padding: "12px 22px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <RotateCcw size={16} />
                <span>Limpar Campos</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  color: "#ffffff",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 6px 20px rgba(220, 38, 38, 0.4)",
                  transition: "transform 0.15s, opacity 0.2s",
                }}
              >
                <Siren size={20} />
                <span>{loading ? "Registrando solicitação..." : "Enviar Chamado para o Admin"}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* ===================== COLUNA DIREITA: RADAR AO VIVO & SIMULADOR COM ARTE ===================== */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "20px" }}>
          
          {/* RADAR DE DOADORES APTOS NA REGIÃO */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#ffffff",
              borderRadius: "20px",
              padding: "26px",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#86efac", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Radar de Compatibilidade Regional
                </span>
              </div>
              <Activity size={18} color="#86efac" />
            </div>

            <div style={{ margin: "20px 0" }}>
              <div style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1, fontFamily: "var(--font-display)", color: "#ffffff", display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span>{loadingCompat ? "..." : compatibility?.totalAptos ?? 0}</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 500, color: "#94a3b8" }}>doadores compatíveis</span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px" }}>
                Voluntários em <strong>{formData.ajudaCidade ? `${formData.ajudaCidade}, ` : ""}{formData.ajudaEstado}</strong> com sangue compatível com <strong>{formData.ajudaTipo}</strong>
              </p>
            </div>

            {/* Grupos compatíveis para a bolsa selecionada */}
            <div style={{ background: "rgba(255, 255, 255, 0.06)", borderRadius: "12px", padding: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "0.78rem", textTransform: "uppercase", color: "#cbd5e1", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Droplet size={14} color="#f43f5e" />
                <span>Quem pode doar para receptor {formData.ajudaTipo}:</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {compatibility && compatibility.tiposCompativeis.length > 0 ? (
                  compatibility.tiposCompativeis.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: t === formData.ajudaTipo ? "rgba(225, 29, 72, 0.4)" : "rgba(255, 255, 255, 0.12)",
                        border: t === formData.ajudaTipo ? "1px solid #f43f5e" : "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#ffffff",
                        padding: "3px 10px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Calculando compatibilidade...</span>
                )}
              </div>
            </div>
          </div>

          {/* SIMULADOR VISUAL DO WHATSAPP COM ARTE OFICIAL */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#25D366", display: "grid", placeItems: "center", color: "#fff" }}>
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Simulador do WhatsApp
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                    Mensagem + Arte enviadas 1 por 1 após aprovação
                  </p>
                </div>
              </div>
              <span style={{ fontSize: "0.72rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px", fontWeight: 600, color: "#475569" }}>
                Foto + Texto
              </span>
            </div>

            {/* Balão do WhatsApp estilizado com imagem */}
            <div
              style={{
                background: "#efeae2",
                borderRadius: "16px",
                padding: "16px",
                position: "relative",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px 12px 12px 2px",
                  padding: "12px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  color: "#111827",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  maxHeight: "440px",
                  overflowY: "auto",
                }}
              >
                {/* Imagem Oficial art.jpeg renderizada no balão */}
                <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", marginBottom: "10px", border: "1px solid #e2e8f0" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/art.jpeg"
                    alt="Arte Oficial de Campanha SOS"
                    style={{
                      width: "100%",
                      maxHeight: "220px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "6px",
                      left: "8px",
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(4px)",
                      color: "#ffffff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <ImageIcon size={12} />
                    <span>Arte Oficial de Campanha (art.jpeg)</span>
                  </div>
                </div>

                <div style={{ whiteSpace: "pre-wrap" }}>
                  {previewMessage}
                </div>

                <div style={{ textAlign: "right", marginTop: "8px", fontSize: "0.7rem", color: "#9ca3af", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "4px" }}>
                  <span>Agora</span>
                  <Check size={13} color="#25D366" />
                </div>
              </div>
            </div>

            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#64748b" }}>
              <Info size={15} color="#0284c7" style={{ flexShrink: 0 }} />
              <span>
                A imagem <code>art.jpeg</code> e a legenda detalhando o Hospital e Paciente serão entregues pelo bot oficial.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================= MODAL DE CONFIRMAÇÃO SOS ======================= */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirmar Envio para Triagem do Administrador"
        type="warning"
        confirmText="Confirmar e Enviar para o Admin"
        cancelText="Revisar Informações"
        onConfirm={handleExecuteSend}
        onClose={() => setShowConfirmModal(false)}
        message={
          <div>
            <p>
              Você está cadastrando uma solicitação de emergência para o <strong>{formData.ajudaHospital}</strong> em <strong>{formData.ajudaCidade}/{formData.ajudaEstado}</strong>.
            </p>
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                background: "#fef3c7",
                borderRadius: "10px",
                border: "1px solid #fde68a",
                fontSize: "0.84rem",
                color: "#92400e",
              }}
            >
              <div><strong>Tipo Sanguíneo:</strong> {formData.ajudaTipo} ({formData.ajudaQuantidade} bolsa(s))</div>
              <div><strong>Urgência:</strong> {formData.ajudaUrgencia}</div>
              <div><strong>Hospital:</strong> {formData.ajudaHospital}</div>
              <div><strong>Paciente / Leito:</strong> {formData.ajudaPaciente}</div>
              <div><strong>Telefone de Retorno:</strong> {formData.ajudaContato}</div>
              <div><strong>Doadores compatíveis estimados:</strong> {compatibility?.totalAptos ?? 0} voluntário(s)</div>
            </div>
            <p style={{ marginTop: "12px", fontSize: "0.8rem", color: "#64748b" }}>
              ⚠️ Esta chamada <strong>NÃO</strong> irá disparar mensagens automáticas imediatamente aos doadores. O chamado entrará na fila de aprovação do painel <code>/admin</code> para validação médica.
            </p>
          </div>
        }
      />
    </div>
  );
}

export default function EmergenciaPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "60px 20px" }}>Carregando módulo de emergência...</div>}>
      <EmergenciaContent />
    </Suspense>
  );
}
