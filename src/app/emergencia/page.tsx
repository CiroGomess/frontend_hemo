"use client";

import { useState, useEffect } from "react";
import { checkCompatibility, sendEmergency, CompatibilityResponse, EmergencyResponse } from "@/services/api";

const TIPOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function EmergenciaPage() {
  const [formData, setFormData] = useState({
    tipo: "O+",
    quantidade: 2,
    paciente: "",
    cidade: "São Paulo",
    estado: "SP",
    urgencia: "CRÍTICA",
    contato: "",
    mensagem: "",
  });

  const [compatibility, setCompatibility] = useState<CompatibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdEmergency, setCreatedEmergency] = useState<EmergencyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Recalcula compatibilidade e contagem de doadores aptos em tempo real
  useEffect(() => {
    if (formData.tipo && formData.estado) {
      checkCompatibility(formData.tipo, formData.estado, formData.cidade)
        .then((res) => setCompatibility(res))
        .catch(() => {});
    }
  }, [formData.tipo, formData.estado, formData.cidade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.paciente.trim()) {
      setError("Informe o nome do paciente ou hospital.");
      setLoading(false);
      return;
    }
    if (!formData.contato.trim()) {
      setError("Informe um telefone de contato para a emergência.");
      setLoading(false);
      return;
    }

    try {
      const res = await sendEmergency(formData);
      setCreatedEmergency(res.emergencia);
    } catch (err: any) {
      setError(err.message || "Falha ao enviar alerta de emergência.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">
          <span>🆘</span> Módulo de Emergência Hospitalar
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
          Disparo de Alerta de Urgência
        </h1>
        <p className="mt-2 text-zinc-600 text-sm">
          Acione em tempo real os doadores voluntários compatíveis e aptos cadastrados na região.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário de Urgência */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-rose-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Tipo Sanguíneo Necessário *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm font-black text-red-700 bg-red-50/50"
                >
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Bolsas Necessárias *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Nível de Urgência *
                </label>
                <select
                  value={formData.urgencia}
                  onChange={(e) => setFormData({ ...formData, urgencia: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm font-bold text-zinc-800"
                >
                  <option value="CRÍTICA">🔴 Crítica (Até 6 horas)</option>
                  <option value="ALTA">🟠 Alta (Até 24 horas)</option>
                  <option value="MÉDIA">🟡 Média (Agendamento urgente)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Telefone para Contato *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contato}
                  onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Paciente ou Instituição *
                </label>
                <input
                  type="text"
                  required
                  value={formData.paciente}
                  onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                  placeholder="Ex: Hospital das Clínicas / Paciente João Silva"
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Estado (UF) *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                >
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Detalhes Adicionais (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  placeholder="Ex: Doação no posto central, 3º andar, setor de hemoterapia..."
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:border-red-500 outline-none text-sm text-zinc-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? "Processando motor de matching..." : "Disparar Alerta para Doadores Compatíveis 🆘"}
            </button>
          </form>
        </div>

        {/* Painel Lateral: Inteligência de Compatibilidade + Preview WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card de Matching Inteligente */}
          <div className="bg-linear-to-br from-red-600 to-rose-700 rounded-3xl p-6 text-white shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-200">
                Motor de Matching Biológico
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="text-4xl font-black mb-1">
              {compatibility ? compatibility.totalAptos : "..."}
            </div>
            <div className="text-sm font-semibold text-rose-100 mb-4">
              Doadores aptos encontrados em {formData.estado}
            </div>

            <div className="pt-4 border-t border-rose-500/50">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-200 mb-2">
                Tipos que podem doar para {formData.tipo}:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {compatibility?.tiposCompativeis.map((bt) => (
                  <span
                    key={bt}
                    className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white font-extrabold text-xs"
                  >
                    {bt}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Resultado do Envio / Botão de WhatsApp direto */}
          {createdEmergency && (
            <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 shadow-md animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm mb-2">
                <span>✓</span> ALERTA REGISTRADO COM SUCESSO!
              </div>
              <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
                A solicitação foi salva no sistema. Você pode compartilhar a mensagem oficial diretamente nos grupos e contatos do WhatsApp:
              </p>

              <a
                href={createdEmergency.whatsappShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
              >
                <span>📱</span> Abrir WhatsApp com Mensagem
              </a>
            </div>
          )}

          {/* Preview da Mensagem */}
          <div className="bg-zinc-900 rounded-3xl p-6 text-zinc-300 text-xs font-mono border border-zinc-800">
            <div className="text-[11px] font-bold uppercase text-zinc-500 mb-3 tracking-wider">
              Preview do Alerta WhatsApp
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 whitespace-pre-wrap leading-relaxed text-zinc-200">
              {`🚨 *ALERTA DE EMERGÊNCIA — HEMOALERTA*
Tipo sanguíneo necessário: *${formData.tipo}*
Quantidade: *${formData.quantidade} bolsa(s)*
Instituição: *${formData.paciente || "[Nome do Hospital/Paciente]"}*
Local: *${formData.cidade} - ${formData.estado}*
Contato: *${formData.contato || "[Telefone]"}*
${formData.mensagem ? "\nDetalhes: " + formData.mensagem : ""}

🩸 *Você é um voluntário compatível!*
Sua doação salva vidas hoje. Por favor, compareça ao hemocentro mais próximo.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
