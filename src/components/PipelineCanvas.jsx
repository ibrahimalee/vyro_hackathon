import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { Workflow } from "lucide-react";
import CipherNode from "./CipherNode";
import Connector from "./Connector";

export default function PipelineCanvas({
  nodes,
  results,
  onUpdate,
  onDuplicate,
  onDelete,
  onReorder,
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [activeId, setActiveId] = useState(null);

  const handleDragEnd = (e) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = nodes.findIndex((n) => n.id === active.id);
    const newIndex = nodes.findIndex((n) => n.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(nodes, oldIndex, newIndex));
  };

  const activeNode = activeId ? nodes.find((n) => n.id === activeId) : null;

  return (
    <div
      className="cs-scroll"
      style={{
        flex: 1,
        overflowY: "auto",
        background: "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 60%), #09090b",
        padding: 24,
      }}
    >
      {nodes.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e) => setActiveId(e.active.id)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
              {nodes.map((node, i) => {
                const result = results[node.id];
                const nextResult = i < nodes.length - 1 ? results[nodes[i + 1].id] : null;
                return (
                  <div key={node.id}>
                    <CipherNode
                      node={node}
                      result={result}
                      onUpdate={onUpdate}
                      onDuplicate={onDuplicate}
                      onDelete={onDelete}
                    />
                    {i < nodes.length - 1 && (
                      <Connector
                        pipelineRan={!!result}
                        charCount={
                          result && !result.error
                            ? result.outputText.length
                            : nextResult
                            ? nextResult.inputText.length
                            : null
                        }
                      />
                    )}
                  </div>
                );
              })}
            </SortableContext>
            <DragOverlay>
              {activeNode ? (
                <div style={{ opacity: 0.9 }}>
                  <CipherNode
                    node={activeNode}
                    result={null}
                    onUpdate={() => {}}
                    onDuplicate={() => {}}
                    onDelete={() => {}}
                    isOverlay
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        height: "100%",
        minHeight: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: "1.5px dashed rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "48px 32px",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Workflow size={32} color="#3f3f46" style={{ margin: "0 auto" }} />
        <div style={{ fontSize: 14, color: "#52525b", marginTop: 16 }}>
          No cipher nodes yet
        </div>
        <div style={{ fontSize: 12, color: "#3f3f46", marginTop: 6, lineHeight: 1.5 }}>
          Add nodes from the left panel to build your encryption pipeline
        </div>
      </div>
    </div>
  );
}
