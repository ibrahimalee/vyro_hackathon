import { ciphers } from "./ciphers";

const PIPELINE_FAULT = "ERR_PIPELINE_FAULT: Invalid character sequence for current cipher configuration. Reverse traverse aborted.";

export function runPipeline(nodes, inputText, mode) {
  if (nodes.length < 3) {
    throw { type: "validation", message: "Need at least 3 nodes" };
  }
  const ordered = mode === "encrypt" ? [...nodes] : [...nodes].reverse();
  let current = inputText;
  const results = [];

  for (const node of ordered) {
    const nodeInput = current;
    try {
      const fn = mode === "encrypt" ? ciphers[node.type].encrypt : ciphers[node.type].decrypt;
      const nodeOutput = fn(current, node.config);
      if (typeof nodeOutput !== "string") {
        throw new Error(PIPELINE_FAULT);
      }
      results.push({ id: node.id, inputText: nodeInput, outputText: nodeOutput, error: null });
      current = nodeOutput;
    } catch (err) {
      const errorMessage = err?.message || PIPELINE_FAULT;
      results.push({
        id: node.id,
        inputText: nodeInput,
        outputText: "",
        error: errorMessage,
      });
      return { success: false, results, finalOutput: "", failedAt: node.id, pipelineError: PIPELINE_FAULT };
    }
  }
  return { success: true, results, finalOutput: current };
}

