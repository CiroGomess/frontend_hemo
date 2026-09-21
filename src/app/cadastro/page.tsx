"use client";

import { useState } from "react";
import { createDonor } from "@/services/api";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    nascimento: "",
    cidade: "",
    estado: "",
    whatsapp: "",
    email: "",
    ultimaDoacao: "",
    optIn: true,
    lgpd: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const maskWhatsapp = (value: string) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11);
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

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskWhatsapp(e.target.value);
    setFormData((prev) => ({ ...prev, whatsapp: masked }));
    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nome.trim() || formData.nome.trim().length < 3) {
      errs.nome = "Informe o nome completo.";
    }
    if (!formData.tipo) {
      errs.tipo = "Selecione o tipo sanguíneo.";
    }
    if (!formData.cidade.trim()) {
      errs.cidade = "Informe a cidade.";
    }
    if (!formData.estado) {
      errs.estado = "UF.";
    }
    const digits = formData.whatsapp.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) {
      errs.whatsapp = "WhatsApp inválido. Use DDD + número.";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "E-mail inválido.";
    }
    if (formData.nascimento) {
      const nasc = new Date(formData.nascimento);
      const hoje = new Date();
      let a = hoje.getFullYear() - nasc.getFullYear();
      if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) a--;
      if (a < 16) errs.nascimento = "Doadores devem ter ao menos 16 anos.";
      else if (a > 120) errs.nascimento = "Data de nascimento inválida.";
      if (nasc > hoje) errs.nascimento = "Data não pode ser no futuro.";
    }
    if (!formData.optIn) {
      errs.optIn = "É necessário aceitar o recebimento de alertas.";
    }
    if (!formData.lgpd) {
      errs.lgpd = "É necessário concordar com a LGPD.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await createDonor({
        nomeCompleto: formData.nome,
        tipoSanguineo: formData.tipo,
        dataNascimento: formData.nascimento || undefined,
        cidade: formData.cidade,
        estado: formData.estado,
        whatsapp: formData.whatsapp,
        email: formData.email || undefined,
        ultimaDoacao: formData.ultimaDoacao || undefined,
        optInAlertas: formData.optIn,
        consentimentoLGPD: formData.lgpd,
      });

      setSuccess("Cadastro confirmado! Obrigado por salvar vidas. 🩸");
      setFormData({
        nome: "",
        tipo: "",
        nascimento: "",
        cidade: "",
        estado: "",
        whatsapp: "",
        email: "",
        ultimaDoacao: "",
        optIn: true,
        lgpd: true,
      });
      setErrors({});
    } catch (err: any) {
      setErrors({ global: err.message || "Erro ao salvar no banco de dados." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nome: "",
      tipo: "",
      nascimento: "",
      cidade: "",
      estado: "",
      whatsapp: "",
      email: "",
      ultimaDoacao: "",
      optIn: true,
      lgpd: true,
    });
    setErrors({});
    setSuccess(null);
  };

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "clamp(20px, 4vw, 40px)" }}>
      <div className="split">
        {/* Painel de marca */}
        <aside className="hero">
          <div className="hero__inner">
            <span className="hero__badge">Rede de doadores voluntários</span>
            <h1 className="hero__title">Cada cadastro pode salvar até <em>4 vidas</em>.</h1>
            <p className="hero__lead">
              Cadastre-se na HemoAlerta e seja avisado pelo WhatsApp apenas quando
              o seu tipo sanguíneo entrar em nível crítico no hemocentro da sua cidade.
              Sem spam. Só quando importa de verdade.
            </p>

            <ul className="hero__points">
              <li><span className="dot"></span> Alerta inteligente por tipo e cidade</li>
              <li><span className="dot"></span> Você decide quando responder: SIM / NÃO / AGENDAR</li>
              <li><span className="dot"></span> Dados protegidos conforme a LGPD</li>
            </ul>

            <div className="hero__types" aria-hidden="true">
              <span>O−</span><span>O+</span><span>A−</span><span>A+</span>
              <span>B−</span><span>B+</span><span>AB−</span><span>AB+</span>
            </div>
          </div>
        </aside>

        {/* Formulário */}
        <div className="formwrap">
          <div className="formhead">
            <h2>Quero ser doador</h2>
            <p>Leva menos de um minuto. Os campos com <span className="req">*</span> são obrigatórios.</p>
          </div>

          {success && (
            <div style={{ background: "#e7f4ec", border: "1px solid #1e7a4d", color: "#1e7a4d", padding: "12px 16px", borderRadius: "10px", marginTop: "16px", fontWeight: 600, fontSize: "0.95rem" }}>
              ✓ {success}
            </div>
          )}

          {errors.global && (
            <div style={{ background: "#fff1f3", border: "1px solid #d71e3a", color: "#d71e3a", padding: "12px 16px", borderRadius: "10px", marginTop: "16px", fontWeight: 600, fontSize: "0.95rem" }}>
              ⚠️ {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} onReset={handleReset} className="form" noValidate>
            <div className={`field ${errors.nome ? "has-error" : ""}`}>
              <label htmlFor="nome">Nome completo <span className="req">*</span></label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex.: Maria Helena Souza"
              />
              {errors.nome && <small className="error">{errors.nome}</small>}
            </div>

            <div className="grid-2">
              <div className={`field ${errors.tipo ? "has-error" : ""}`}>
                <label htmlFor="tipo">Tipo sanguíneo <span className="req">*</span></label>
                <div className="select-wrap">
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="A+">A+</option>
                    <option value="A-">A−</option>
                    <option value="B+">B+</option>
                    <option value="B-">B−</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB−</option>
                    <option value="O+">O+</option>
                    <option value="O-">O−</option>
                    <option value="NS">Não sei</option>
                  </select>
                </div>
                {errors.tipo && <small className="error">{errors.tipo}</small>}
              </div>

              <div className={`field ${errors.nascimento ? "has-error" : ""}`}>
                <label htmlFor="nascimento">Data de nascimento</label>
                <input
                  type="date"
                  id="nascimento"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={(e) => setFormData({ ...formData, nascimento: e.target.value })}
                />
                {errors.nascimento && <small className="error">{errors.nascimento}</small>}
              </div>
            </div>

            <div className="grid-2">
              <div className={`field ${errors.cidade ? "has-error" : ""}`}>
                <label htmlFor="cidade">Cidade <span className="req">*</span></label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="Ex.: São Paulo"
                />
                {errors.cidade && <small className="error">{errors.cidade}</small>}
              </div>

              <div className={`field field--uf ${errors.estado ? "has-error" : ""}`}>
                <label htmlFor="estado">UF <span className="req">*</span></label>
                <div className="select-wrap">
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="" disabled>—</option>
                    {UFS.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
                {errors.estado && <small className="error">{errors.estado}</small>}
              </div>
            </div>

            <div className="grid-2">
              <div className={`field ${errors.whatsapp ? "has-error" : ""}`}>
                <label htmlFor="whatsapp">WhatsApp <span className="req">*</span></label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  inputMode="numeric"
                  value={formData.whatsapp}
                  onChange={handlePhoneInput}
                  placeholder="(11) 90000-0000"
                  maxLength={16}
                />
                {errors.whatsapp && <small className="error">{errors.whatsapp}</small>}
              </div>

              <div className={`field ${errors.email ? "has-error" : ""}`}>
                <label htmlFor="email">E-mail <span className="opt">(opcional)</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nome@exemplo.com"
                />
                {errors.email && <small className="error">{errors.email}</small>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="ultimaDoacao">Data da última doação <span className="opt">(opcional)</span></label>
              <input
                type="date"
                id="ultimaDoacao"
                name="ultimaDoacao"
                value={formData.ultimaDoacao}
                onChange={(e) => setFormData({ ...formData, ultimaDoacao: e.target.value })}
              />
              <small className="hint">Usamos para não incomodar antes do intervalo obrigatório.</small>
            </div>

            <div className="consents">
              <label className="check">
                <input
                  type="checkbox"
                  id="optIn"
                  name="optIn"
                  checked={formData.optIn}
                  onChange={(e) => setFormData({ ...formData, optIn: e.target.checked })}
                />
                <span className="check__box" aria-hidden="true"></span>
                <span className="check__label">
                  Aceito receber <strong>alertas de doação</strong> por WhatsApp/e-mail quando meu
                  tipo sanguíneo estiver em falta. <span className="req">*</span>
                </span>
              </label>
              {errors.optIn && <small className="error">{errors.optIn}</small>}

              <label className="check">
                <input
                  type="checkbox"
                  id="lgpd"
                  name="lgpd"
                  checked={formData.lgpd}
                  onChange={(e) => setFormData({ ...formData, lgpd: e.target.checked })}
                />
                <span className="check__box" aria-hidden="true"></span>
                <span className="check__label">
                  Li e concordo com o tratamento dos meus dados conforme a <strong>LGPD</strong>
                  (consentimento, criptografia e retenção máxima de 5 anos). <span className="req">*</span>
                </span>
              </label>
              {errors.lgpd && <small className="error">{errors.lgpd}</small>}
            </div>

            <div className="form__actions">
              <button type="reset" className="btn btn--ghost" disabled={loading}>Limpar</button>
              <button type="submit" className="btn btn--primary" disabled={loading}>
                {loading ? "Gravando..." : "Confirmar cadastro"}
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
