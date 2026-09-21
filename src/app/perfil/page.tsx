"use client";

import { useState } from "react";
import { loginDonor, updateDonor, deleteDonor, Donor } from "@/services/api";
import { User, Save, CheckCircle2, Trash2, LogOut } from "lucide-react";

const TIPOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "NS"];
const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function PerfilPage() {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePhoneInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    let out = "";
    if (digits.length > 0) out = "(" + digits.slice(0, 2);
    if (digits.length > 2) out += ") " + digits.slice(2, 7);
    if (digits.length > 7) out += "-" + digits.slice(7);
    return out;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !telefone.trim()) {
      setError("Preencha e-mail e WhatsApp para consultar o perfil.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginDonor(email, telefone);
      setDonor(data);
      setSuccess(`Bem-vindo, ${data.nomeCompleto}!`);
    } catch (err: any) {
      setError(err.message || "Doador não encontrado. Verifique e-mail e telefone.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donor) return;
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await updateDonor(donor.id, {
        nomeCompleto: donor.nomeCompleto,
        tipoSanguineo: donor.tipoSanguineo,
        cidade: donor.cidade,
        estado: donor.estado,
        whatsapp: donor.whatsapp,
        email: donor.email,
        ultimaDoacao: donor.ultimaDoacao,
        optInAlertas: donor.optInAlertas,
      });
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!donor) return;
    if (!confirm("Tem certeza que deseja solicitar a exclusão de todos os seus dados? (Direito ao esquecimento LGPD)")) {
      return;
    }

    setLoading(true);
    try {
      await deleteDonor(donor.id);
      setDonor(null);
      setEmail("");
      setTelefone("");
      setSuccess("Seus dados foram excluídos definitivamente do sistema conforme a LGPD.");
    } catch (err: any) {
      setError(err.message || "Erro ao excluir cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "clamp(20px, 4vw, 40px)" }}>
      <div className="panel">
        {/* LOGIN / ACESSO AO PERFIL */}
        {!donor ? (
          <div id="perfilLogin" style={{ display: "block" }}>
            <div className="panel__head">
              <div>
                <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <User size={22} color="var(--blood)" />
                  <span>Meu Perfil</span>
                </h2>
                <p>Acesse seu perfil de doador usando email e telefone</p>
              </div>
            </div>

            <div style={{ padding: "40px", maxWidth: "440px", margin: "0 auto" }}>
              {error && (
                <div style={{ background: "#fff1f3", border: "1px solid #d71e3a", color: "#d71e3a", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem" }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ background: "#e7f4ec", border: "1px solid #1e7a4d", color: "#1e7a4d", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem" }}>
                  {success}
                </div>
              )}

              <form onSubmit={handleLogin} className="form" noValidate>
                <div className="field">
                  <label htmlFor="perfilEmail">E-mail <span className="req">*</span></label>
                  <input
                    type="email"
                    id="perfilEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                  />
                </div>

                <div className="field">
                  <label htmlFor="perfilTelefone">Telefone/WhatsApp <span className="req">*</span></label>
                  <input
                    type="tel"
                    id="perfilTelefone"
                    value={telefone}
                    onChange={(e) => setTelefone(handlePhoneInput(e.target.value))}
                    placeholder="(11) 90000-0000"
                    maxLength={16}
                    inputMode="numeric"
                  />
                  <small style={{ display: "block", color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                    O mesmo número que cadastrou
                  </small>
                </div>

                <div className="form__actions" style={{ marginTop: "24px" }}>
                  <button type="submit" disabled={loading} className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>
                    {loading ? "Verificando..." : "Acessar Perfil"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* DADOS DO PERFIL */
          <div id="perfilData" style={{ display: "block" }}>
            <div className="panel__head">
              <div>
                <h2 id="perfilNome" style={{ color: "var(--blood)" }}>{donor.nomeCompleto}</h2>
                <p id="perfilEmail2">{donor.email || "E-mail não cadastrado"} • ID: {donor.id}</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn--danger-ghost"
                  style={{ fontSize: "0.85rem", padding: "8px 14px" }}
                >
                  Excluir Conta (LGPD)
                </button>
                <button
                  type="button"
                  onClick={() => setDonor(null)}
                  className="btn btn--ghost"
                  style={{ fontSize: "0.85rem", padding: "8px 14px" }}
                >
                  Sair
                </button>
              </div>
            </div>

            <div style={{ padding: "30px" }}>
              {error && (
                <div style={{ background: "#fff1f3", border: "1px solid #d71e3a", color: "#d71e3a", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ background: "#e7f4ec", border: "1px solid #1e7a4d", color: "#1e7a4d", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
                  {success}
                </div>
              )}

              <form onSubmit={handleUpdate} className="form" noValidate>
                <div className="field">
                  <label htmlFor="perfilEditNome">Nome completo <span className="req">*</span></label>
                  <input
                    type="text"
                    id="perfilEditNome"
                    value={donor.nomeCompleto}
                    onChange={(e) => setDonor({ ...donor, nomeCompleto: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label htmlFor="perfilEditTipo">Tipo sanguíneo <span className="req">*</span></label>
                    <div className="select-wrap">
                      <select
                        id="perfilEditTipo"
                        value={donor.tipoSanguineo}
                        onChange={(e) => setDonor({ ...donor, tipoSanguineo: e.target.value })}
                      >
                        {TIPOS.map((t) => (
                          <option key={t} value={t}>{t || "Não informado"}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="perfilEditNascimento">Data de nascimento</label>
                    <input
                      type="date"
                      id="perfilEditNascimento"
                      value={donor.dataNascimento || ""}
                      onChange={(e) => setDonor({ ...donor, dataNascimento: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label htmlFor="perfilEditCidade">Cidade <span className="req">*</span></label>
                    <input
                      type="text"
                      id="perfilEditCidade"
                      value={donor.cidade}
                      onChange={(e) => setDonor({ ...donor, cidade: e.target.value })}
                    />
                  </div>

                  <div className="field field--uf">
                    <label htmlFor="perfilEditEstado">UF <span className="req">*</span></label>
                    <div className="select-wrap">
                      <select
                        id="perfilEditEstado"
                        value={donor.estado}
                        onChange={(e) => setDonor({ ...donor, estado: e.target.value })}
                      >
                        {UFS.map((uf) => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label htmlFor="perfilEditWhatsapp">WhatsApp <span className="req">*</span></label>
                    <input
                      type="tel"
                      id="perfilEditWhatsapp"
                      value={donor.whatsapp}
                      onChange={(e) => setDonor({ ...donor, whatsapp: handlePhoneInput(e.target.value) })}
                      maxLength={16}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="perfilEditEmail">E-mail <span className="req">*</span></label>
                    <input
                      type="email"
                      id="perfilEditEmail"
                      value={donor.email || ""}
                      onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="perfilEditUltimaDoacao">Data da última doação (opcional)</label>
                  <input
                    type="date"
                    id="perfilEditUltimaDoacao"
                    value={donor.ultimaDoacao || ""}
                    onChange={(e) => setDonor({ ...donor, ultimaDoacao: e.target.value })}
                  />
                </div>

                <div className="consents">
                  <label className="check">
                    <input
                      type="checkbox"
                      id="perfilEditOptIn"
                      checked={donor.optInAlertas}
                      onChange={(e) => setDonor({ ...donor, optInAlertas: e.target.checked })}
                    />
                    <span className="check__box" aria-hidden="true"></span>
                    <span className="check__label">Aceita receber alertas de emergência no WhatsApp</span>
                  </label>
                </div>

                <div className="form__actions" style={{ marginTop: "24px" }}>
                  <button type="submit" disabled={loading} className="btn btn--primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <Save size={16} />
                    <span>{loading ? "Salvando..." : "Salvar Alterações"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
