import React, { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PipelineCanvas from "./components/PipelineCanvas";
import IOPanel from "./components/IOPanel";
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
    } catch {
      alert("Could not import: invalid pipeline file.");
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
    </div>
  );
}
