import React, { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PipelineCanvas from "./components/PipelineCanvas";
import IOPanel from "./components/IOPanel";
import { HelpCircle, X } from "lucide-react";
import { toast } from "sonner";
import { ciphers } from "./lib/ciphers";
import { runPipeline } from "./lib/pipeline";
import { uuid } from "./lib/utils";

const makeNode = (type, config) => ({
  id: uuid(),
  type,
  config: config || { ...ciphers[type].defaultConfig },
});

const PRESETS = {
  classic: () => [
    makeNode("caesar", { shift: 3 }),
    makeNode("xor", { key: "hack" }),
    makeNode("vigenere", { keyword: "VYRO" }),
  ],
  chaos: () => [
    makeNode("caesar", { shift: 7 }),
    makeNode("railfence", { rails: 4 }),
    makeNode("columnar", { keyword: "ZEBRA" }),
    makeNode("xor", { key: "key" }),
    makeNode("vigenere", { keyword: "SECRET" }),
  ],
  minimal: () => [
    makeNode("base64"),
    makeNode("caesar", { shift: 13 }),
    makeNode("xor", { key: "abc" }),
  ],
};

export default function App() {
  const [nodes, setNodes] = useState(() => [
    makeNode("caesar", { shift: 13 }),
    makeNode("base64"),
    makeNode("vigenere", { keyword: "VYRO" }),
    makeNode("xor", { key: "hack" }),
  ]);
  const [inputText, setInputText] = useState("Vyrothon_2026: The Node-Based Cipher!");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("encrypt");
  const [nodeResults, setNodeResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineError, setPipelineError] = useState(null);
  const [chainCount, setChainCount] = useState(1);
  const [showArchModal, setShowArchModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = "CipherStack — Cascade Encryption Builder";
    const link = document.createElement("link");
    link.rel = "icon";
    link.href =
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="78" font-size="80">🔒</text></svg>`,
      );
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Clear stale results whenever pipeline shape/config changes
  const clearResults = () => {
    setNodeResults({});
    setOutputText("");
    setPipelineError(null);
  };

  const updateNodes = (next) => {
    setNodes(next);
    clearResults();
  };

  const addNode = (type) => updateNodes([...nodes, makeNode(type)]);
  const deleteNode = (id) => updateNodes(nodes.filter((n) => n.id !== id));
  const duplicateNode = (id) => {
    const idx = nodes.findIndex((n) => n.id === id);
    if (idx < 0) return;
    const orig = nodes[idx];
    const dup = { id: uuid(), type: orig.type, config: { ...orig.config } };
    const next = [...nodes];
    next.splice(idx + 1, 0, dup);
    updateNodes(next);
  };
  const updateNode = (id, config) =>
    updateNodes(nodes.map((n) => (n.id === id ? { ...n, config } : n)));
  const reorder = (next) => updateNodes(next);

  const run = async () => {
    if (nodes.length < 3) return;
    setIsRunning(true);
    setNodeResults({});
    setOutputText("");
    setPipelineError(null);
    await new Promise((r) => setTimeout(r, 350));
    try {
      let current = inputText;
      let lastMap = {};
      let hadError = false;
      const passes = Math.max(1, Math.min(chainCount, 10));
      for (let pass = 0; pass < passes; pass++) {
        const res = runPipeline(nodes, current, mode);
        const map = {};
        res.results.forEach((r) => (map[r.id] = r));
        lastMap = map;
        if (!res.success) {
          setPipelineError(res.pipelineError);
          hadError = true;
          break;
        }
        current = res.finalOutput;
      }
      setNodeResults(lastMap);
      if (!hadError) {
        setOutputText(current);
      }
    } catch (e) {
      setPipelineError("ERR_PIPELINE_FAULT: Invalid character sequence for current cipher configuration. Reverse traverse aborted.");
      console.warn(e);
    } finally {
      setIsRunning(false);
    }
  };

  const onPreset = (key) => {
    const builder = PRESETS[key];
    if (!builder) return;
    setNodes(builder());
    clearResults();
  };

  const onExport = () => {
    const payload = {
      version: "1.0",
      nodes: nodes.map((n) => ({ type: n.type, config: n.config })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cipherstack-pipeline.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportClick = () => fileInputRef.current?.click();

  const onFileChosen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || !Array.isArray(parsed.nodes)) throw new Error("invalid");
      const rebuilt = parsed.nodes
        .filter((n) => n && ciphers[n.type])
        .map((n) => makeNode(n.type, { ...ciphers[n.type].defaultConfig, ...(n.config || {}) }));
      if (rebuilt.length === 0) throw new Error("empty");
      setNodes(rebuilt);
      clearResults();
      toast.success("Pipeline Imported", {
        description: `Successfully loaded ${rebuilt.length} cipher nodes.`,
      });
    } catch {
      toast.error("Import Failed", {
        description: "Could not read the pipeline file.",
      });
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#09090b", color: "#f4f4f5" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: "none" }}
        onChange={onFileChosen}
      />
      <Navbar nodeCount={nodes.length} onImport={onImportClick} onExport={onExport} />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Sidebar onAdd={addNode} />
        <PipelineCanvas
          nodes={nodes}
          results={nodeResults}
          onUpdate={updateNode}
          onDuplicate={duplicateNode}
          onDelete={deleteNode}
          onReorder={reorder}
        />
        <IOPanel
          nodeCount={nodes.length}
          inputText={inputText}
          setInputText={setInputText}
          outputText={outputText}
          pipelineError={pipelineError}
          mode={mode}
          setMode={setMode}
          isRunning={isRunning}
          onRun={run}
          onPreset={onPreset}
          chainCount={chainCount}
          setChainCount={setChainCount}
        />
      </div>

      {/* Architecture Modal Toggle */}
      <button
        onClick={() => setShowArchModal(true)}
        className="group"
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          zIndex: 40,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(139,92,246,0.1)";
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }}
        title="Engine Architecture"
      >
        <HelpCircle size={18} className="text-zinc-500 group-hover:text-purple-400 transition-colors" />
      </button>

      {/* Architecture Modal */}
      {showArchModal && (
        <div
          className="node-enter"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setShowArchModal(false)}
        >
          <div
            className="node-enter"
            style={{
              width: "100%",
              maxWidth: 500,
              background: "rgba(17,17,19,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f4f4f5", letterSpacing: "-0.01em" }}>Engine Architecture</h2>
              <button
                onClick={() => setShowArchModal(false)}
                style={{ background: "transparent", border: "none", color: "#52525b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.7 }}>
              <p style={{ marginBottom: 16 }}>
                CipherStack is built on a decoupled, pure-function cryptography engine. State is managed via a centralized Zustand store. To add a new cipher (e.g., AES-256), a developer only needs to:
              </p>
              <ul style={{ listStyleType: "none", padding: 0, marginBottom: 16 }}>
                <li style={{ marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#a78bfa", marginTop: 8, shrink: 0 }} />
                  <span>Export an <code style={{ color: "#a78bfa" }}>encrypt/decrypt</code> pure function in <code style={{ color: "#a78bfa" }}>ciphers.js</code>.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#a78bfa", marginTop: 8, shrink: 0 }} />
                  <span>Add the config schema to the Cipher Library array.</span>
                </li>
              </ul>
              <p>
                The UI, canvas routing, and reverse-traversal engine will dynamically adopt the new node with zero UI rewrites.
              </p>
            </div>

            <button
              onClick={() => setShowArchModal(false)}
              style={{
                marginTop: 28,
                width: "100%",
                padding: "12px 0",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#f4f4f5",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
