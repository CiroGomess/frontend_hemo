"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { checkCompatibility, sendEmergency, CompatibilityResponse, EmergencyResponse } from "@/services/api";

const TIPOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

function EmergenciaContent() {
  const searchParams = useSearchParams();
  const initialEstado = searchParams.get("estado") || "SP";

  const [formData, setFormData] = useState({
    ajudaTipo: "O+",
    ajudaQuantidade: 1,
    ajudaUrgencia: "CRÍTICA",
    ajudaCidade: "São Paulo",
    ajudaEstado: initialEstado,
    ajudaPaciente: "",
    ajudaContato: "",
    ajudaMensagem: "",
  });

  const [compatibility, setCompatibility] = useState<CompatibilityResponse | null>(null);
  const [createdEmergency, setCreatedEmergency] = useState<EmergencyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.ajudaTipo && formData.ajudaEstado) {
      checkCompatibility(formData.ajudaTipo, formData.ajudaEstado, formData.ajudaCidade)
        .then((res) => setCompatibility(res))
        .catch(() => {});
    }
  }, [formData.ajudaTipo, formData.ajudaEstado, formData.ajudaCidade]);

  const maskPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    let out = "";
    if (digits.length > 0) out = "(" + digits.slice(0, 2);
    if (digits.length >= 2) out += ") ";
    if (digits.length > 2) {
      const rest = digits.slice(2);
      if (rest.length <= 4) out += rest;
      else if (rest.length <= 8) out += rest.slice(0, 4) + "-" + rest.slice(4);
      else out += rest.slice(0, 5) + "-" + rest.slice(5);
    }
    return out;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.ajudaTipo) errs.ajudaTipo = "Selecione o tipo sanguíneo.";
    if (!formData.ajudaQuantidade || formData.ajudaQuantidade < 1) errs.ajudaQuantidade = "Informe a quantidade.";
    if (!formData.ajudaCidade.trim()) errs.ajudaCidade = "Informe a cidade.";
    if (!formData.ajudaEstado) errs.ajudaEstado = "Selecione o estado.";
    if (!formData.ajudaPaciente.trim()) errs.ajudaPaciente = "Informe o paciente/instituição.";
    if (!formData.ajudaUrgencia) errs.ajudaUrgencia = "Selecione o nível de urgência.";
    const digits = formData.ajudaContato.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) errs.ajudaContato = "Telefone inválido.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await sendEmergency({
        tipo: formData.ajudaTipo,
        quantidade: Number(formData.ajudaQuantidade),
        paciente: formData.ajudaPaciente,
        cidade: formData.ajudaCidade,
        estado: formData.ajudaEstado,
        urgencia: formData.ajudaUrgencia,
        contato: formData.ajudaContato,
        mensagem: formData.ajudaMensagem,
      });

      setCreatedEmergency(res.emergencia);
      setToastMsg("🆘 Alertas enviados para doadores da região! 🙏");
      setErrors({});
    } catch (err: any) {
      setToastMsg("Erro ao processar alerta: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const urgenciaEmoji = {
    "CRÍTICA": "🔴",
    "ALTA": "🟠",
    "MÉDIA": "🟡"
  }[formData.ajudaUrgencia] || "🔴";

  const previewMessage = `${urgenciaEmoji} ALERTA DE DOAÇÃO
Tipo sanguíneo: ${formData.ajudaTipo}
Quantidade: ${formData.ajudaQuantidade} bolsa${formData.ajudaQuantidade > 1 ? "s" : ""}
Paciente: ${formData.ajudaPaciente || "[Paciente / Instituição]"}
Local: ${formData.ajudaCidade}, ${formData.ajudaEstado}
Contato: ${formData.ajudaContato || "[Telefone]"}
${formData.ajudaMensagem ? "\nDetalhes: " + formData.ajudaMensagem : ""}

Você pode salvar vidas! Responda SIM para ajudar.`;

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "clamp(20px, 4vw, 40px)" }}>
      {/* Hero/Intro */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--blood-dark), var(--blood-deep))",
          color: "white",
          padding: "40px",
          borderRadius: "16px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px", fontFamily: "var(--font-display)" }}>
          🆘 Chamar Doadores
        </h2>
        <p style={{ fontSize: "1.05rem", marginBottom: "16px", opacity: 0.95 }}>
          Solicite doadores de sangue na sua região quando houver urgência. A rede HemoAlerta o conectará aos doadores voluntários cadastrados.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginTop: "24px" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px", borderRadius: "10px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>⚡</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>Alertas Instantâneos</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px", borderRadius: "10px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>🗺️</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>Por Região</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px", borderRadius: "10px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>💪</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>Voluntários Ativos</div>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div style={{ background: "#e7f4ec", border: "1px solid #1e7a4d", color: "#1e7a4d", padding: "14px 20px", borderRadius: "12px", marginBottom: "24px", fontWeight: 700 }}>
          {toastMsg}
        </div>
      )}

      <div className="panel">
        <div className="panel__head">
          <div>
            <h2>Formulário de Solicitação</h2>
            <p>Preencha os detalhes abaixo para mobilizar a rede de doadores.</p>
          </div>
        </div>

        <div style={{ padding: "30px" }}>
          <form onSubmit={handleSubmit} className="form" noValidate>
            {/* Seção 1: Sangue & Urgência */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--blood)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px", paddingBottom: "8px", borderBottom: "2px solid var(--blood-fade)" }}>
                🩸 Tipo de Sangue & Urgência
              </h3>

              <div className="grid-2">
                <div className={`field ${errors.ajudaTipo ? "has-error" : ""}`}>
                  <label htmlFor="ajudaTipo">Tipo sanguíneo <span className="req">*</span></label>
                  <div className="select-wrap">
                    <select
                      id="ajudaTipo"
                      value={formData.ajudaTipo}
                      onChange={(e) => setFormData({ ...formData, ajudaTipo: e.target.value })}
                    >
                      {TIPOS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  {errors.ajudaTipo && <small className="error">{errors.ajudaTipo}</small>}
                </div>

                <div className={`field ${errors.ajudaQuantidade ? "has-error" : ""}`}>
                  <label htmlFor="ajudaQuantidade">Quantidade de bolsas <span className="req">*</span></label>
                  <input
                    type="number"
                    id="ajudaQuantidade"
                    min="1"
                    max="50"
                    value={formData.ajudaQuantidade}
                    onChange={(e) => setFormData({ ...formData, ajudaQuantidade: Number(e.target.value) })}
                  />
                  {errors.ajudaQuantidade && <small className="error">{errors.ajudaQuantidade}</small>}
                </div>
              </div>

              <div className="grid-2" style={{ marginTop: "18px" }}>
                <div className={`field ${errors.ajudaUrgencia ? "has-error" : ""}`}>
                  <label htmlFor="ajudaUrgencia">Nível de urgência <span className="req">*</span></label>
                  <div className="select-wrap">
                    <select
                      id="ajudaUrgencia"
                      value={formData.ajudaUrgencia}
                      onChange={(e) => setFormData({ ...formData, ajudaUrgencia: e.target.value })}
                    >
                      <option value="CRÍTICA">🔴 Crítica (Até 6 horas)</option>
                      <option value="ALTA">🟠 Alta (Até 24 horas)</option>
                      <option value="MÉDIA">🟡 Média (Agendamento urgente)</option>
                    </select>
                  </div>
                  {errors.ajudaUrgencia && <small className="error">{errors.ajudaUrgencia}</small>}
                </div>
              </div>
            </div>

            {/* Seção 2: Localização & Paciente */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--blood)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px", paddingBottom: "8px", borderBottom: "2px solid var(--blood-fade)" }}>
                📍 Localização & Paciente
              </h3>

              <div className="grid-2">
                <div className={`field ${errors.ajudaCidade ? "has-error" : ""}`}>
                  <label htmlFor="ajudaCidade">Cidade <span className="req">*</span></label>
                  <input
                    type="text"
                    id="ajudaCidade"
                    value={formData.ajudaCidade}
                    onChange={(e) => setFormData({ ...formData, ajudaCidade: e.target.value })}
                    placeholder="Ex: São Paulo"
                  />
                  {errors.ajudaCidade && <small className="error">{errors.ajudaCidade}</small>}
                </div>

                <div className={`field field--uf ${errors.ajudaEstado ? "has-error" : ""}`}>
                  <label htmlFor="ajudaEstado">UF <span className="req">*</span></label>
                  <div className="select-wrap">
                    <select
                      id="ajudaEstado"
                      value={formData.ajudaEstado}
                      onChange={(e) => setFormData({ ...formData, ajudaEstado: e.target.value })}
                    >
                      {UFS.map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                  {errors.ajudaEstado && <small className="error">{errors.ajudaEstado}</small>}
                </div>
              </div>

              <div className={`field ${errors.ajudaPaciente ? "has-error" : ""}`} style={{ marginTop: "18px" }}>
                <label htmlFor="ajudaPaciente">Paciente / Instituição <span className="req">*</span></label>
                <input
                  type="text"
                  id="ajudaPaciente"
                  value={formData.ajudaPaciente}
                  onChange={(e) => setFormData({ ...formData, ajudaPaciente: e.target.value })}
                  placeholder="Hospital Central / João Silva"
                />
                <small style={{ display: "block", color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                  Quem vai receber a transfusão? (paciente ou hospital)
                </small>
                {errors.ajudaPaciente && <small className="error">{errors.ajudaPaciente}</small>}
              </div>
            </div>

            {/* Seção 3: Contato & Detalhes */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--blood)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px", paddingBottom: "8px", borderBottom: "2px solid var(--blood-fade)" }}>
                📞 Contato & Detalhes
              </h3>

              <div className={`field ${errors.ajudaContato ? "has-error" : ""}`}>
                <label htmlFor="ajudaContato">Telefone para contato <span className="req">*</span></label>
                <input
                  type="tel"
                  id="ajudaContato"
                  inputMode="numeric"
                  value={formData.ajudaContato}
                  onChange={(e) => setFormData({ ...formData, ajudaContato: maskPhone(e.target.value) })}
                  placeholder="(11) 90000-0000"
                  maxLength={16}
                />
                <small style={{ display: "block", color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                  Doadores entrarão em contato por WhatsApp neste número
                </small>
                {errors.ajudaContato && <small className="error">{errors.ajudaContato}</small>}
              </div>

              <div className="field" style={{ marginTop: "18px" }}>
                <label htmlFor="ajudaMensagem">Detalhes adicionais <span className="opt">(opcional)</span></label>
                <textarea
                  id="ajudaMensagem"
                  rows={3}
                  value={formData.ajudaMensagem}
                  onChange={(e) => setFormData({ ...formData, ajudaMensagem: e.target.value })}
                  placeholder="Informações extras (cirurgia, compatibilidade, etc...)..."
                  style={{
                    resize: "vertical",
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    color: "var(--ink)",
                    border: "1.5px solid var(--line)",
                    borderRadius: "var(--r-sm)",
                    padding: "12px 14px",
                    width: "100%",
                  }}
                ></textarea>
                <small style={{ display: "block", color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                  Informações que ajudem os doadores a entender melhor o caso
                </small>
              </div>
            </div>

            <div className="form__actions">
              <button
                type="button"
                onClick={() => setFormData({
                  ajudaTipo: "O+",
                  ajudaQuantidade: 1,
                  ajudaUrgencia: "CRÍTICA",
                  ajudaCidade: "São Paulo",
                  ajudaEstado: "SP",
                  ajudaPaciente: "",
                  ajudaContato: "",
                  ajudaMensagem: "",
                })}
                className="btn btn--ghost"
              >
                Limpar
              </button>
              <button type="submit" disabled={loading} className="btn btn--primary">
                {loading ? "Calculando compatibilidade..." : "🆘 Alertar Doadores da Região"}
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>

          {/* Resultado do Envio com Link Direto para WhatsApp */}
          {createdEmergency && (
            <div style={{ marginTop: "30px", padding: "20px", background: "#e7f4ec", border: "2px solid #1e7a4d", borderRadius: "12px" }}>
              <h4 style={{ color: "#1e7a4d", fontWeight: 800, margin: "0 0 10px", fontSize: "1.1rem" }}>
                ✓ Solicitação registrada no banco de dados com sucesso!
              </h4>
              <p style={{ fontSize: "0.9rem", color: "#1c1418", marginBottom: "16px" }}>
                Foram identificados <strong>{createdEmergency.doadoresAptosNotificados} doadores compatíveis</strong> no estado de {createdEmergency.estado}.
              </p>
              <a
                href={createdEmergency.whatsappShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
                style={{ background: "#25D366", borderColor: "#25D366", color: "white", textDecoration: "none" }}
              >
                📱 Abrir WhatsApp e Disparar Alerta Oficial
              </a>
            </div>
          )}

          {/* Preview de mensagem em tempo real */}
          <div className="ajuda-preview" style={{ display: "block" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--blood)", margin: "30px 0 15px" }}>
              Mensagem que será enviada
            </h3>
            <div
              className="ajuda-message"
              style={{
                background: "rgba(200, 30, 60, 0.06)",
                borderLeft: "4px solid var(--blood)",
                padding: "15px",
                borderRadius: "var(--r-md)",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
                color: "var(--ink)",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {previewMessage}
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "15px" }}>
              ✅ Serão notificados: <strong id="doadoresToNotify" style={{ color: "var(--blood)", fontSize: "1.1rem" }}>{compatibility?.totalAptos ?? 0}</strong> doador(es) aptos da região
              {compatibility && compatibility.tiposCompativeis.length > 0 && (
                <span style={{ display: "block", marginTop: "4px", fontSize: "0.8rem" }}>
                  Tipos compatíveis aptos: {compatibility.tiposCompativeis.join(", ")}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
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
