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
  updateHemocentro,
  deleteHemocentro,
  fetchAdminEmergencies,
  approveAndBroadcastEmergency,
  cancelEmergency,
  WhatsAppStatus,
  Hemocentro,
  EmergencyResponse,
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
  Pencil,
  X,
  Siren,
  CheckCheck,
  Ban,
  Users,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

function formatEmergencyDate(dateStr?: string) {
  if (!dateStr) return "Data recente";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} às ${hours}:${mins}`;
  } catch {
    return dateStr;
  }
}

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

  // Emergency Moderation State
  const [emergenciesList, setEmergenciesList] = useState<EmergencyResponse[]>([]);
  const [emergenciesLoading, setEmergenciesLoading] = useState(false);
  const [emergencyStatusFilter, setEmergencyStatusFilter] = useState<string>("PENDENTE");
  const [emergencySearchQuery, setEmergencySearchQuery] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [emergencySubTab, setEmergencySubTab] = useState<"moderacao" | "manual">("moderacao");

  // Hemocentros Management State
  const [hemocentros, setHemocentros] = useState<Hemocentro[]>([]);
  const [hemoLoading, setHemoLoading] = useState(false);
  const [hemoSearch, setHemoSearch] = useState("");
  const [hemoSuccess, setHemoSuccess] = useState<string | null>(null);
  const [hemoError, setHemoError] = useState<string | null>(null);
  const [hemoSubmitting, setHemoSubmitting] = useState(false);
  const [editingHemoId, setEditingHemoId] = useState<string | null>(null);
  const [hemoForm, setHemoForm] = useState({
    nome: "",
    tipo: "hemocentro",
    estado: "PB",
    cidade: "João Pessoa",
    endereco: "",
    telefone: "",
    horario: "Seg-Sex: 7h30-17h, Sáb: 7h-12h"
  });

  // Modal de Confirmação & Alertas Modernos
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    type: "danger" | "warning" | "info" | "success";
    confirmText?: string;
    cancelText?: string;
    isAlertOnly?: boolean;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    isAlertOnly: false,
  });

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const showConfirm = ({
    title,
    message,
    type = "danger",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
  }: {
    title: string;
    message: React.ReactNode;
    type?: "danger" | "warning" | "info" | "success";
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      isAlertOnly: false,
      onConfirm,
    });
  };

  const showAlert = ({
    title,
    message,
    type = "info",
    confirmText = "Entendido",
  }: {
    title: string;
    message: React.ReactNode;
    type?: "danger" | "warning" | "info" | "success";
    confirmText?: string;
  }) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText: "",
      isAlertOnly: true,
      onConfirm: () => {},
    });
  };

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
    loadAdminEmergencies();

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

  useEffect(() => {
    if (isLogged && activeTab === "emergencia") {
      loadAdminEmergencies();
    }
  }, [isLogged, activeTab, emergencyStatusFilter]);

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
    showConfirm({
      title: "Desconectar WhatsApp",
      type: "warning",
      confirmText: "Sim, Desconectar",
      cancelText: "Cancelar",
      message: (
        <div>
          <p>Deseja realmente desconectar a sessão atual do WhatsApp?</p>
          <p style={{ marginTop: "8px", fontSize: "0.84rem", color: "#64748b" }}>
            Os disparos automáticos e notificações ficarão inativos até que uma nova conexão seja feita via QR Code.
          </p>
        </div>
      ),
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await disconnectWhatsApp();
          setQrCodeImg(null);
          setActionMessage("Sessão desconectada com sucesso.");
        } catch (err: any) {
          setActionMessage("Erro: " + err.message);
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) {
      showAlert({
        title: "Telefone Necessário",
        message: "Por favor, informe o número do telefone com DDD para realizar o teste de envio.",
        type: "info",
      });
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
      showAlert({
        title: "WhatsApp Não Conectado",
        message: "Conecte a instância do WhatsApp do HemoAlerta antes de efetuar disparos de emergência.",
        type: "warning",
      });
      return;
    }

    showConfirm({
      title: "Confirmar Disparo de Alerta SOS",
      type: "warning",
      confirmText: "Sim, Disparar Alertas",
      cancelText: "Cancelar",
      message: (
        <div>
          <p>
            Deseja disparar alertas de urgência via WhatsApp para todos os doadores compatíveis com o tipo{" "}
            <strong style={{ color: "#be123c", fontWeight: 800 }}>{alertTipo}</strong> no estado de{" "}
            <strong>{alertEstado}</strong>?
          </p>
          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              background: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "0.82rem",
              color: "#64748b",
            }}
          >
            <div><strong>Hospital:</strong> {alertHospital || "Hemocentro de Referência"}</div>
            <div><strong>Localização:</strong> {alertCidade}/{alertEstado}</div>
            <div><strong>Nível de Urgência:</strong> {alertUrgencia}</div>
          </div>
        </div>
      ),
      onConfirm: async () => {
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
          showAlert({
            title: "Erro no Disparo",
            message: err.message || "Ocorreu uma falha ao tentar disparar o alerta.",
            type: "danger",
          });
        } finally {
          setBroadcastLoading(false);
        }
      },
    });
  };

  const loadAdminEmergencies = () => {
    setEmergenciesLoading(true);
    fetchAdminEmergencies(emergencyStatusFilter || undefined)
      .then((data) => setEmergenciesList(data))
      .catch((err) => console.error("Erro ao carregar chamados SOS:", err))
      .finally(() => setEmergenciesLoading(false));
  };

  const handleApproveEmergency = (emg: EmergencyResponse) => {
    if (waStatus.status !== "CONNECTED") {
      showAlert({
        title: "WhatsApp Não Conectado",
        message: "A instância do WhatsApp Web precisa estar CONECTADA para disparar os alertas oficiais aos voluntários. Conecte o WhatsApp na primeira aba antes de aprovar.",
        type: "warning",
      });
      return;
    }

    showConfirm({
      title: `Aprovar & Disparar SOS #${emg.id}`,
      type: "danger",
      confirmText: "Sim, Aprovar & Disparar via WhatsApp",
      cancelText: "Voltar / Revisar",
      message: (
        <div>
          <p>
            Você está prestes a autorizar o disparo de notificações 1 a 1 para <strong>{emg.doadoresAptosNotificados} doadores compatíveis</strong> em <strong>{emg.cidade}/{emg.estado}</strong>.
          </p>
          <div
            style={{
              margin: "12px 0",
              padding: "14px",
              background: "#fef2f2",
              borderRadius: "10px",
              border: "1px solid #fecdd3",
              fontSize: "0.85rem",
              color: "#991b1b",
              lineHeight: 1.6,
            }}
          >
            <div>🏥 <strong>Hospital / Local:</strong> {emg.hospital || "Hospital Regional"}</div>
            <div>🩸 <strong>Tipo Solicitado:</strong> {emg.tipo} ({emg.quantidade} bolsa(s))</div>
            <div>⚠️ <strong>Urgência Médica:</strong> {emg.urgencia}</div>
            <div>👤 <strong>Paciente / Leito:</strong> {emg.paciente}</div>
            <div>📞 <strong>Contato do Hemocentro:</strong> {emg.contato}</div>
            <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #fca5a5", color: "#b91c1c", fontWeight: 600 }}>
              🖼️ <strong>Arte Oficial Anexada:</strong> A imagem <code>art.jpeg</code> será enviada junto com o texto para cada voluntário com intervalo seguro de ~1.8s.
            </div>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Apenas confirme caso os dados do hospital e a urgência tenham sido devidamente verificados.
          </p>
        </div>
      ),
      onConfirm: async () => {
        setApprovingId(emg.id);
        try {
          const res = await approveAndBroadcastEmergency(emg.id);
          showAlert({
            title: "Disparo SOS Concluído com Sucesso!",
            type: "success",
            message: (
              <div>
                <p>{res.mensagem}</p>
                <div style={{ marginTop: "10px", padding: "12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", fontSize: "0.85rem", color: "#166534" }}>
                  <div>Total de doadores compatíveis: <strong>{res.disparo?.totalEncontrados ?? emg.doadoresAptosNotificados}</strong></div>
                  <div>Mensagens entregues com sucesso: <strong>{res.disparo?.sentCount ?? 0}</strong></div>
                  {res.disparo?.errorsCount > 0 && <div>Falhas no envio: <strong>{res.disparo?.errorsCount}</strong></div>}
                </div>
              </div>
            ),
          });
          loadAdminEmergencies();
        } catch (err: any) {
          showAlert({
            title: "Falha no Disparo",
            message: err.message || "Erro ao conectar com a instância Venom WhatsApp.",
            type: "danger",
          });
        } finally {
          setApprovingId(null);
        }
      },
    });
  };

  const handleCancelEmergency = (emg: EmergencyResponse) => {
    showConfirm({
      title: `Cancelar Solicitação SOS #${emg.id}`,
      type: "warning",
      confirmText: "Sim, Cancelar Solicitação",
      cancelText: "Manter",
      message: (
        <div>
          <p>
            Deseja cancelar o chamado de <strong>{emg.tipo}</strong> para o <strong>{emg.hospital || emg.paciente}</strong>?
          </p>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            O status será marcado como CANCELADO e nenhuma mensagem será enviada aos voluntários.
          </p>
        </div>
      ),
      onConfirm: async () => {
        setCancellingId(emg.id);
        try {
          await cancelEmergency(emg.id);
          loadAdminEmergencies();
        } catch (err: any) {
          showAlert({
            title: "Erro ao Cancelar",
            message: err.message || "Não foi possível cancelar o chamado.",
            type: "danger",
          });
        } finally {
          setCancellingId(null);
        }
      },
    });
  };

  const handleSaveHemocentro = async (e: React.FormEvent) => {
    e.preventDefault();
    setHemoError(null);
    setHemoSuccess(null);
    setHemoSubmitting(true);

    try {
      if (editingHemoId) {
        await updateHemocentro(editingHemoId, hemoForm);
        setHemoSuccess("Dados do hemocentro atualizados com sucesso!");
        setEditingHemoId(null);
      } else {
        await createHemocentro(hemoForm);
        setHemoSuccess("Hemocentro cadastrado com sucesso! Ele já está disponível no mapa e busca pública.");
      }
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
      setHemoError(err.message || "Erro ao salvar hemocentro.");
    } finally {
      setHemoSubmitting(false);
    }
  };

  const handleStartEdit = (h: Hemocentro) => {
    setEditingHemoId(h.id);
    setHemoForm({
      nome: h.nome,
      tipo: h.tipo,
      estado: h.estado,
      cidade: h.cidade,
      endereco: h.endereco,
      telefone: h.telefone,
      horario: h.horario || "Seg-Sex: 7h30-17h, Sáb: 7h-12h",
    });
    setHemoSuccess(null);
    setHemoError(null);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingHemoId(null);
    setHemoForm({
      nome: "",
      tipo: "hemocentro",
      estado: "PB",
      cidade: "João Pessoa",
      endereco: "",
      telefone: "",
      horario: "Seg-Sex: 7h30-17h, Sáb: 7h-12h"
    });
  };

  const handleDeleteHemocentro = (id: string, nome: string) => {
    showConfirm({
      title: "Excluir Hemocentro",
      type: "danger",
      confirmText: "Sim, Excluir",
      cancelText: "Cancelar",
      message: (
        <div>
          <p>
            Deseja realmente remover o cadastro de <strong>"{nome}"</strong>?
          </p>
          <p style={{ marginTop: "8px", fontSize: "0.84rem", color: "#64748b" }}>
            Esta unidade deixará de ser exibida na busca pública e na rede de hemocentros do sistema.
          </p>
        </div>
      ),
      onConfirm: async () => {
        try {
          await deleteHemocentro(id);
          if (editingHemoId === id) {
            handleCancelEdit();
          }
          loadHemocentros();
        } catch (err: any) {
          showAlert({
            title: "Erro ao Excluir",
            message: err.message || "Não foi possível remover o hemocentro.",
            type: "danger",
          });
        }
      },
    });
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
              <span>Moderação & Alertas SOS</span>
              {emergenciesList.filter((e) => (e.status || "PENDENTE") === "PENDENTE").length > 0 && (
                <span
                  style={{
                    background: "#dc2626",
                    color: "#ffffff",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontSize: "0.74rem",
                    fontWeight: 800,
                  }}
                >
                  {emergenciesList.filter((e) => (e.status || "PENDENTE") === "PENDENTE").length}
                </span>
              )}
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

          {/* ===================== TAB 2: MODERAÇÃO E DISPARO DE EMERGÊNCIA ===================== */}
          {activeTab === "emergencia" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Header da Aba com Navegação Sub-Abas */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "24px 28px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #dc2626, #991b1b)",
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      boxShadow: "0 6px 16px rgba(220, 38, 38, 0.25)",
                    }}
                  >
                    <Siren size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      Central de Moderação & Disparo SOS WhatsApp
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "2px 0 0 0" }}>
                      Valide solicitações de emergência e libere o envio 1 a 1 aos doadores com a imagem oficial <code>art.jpeg</code>
                    </p>
                  </div>
                </div>

                {/* Sub-abas: Fila de Moderação vs Disparo Manual */}
                <div style={{ display: "flex", gap: "8px", background: "#f1f5f9", padding: "4px", borderRadius: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setEmergencySubTab("moderacao")}
                    style={{
                      background: emergencySubTab === "moderacao" ? "#ffffff" : "transparent",
                      color: emergencySubTab === "moderacao" ? "#0f172a" : "#64748b",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: emergencySubTab === "moderacao" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    <Clock size={15} />
                    <span>Fila de Chamados Recebidos</span>
                    <span style={{ background: "#fee2e2", color: "#991b1b", padding: "1px 6px", borderRadius: "6px", fontSize: "0.72rem" }}>
                      {emergenciesList.filter((e) => (e.status || "PENDENTE") === "PENDENTE").length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmergencySubTab("manual")}
                    style={{
                      background: emergencySubTab === "manual" ? "#ffffff" : "transparent",
                      color: emergencySubTab === "manual" ? "#0f172a" : "#64748b",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: emergencySubTab === "manual" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    <Radio size={15} />
                    <span>Disparo Avulso Manual</span>
                  </button>
                </div>
              </div>

              {/* CONTEÚDO 1: FILA DE MODERAÇÃO DE CHAMADOS */}
              {emergencySubTab === "moderacao" && (
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "28px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  {/* Cabeçalho da Seção de Moderação */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
                        Fila de Moderação e Disparo de Chamados SOS
                      </h2>
                      <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                        Revise e autorize solicitações de emergência com disparo individual e seguro para doadores compatíveis.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={loadAdminEmergencies}
                      disabled={emergenciesLoading}
                      style={{
                        background: "#ffffff",
                        color: "#475569",
                        border: "1px solid #cbd5e1",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <RefreshCw size={14} className={emergenciesLoading ? "animate-spin" : ""} />
                      <span>{emergenciesLoading ? "Atualizando..." : "Recarregar Lista"}</span>
                    </button>
                  </div>

                  {/* Barra de Filtros por Status & Busca Rápida */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                      padding: "14px 16px",
                      background: "#f8fafc",
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                      marginBottom: "22px",
                    }}
                  >
                    {/* Status Tabs */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[
                        { id: "PENDENTE", label: "Aguardando Aprovação", count: emergenciesList.filter((e) => (e.status || "PENDENTE") === "PENDENTE").length, color: "#d97706", bg: "#fef3c7" },
                        { id: "DISPARADO", label: "Disparados no WhatsApp", count: emergenciesList.filter((e) => e.status === "DISPARADO").length, color: "#16a34a", bg: "#dcfce7" },
                        { id: "CANCELADO", label: "Cancelados", count: emergenciesList.filter((e) => e.status === "CANCELADO").length, color: "#64748b", bg: "#f1f5f9" },
                        { id: "", label: "Todos os Chamados", count: emergenciesList.length, color: "#0f172a", bg: "#e2e8f0" },
                      ].map((filtro) => {
                        const isSelected = emergencyStatusFilter === filtro.id;
                        return (
                          <button
                            key={filtro.id}
                            type="button"
                            onClick={() => setEmergencyStatusFilter(filtro.id)}
                            style={{
                              background: isSelected ? "#0f172a" : "#ffffff",
                              color: isSelected ? "#ffffff" : "#475569",
                              border: isSelected ? "1px solid #0f172a" : "1px solid #cbd5e1",
                              padding: "7px 14px",
                              borderRadius: "8px",
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "7px",
                              boxShadow: isSelected ? "0 2px 6px rgba(15, 23, 42, 0.15)" : "none",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <span>{filtro.label}</span>
                            <span
                              style={{
                                background: isSelected ? "rgba(255,255,255,0.2)" : filtro.bg,
                                color: isSelected ? "#ffffff" : filtro.color,
                                padding: "2px 7px",
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                              }}
                            >
                              {filtro.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Busca Rápida em Tempo Real */}
                    <div style={{ position: "relative", minWidth: "260px", flex: "1 1 260px", maxWidth: "420px" }}>
                      <Search
                        size={15}
                        color="#94a3b8"
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                      />
                      <input
                        type="text"
                        value={emergencySearchQuery}
                        onChange={(e) => setEmergencySearchQuery(e.target.value)}
                        placeholder="Buscar hospital, paciente, tipo ou ID..."
                        style={{
                          width: "100%",
                          padding: "8px 32px 8px 34px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.82rem",
                          background: "#ffffff",
                          color: "#1e293b",
                          outline: "none",
                        }}
                      />
                      {emergencySearchQuery && (
                        <button
                          type="button"
                          onClick={() => setEmergencySearchQuery("")}
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lista de Chamados */}
                  {emergenciesLoading ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                      <Clock size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: "#3b82f6" }} />
                      <p style={{ fontWeight: 600 }}>Carregando solicitações da base de dados...</p>
                    </div>
                  ) : (() => {
                    const filteredEmergencies = emergenciesList.filter((emg) => {
                      if (!emergencySearchQuery.trim()) return true;
                      const q = emergencySearchQuery.toLowerCase();
                      const idStr = String(emg.id || "").toLowerCase();
                      const hosp = String(emg.hospital || "").toLowerCase();
                      const pac = String(emg.paciente || "").toLowerCase();
                      const cid = String(emg.cidade || "").toLowerCase();
                      const est = String(emg.estado || "").toLowerCase();
                      const tp = String(emg.tipo || "").toLowerCase();
                      const cont = String(emg.contato || "").toLowerCase();
                      return idStr.includes(q) || hosp.includes(q) || pac.includes(q) || cid.includes(q) || est.includes(q) || tp.includes(q) || cont.includes(q);
                    });

                    if (filteredEmergencies.length === 0) {
                      return (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "48px 24px",
                            background: "#f8fafc",
                            borderRadius: "16px",
                            border: "1.5px dashed #cbd5e1",
                          }}
                        >
                          <CheckCircle2 size={40} color="#16a34a" style={{ margin: "0 auto 12px" }} />
                          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
                            Nenhuma solicitação encontrada
                          </h3>
                          <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0 }}>
                            {emergencySearchQuery
                              ? `Nenhum chamado corresponde aos termos da pesquisa "${emergencySearchQuery}".`
                              : emergencyStatusFilter
                              ? `Não há chamados com status "${emergencyStatusFilter}".`
                              : "Nenhum chamado de emergência foi cadastrado ainda."}
                          </p>
                          {emergencySearchQuery && (
                            <button
                              type="button"
                              onClick={() => setEmergencySearchQuery("")}
                              style={{
                                marginTop: "12px",
                                background: "#ffffff",
                                border: "1px solid #cbd5e1",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "#475569",
                                cursor: "pointer",
                              }}
                            >
                              Limpar Pesquisa
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {filteredEmergencies.map((emg) => {
                          const status = emg.status || "PENDENTE";
                          const isPending = status === "PENDENTE";
                          const isDispatched = status === "DISPARADO";
                          const isCancelled = status === "CANCELADO";

                          const urgencia = emg.urgencia || "CRÍTICA";
                          const urgencyColor = urgencia === "CRÍTICA" ? "#dc2626" : urgencia === "ALTA" ? "#ea580c" : "#d97706";
                          const urgencyBg = urgencia === "CRÍTICA" ? "#fef2f2" : urgencia === "ALTA" ? "#fff7ed" : "#fefce8";
                          const urgencyBorder = urgencia === "CRÍTICA" ? "#fecaca" : urgencia === "ALTA" ? "#fed7aa" : "#fef08a";

                          const accentBorderLeft = isPending
                            ? `5px solid ${urgencyColor}`
                            : isDispatched
                            ? "5px solid #10b981"
                            : "5px solid #94a3b8";

                          const donorsCount = emg.doadoresAptosNotificados || 0;
                          const donorLabel =
                            donorsCount === 1
                              ? "1 doador compatível mapeado"
                              : `${donorsCount} doadores compatíveis mapeados`;

                          const cleanId = String(emg.id).replace(/^SOS-/, "");

                          return (
                            <div
                              key={emg.id}
                              style={{
                                background: "#ffffff",
                                borderRadius: "16px",
                                border: "1px solid #e2e8f0",
                                borderLeft: accentBorderLeft,
                                padding: "20px 24px",
                                boxShadow: isPending ? "0 4px 18px rgba(220, 38, 38, 0.04)" : "0 2px 8px rgba(0,0,0,0.02)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "14px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              {/* Barra Superior do Card: ID, Status, Urgência e Data */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                  {/* ID Badge Anti-wrap */}
                                  <span
                                    style={{
                                      fontSize: "0.8rem",
                                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                      fontWeight: 800,
                                      background: "#0f172a",
                                      color: "#f8fafc",
                                      padding: "3px 10px",
                                      borderRadius: "8px",
                                      letterSpacing: "0.5px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    #SOS-{cleanId}
                                  </span>

                                  {/* Status Badge */}
                                  {isPending && (
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        background: "#fffbeb",
                                        color: "#b45309",
                                        border: "1px solid #fef3c7",
                                        padding: "3px 10px",
                                        borderRadius: "20px",
                                        fontSize: "0.74rem",
                                        fontWeight: 800,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: "7px",
                                          height: "7px",
                                          borderRadius: "50%",
                                          background: "#f59e0b",
                                          display: "inline-block",
                                        }}
                                      />
                                      <span>PENDENTE DE APROVAÇÃO</span>
                                    </span>
                                  )}
                                  {isDispatched && (
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        background: "#ecfdf5",
                                        color: "#15803d",
                                        border: "1px solid #bbf7d0",
                                        padding: "3px 10px",
                                        borderRadius: "20px",
                                        fontSize: "0.74rem",
                                        fontWeight: 800,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      <CheckCheck size={13} />
                                      <span>DISPARADO VIA WHATSAPP</span>
                                    </span>
                                  )}
                                  {isCancelled && (
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        background: "#f1f5f9",
                                        color: "#64748b",
                                        border: "1px solid #cbd5e1",
                                        padding: "3px 10px",
                                        borderRadius: "20px",
                                        fontSize: "0.74rem",
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      <Ban size={13} />
                                      <span>CANCELADO</span>
                                    </span>
                                  )}

                                  {/* Urgency Badge */}
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "5px",
                                      background: urgencyBg,
                                      color: urgencyColor,
                                      border: `1px solid ${urgencyBorder}`,
                                      padding: "3px 10px",
                                      borderRadius: "20px",
                                      fontSize: "0.74rem",
                                      fontWeight: 800,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        background: urgencyColor,
                                        display: "inline-block",
                                      }}
                                    />
                                    <span>URGÊNCIA {urgencia}</span>
                                  </span>
                                </div>

                                {/* Formatted Timestamp */}
                                <div
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontSize: "0.78rem",
                                    color: "#64748b",
                                    background: "#f8fafc",
                                    padding: "3px 10px",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <Calendar size={13} color="#94a3b8" />
                                  <span>{formatEmergencyDate(emg.criadoEm)}</span>
                                </div>
                              </div>

                              {/* Linha Divisória Sutil */}
                              <div style={{ borderTop: "1px solid #f1f5f9" }} />

                              {/* Conteúdo Principal do Card (Informações à Esquerda, Mídia e Ações à Direita) */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  gap: "24px",
                                }}
                              >
                                {/* Bloco Esquerdo: Hospital, Metadados & Demanda Sanguínea */}
                                <div style={{ flex: "1 1 360px" }}>
                                  {/* Nome do Hospital */}
                                  <h3
                                    style={{
                                      fontSize: "1.18rem",
                                      fontWeight: 800,
                                      color: "#0f172a",
                                      margin: "0 0 8px 0",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "28px",
                                        height: "28px",
                                        borderRadius: "8px",
                                        background: "#fef2f2",
                                        display: "grid",
                                        placeItems: "center",
                                      }}
                                    >
                                      <Building2 size={16} color="#dc2626" />
                                    </div>
                                    <span>{emg.hospital || "Hospital Regional"}</span>
                                  </h3>

                                  {/* Metadados: Localização, Paciente/Leito, Contato */}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "14px",
                                      fontSize: "0.84rem",
                                      color: "#475569",
                                      marginBottom: "12px",
                                    }}
                                  >
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                      <MapPin size={14} color="#64748b" />
                                      <span>{emg.cidade}, <strong>{emg.estado}</strong></span>
                                    </div>

                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                      <User size={14} color="#64748b" />
                                      <span>Paciente: <strong>{emg.paciente}</strong></span>
                                    </div>

                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                      <Phone size={14} color="#64748b" />
                                      <span>Contato: <strong>{emg.contato}</strong></span>
                                    </div>
                                  </div>

                                  {/* Painel de Demanda Sanguínea & Cobertura Regional */}
                                  <div
                                    style={{
                                      background: "#f8fafc",
                                      padding: "10px 14px",
                                      borderRadius: "12px",
                                      border: "1px solid #e2e8f0",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      flexWrap: "wrap",
                                      gap: "12px",
                                    }}
                                  >
                                    {/* Droplet & Quantidade */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      <span
                                        style={{
                                          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                          color: "#ffffff",
                                          padding: "5px 12px",
                                          borderRadius: "8px",
                                          fontSize: "1.1rem",
                                          fontWeight: 900,
                                          boxShadow: "0 2px 8px rgba(220, 38, 38, 0.25)",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        {emg.tipo}
                                      </span>
                                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                                        {emg.quantidade} bolsa{Number(emg.quantidade) !== 1 ? "s" : ""} solicitada{Number(emg.quantidade) !== 1 ? "s" : ""}
                                      </span>
                                    </div>

                                    {/* Doadores compatíveis no estado */}
                                    <div style={{ textAlign: "right" }}>
                                      <div
                                        style={{
                                          color: "#166534",
                                          fontWeight: 700,
                                          fontSize: "0.82rem",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "6px",
                                          background: "#f0fdf4",
                                          border: "1px solid #bbf7d0",
                                          padding: "3px 8px",
                                          borderRadius: "6px",
                                        }}
                                      >
                                        <Users size={13} />
                                        <span>{donorLabel}</span>
                                      </div>
                                      <div style={{ color: "#64748b", marginTop: "3px", fontSize: "0.74rem" }}>
                                        Grupos aptos: {(emg.tiposCompativeis || []).join(", ") || emg.tipo}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Histórico se já disparado */}
                                  {isDispatched && (
                                    <div
                                      style={{
                                        marginTop: "10px",
                                        padding: "8px 12px",
                                        background: "#f0fdf4",
                                        borderRadius: "8px",
                                        border: "1px solid #bbf7d0",
                                        fontSize: "0.78rem",
                                        color: "#166534",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                      }}
                                    >
                                      <CheckCheck size={14} />
                                      <span>
                                        Disparo autorizado por <strong>{emg.aprovadoPor || "Admin"}</strong> em {formatEmergencyDate(emg.aprovadoEm)}.
                                        {emg.disparosSucesso !== undefined && (
                                          <span> • <strong>{emg.disparosSucesso} voluntários notificados via WhatsApp</strong></span>
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Bloco Direito: Prévia de Mídia e Ações */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    alignItems: "flex-end",
                                    minWidth: "220px",
                                  }}
                                >
                                  {/* Arte Oficial Anexada */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      background: "#f8fafc",
                                      padding: "6px 12px",
                                      borderRadius: "10px",
                                      border: "1px solid #e2e8f0",
                                    }}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src="/art.jpeg"
                                      alt="Arte Oficial SOS"
                                      style={{
                                        width: "34px",
                                        height: "34px",
                                        borderRadius: "6px",
                                        objectFit: "cover",
                                        border: "1px solid #cbd5e1",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                      }}
                                    />
                                    <div style={{ textAlign: "left" }}>
                                      <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#1e293b" }}>
                                        Arte Oficial Vinculada
                                      </div>
                                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                                        <code>art.jpeg</code> (anexo WhatsApp)
                                      </div>
                                    </div>
                                  </div>

                                  {/* Botões de Ação */}
                                  <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "flex-end" }}>
                                    {isPending && (
                                      <>
                                        <button
                                          type="button"
                                          disabled={cancellingId === emg.id || approvingId === emg.id}
                                          onClick={() => handleCancelEmergency(emg)}
                                          style={{
                                            background: "#ffffff",
                                            color: "#dc2626",
                                            border: "1px solid #fca5a5",
                                            padding: "9px 14px",
                                            borderRadius: "10px",
                                            fontWeight: 700,
                                            fontSize: "0.82rem",
                                            cursor: "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            transition: "all 0.15s ease",
                                          }}
                                        >
                                          <Trash2 size={14} />
                                          <span>{cancellingId === emg.id ? "Cancelando..." : "Rejeitar"}</span>
                                        </button>

                                        <button
                                          type="button"
                                          disabled={approvingId === emg.id || cancellingId === emg.id}
                                          onClick={() => handleApproveEmergency(emg)}
                                          style={{
                                            background: "linear-gradient(135deg, #16a34a, #15803d)",
                                            color: "#ffffff",
                                            border: "none",
                                            padding: "9px 18px",
                                            borderRadius: "10px",
                                            fontWeight: 800,
                                            fontSize: "0.86rem",
                                            cursor: "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.28)",
                                            transition: "all 0.15s ease",
                                          }}
                                        >
                                          <Zap size={15} />
                                          <span>{approvingId === emg.id ? "Disparando 1 a 1..." : "Aprovar & Disparar SOS"}</span>
                                        </button>
                                      </>
                                    )}

                                    {isDispatched && (
                                      <button
                                        type="button"
                                        disabled={approvingId === emg.id}
                                        onClick={() => handleApproveEmergency(emg)}
                                        style={{
                                          background: "#f8fafc",
                                          color: "#166534",
                                          border: "1px solid #86efac",
                                          padding: "8px 14px",
                                          borderRadius: "8px",
                                          fontWeight: 700,
                                          fontSize: "0.82rem",
                                          cursor: "pointer",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "6px",
                                        }}
                                      >
                                        <RefreshCw size={13} />
                                        <span>Re-enviar Disparo</span>
                                      </button>
                                    )}

                                    {isCancelled && (
                                      <span
                                        style={{
                                          fontSize: "0.78rem",
                                          color: "#94a3b8",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        Solicitação arquivada
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* CONTEÚDO 2: DISPARO MANUAL AVULSO (SEM CHAMADO PRÉVIO) */}
              {emergencySubTab === "manual" && (
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
                      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        Disparo de Alerta Avulso Imediato
                      </h2>
                      <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "2px 0 0 0" }}>
                        Utilize caso queira emitir um alerta SOS direto para uma região sem precisar de uma solicitação cadastrada previamente
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
                        <span>Prévia da Mensagem no WhatsApp (com <code>art.jpeg</code> anexada):</span>
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
                      <span>{broadcastLoading ? "Disparando mensagens 1 a 1 com intervalo de 1.8s..." : "Disparar Alerta Avulso aos Doadores"}</span>
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
                        Doadores compatíveis encontrados na base: <strong>{broadcastResult.totalEncontrados ?? 0}</strong> • Mensagens enviadas: <strong>{broadcastResult.sentCount ?? 0}</strong>
                      </div>
                    </div>
                  )}
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
                      background: editingHemoId
                        ? "linear-gradient(135deg, #f59e0b, #d97706)"
                        : "linear-gradient(135deg, #0284c7, #0369a1)",
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      transition: "background 0.3s ease",
                    }}
                  >
                    {editingHemoId ? <Pencil size={20} /> : <Plus size={22} />}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
                      {editingHemoId ? "Editar Informações do Hemocentro" : "Cadastrar Novo Hemocentro / Ponto de Doação"}
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      {editingHemoId
                        ? `Atualizando registro ID: ${editingHemoId}. Modifique os campos abaixo e clique em Salvar Alterações.`
                        : "Os hemocentros cadastrados aqui são disponibilizados imediatamente na busca pública para todos os doadores"}
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

                <form onSubmit={handleSaveHemocentro}>
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

                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <button
                      type="submit"
                      disabled={hemoSubmitting}
                      style={{
                        background: editingHemoId
                          ? "linear-gradient(135deg, #f59e0b, #d97706)"
                          : "linear-gradient(135deg, #0284c7, #0369a1)",
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
                        boxShadow: editingHemoId
                          ? "0 4px 14px rgba(245, 158, 11, 0.3)"
                          : "0 4px 14px rgba(2, 132, 199, 0.3)",
                      }}
                    >
                      {editingHemoId ? <Check size={18} /> : <Plus size={18} />}
                      <span>
                        {hemoSubmitting
                          ? "Salvando dados..."
                          : editingHemoId
                          ? "Salvar Alterações"
                          : "Salvar Hemocentro"}
                      </span>
                    </button>

                    {editingHemoId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{
                          background: "#f1f5f9",
                          color: "#475569",
                          border: "1px solid #cbd5e1",
                          padding: "12px 20px",
                          borderRadius: "10px",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <X size={16} />
                        <span>Cancelar Edição</span>
                      </button>
                    )}
                  </div>
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

                        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(h)}
                            style={{
                              background: "#eff6ff",
                              color: "#0284c7",
                              border: "1px solid #bfdbfe",
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
                            <Pencil size={13} />
                            <span>Editar</span>
                          </button>

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

      {/* Modal de Confirmação & Alertas Modernos */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        isAlertOnly={modalConfig.isAlertOnly}
        onConfirm={modalConfig.onConfirm}
        onClose={closeModal}
      />
    </div>
  );
}
