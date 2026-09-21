"use client";

import { useState } from "react";
import { createDonor } from "@/services/api";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "NS"];

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    tipoSanguineo: "",
    dataNascimento: "",
    cidade: "",
    estado: "SP",
    whatsapp: "",
    email: "",
    ultimaDoacao: "",
    optInAlertas: true,
    consentimentoLGPD: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Máscara de WhatsApp automática
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    let formatted = "";
    if (digits.length > 0) formatted = "(" + digits.slice(0, 2);
    if (digits.length >= 2) formatted += ") ";
    if (digits.length > 2) {
      const rest = digits.slice(2);
      if (rest.length <= 4) formatted += rest;
      else if (rest.length <= 8) formatted += rest.slice(0, 4) + "-" + rest.slice(4);
      else formatted += rest.slice(0, 5) + "-" + rest.slice(5);
    }
    setFormData((prev) => ({ ...prev, whatsapp: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validações
    if (!formData.nomeCompleto.trim()) {
      setError("Por favor, informe seu nome completo.");
      return;
    }
    if (!formData.tipoSanguineo) {
      setError("Selecione seu tipo sanguíneo.");
      return;
    }
    const cleanPhone = formData.whatsapp.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Informe um número de WhatsApp válido com DDD.");
      return;
    }
    if (!formData.cidade.trim()) {
      setError("Informe sua cidade.");
      return;
    }
    if (!formData.consentimentoLGPD) {
      setError("Você precisa concordar com os termos da LGPD para continuar.");
      return;
    }

    // Checagem de idade mínima 16 anos se informada
    if (formData.dataNascimento) {
      const nasc = new Date(formData.dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nasc.getFullYear();
      if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      if (idade < 16) {
        setError("Doadores devem ter no mínimo 16 anos de idade.");
        return;
      }
    }

    try {
      setLoading(true);
      await createDonor({
        nomeCompleto: formData.nomeCompleto,
        tipoSanguineo: formData.tipoSanguineo,
        dataNascimento: formData.dataNascimento || undefined,
        cidade: formData.cidade,
        estado: formData.estado,
        whatsapp: formData.whatsapp,
        email: formData.email || undefined,
        ultimaDoacao: formData.ultimaDoacao || undefined,
        optInAlertas: formData.optInAlertas,
        consentimentoLGPD: formData.consentimentoLGPD,
      });

      setSuccess("Cadastro realizado com sucesso! Muito obrigado por ser um herói e salvar vidas. 🩸");
      setFormData({
        nomeCompleto: "",
        tipoSanguineo: "",
        dataNascimento: "",
        cidade: "",
        estado: "SP",
        whatsapp: "",
        email: "",
        ultimaDoacao: "",
        optInAlertas: true,
        consentimentoLGPD: true,
      });
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-950/5 overflow-hidden">
        {/* Cabeçalho do formulário */}
        <div className="bg-linear-to-r from-red-600 to-rose-700 p-8 text-white">
          <span className="text-3xl">🩸</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Cadastro de Doador Voluntário
          </h1>
          <p className="text-rose-100 text-sm mt-1">
            Leva menos de 1 minuto. Você só será acionado quando alguém da sua região precisar urgentemente do seu sangue.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
              <span className="text-xl">✓</span>
              {success}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nome Completo */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.nomeCompleto}
                onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                placeholder="Ex: Maria Helena Souza"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-zinc-800"
              />
            </div>

            {/* Tipo Sanguíneo */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Tipo Sanguíneo *
              </label>
              <select
                required
                value={formData.tipoSanguineo}
                onChange={(e) => setFormData({ ...formData, tipoSanguineo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none bg-white text-zinc-800 font-bold"
              >
                <option value="">Selecione...</option>
                {TIPOS_SANGUINEOS.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo === "NS" ? "Não sei meu tipo" : tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                WhatsApp com DDD *
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-zinc-800 font-mono"
              />
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                required
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="Ex: São Paulo"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-zinc-800"
              />
            </div>

            {/* Estado UF */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Estado (UF) *
              </label>
              <select
                required
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none bg-white text-zinc-800"
              >
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            {/* E-mail (Opcional) */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                E-mail (opcional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu.email@exemplo.com"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-zinc-800"
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-zinc-800"
              />
            </div>

            {/* Última Doação */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Data da Última Doação (se houver)
              </label>
              <input
                type="date"
                value={formData.ultimaDoacao}
                onChange={(e) => setFormData({ ...formData, ultimaDoacao: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-zinc-800"
              />
              <span className="text-xs text-zinc-600 mt-1 block">
                Ajuda nosso sistema a calcular se você já está no período apto para nova doação.
              </span>
            </div>
          </div>

          {/* Consentimentos LGPD */}
          <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-100 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.optInAlertas}
                onChange={(e) => setFormData({ ...formData, optInAlertas: e.target.checked })}
                className="mt-1 w-5 h-5 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-zinc-700 leading-relaxed font-medium">
                Aceito receber alertas de urgência sanguínea no meu WhatsApp quando houver falta do meu tipo na minha região.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.consentimentoLGPD}
                onChange={(e) => setFormData({ ...formData, consentimentoLGPD: e.target.checked })}
                className="mt-1 w-5 h-5 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-zinc-700 leading-relaxed font-medium">
                Concordo com o tratamento dos meus dados exclusivamente para fins humanitários de doação de sangue, em estrita conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>.
              </span>
            </label>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando cadastro..." : "Confirmar Cadastro e Salvar Vidas 🩸"}
          </button>
        </form>
      </div>
    </div>
  );
}
