import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
} from "@xyflow/react";
import { RelationshipEdge, RelationshipType } from "../../types";

const RELATIONSHIP_COLORS: Record<RelationshipType, { stroke: string; badge: string; text: string }> = {
  USES: {
    stroke: "#4338ca", // indigo-700
    badge: "bg-[#ebf4ff] border-2 border-black text-indigo-950 font-bold",
    text: "text-indigo-900",
  },
  DEPENDS_ON: {
    stroke: "#0284c7", // sky-600
    badge: "bg-[#e0f2fe] border-2 border-black text-sky-950 font-bold",
    text: "text-sky-900",
  },
  IMPROVES: {
    stroke: "#059669", // emerald-600
    badge: "bg-[#e2fce3] border-2 border-black text-emerald-950 font-bold",
    text: "text-emerald-900",
  },
  CONTRADICTS: {
    stroke: "#e11d48", // rose-600
    badge: "bg-[#ffe4e6] border-2 border-black text-rose-950 font-bold",
    text: "text-rose-900",
  },
  ALTERNATIVE_TO: {
    stroke: "#d97706", // amber-600
    badge: "bg-[#fff7d1] border-2 border-black text-amber-950 font-bold",
    text: "text-amber-900",
  },
  SUPPORTS: {
    stroke: "#0891b2", // cyan-600
    badge: "bg-[#e0f2fe] border-2 border-black text-cyan-950 font-bold",
    text: "text-cyan-900",
  },
  EXTENDS: {
    stroke: "#c026d3", // fuchsia-600
    badge: "bg-[#f3e8ff] border-2 border-black text-purple-950 font-bold",
    text: "text-purple-900",
  },
  COMPARES_WITH: {
    stroke: "#7c3aed", // violet-600
    badge: "bg-[#f3e8ff] border-2 border-black text-violet-950 font-bold",
    text: "text-violet-900",
  },
  PART_OF: {
    stroke: "#475569", // slate-600
    badge: "bg-[#f1f5f9] border-2 border-black text-slate-900 font-bold",
    text: "text-slate-900",
  },
  IMPLEMENTS: {
    stroke: "#2563eb", // blue-600
    badge: "bg-[#ebf4ff] border-2 border-black text-blue-950 font-bold",
    text: "text-blue-900",
  },
  PRECEDES: {
    stroke: "#9333ea", // purple-600
    badge: "bg-[#f3e8ff] border-2 border-black text-purple-950 font-bold",
    text: "text-purple-900",
  },
  RELATED_TO: {
    stroke: "#475569", // slate-600
    badge: "bg-white border-2 border-black text-[#1a1a1a] font-bold",
    text: "text-slate-900",
  },
};

export const CustomRelationshipEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
    markerEnd,
  }: EdgeProps) => {
    const edgeData = data as unknown as RelationshipEdge & {
      isHighlighted?: boolean;
      isDimmed?: boolean;
      showEvidence?: boolean;
    };

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const rel = edgeData?.relationship || ("RELATED_TO" as RelationshipType);
    const colorConfig = RELATIONSHIP_COLORS[rel] || RELATIONSHIP_COLORS.RELATED_TO;
    const isHighlighted = edgeData?.isHighlighted;
    const isDimmed = edgeData?.isDimmed;
    const showEvidence = edgeData?.showEvidence;

    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            stroke: isHighlighted ? "#f59e0b" : selected ? "#4f46e5" : colorConfig.stroke,
            strokeWidth: isHighlighted ? 3.5 : selected ? 3 : 2,
            strokeDasharray: rel === "DEPENDS_ON" || rel === "CONTRADICTS" ? "6 4" : undefined,
            opacity: isDimmed ? 0.2 : isHighlighted ? 1 : 0.85,
            transition: "all 0.2s ease",
          }}
        />
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div
              className={`px-2 py-0.5 rounded text-[9px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 cursor-pointer ${
                isHighlighted
                  ? "bg-[#fff7d1] border-2 border-black text-amber-950 font-bold scale-110 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : selected
                  ? "bg-[#ebf4ff] border-2 border-black text-indigo-950 font-bold scale-105 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : colorConfig.badge
              } ${isDimmed ? "opacity-25" : "opacity-100"}`}
              title={edgeData?.description || `${edgeData?.relationship} (${Math.round((edgeData?.confidence || 0.9) * 100)}% confidence)`}
            >
              <span className="flex items-center gap-1">
                {rel.replace("_", " ")}
                {showEvidence && edgeData?.sourceIds?.length ? (
                  <span className="bg-black text-white px-1 rounded text-[8px] font-bold">
                    {edgeData.sourceIds.length} src
                  </span>
                ) : null}
              </span>
            </div>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }
);

CustomRelationshipEdge.displayName = "CustomRelationshipEdge";
