import React from "react";

export default function Connector({ pipelineRan, charCount }) {
  return (
    <div
      style={{
        height: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 1,
          background:
            "linear-gradient(to bottom, rgba(139,92,246,0.4), rgba(34,211,238,0.4))",
        }}
      />
      {pipelineRan && (
        <div
          className="travel-dot"
          style={{
            position: "absolute",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#22d3ee",
            boxShadow: "0 0 6px rgba(34,211,238,0.6)",
          }}
        />
      )}
      {pipelineRan && charCount != null && (
        <span
          style={{
            position: "absolute",
            right: -56,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
            padding: "2px 5px",
            fontSize: 10,
            color: "#52525b",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {charCount} ch
        </span>
      )}
    </div>
  );
}
