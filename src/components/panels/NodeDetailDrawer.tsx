import React, { useState } from "react";
import { ConceptNode, RelationshipEdge, Source, NodeExplanation } from "../../types";
import { 
  X, 
  Sparkles, 
  GitBranch, 
  Maximize2, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Scale, 
  Focus,
  BookOpen,
  Cpu,
  Loader2
} from "lucide-react";

interface NodeDetailDrawerProps {
  node: ConceptNode | null;
  allNodes: ConceptNode[];
  edges: RelationshipEdge[];
  sources: Source[];
  projectQuery: string;
  onClose: () => void;
  onSelectNode: (node: ConceptNode) => void;
  onExpandNode: (node: ConceptNode) => Promise<void>;
  onOpenCompare: (nodeA: ConceptNode) => void;
  onToggleFocus: (node: ConceptNode) => void;
  isFocused: boolean;
}

export function NodeDetailDrawer({
  node,
  allNodes,
  edges,
  sources,
  projectQuery,
  onClose,
  onSelectNode,
  onExpandNode,
  onOpenCompare,
  onToggleFocus,
  isFocused,
}: NodeDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "explain" | "evidence" | "connections">("overview");
  const [explainLevel, setExplainLevel] = useState<"beginner" | "student" | "engineer" | "researcher">("engineer");
  const [explanation, setExplanation] = useState<NodeExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  if (!node) return null;

  // Find incoming & outgoing connections
  const incomingEdges = edges.filter((e) => e.target === node.id);
  const outgoingEdges = edges.filter((e) => e.source === node.id);

  // Find linked sources
  const linkedSources = sources.filter((s) => node.sourceIds?.includes(s.id));

  // Handle Level Explanation fetch
  const fetchExplanation = async (level: "beginner" | "student" | "engineer" | "researcher") => {
    setExplainLevel(level);
    setIsExplaining(true);
    try {
      const res = await fetch("/api/nodes/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node,
          level,
          projectContext: projectQuery,
        }),
      });
      const data = await res.json();
      setExplanation(data);
    } catch (err) {
      console.error("Error explaining node:", err);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleExpand = async () => {
    setIsExpanding(true);
    try {
      await onExpandNode(node);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#fdfdfd] text-[#1a1a1a] border-l-2 border-black shadow-[-6px_0px_0px_0px_rgba(0,0,0,1)] z-40 flex flex-col transition-all duration-300 animate-in slide-in-from-right font-sans">
      {/* Drawer Header */}
      <div className="p-5 border-b-2 border-black flex items-start justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ebf4ff] text-indigo-950 border border-black">
              {node.type}
            </span>
            <span className="text-xs text-slate-700 font-mono font-bold">
              {node.category}
            </span>
            <span className="text-xs text-emerald-800 font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 border border-black" />
              {Math.round(node.confidence * 100)}% conf
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-[#1a1a1a] leading-tight">
            {node.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-[#ffe4e6] text-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Toolbar (Bento buttons) */}
      <div className="px-5 py-2.5 bg-[#f8fafc] border-b-2 border-black flex items-center justify-between gap-2 overflow-x-auto">
        <button
          onClick={() => onToggleFocus(node)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
            isFocused
              ? "bg-[#ebf4ff] text-indigo-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5"
              : "bg-white text-[#1a1a1a] hover:bg-[#ebf4ff]"
          }`}
        >
          <Focus className="w-3.5 h-3.5 text-indigo-700" />
          <span>{isFocused ? "Focused" : "Focus Node"}</span>
        </button>

        <button
          onClick={handleExpand}
          disabled={isExpanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#fff7d1] hover:bg-[#fef08a] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#1a1a1a] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isExpanding ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          )}
          <span>Expand Graph</span>
        </button>

        <button
          onClick={() => onOpenCompare(node)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-[#e2fce3] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#1a1a1a] transition-all cursor-pointer"
        >
          <Scale className="w-3.5 h-3.5 text-emerald-700" />
          <span>Compare</span>
        </button>
      </div>

      {/* Navigation Tabs (Bento tab pills) */}
      <div className="flex border-b-2 border-black bg-white px-5 gap-2 pt-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-2 px-3 text-xs font-bold border-t-2 border-x-2 rounded-t-lg transition-all ${
            activeTab === "overview"
              ? "border-black bg-[#fdfdfd] text-[#1a1a1a] shadow-sm -mb-[2px] pb-2.5 z-10"
              : "border-transparent text-slate-600 hover:text-black"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => {
            setActiveTab("explain");
            if (!explanation) fetchExplanation(explainLevel);
          }}
          className={`py-2 px-3 text-xs font-bold border-t-2 border-x-2 rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === "explain"
              ? "border-black bg-[#fdfdfd] text-[#1a1a1a] shadow-sm -mb-[2px] pb-2.5 z-10"
              : "border-transparent text-slate-600 hover:text-black"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
          <span>Explain</span>
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`py-2 px-3 text-xs font-bold border-t-2 border-x-2 rounded-t-lg transition-all ${
            activeTab === "connections"
              ? "border-black bg-[#fdfdfd] text-[#1a1a1a] shadow-sm -mb-[2px] pb-2.5 z-10"
              : "border-transparent text-slate-600 hover:text-black"
          }`}
        >
          Connections ({incomingEdges.length + outgoingEdges.length})
        </button>
        <button
          onClick={() => setActiveTab("evidence")}
          className={`py-2 px-3 text-xs font-bold border-t-2 border-x-2 rounded-t-lg transition-all ${
            activeTab === "evidence"
              ? "border-black bg-[#fdfdfd] text-[#1a1a1a] shadow-sm -mb-[2px] pb-2.5 z-10"
              : "border-transparent text-slate-600 hover:text-black"
          }`}
        >
          Evidence ({linkedSources.length})
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-900 mb-2">
                What is it?
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed bg-[#ebf4ff] p-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium">
                {node.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-900 mb-2">
                Why it matters
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed bg-[#e2fce3] p-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium">
                {node.whyItMatters}
              </p>
            </div>

            {node.properties && Object.keys(node.properties).length > 0 && (
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">
                  Key Technical Properties
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(node.properties).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-2.5 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs"
                    >
                      <div className="text-[10px] text-slate-600 uppercase font-mono font-bold">
                        {k}
                      </div>
                      <div className="text-[#1a1a1a] font-bold mt-0.5 truncate">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* 2. EXPLAIN TAB */}
        {activeTab === "explain" && (
          <div className="space-y-4">
            {/* Level Selector */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {(["beginner", "student", "engineer", "researcher"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => fetchExplanation(lvl)}
                  className={`py-1.5 text-center text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                    explainLevel === lvl
                      ? "bg-[#fff7d1] text-[#1a1a1a] border border-black shadow-sm"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {isExplaining ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-700 space-y-3">
                <Loader2 className="w-7 h-7 text-indigo-700 animate-spin" />
                <p className="text-xs font-mono font-bold">
                  Synthesizing {explainLevel} explanation from research corpus...
                </p>
              </div>
            ) : explanation ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 bg-[#ebf4ff] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-950 font-bold mb-2">
                    {explanation.level} Explanation
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                    {explanation.explanation}
                  </p>
                </div>

                {explanation.keyTakeaways && (
                  <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#1a1a1a] font-bold mb-2">
                      Key Takeaways
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium">
                      {explanation.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {explanation.practicalApplication && (
                  <div className="p-4 bg-[#fff7d1] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-amber-950 font-bold mb-1.5">
                      Practical Application
                    </h4>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {explanation.practicalApplication}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* 3. CONNECTIONS TAB */}
        {activeTab === "connections" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#1a1a1a] font-bold mb-2">
                Incoming Dependencies ({incomingEdges.length})
              </h4>
              {incomingEdges.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No incoming nodes recorded.</p>
              ) : (
                <div className="space-y-2">
                  {incomingEdges.map((e) => {
                    const sourceNode = allNodes.find((n) => n.id === e.source);
                    return (
                      <div
                        key={e.id}
                        onClick={() => sourceNode && onSelectNode(sourceNode)}
                        className="p-3 bg-white hover:bg-[#ebf4ff] border-2 border-black rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#1a1a1a] group-hover:text-indigo-900 transition-colors">
                            {sourceNode?.name || e.source}
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5 font-medium">
                            Relationship: <span className="font-mono font-bold text-indigo-700">{e.relationship}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black transition-colors" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#1a1a1a] font-bold mb-2">
                Outgoing Projections ({outgoingEdges.length})
              </h4>
              {outgoingEdges.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No outgoing nodes recorded.</p>
              ) : (
                <div className="space-y-2">
                  {outgoingEdges.map((e) => {
                    const targetNode = allNodes.find((n) => n.id === e.target);
                    return (
                      <div
                        key={e.id}
                        onClick={() => targetNode && onSelectNode(targetNode)}
                        className="p-3 bg-white hover:bg-[#ebf4ff] border-2 border-black rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#1a1a1a] group-hover:text-indigo-900 transition-colors">
                            {targetNode?.name || e.target}
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5 font-medium">
                            Relationship: <span className="font-mono font-bold text-indigo-700">{e.relationship}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black transition-colors" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. EVIDENCE TAB */}
        {activeTab === "evidence" && (
          <div className="space-y-3">
            {linkedSources.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No direct primary citations attached.</p>
            ) : (
              linkedSources.map((src) => (
                <div
                  key={src.id}
                  className="p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#e0f2fe] text-sky-950 border border-black">
                      {src.venue || src.sourceType}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono font-bold">
                      {src.publicationDate}
                    </span>
                  </div>

                  <h5 className="text-xs font-extrabold text-[#1a1a1a] leading-snug">
                    {src.title}
                  </h5>

                  <p className="text-[11px] text-slate-600 line-clamp-1 font-mono">
                    {src.authors.join(", ")}
                  </p>

                  <div className="p-2.5 bg-[#f8fafc] rounded-lg border border-black text-[11px] text-slate-700 italic font-medium">
                    "{src.snippet}"
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-mono font-bold">
                      Quality: {Math.round(src.qualityScore * 100)}%
                    </span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-bold"
                      >
                        <span>View Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
