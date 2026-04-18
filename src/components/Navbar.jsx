import React from "react";
import { Lock, Upload, Download } from "lucide-react";

const C = {
  bg: "#09090b",
  textPrimary: "#f4f4f5",
  textSecondary: "#71717a",
  amber: "#fbbf24",
  green: "#4ade80",
  purple: "#8b5cf6",
};

export default function Navbar({ nodeCount, onImport, onExport }) {
  const ready = nodeCount >= 3;
  const remaining = Math.max(0, 3 - nodeCount);

  return (
    <div
      style={{
        height: 48,
        background: C.bg,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Lock size={16} color={C.purple} />
        <span style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
          CipherStack
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", width: 8, height: 8 }}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: ready ? C.green : C.amber,
            }}
          />
          {ready && (
            <span
              className="ring-pulse"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `1px solid ${C.green}`,
              }}
            />
          )}
        </div>
        <span style={{ fontSize: 12, color: C.textSecondary }}>
          {ready ? `Pipeline ready · ${nodeCount} nodes` : `Add ${remaining} more node${remaining === 1 ? "" : "s"}`}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <NavBtn icon={<Upload size={12} />} label="Import" onClick={onImport} />
        <NavBtn icon={<Download size={12} />} label="Export" onClick={onExport} />

        {/* Zero Telemetry Badge */}
        <div
          className="bg-zinc-900/50"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 9999,
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px rgba(16,185,129,0.6)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#a1a1aa",
              whiteSpace: "nowrap",
            }}
          >
            Local Execution Only | Zero Telemetry
          </span>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn-press"
      style={{
        height: 28,
        padding: "0 10px",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "transparent",
        color: C.textSecondary,
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 6,
        fontSize: 12,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
      {label}
    </button>
  );
}
