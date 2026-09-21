"use client";

import { useState } from "react";
import { loginDonor, updateDonor, deleteDonor, Donor } from "@/services/api";

const TIPOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "NS"];
const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function PerfilPage() {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await loginDonor(email, whatsapp);
      setDonor(data);
      setSuccess("Dados carregados com sucesso!");
    } catch (err: any) {
      setError(err.message || "Doador não encontrado.");
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
      setSuccess("Dados atualizados com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!donor) return;
    if (!confirm("Tem certeza que deseja apagar todos os seus dados do HemoAlerta? (Direito ao esquecimento LGPD)")) {
      return;
    }

    setLoading(true);
    try {
      await deleteDonor(donor.id);
      setDonor(null);
      setEmail("");
      setWhatsapp("");
      setSuccess("Seus dados foram excluídos definitivamente dos nossos registros.");
    } catch (err: any) {
      setError(err.message || "Erro ao excluir conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-3xl">👤</span>
        <h1 className="text-3xl font-black text-zinc-900 mt-2">
          Área do Doador — Meu Perfil
        </h1>
        <p className="mt-2 text-zinc-600 text-sm">
          Gerencie seus dados e preferências de notificação em conformidade com a LGPD.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
          <span>✓</span> {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      {!donor ? (
        /* Tela de Acesso / Login */
        <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            Acesse seu cadastro
          </h2>
          <p className="text-sm text-zinc-600 mb-6">
            Informe o e-mail e o WhatsApp cadastrados para visualizar ou atualizar seus dados.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                E-mail cadastrado
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-zinc-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                WhatsApp cadastrado
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-zinc-800 text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Acessar Meus Dados"}
            </button>
          </form>
        </div>
      ) : (
        /* Tela de Edição de Dados */
        <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100">
            <div>
              <div className="text-lg font-black text-zinc-900">
                {donor.nomeCompleto}
              </div>
              <div className="text-xs text-zinc-600 font-mono">
                ID: {donor.id}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDonor(null)}
              className="text-xs text-zinc-600 hover:text-zinc-900 font-bold underline"
            >
              Sair
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={donor.nomeCompleto}
                  onChange={(e) => setDonor({ ...donor, nomeCompleto: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Tipo Sanguíneo
                </label>
                <select
                  value={donor.tipoSanguineo}
                  onChange={(e) => setDonor({ ...donor, tipoSanguineo: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm font-bold text-zinc-800"
                >
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {t || "Não informado"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={donor.whatsapp}
                  onChange={(e) => setDonor({ ...donor, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={donor.cidade}
                  onChange={(e) => setDonor({ ...donor, cidade: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Estado (UF)
                </label>
                <select
                  value={donor.estado}
                  onChange={(e) => setDonor({ ...donor, estado: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                >
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={donor.email || ""}
                  onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Data da Última Doação
                </label>
                <input
                  type="date"
                  value={donor.ultimaDoacao || ""}
                  onChange={(e) => setDonor({ ...donor, ultimaDoacao: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={donor.optInAlertas}
                  onChange={(e) => setDonor({ ...donor, optInAlertas: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600"
                />
                <span className="text-xs font-bold text-zinc-700">
                  Desejo continuar recebendo alertas de emergência no WhatsApp
                </span>
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition"
              >
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
              >
                Excluir Cadastro (LGPD)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
