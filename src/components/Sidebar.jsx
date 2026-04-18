import React from "react";
import { Plus, ArrowLeftRight, Shuffle, KeyRound, AlignJustify, Table2, Binary } from "lucide-react";
import { ciphers, cipherOrder } from "../lib/ciphers";

const ICONS = { ArrowLeftRight, Shuffle, KeyRound, AlignJustify, Table2, Binary };

export default function Sidebar({ onAdd }) {
  return (
    <div
      style={{
        width: 220,
        background: "#0f0f11",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "16px 16px 8px",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#52525b",
          fontWeight: 600,
        }}
      >
        Cipher Library
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="cs-scroll">
        {cipherOrder.map((type) => {
          const c = ciphers[type];
          const Icon = ICONS[c.icon];
          return (
            <div
              key={type}
              onClick={() => onAdd(type)}
              className="btn-press"
              style={{
                padding: "10px 12px",
                margin: "4px 10px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 140ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} color={c.color} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#f4f4f5", flex: 1 }}>
                  {c.label}
                </span>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 5,
                    color: "#71717a",
                  }}
                >
                  <Plus size={12} />
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#52525b",
                  marginTop: 4,
                  paddingLeft: 22,
                  lineHeight: 1.4,
                }}
              >
                {c.description}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: "12px 16px",
          fontSize: 10,
          color: "#3f3f46",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        v1.0.0 · CipherStack
      </div>
    </div>
  );
}
