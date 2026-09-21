import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade e LGPD — HemoAlerta",
  description: "Transparência total e conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
};

export default function PrivacidadePage() {
  return (
    <div style={{ maxWidth: "920px", margin: "0 auto", padding: "clamp(24px, 5vw, 50px)" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--blood)",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          <ArrowLeft size={18} /> Voltar ao Início
        </Link>
      </div>

      <div className="panel" style={{ padding: "clamp(24px, 4vw, 44px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(30, 122, 77, 0.12)",
              color: "var(--success)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--ink)" }}>
              Política de Privacidade e Proteção de Dados
            </h1>
            <p style={{ color: "var(--muted)", margin: "4px 0 0", fontSize: "0.95rem" }}>
              Conforme a Lei Geral de Proteção de Dados Pessoais (LGPD) — Lei Federal nº 13.709/2018
            </p>
          </div>
        </div>

        <div
          style={{
            background: "rgba(215, 30, 58, 0.06)",
            borderLeft: "4px solid var(--blood)",
            padding: "18px 24px",
            borderRadius: "8px",
            margin: "24px 0",
          }}
        >
          <strong style={{ color: "var(--blood-dark)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Lock size={18} /> Compromisso Ético e Sanitário
          </strong>
          <span style={{ fontSize: "0.92rem", color: "var(--ink)", lineHeight: 1.6 }}>
            O <strong>HemoAlerta</strong> existe para uma única e nobre missão: conectar voluntários a estoques emergenciais de sangue para salvar vidas.
            Não comercializamos informações, não exibimos anúncios de terceiros e tratamos todos os dados com sigilo absoluto.
          </span>
        </div>

        <div style={{ lineHeight: 1.8, color: "var(--ink-2)", fontSize: "0.95rem" }}>
          <h2 style={{ color: "var(--ink)", fontSize: "1.25rem", fontWeight: 700, marginTop: "28px", marginBottom: "12px" }}>
            1. Apresentação e Enquadramento Legal
          </h2>
          <p>
            Esta política rege o tratamento de dados pessoais no âmbito da plataforma HemoAlerta, concebida para atuar como
            canal direto e voluntário de mobilização de doadores em benefício de hemocentros e hospitais. O sistema atua estritamente
            em conformidade com a legislação brasileira, em especial os Artigos 7º e 11 da Lei Federal nº 13.709/2018.
          </p>

          <h2 style={{ color: "var(--ink)", fontSize: "1.25rem", fontWeight: 700, marginTop: "28px", marginBottom: "12px" }}>
            2. Dados Coletados e Finalidades
          </h2>
          <p>Coletamos os seguintes dados estritamente necessários para a operacionalização segura:</p>
          <ul style={{ paddingLeft: "24px", margin: "12px 0" }}>
            <li><strong>Nome Completo:</strong> Identificação única perante o protocolo de triagem do hemocentro.</li>
            <li><strong>Tipo Sanguíneo (Dado Sensível de Saúde):</strong> Aplicação da matriz biológica de compatibilidade (sistema ABO e Rh).</li>
            <li><strong>WhatsApp (Telefone):</strong> Notificação instantânea com detalhes de emergência e mapa para rota de doação.</li>
            <li><strong>Cidade e UF:</strong> Restrição territorial para mobilização rápida e oportuna.</li>
            <li><strong>Data da Última Doação:</strong> Garantia sanitária dos prazos mínimos de repouso (60 dias homens / 90 dias mulheres).</li>
          </ul>

          <h2 style={{ color: "var(--ink)", fontSize: "1.25rem", fontWeight: 700, marginTop: "28px", marginBottom: "12px" }}>
            3. Segurança e Privacidade por Padrão (Privacy by Design)
          </h2>
          <p>
            O HemoAlerta implementa medidas técnicas de segurança para proteção de dados:
          </p>
          <ul style={{ paddingLeft: "24px", margin: "12px 0" }}>
            <li><strong>Mascaramento de Contatos:</strong> Telefones e e-mails são anonimizados em listagens públicas (ex.: <code>••••••••9012</code>).</li>
            <li><strong>Criptografia em Trânsito:</strong> Toda a navegação e envio de formulários são protegidos via HTTPS e TLS.</li>
            <li><strong>Controle de Acesso:</strong> Somente requisições autorizadas podem processar alertas em hospitais credenciados.</li>
          </ul>

          <h2 style={{ color: "var(--ink)", fontSize: "1.25rem", fontWeight: 700, marginTop: "28px", marginBottom: "12px" }}>
            4. Direitos do Titular (Artigo 18 da LGPD)
          </h2>
          <p>
            A qualquer momento, o doador voluntário pode:
          </p>
          <ul style={{ paddingLeft: "24px", margin: "12px 0" }}>
            <li>Consultar livremente todos os seus dados cadastrados.</li>
            <li>Atualizar seu número de WhatsApp, cidade ou disponibilidade na aba <strong>Meu Perfil</strong>.</li>
            <li>Revogar o recebimento de alertas com desativação imediata.</li>
            <li>Solicitar a <strong>eliminação definitiva</strong> de seus dados de nossa base com apenas um clique.</li>
          </ul>

          <h2 style={{ color: "var(--ink)", fontSize: "1.25rem", fontWeight: 700, marginTop: "28px", marginBottom: "12px" }}>
            5. Contato e DPO (Encarregado)
          </h2>
          <p>
            Para exercer seus direitos ou sanar dúvidas sobre como tratamos seus dados, faça contato direto com nosso encarregado:
            <br />
            <strong>E-mail de Privacidade:</strong> privacidade@hemoalerta.org.br
            <br />
            <strong>Disque Saúde (SUS):</strong> 136
          </p>
        </div>
      </div>
    </div>
  );
}
