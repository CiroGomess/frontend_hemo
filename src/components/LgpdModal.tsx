"use client";

import { ShieldCheck, X, Check, Lock, FileText, HeartHandshake } from "lucide-react";

interface LgpdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function LgpdModal({ isOpen, onClose, onAccept }: LgpdModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onAccept) onAccept();
    onClose();
  };

  return (
    <div className="modal show" style={{ zIndex: 1000 }} onClick={onClose}>
      <div
        className="modal__card modal__card--lg"
        style={{
          width: "95%",
          maxWidth: "780px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fcf8f7",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "rgba(30, 122, 77, 0.12)",
                color: "var(--success)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)" }}>
                Política de Privacidade & LGPD
              </h3>
              <small style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                Lei Federal nº 13.709/2018 · Versão 1.0 Oficial HemoAlerta
              </small>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal__close"
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: "6px",
              color: "var(--muted)",
              borderRadius: "6px",
              display: "grid",
              placeItems: "center",
            }}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div
          style={{
            padding: "24px 28px",
            overflowY: "auto",
            flex: 1,
            fontSize: "0.92rem",
            lineHeight: 1.7,
            color: "var(--ink-2)",
          }}
        >
          <div
            style={{
              background: "rgba(215, 30, 58, 0.06)",
              borderLeft: "4px solid var(--blood)",
              padding: "16px 20px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <strong style={{ color: "var(--blood-dark)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <Lock size={16} /> Compromisso de Transparência e Segurança
            </strong>
            <span style={{ fontSize: "0.88rem", color: "var(--ink)" }}>
              O HemoAlerta é uma plataforma voluntária de mobilização para bancos de sangue. Seus dados são utilizados
              <strong> exclusivamente</strong> para fins de convocação em emergências médicas e saúde pública. Não vendemos dados nem realizamos publicidade comercial.
            </span>
          </div>

          <h4 style={{ color: "var(--ink)", fontWeight: 700, fontSize: "1.05rem", marginTop: "16px", marginBottom: "8px" }}>
            1. Apresentação e Objetivo do Sistema
          </h4>
          <p>
            O <strong>HemoAlerta</strong> conecta doadores voluntários a hemocentros, hospitais e unidades de saúde em períodos críticos
            de desabastecimento de sangue. Esta política estabelece de forma clara como os dados pessoais são coletados, tratados,
            armazenados e protegidos em conformidade rigorosa com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong>.
          </p>

          <h4 style={{ color: "var(--ink)", fontWeight: 700, fontSize: "1.05rem", marginTop: "20px", marginBottom: "8px" }}>
            2. Dados Coletados e Sua Necessidade
          </h4>
          <p>Coletamos apenas o volume mínimo estritamente indispensável para a finalidade de salvar vidas:</p>
          <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
            <li><strong>Nome completo:</strong> Identificação formal perante a recepção do hemocentro.</li>
            <li><strong>Tipo sanguíneo:</strong> Triagem de compatibilidade imunobiológica para atendimento direcionado.</li>
            <li><strong>Telefone WhatsApp:</strong> Envio imediato do comunicado oficial de emergência e rota hospitalar.</li>
            <li><strong>Cidade e Estado (UF):</strong> Filtragem regional para não acionar voluntários fora de alcance viável.</li>
            <li><strong>Data de nascimento:</strong> Averiguação legal de faixa etária para doação (16 a 69 anos pelo Ministério da Saúde).</li>
            <li><strong>Data da última doação:</strong> Respeito aos intervalos biológicos legais de repouso (60 dias para homens, 90 dias para mulheres).</li>
          </ul>

          <h4 style={{ color: "var(--ink)", fontWeight: 700, fontSize: "1.05rem", marginTop: "20px", marginBottom: "8px" }}>
            3. Tratamento de Dados Sensíveis de Saúde
          </h4>
          <p>
            O tipo sanguíneo e o histórico de doação são classificados como <strong>dados sensíveis</strong> (Art. 5º, II da LGPD).
            O tratamento desses dados é amparado pelo consentimento expresso do titular e pela salvaguarda à tutela da saúde e procedimentos de emergência médica (Art. 11, II, "f").
          </p>

          <h4 style={{ color: "var(--ink)", fontWeight: 700, fontSize: "1.05rem", marginTop: "20px", marginBottom: "8px" }}>
            4. Princípios de Segurança e Sigilo
          </h4>
          <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
            <li><strong>Mascaramento público:</strong> Números de telefone e e-mails nunca são exibidos na íntegra em listagens públicas.</li>
            <li><strong>Criptografia em trânsito:</strong> Conexões protegidas sob protocolo HTTPS e TLS.</li>
            <li><strong>Retenção controlada:</strong> Dados mantidos durante a vigência do cadastro do voluntário, podendo ser revogados a qualquer instante.</li>
          </ul>

          <h4 style={{ color: "var(--ink)", fontWeight: 700, fontSize: "1.05rem", marginTop: "20px", marginBottom: "8px" }}>
            5. Direitos do Titular (Art. 18 da LGPD)
          </h4>
          <p>Você é o único proprietário de seus dados e pode, a qualquer momento:</p>
          <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
            <li>Confirmar a existência do tratamento e acessar seus dados cadastrados.</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados através da aba <strong>Meu Perfil</strong>.</li>
            <li>Revogar seu consentimento e solicitar a exclusão total do registro com apenas um clique.</li>
            <li>Desativar o recebimento de alertas de emergência sem perder o histórico do seu perfil.</li>
          </ul>

          <h4 style={{ color: "var(--ink)", fontWeight: 700, fontSize: "1.05rem", marginTop: "20px", marginBottom: "8px" }}>
            6. Contato com o Encarregado de Proteção de Dados (DPO)
          </h4>
          <p style={{ marginBottom: 0 }}>
            Para tirar dúvidas ou exercer seus direitos previstos pela LGPD, nosso canal oficial de comunicação é:
            <br />
            <strong>E-mail:</strong> privacidade@hemoalerta.org.br · <strong>Encarregado:</strong> Equipe de Conformidade Hemotech
          </p>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--line)",
            background: "#fcf8f7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <FileText size={15} /> Documento oficial em vigor
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn--ghost"
              style={{ padding: "8px 18px", fontSize: "0.88rem" }}
            >
              Fechar
            </button>
            {onAccept && (
              <button
                type="button"
                onClick={handleConfirm}
                className="btn btn--primary"
                style={{ padding: "8px 20px", fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Check size={16} /> Entendi e Concordo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
