"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2, Radio, Info, CheckCircle2, X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  isAlertOnly?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  type = "danger",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isAlertOnly = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTheme = () => {
    switch (type) {
      case "danger":
        return {
          icon: <Trash2 size={24} color="#dc2626" />,
          badgeBg: "#fee2e2",
          badgeBorder: "#fecdd3",
          btnBg: "linear-gradient(135deg, #dc2626, #b91c1c)",
          btnShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={24} color="#d97706" />,
          badgeBg: "#fef3c7",
          badgeBorder: "#fde68a",
          btnBg: "linear-gradient(135deg, #d97706, #b45309)",
          btnShadow: "0 4px 14px rgba(217, 119, 6, 0.35)",
        };
      case "success":
        return {
          icon: <CheckCircle2 size={24} color="#16a34a" />,
          badgeBg: "#dcfce7",
          badgeBorder: "#bbf7d0",
          btnBg: "linear-gradient(135deg, #16a34a, #15803d)",
          btnShadow: "0 4px 14px rgba(22, 163, 74, 0.35)",
        };
      case "info":
      default:
        return {
          icon: <Info size={24} color="#0284c7" />,
          badgeBg: "#e0f2fe",
          badgeBorder: "#bae6fd",
          btnBg: "linear-gradient(135deg, #0284c7, #0369a1)",
          btnShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        animation: "fade 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "460px",
          padding: "26px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)",
          position: "relative",
          animation: "modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar canto superior */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: "#64748b",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e2e8f0";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <X size={16} />
        </button>

        {/* Ícone com badge estilizado */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: theme.badgeBg,
              border: `1px solid ${theme.badgeBorder}`,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            {theme.icon}
          </div>

          <div style={{ flex: 1, paddingRight: "20px" }}>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 8px 0",
                fontFamily: "var(--font-display, inherit)",
              }}
            >
              {title}
            </h3>

            <div
              style={{
                fontSize: "0.92rem",
                color: "#475569",
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {!isAlertOnly && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#f8fafc",
                color: "#475569",
                border: "1px solid #cbd5e1",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            style={{
              background: theme.btnBg,
              color: "#ffffff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              boxShadow: theme.btnShadow,
              transition: "transform 0.15s, opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
