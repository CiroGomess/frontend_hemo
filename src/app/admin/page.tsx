"use client";

import { useState, useEffect } from "react";
import {
  adminLogin,
  fetchWhatsAppStatus,
  fetchWhatsAppQRCode,
  connectWhatsApp,
  disconnectWhatsApp,
  sendWhatsAppTest,
  broadcastWhatsAppAlert,
  fetchHemocentros,
  createHemocentro,
  deleteHemocentro,
  WhatsAppStatus,
  Hemocentro,
} from "@/services/api";
import {
  Shield,
  KeyRound,
  UserCheck,
  QrCode,
  Smartphone,
  Send,
  Radio,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Zap,
  Info,
  Lock,
  User,
  Eye,
  EyeOff,
  MessageSquare,
  Building2,
  MapPin,
  Check,
  Plus,
  Trash2,
  Search,
  Phone,
  Clock,
} from "lucide-react";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"whatsapp" | "emergencia" | "hemocentros">("whatsapp");

  // WhatsApp State
  const [waStatus, setWaStatus] = useState<WhatsAppStatus>({
    status: "DISCONNECTED",
    hasQrCode: false,
  });
  const [qrCodeImg, setQrCodeImg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Test message state
  const [testPhone, setTestPhone] = useState("");
  const [testMsg, setTestMsg] = useState("Olá! Esta é uma notificação de teste do HemoAlerta via Venom-Bot.");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Broadcast state
  const [alertTipo, setAlertTipo] = useState("O-");
  const [alertEstado, setAlertEstado] = useState("PB");
  const [alertCidade, setAlertCidade] = useState("João Pessoa");
  const [alertHospital, setAlertHospital] = useState("Hemocentro Regional da Paraíba");
  const [alertUrgencia, setAlertUrgencia] = useState("ALTA");
  const [broadcastResult, setBroadcastResult] = useState<any | null>(null);
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // Hemocentros Management State
  const [hemocentros, setHemocentros] = useState<Hemocentro[]>([]);
  const [hemoLoading, setHemoLoading] = useState(false);
  const [hemoSearch, setHemoSearch] = useState("");
  const [hemoSuccess, setHemoSuccess] = useState<string | null>(null);
  const [hemoError, setHemoError] = useState<string | null>(null);
  const [hemoSubmitting, setHemoSubmitting] = useState(false);
  const [hemoForm, setHemoForm] = useState({
    nome: "",
    tipo: "hemocentro",
    estado: "PB",
    cidade: "João Pessoa",
    endereco: "",
    telefone: "",
    horario: "Seg-Sex: 7h30-17h, Sáb: 7h-12h"
  });

  useEffect(() => {
    const token = localStorage.getItem("hemoalerta_admin_token");
    if (token) {
      setIsLogged(true);
    }
  }, []);

  const loadHemocentros = () => {
    setHemoLoading(true);
    fetchHemocentros()
      .then((data) => setHemocentros(data))
      .catch((err) => console.error("Erro ao carregar hemocentros:", err))
      .finally(() => setHemoLoading(false));
  };

  useEffect(() => {
    if (!isLogged) return;

    loadHemocentros();

    const checkStatus = () => {
      fetchWhatsAppStatus()
        .then((data) => {
          setWaStatus(data);
          if (data.status === "QRCODE_READY" || data.hasQrCode) {
            fetchWhatsAppQRCode()
              .then((qr) => setQrCodeImg(qr.qrcode))
              .catch(() => {});
          } else if (data.status === "CONNECTED") {
            setQrCodeImg(null);
          }
        })
        .catch(() => {
          setWaStatus({ status: "OFFLINE", hasQrCode: false });
        });
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2500);
    return () => clearInterval(interval);
  }, [isLogged]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await adminLogin(username, password);
      localStorage.setItem("hemoalerta_admin_token", res.token);
      setIsLogged(true);
    } catch (err: any) {
      setLoginError(err.message || "Usuário ou senha incorretos");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername("admin");
    setPassword("admin123");
    setLoginLoading(true);
    setLoginError(null);

    adminLogin("admin", "admin123")
      .then((res) => {
        localStorage.setItem("hemoalerta_admin_token", res.token);
        setIsLogged(true);
      })
      .catch((err) => setLoginError(err.message))
      .finally(() => setLoginLoading(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("hemoalerta_admin_token");
    setIsLogged(false);
  };

  const handleConnect = async () => {
    setActionLoading(true);
    setActionMessage("Iniciando instância Venom-Bot... Aguarde o QR Code.");
    try {
      await connectWhatsApp();
    } catch (err: any) {
      setActionMessage("Erro ao conectar: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Deseja realmente desconectar a sessão do WhatsApp?")) return;
    setActionLoading(true);
    try {
      await disconnectWhatsApp();
      setQrCodeImg(null);
      setActionMessage("Sessão desconectada.");
    } catch (err: any) {
      setActionMessage("Erro: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) {
      alert("Informe o telefone com DDD.");
      return;
    }
    setTestLoading(true);
    setTestResult(null);
    try {
      await sendWhatsAppTest(testPhone, testMsg);
      setTestResult("✅ Mensagem de teste enviada com sucesso!");
    } catch (err: any) {
      setTestResult("❌ Erro ao enviar: " + err.message);
    } finally {
      setTestLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (waStatus.status !== "CONNECTED") {
      alert("Conecte o WhatsApp do HemoAlerta antes de disparar alertas.");
      return;
    }

    if (!confirm(`Confirmar disparo para todos os doadores compatíveis com ${alertTipo} em ${alertEstado}?`)) {
      return;
    }

    setBroadcastLoading(true);
    setBroadcastResult(null);
    try {
      const res = await broadcastWhatsAppAlert({
        tipoSanguineo: alertTipo,
        estado: alertEstado,
        cidade: alertCidade,
        hospital: alertHospital,
        urgencia: alertUrgencia,
      });
      setBroadcastResult(res);
    } catch (err: any) {
      alert("Erro ao disparar alerta: " + err.message);
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleAddHemocentro = async (e: React.FormEvent) => {
    e.preventDefault();
    setHemoError(null);
    setHemoSuccess(null);
    setHemoSubmitting(true);

    try {
      await createHemocentro(hemoForm);
      setHemoSuccess("Hemocentro cadastrado com sucesso! Ele já está disponível no mapa e busca pública.");
      setHemoForm({
        nome: "",
        tipo: "hemocentro",
        estado: hemoForm.estado,
        cidade: hemoForm.cidade,
        endereco: "",
        telefone: "",
        horario: "Seg-Sex: 7h30-17h, Sáb: 7h-12h"
      });
      loadHemocentros();
    } catch (err: any) {
      setHemoError(err.message || "Erro ao cadastrar hemocentro.");
    } finally {
      setHemoSubmitting(false);
    }
  };

  const handleDeleteHemocentro = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente remover o cadastro de "${nome}"?`)) return;
    try {
      await deleteHemocentro(id);
      loadHemocentros();
    } catch (err: any) {
      alert("Erro ao remover: " + err.message);
    }
  };

  const filteredHemocentros = hemocentros.filter((h) => {
    const q = hemoSearch.toLowerCase();
    return (
      h.nome.toLowerCase().includes(q) ||
      h.cidade.toLowerCase().includes(q) ||
      h.estado.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ background: "#f8fafc", minHeight: "85vh", padding: "clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)" }}>
      {/* ===================== CASO NÃO ESTEJA LOGADO: LOGIN LIMPO ===================== */}
      {!isLogged ? (
        <div style={{ maxWidth: "440px", margin: "40px auto" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "40px 32px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.02)",
            }}
          >
            {/* Ícone de Topo */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  margin: "0 auto 16px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #e11d48, #be123c)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  boxShadow: "0 8px 20px rgba(225, 29, 72, 0.25)",
                }}
              >
                <Shield size={28} />
              </div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", fontFamily: "var(--font-display)" }}>
                Portal do Administrador
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "6px" }}>
                Gestão da instância Venom WhatsApp e hemocentros
              </p>
            </div>

            {/* Acesso Rápido Acadêmico Integrado */}
            <div
              style={{
                background: "#f8fafc",
                border: "1.5px dashed #cbd5e1",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🎓</span> Acesso Rápido de Avaliação
                </span>
                <span style={{ fontSize: "0.75rem", background: "#e2e8f0", color: "#334155", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                  Acadêmico
                </span>
              </div>

              <div style={{ fontSize: "0.84rem", color: "#64748b", marginBottom: "12px", display: "flex", gap: "12px" }}>
                <span>User: <strong style={{ color: "#0f172a" }}>admin</strong></span>
                <span>Senha: <strong style={{ color: "#0f172a" }}>admin123</strong></span>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={loginLoading}
                style={{
                  width: "100%",
                  background: "#ffffff",
                  color: "#be123c",
                  border: "1px solid #fecdd3",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
                }}
              >
                <Zap size={15} />
                <span>Preencher e Entrar com 1 Clique</span>
              </button>
            </div>

            {loginError && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            {/* Formulário de Login */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Usuário
                </label>
                <div style={{ position: "relative" }}>
                  <User size={18} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 38px",
                      borderRadius: "10px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.95rem",
                      outline: "none",
                      color: "#0f172a",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Senha
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={18} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 40px 12px 38px",
                      borderRadius: "10px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.95rem",
                      outline: "none",
                      color: "#0f172a",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  marginTop: "6px",
                  background: "linear-gradient(135deg, #e11d48, #be123c)",
                  color: "#ffffff",
                  border: "none",
                  padding: "13px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(225, 29, 72, 0.25)",
                }}
              >
                {loginLoading ? "Acessando..." : "Entrar no Painel"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ===================== DASHBOARD ADMINISTRATIVO ===================== */
        <div style={{ maxWidth: "1140px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header Superior */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "20px 28px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 8px #22c55e",
                  }}
                />
                <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", fontFamily: "var(--font-display)" }}>
                  Painel de Controle HemoAlerta
                </h1>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.88rem", marginTop: "2px" }}>
                Gestão da instância Venom WhatsApp, disparos SOS e cadastro de hemocentros
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  background: "#f1f5f9",
                  color: "#334155",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <UserCheck size={15} color="#0284c7" />
                <span>SuperAdmin</span>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #fecdd3",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <LogOut size={15} />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Abas de Navegação do Painel */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              style={{
                background: activeTab === "whatsapp" ? "#0f172a" : "#ffffff",
                color: activeTab === "whatsapp" ? "#ffffff" : "#475569",
                border: "1px solid #e2e8f0",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: activeTab === "whatsapp" ? "0 4px 12px rgba(15, 23, 42, 0.15)" : "none",
              }}
            >
              <Smartphone size={16} />
              <span>Conexão WhatsApp (Venom)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("emergencia")}
              style={{
                background: activeTab === "emergencia" ? "#0f172a" : "#ffffff",
                color: activeTab === "emergencia" ? "#ffffff" : "#475569",
                border: "1px solid #e2e8f0",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: activeTab === "emergencia" ? "0 4px 12px rgba(15, 23, 42, 0.15)" : "none",
              }}
            >
              <Radio size={16} />
              <span>Disparo de Alertas SOS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("hemocentros")}
              style={{
                background: activeTab === "hemocentros" ? "#0f172a" : "#ffffff",
                color: activeTab === "hemocentros" ? "#ffffff" : "#475569",
                border: "1px solid #e2e8f0",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: activeTab === "hemocentros" ? "0 4px 12px rgba(15, 23, 42, 0.15)" : "none",
              }}
            >
              <Building2 size={16} />
              <span>Cadastrar & Gerenciar Hemocentros</span>
              <span
                style={{
                  background: activeTab === "hemocentros" ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                }}
              >
                {hemocentros.length}
              </span>
            </button>
          </div>

          {/* ===================== TAB 1: WHATSAPP VENOM ===================== */}
          {activeTab === "whatsapp" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "28px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #f1f5f9",
                  marginBottom: "24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#25d366",
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      boxShadow: "0 6px 16px rgba(37, 211, 102, 0.25)",
                    }}
                  >
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                      WhatsApp Oficial do HemoAlerta
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Instância Venom-Bot conectada ao WhatsApp Web para envio automático aos doadores
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <div>
                  {waStatus.status === "CONNECTED" && (
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        padding: "8px 16px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <CheckCircle2 size={18} />
                      <span>WhatsApp Conectado e Ativo</span>
                    </span>
                  )}

                  {waStatus.status === "QRCODE_READY" && (
                    <span
                      style={{
                        background: "#fef3c7",
                        color: "#92400e",
                        padding: "8px 16px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "1px solid #fde68a",
                      }}
                    >
                      <QrCode size={18} />
                      <span>Aguardando Leitura do QR Code</span>
                    </span>
                  )}

                  {waStatus.status === "STARTING" && (
                    <span
                      style={{
                        background: "#e0e7ff",
                        color: "#4338ca",
                        padding: "8px 16px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "1px solid #c7d2fe",
                      }}
                    >
                      <RefreshCw size={18} className="spin" />
                      <span>Iniciando Sessão Venom...</span>
                    </span>
                  )}

                  {waStatus.status === "DISCONNECTED" && (
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        padding: "8px 16px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      Desconectado
                    </span>
                  )}
                </div>
              </div>

              {/* Conteúdo Dinâmico por Estado */}
              {waStatus.status === "CONNECTED" ? (
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1.5px solid #86efac",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: "#166534", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Check size={20} />
                      <span>Aparelho Sincronizado com Sucesso</span>
                    </div>
                    <p style={{ color: "#15803d", fontSize: "0.9rem", marginTop: "4px", maxWidth: "600px" }}>
                      O número conectado responderá como canal oficial do HemoAlerta. As mensagens de emergência acionadas abaixo serão enviadas automaticamente por esta conta.
                    </p>
                  </div>

                  <button
                    onClick={handleDisconnect}
                    disabled={actionLoading}
                    type="button"
                    style={{
                      background: "#ffffff",
                      color: "#b91c1c",
                      border: "1.5px solid #fca5a5",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    Desconectar Sessão
                  </button>
                </div>
              ) : waStatus.status === "QRCODE_READY" && qrCodeImg ? (
                <div
                  style={{
                    background: "#ffffff",
                    border: "2px dashed #f59e0b",
                    borderRadius: "20px",
                    padding: "32px",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                    Escaneie o QR Code com seu WhatsApp
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 24px" }}>
                    Abra o WhatsApp no celular &gt; <strong>Aparelhos Conectados</strong> &gt; <strong>Conectar um aparelho</strong> e aponte para o código abaixo:
                  </p>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "20px",
                      background: "#ffffff",
                      borderRadius: "20px",
                      border: "2px solid #e2e8f0",
                      boxShadow: "0 12px 35px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <img
                      src={qrCodeImg.startsWith("data:") ? qrCodeImg : `data:image/png;base64,${qrCodeImg}`}
                      alt="QR Code Venom WhatsApp"
                      style={{ width: "260px", height: "260px", display: "block", borderRadius: "8px" }}
                    />
                  </div>

                  <div style={{ marginTop: "16px", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>
                    A página atualizará automaticamente assim que o celular ler o código.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "32px",
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      margin: "0 auto 12px",
                      borderRadius: "50%",
                      background: "#fee2e2",
                      display: "grid",
                      placeItems: "center",
                      color: "#be123c",
                    }}
                  >
                    <QrCode size={24} />
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                    Conectar WhatsApp para Ativar Disparos
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.92rem", maxWidth: "520px", margin: "0 auto 20px" }}>
                    Para que o HemoAlerta envie notificações oficiais aos doadores, inicie a sessão do Venom e escaneie o QR Code gerado pelo WhatsApp Web.
                  </p>

                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={actionLoading}
                    style={{
                      background: "linear-gradient(135deg, #25d366, #128c7e)",
                      color: "#ffffff",
                      border: "none",
                      padding: "13px 28px",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.98rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 6px 18px rgba(37, 211, 102, 0.3)",
                    }}
                  >
                    <QrCode size={18} />
                    <span>{actionLoading ? "Inicializando navegador..." : "Conectar WhatsApp via QR Code"}</span>
                  </button>

                  {actionMessage && (
                    <div style={{ marginTop: "14px", color: "#64748b", fontSize: "0.85rem" }}>
                      {actionMessage}
                    </div>
                  )}
                </div>
              )}

              {/* Teste Rápido de Envio Individual */}
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                  Testar Envio Individual de Mensagem WhatsApp
                </div>

                <form
                  onSubmit={handleSendTest}
                  style={{ display: "grid", gridTemplateColumns: "minmax(180px, 1fr) 2fr auto", gap: "12px", alignItems: "end" }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", marginBottom: "4px" }}>
                      Número com DDD (ex: 83999998888)
                    </label>
                    <input
                      type="text"
                      placeholder="83999998888"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", marginBottom: "4px" }}>
                      Mensagem de Teste
                    </label>
                    <input
                      type="text"
                      value={testMsg}
                      onChange={(e) => setTestMsg(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={testLoading || waStatus.status !== "CONNECTED"}
                    style={{
                      background: waStatus.status === "CONNECTED" ? "#0f172a" : "#cbd5e1",
                      color: "#ffffff",
                      border: "none",
                      padding: "11px 20px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: waStatus.status === "CONNECTED" ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Send size={15} />
                    <span>{testLoading ? "Enviando..." : "Enviar Teste"}</span>
                  </button>
                </form>

                {testResult && (
                  <div style={{ marginTop: "10px", fontSize: "0.86rem", fontWeight: 600, color: testResult.includes("✅") ? "#15803d" : "#b91c1c" }}>
                    {testResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 2: DISPARO DE EMERGÊNCIA ===================== */}
          {activeTab === "emergencia" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "28px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #e11d48, #be123c)",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                  }}
                >
                  <Radio size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
                    Disparo de Alerta de Emergência SOS
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    O backend Python pesquisa os doadores compatíveis no SQLite (<code>hemoalerta.db</code>) e comanda o envio via Venom
                  </p>
                </div>
              </div>

              <form onSubmit={handleBroadcast}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                    gap: "14px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Tipo Sanguíneo
                    </label>
                    <select
                      value={alertTipo}
                      onChange={(e) => setAlertTipo(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1.5px solid #e2e8f0",
                        fontWeight: 700,
                        color: "#be123c",
                      }}
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={alertEstado}
                      onChange={(e) => setAlertEstado(e.target.value.toUpperCase())}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1.5px solid #e2e8f0",
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={alertCidade}
                      onChange={(e) => setAlertCidade(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1.5px solid #e2e8f0",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Hospital / Hemocentro
                    </label>
                    <input
                      type="text"
                      value={alertHospital}
                      onChange={(e) => setAlertHospital(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1.5px solid #e2e8f0",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Nível de Urgência
                    </label>
                    <select
                      value={alertUrgencia}
                      onChange={(e) => setAlertUrgencia(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1.5px solid #e2e8f0",
                        fontWeight: 600,
                      }}
                    >
                      <option value="ALTA">Alta</option>
                      <option value="CRÍTICA">Crítica</option>
                      <option value="MÉDIA">Média</option>
                    </select>
                  </div>
                </div>

                {/* Prévia da Mensagem */}
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "14px",
                    padding: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#166534", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <MessageSquare size={16} />
                    <span>Prévia da Mensagem no WhatsApp:</span>
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dcfce7",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      color: "#1e293b",
                      lineHeight: 1.5,
                    }}
                  >
                    🚨 *ALERTA DE EMERGÊNCIA - HEMOALERTA* 🚨<br />
                    Olá {"{Nome do Doador}"},<br />
                    Precisamos com *URGÊNCIA MÁXIMA ({alertUrgencia})* de sangue tipo *{alertTipo}* em {alertCidade} / {alertEstado}.<br />
                    🏥 Local: {alertHospital}<br />
                    ❤️ Você está cadastrado no HemoAlerta como compatível. Cada doação salva até 4 vidas!
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={broadcastLoading || waStatus.status !== "CONNECTED"}
                  style={{
                    background: waStatus.status === "CONNECTED" ? "linear-gradient(135deg, #e11d48, #be123c)" : "#cbd5e1",
                    color: "#ffffff",
                    border: "none",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: waStatus.status === "CONNECTED" ? "pointer" : "not-allowed",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: waStatus.status === "CONNECTED" ? "0 6px 20px rgba(225, 29, 72, 0.28)" : "none",
                  }}
                >
                  <Zap size={18} />
                  <span>{broadcastLoading ? "Disparando mensagens pelo WhatsApp..." : "Disparar Alerta Oficial aos Doadores"}</span>
                </button>
              </form>

              {broadcastResult && (
                <div
                  style={{
                    marginTop: "20px",
                    background: "#f0fdf4",
                    border: "1px solid #86efac",
                    borderRadius: "12px",
                    padding: "16px 20px",
                  }}
                >
                  <div style={{ color: "#166534", fontWeight: 700, fontSize: "0.95rem" }}>
                    Relatório de Disparo Concluído
                  </div>
                  <div style={{ color: "#15803d", fontSize: "0.88rem", marginTop: "4px" }}>
                    Doadores compatíveis encontrados no SQLite: <strong>{broadcastResult.totalEncontrados ?? 0}</strong> • Mensagens enviadas: <strong>{broadcastResult.sentCount ?? 0}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 3: CADASTRO E GESTÃO DE HEMOCENTROS ===================== */}
          {activeTab === "hemocentros" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Formulário de Cadastro de Novo Hemocentro */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "28px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #0284c7, #0369a1)",
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                    }}
                  >
                    <Plus size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
                      Cadastrar Novo Hemocentro / Ponto de Doação
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Os hemocentros cadastrados aqui são salvos diretamente no SQLite (<code>hemoalerta.db</code>) e aparecem na busca pública para todos os doadores
                    </p>
                  </div>
                </div>

                {hemoSuccess && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      color: "#166534",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      border: "1px solid #bbf7d0",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{hemoSuccess}</span>
                  </div>
                )}

                {hemoError && (
                  <div
                    style={{
                      background: "#fee2e2",
                      color: "#991b1b",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      fontSize: "0.9rem",
                      border: "1px solid #fecdd3",
                    }}
                  >
                    {hemoError}
                  </div>
                )}

                <form onSubmit={handleAddHemocentro}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                        Nome da Unidade / Hemocentro *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Hemocentro Regional da Paraíba"
                        required
                        value={hemoForm.nome}
                        onChange={(e) => setHemoForm({ ...hemoForm, nome: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                        Tipo de Estabelecimento
                      </label>
                      <select
                        value={hemoForm.tipo}
                        onChange={(e) => setHemoForm({ ...hemoForm, tipo: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "0.9rem",
                        }}
                      >
                        <option value="hemocentro">Hemocentro Regional / Estadual</option>
                        <option value="hospital">Hospital com Banco de Sangue</option>
                        <option value="clinica">Clínica de Hematologia</option>
                        <option value="posto">Posto de Coleta Móvel / Fixo</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                        Estado (UF) *
                      </label>
                      <select
                        value={hemoForm.estado}
                        onChange={(e) => setHemoForm({ ...hemoForm, estado: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                        }}
                      >
                        {UFS.map((uf) => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                        Cidade *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: João Pessoa"
                        required
                        value={hemoForm.cidade}
                        onChange={(e) => setHemoForm({ ...hemoForm, cidade: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                        Endereço Completo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Av. Dom Pedro II, 1119 - Jaguaribe"
                        required
                        value={hemoForm.endereco}
                        onChange={(e) => setHemoForm({ ...hemoForm, endereco: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                        Telefone de Contato *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: (83) 3218-7601"
                        required
                        value={hemoForm.telefone}
                        onChange={(e) => setHemoForm({ ...hemoForm, telefone: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                        Horário de Atendimento
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Seg-Sex: 7h-17h30, Sáb: 7h-12h"
                        value={hemoForm.horario}
                        onChange={(e) => setHemoForm({ ...hemoForm, horario: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={hemoSubmitting}
                    style={{
                      background: "linear-gradient(135deg, #0284c7, #0369a1)",
                      color: "#ffffff",
                      border: "none",
                      padding: "12px 28px",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(2, 132, 199, 0.3)",
                    }}
                  >
                    <Plus size={18} />
                    <span>{hemoSubmitting ? "Salvando no SQLite..." : "Salvar Hemocentro no Banco"}</span>
                  </button>
                </form>
              </div>

              {/* Lista dos Hemocentros Cadastrados */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "28px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "14px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                      Hemocentros Cadastrados ({filteredHemocentros.length})
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Listagem oficial integrada à página pública de busca de hemocentros
                    </p>
                  </div>

                  <div style={{ position: "relative", minWidth: "260px" }}>
                    <Search size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="search"
                      placeholder="Filtrar por nome, cidade ou UF..."
                      value={hemoSearch}
                      onChange={(e) => setHemoSearch(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px 8px 36px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                </div>

                {hemoLoading ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                    Carregando hemocentros...
                  </div>
                ) : filteredHemocentros.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                    Nenhum hemocentro encontrado para a busca.
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
                    {filteredHemocentros.map((h) => (
                      <div
                        key={h.id}
                        style={{
                          background: "#f8fafc",
                          borderRadius: "14px",
                          padding: "18px",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          position: "relative",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                            <span
                              style={{
                                background: "#fee2e2",
                                color: "#be123c",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "6px",
                                textTransform: "uppercase",
                              }}
                            >
                              {h.tipo}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0284c7" }}>
                              {h.estado}
                            </span>
                          </div>

                          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginTop: "8px", marginBottom: "8px" }}>
                            {h.nome}
                          </h4>

                          <div style={{ fontSize: "0.82rem", color: "#64748b", display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <MapPin size={14} color="#be123c" style={{ flexShrink: 0 }} />
                              <span>{h.endereco} — {h.cidade}/{h.estado}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Phone size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                              <span>{h.telefone}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Clock size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                              <span>{h.horario}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteHemocentro(h.id, h.nome)}
                            style={{
                              background: "#fee2e2",
                              color: "#b91c1c",
                              border: "1px solid #fecdd3",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
