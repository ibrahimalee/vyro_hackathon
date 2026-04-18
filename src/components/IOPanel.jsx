import React, { useState, useEffect } from "react";
import {
  ShieldCheck, ShieldOff, Play, LoaderCircle, Copy, CheckCheck,
  AlertTriangle, Repeat,
} from "lucide-react";
import { useTypewriter } from "../hooks/useTypewriter";

export default function IOPanel({
  nodeCount,
  inputText, setInputText,
  outputText,
  pipelineError,
  mode, setMode,
  isRunning, onRun,
  onPreset,
  chainCount, setChainCount,
}) {
  const valid = nodeCount >= 3;
  const displayedOutput = useTypewriter(outputText, 8, 200);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const ratio = inputText.length > 0 ? (outputText.length / inputText.length).toFixed(2) : "0.00";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
    } catch {}
  };

  const runColors = mode === "encrypt"
    ? { bg: "rgba(139,92,246,0.2)", bd: "rgba(139,92,246,0.35)", color: "#a78bfa", hover: "rgba(139,92,246,0.3)" }
    : { bg: "rgba(34,211,238,0.12)", bd: "rgba(34,211,238,0.3)", color: "#22d3ee", hover: "rgba(34,211,238,0.2)" };

  return (
    <div
      className="cs-scroll"
      style={{
        width: 280,
        background: "#0f0f11",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 16px",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      <SectionLabel>INPUT</SectionLabel>
      <textarea
        className="cs-textarea font-mono"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter plaintext..."
        style={{
          width: "100%",
          minHeight: 120,
          maxHeight: 200,
          background: "#0d0d0f",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 13,
          color: "#f4f4f5",
          outline: "none",
          lineHeight: 1.6,
          marginTop: 8,
        }}
      />

      <div style={{ display: "flex", marginTop: 12 }}>
        <ModeBtn
          active={mode === "encrypt"}
          onClick={() => setMode("encrypt")}
          icon={<ShieldCheck size={13} />}
          label="Encrypt"
          activeBg="rgba(139,92,246,0.15)"
          activeBd="rgba(139,92,246,0.4)"
          activeColor="#a78bfa"
          radius="7px 0 0 7px"
        />
        <ModeBtn
          active={mode === "decrypt"}
          onClick={() => setMode("decrypt")}
          icon={<ShieldOff size={13} />}
          label="Decrypt"
          activeBg="rgba(34,211,238,0.1)"
          activeBd="rgba(34,211,238,0.35)"
          activeColor="#22d3ee"
          radius="0 7px 7px 0"
          noLeft
        />
      </div>

      <button
        onClick={onRun}
        disabled={!valid || isRunning}
        className="btn-press"
        style={{
          width: "100%",
          height: 36,
          marginTop: 10,
          borderRadius: 7,
          fontSize: 13,
          fontWeight: 500,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          cursor: valid && !isRunning ? "pointer" : "not-allowed",
          background: valid ? runColors.bg : "rgba(255,255,255,0.04)",
          border: `1px solid ${valid ? runColors.bd : "rgba(255,255,255,0.07)"}`,
          color: valid ? runColors.color : "#3f3f46",
        }}
        onMouseEnter={(e) => {
          if (valid && !isRunning) e.currentTarget.style.background = runColors.hover;
        }}
        onMouseLeave={(e) => {
          if (valid && !isRunning) e.currentTarget.style.background = runColors.bg;
        }}
      >
        {isRunning ? (
          <>
            <LoaderCircle size={13} className="spin" />
            Running...
          </>
        ) : (
          <>
            <Play size={13} />
            Run Pipeline
          </>
        )}
      </button>

      {!valid && (
        <div
          style={{
            marginTop: 8,
            background: "rgba(251,191,36,0.08)",
            border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 11,
            color: "#fbbf24",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <AlertTriangle size={11} />
          Pipeline needs at least 3 cipher nodes
        </div>
      )}

      {/* Multi-Pass Chaining */}
      <div
        style={{
          marginTop: 12,
          background: "rgba(139,92,246,0.06)",
          border: "1px solid rgba(139,92,246,0.15)",
          borderRadius: 8,
          padding: "8px 10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <Repeat size={11} color="#8b5cf6" />
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8b5cf6" }}>
            Multi-Pass Chaining
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setChainCount(Math.max(1, chainCount - 1))}
            className="btn-press"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#71717a",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
          <span
            className="font-mono"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: chainCount > 1 ? "#a78bfa" : "#52525b",
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {chainCount}×
          </span>
          <button
            onClick={() => setChainCount(Math.min(10, chainCount + 1))}
            className="btn-press"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#71717a",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
          <span style={{ fontSize: 10, color: "#52525b", marginLeft: 4 }}>
            {chainCount === 1 ? "Single pass" : `Output re-encrypts ${chainCount} times`}
          </span>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>OUTPUT</SectionLabel>
        {pipelineError ? (
          <span
            style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: 10,
              color: "#f87171",
            }}
          >
            ✕ Fault
          </span>
        ) : outputText ? (
          <span
            style={{
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: 10,
              color: "#4ade80",
            }}
          >
            ✓ Ready
          </span>
        ) : null}
      </div>

      <div
        className="font-mono cs-scroll"
        style={{
          minHeight: 120,
          maxHeight: 220,
          overflowY: "auto",
          background: "#0d0d0f",
          border: `1px solid ${pipelineError ? "rgba(127,29,29,0.5)" : outputText ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 12,
          wordBreak: "break-all",
          lineHeight: 1.7,
          marginTop: 8,
          color: pipelineError ? "#f87171" : outputText ? "#a1a1aa" : "#2d2d30",
        }}
      >
        {pipelineError
          ? pipelineError
          : outputText
            ? displayedOutput
            : "Output will appear here..."}
      </div>

      {outputText && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <Stat>in: {inputText.length}ch</Stat>
          <Stat>out: {outputText.length}ch</Stat>
          <Stat>×{ratio}</Stat>
        </div>
      )}

      <button
        onClick={copy}
        disabled={!outputText}
        className="btn-press"
        style={{
          width: "100%",
          height: 30,
          marginTop: 10,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 6,
          fontSize: 12,
          color: copied ? "#4ade80" : "#52525b",
          cursor: outputText ? "pointer" : "not-allowed",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
        onMouseEnter={(e) => {
          if (outputText && !copied) {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "#a1a1aa";
          }
        }}
        onMouseLeave={(e) => {
          if (!copied) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#52525b";
          }
        }}
      >
        {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
        {copied ? "Copied!" : "Copy to clipboard"}
      </button>

      <div style={{ marginTop: 16 }}>
        <SectionLabel dim>PRESETS</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
          <PresetBtn label="⚡ Classic Stack" onClick={() => onPreset("classic")} />
          <PresetBtn label="🔥 Maximum Chaos" onClick={() => onPreset("chaos")} />
          <PresetBtn label="✦ Minimal Trio" onClick={() => onPreset("minimal")} />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, dim }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: dim ? "#3f3f46" : "#52525b",
      }}
    >
      {children}
    </div>
  );
}

function ModeBtn({ active, onClick, icon, label, activeBg, activeBd, activeColor, radius, noLeft }) {
  return (
    <button
      onClick={onClick}
      className="btn-press"
      style={{
        flex: 1,
        height: 34,
        background: active ? activeBg : "transparent",
        border: `1px solid ${active ? activeBd : "rgba(255,255,255,0.1)"}`,
        borderLeft: noLeft && !active ? "none" : `1px solid ${active ? activeBd : "rgba(255,255,255,0.1)"}`,
        color: active ? activeColor : "#71717a",
        borderRadius: radius,
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function Stat({ children }) {
  return (
    <span
      className="font-mono"
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: 4,
        padding: "3px 7px",
        fontSize: 10,
        color: "#52525b",
      }}
    >
      {children}
    </span>
  );
}

function PresetBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn-press"
      style={{
        height: 28,
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 6,
        fontSize: 11,
        color: "#52525b",
        textAlign: "left",
        padding: "0 10px",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.color = "#71717a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#52525b";
      }}
    >
      {label}
    </button>
  );
}
