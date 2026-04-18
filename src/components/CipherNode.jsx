import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Copy, X, AlertCircle,
  ArrowLeftRight, Shuffle, KeyRound, AlignJustify, Table2, Binary,
} from "lucide-react";
import { ciphers } from "../lib/ciphers";
import { truncateText } from "../lib/utils";

const ICONS = { ArrowLeftRight, Shuffle, KeyRound, AlignJustify, Table2, Binary };

export default function CipherNode({ node, result, onUpdate, onDuplicate, onDelete, isOverlay }) {
  const sortable = useSortable({ id: node.id, disabled: isOverlay });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

  const c = ciphers[node.type];
  const Icon = ICONS[c.icon];
  const previewText = truncateText(c.preview(node.config), 12);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const updateConfig = (k, v) => onUpdate(node.id, { ...node.config, [k]: v });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isOverlay ? "" : "node-enter"}
    >
      <div
        style={{
          background: "#111113",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* top accent */}
        <div style={{ height: 3, background: c.color }} />

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 10px" }}>
          <button
            {...attributes}
            {...listeners}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "grab",
              color: "#3f3f46",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Drag"
          >
            <GripVertical size={14} />
          </button>

          <Icon size={16} color={c.color} />

          <span style={{ fontSize: 13, fontWeight: 500, color: "#f4f4f5" }}>{c.label}</span>

          <span
            key={previewText}
            className="node-enter"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 11,
              color: "#71717a",
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
            }}
          >
            {previewText}
          </span>

          <div style={{ flex: 1 }} />

          <IconBtn title="Duplicate node" onClick={() => onDuplicate(node.id)} hoverColor="#71717a">
            <Copy size={13} />
          </IconBtn>
          <IconBtn title="Delete node" onClick={() => onDelete(node.id)} hoverColor="#f87171" hoverBg="rgba(247,67,67,0.1)">
            <X size={13} />
          </IconBtn>
        </div>

        {/* config */}
        <div style={{ padding: "0 14px 12px" }}>
          <ConfigInputs type={node.type} config={node.config} onChange={updateConfig} />
        </div>

        {/* I/O */}
        {result && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "10px 14px 12px",
            }}
          >
            {result.error ? (
              <div
                style={{
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  borderRadius: 6,
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#f87171",
                  fontSize: 12,
                }}
              >
                <AlertCircle size={12} />
                <span>{result.error}</span>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <IOCol label="INPUT" text={result.inputText} accent="rgba(139,92,246,0.3)" />
                <IOCol label="OUTPUT" text={result.outputText} accent="rgba(34,211,238,0.3)" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title, hoverColor, hoverBg = "rgba(255,255,255,0.06)" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: "transparent",
        border: "none",
        padding: 4,
        borderRadius: 4,
        color: "#3f3f46",
        cursor: "pointer",
        display: "inline-flex",
        transition: "all 140ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor;
        e.currentTarget.style.background = hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#3f3f46";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

function IOCol({ label, text, accent }) {
  const t = truncateText(text || "", 120);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
        <span style={{ fontSize: 10, color: "#3f3f46", fontFamily: "ui-monospace, monospace" }}>
          {(text || "").length} chars
        </span>
      </div>
      <div
        className="font-mono shadow-inner bg-black/40"
        style={{
          borderLeft: `2px solid ${accent}`,
          borderRadius: 6,
          padding: 8,
          minHeight: 48,
          maxHeight: 80,
          overflow: "hidden",
          fontSize: 11,
          color: "#71717a",
          wordBreak: "break-all",
          lineHeight: 1.5,
        }}
      >
        {t || <span style={{ color: "#2d2d30", fontStyle: "italic" }}>empty</span>}
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        color: "#52525b",
        marginBottom: 4,
      }}
    >
      {children}
    </label>
  );
}

const inputBase = {
  width: "100%",
  background: "#0d0d0f",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 12,
  color: "#f4f4f5",
  outline: "none",
  fontFamily: "ui-monospace, SFMono-Regular, monospace",
};

function ConfigInputs({ type, config, onChange }) {
  if (type === "caesar") {
    return (
      <div>
        <Label>Shift Amount</Label>
        <input
          className="cs-input"
          type="number"
          min={-25}
          max={25}
          value={config.shift}
          onChange={(e) => onChange("shift", parseInt(e.target.value, 10) || 0)}
          style={{ ...inputBase, maxWidth: 80 }}
        />
      </div>
    );
  }
  if (type === "xor") {
    return (
      <div>
        <Label>Key</Label>
        <input
          className="cs-input"
          type="text"
          value={config.key}
          onChange={(e) => onChange("key", e.target.value)}
          style={inputBase}
        />
      </div>
    );
  }
  if (type === "vigenere") {
    return (
      <div>
        <Label>Keyword</Label>
        <input
          className="cs-input"
          type="text"
          value={config.keyword}
          onChange={(e) => onChange("keyword", e.target.value.toUpperCase())}
          style={inputBase}
        />
      </div>
    );
  }
  if (type === "railfence") {
    return (
      <div>
        <Label>Number of Rails</Label>
        <input
          className="cs-input"
          type="number"
          min={2}
          max={10}
          value={config.rails}
          onChange={(e) => onChange("rails", Math.max(2, Math.min(10, parseInt(e.target.value, 10) || 2)))}
          style={{ ...inputBase, maxWidth: 80 }}
        />
      </div>
    );
  }
  if (type === "columnar") {
    return (
      <div>
        <Label>Keyword</Label>
        <input
          className="cs-input"
          type="text"
          value={config.keyword}
          onChange={(e) => onChange("keyword", e.target.value.toUpperCase())}
          style={inputBase}
        />
      </div>
    );
  }
  if (type === "base64") {
    return (
      <div style={{ fontSize: 11, color: "#52525b", fontStyle: "italic" }}>
        No configuration required
      </div>
    );
  }
  return null;
}
