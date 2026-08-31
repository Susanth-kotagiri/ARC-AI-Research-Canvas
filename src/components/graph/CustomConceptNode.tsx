import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { ConceptNode } from "../../types";
import { 
  Layers, 
  Cpu, 
  Sparkles, 
  GitBranch, 
  Database, 
  FileText, 
  AlertTriangle, 
  HelpCircle,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; badgeBg: string; footerBg: string }> = {
  Fundamentals: {
    bg: "bg-white",
    border: "border-black",
    text: "text-blue-900",
    badgeBg: "bg-[#ebf4ff] text-blue-900 border-black",
    footerBg: "bg-slate-50",
  },
  Architecture: {
    bg: "bg-[#ebf4ff]",
    border: "border-black",
    text: "text-indigo-950",
    badgeBg: "bg-white text-indigo-900 border-black",
    footerBg: "bg-indigo-100/50",
  },
  Retrieval: {
    bg: "bg-[#e0f2fe]",
    border: "border-black",
    text: "text-sky-950",
    badgeBg: "bg-white text-sky-900 border-black",
    footerBg: "bg-sky-100/50",
  },
  Generation: {
    bg: "bg-[#e2fce3]",
    border: "border-black",
    text: "text-emerald-950",
    badgeBg: "bg-white text-emerald-900 border-black",
    footerBg: "bg-emerald-100/50",
  },
  Evaluation: {
    bg: "bg-[#fff7d1]",
    border: "border-black",
    text: "text-amber-950",
    badgeBg: "bg-white text-amber-900 border-black",
    footerBg: "bg-amber-100/50",
  },
  Limitations: {
    bg: "bg-[#ffe4e6]",
    border: "border-black",
    text: "text-rose-950",
    badgeBg: "bg-white text-rose-900 border-black",
    footerBg: "bg-rose-100/50",
  },
  Frontier: {
    bg: "bg-[#f3e8ff]",
    border: "border-black",
    text: "text-purple-950",
    badgeBg: "bg-white text-purple-900 border-black",
    footerBg: "bg-purple-100/50",
  },
};

function getNodeIcon(type: string) {
  switch (type) {
    case "technology":
      return <Cpu className="w-3.5 h-3.5" />;
    case "model":
      return <Sparkles className="w-3.5 h-3.5" />;
    case "method":
      return <GitBranch className="w-3.5 h-3.5" />;
    case "dataset":
      return <Database className="w-3.5 h-3.5" />;
    case "paper":
      return <FileText className="w-3.5 h-3.5" />;
    case "problem":
      return <AlertTriangle className="w-3.5 h-3.5" />;
    case "gap":
      return <HelpCircle className="w-3.5 h-3.5" />;
    default:
      return <Layers className="w-3.5 h-3.5" />;
  }
}

export const CustomConceptNode = memo(({ data, selected }: NodeProps) => {
  const node = data as unknown as ConceptNode & { 
    isDimmed?: boolean; 
    isHighlighted?: boolean;
    isContradictionHighlighted?: boolean;
    isGapHighlighted?: boolean;
  };
  
  const categoryConfig = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.Fundamentals;
  const isDimmed = node.isDimmed;
  const isHighlighted = node.isHighlighted;
  const isContradiction = node.isContradictionHighlighted || node.type === "problem";
  const isGap = node.isGapHighlighted || node.type === "gap" || node.isResearchGap;

  return (
    <div
      className={`relative group w-64 rounded-xl border-2 transition-all duration-200 ${
        categoryConfig.bg
      } ${
        selected
          ? "border-black ring-4 ring-indigo-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1"
          : isHighlighted
          ? "border-black ring-4 ring-amber-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] node-highlight-glow scale-105"
          : isContradiction
          ? "border-black ring-4 ring-rose-400 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
          : isGap
          ? "border-black ring-4 ring-purple-400 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
          : "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
      } ${isDimmed ? "opacity-30 grayscale-[50%] scale-95" : "opacity-100"}`}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-white !border-2 !border-black transition-all group-hover:!scale-125"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-white !border-2 !border-black transition-all group-hover:!scale-125"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-white !border-2 !border-black transition-all group-hover:!scale-125"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-white !border-2 !border-black transition-all group-hover:!scale-125"
      />

      {/* Header bar */}
      <div className="p-3.5 pb-2">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${categoryConfig.badgeBg}`}
          >
            {getNodeIcon(node.type)}
            {node.type}
          </span>
          <span className="text-[10px] text-slate-700 font-mono font-bold">
            {node.category}
          </span>
        </div>

        <h3 className="text-sm font-extrabold text-[#1a1a1a] line-clamp-1 leading-snug">
          {node.name}
        </h3>

        <p className="text-[11px] text-slate-700 line-clamp-2 mt-1 leading-relaxed font-medium">
          {node.description}
        </p>
      </div>

      {/* Footer bar */}
      <div className={`px-3.5 py-1.5 mt-1 border-t-2 border-black ${categoryConfig.footerBg} rounded-b-[10px] flex items-center justify-between text-[10px] text-slate-800 font-bold`}>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-600 border border-black" />
          <span>{Math.round(node.confidence * 100)}% conf</span>
        </div>

        <div className="flex items-center gap-1 text-slate-700 font-medium">
          <FileText className="w-3 h-3 text-indigo-700" />
          <span>{node.sourceIds?.length || 1} sources</span>
        </div>
      </div>
    </div>
  );
});

CustomConceptNode.displayName = "CustomConceptNode";
