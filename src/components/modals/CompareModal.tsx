import React, { useState, useEffect } from "react";
import { ConceptNode, NodeComparison, ResearchProject } from "../../types";
import { 
  X, 
  Scale, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Layers
} from "lucide-react";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeA: ConceptNode | null;
  allNodes: ConceptNode[];
  projectQuery: string;
}

export function CompareModal({
  isOpen,
  onClose,
  nodeA,
  allNodes,
  projectQuery,
}: CompareModalProps) {
  const [selectedNodeBId, setSelectedNodeBId] = useState<string>("");
  const [comparison, setComparison] = useState<NodeComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const nodeB = allNodes.find((n) => n.id === selectedNodeBId) || null;

  // Auto-select a meaningful second node when opened
  useEffect(() => {
    if (nodeA && allNodes.length > 1) {
      const candidates = allNodes.filter((n) => n.id !== nodeA.id);
      if (candidates.length > 0) {
        setSelectedNodeBId(candidates[0].id);
      }
    }
  }, [nodeA, allNodes]);

  const handleRunComparison = async (targetNodeB: ConceptNode) => {
    if (!nodeA || !targetNodeB) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeA,
          nodeB: targetNodeB,
          projectQuery,
        }),
      });
      const data = await res.json();
      setComparison(data);
    } catch (err) {
      console.error("Error comparing nodes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (nodeA && nodeB) {
      handleRunComparison(nodeB);
    }
  }, [nodeA, selectedNodeBId]);

  if (!isOpen || !nodeA) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#fdfdfd] border-2 border-black w-full max-w-4xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fff7d1] border-2 border-black flex items-center justify-center text-amber-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1a1a1a] flex items-center gap-2">
                <span>Concept Comparison & Trade-off Matrix</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Evaluating empirical benchmarks, latency trade-offs, and architectural paradigms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-[#ffe4e6] text-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Bar */}
        <div className="p-4 bg-white border-b-2 border-black grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-[#ebf4ff] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono uppercase text-indigo-950 font-bold mb-1">
              Concept A (Primary)
            </div>
            <div className="text-sm font-extrabold text-[#1a1a1a]">{nodeA.name}</div>
            <div className="text-xs text-slate-700 truncate mt-0.5 font-medium">{nodeA.description}</div>
          </div>

          <div className="p-3 bg-[#e0f2fe] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono uppercase text-sky-950 font-bold mb-1">
              Concept B (Select Target)
            </div>
            <select
              value={selectedNodeBId}
              onChange={(e) => setSelectedNodeBId(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-1.5 text-xs text-[#1a1a1a] font-bold focus:outline-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              {allNodes
                .filter((n) => n.id !== nodeA.id)
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.category})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-600 space-y-3">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
              <p className="text-xs font-mono font-bold">
                Synthesizing multi-source empirical comparison...
              </p>
            </div>
          ) : comparison ? (
            <div className="space-y-6">
              {/* Trade-off summary banner */}
              <div className="p-4 bg-[#fff7d1] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-950 font-extrabold mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-800" />
                  <span>Synthesized Trade-Off Evaluation</span>
                </h4>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {comparison.tradeoffs}
                </p>
              </div>

              {/* Side-by-side comparison columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Advantages A */}
                <div className="p-4 bg-white border-2 border-black rounded-xl space-y-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider font-mono">
                    Advantages of {nodeA.name}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-800 font-medium">
                    {comparison.advantagesA?.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t-2 border-black/10 text-[11px] text-slate-700 font-medium">
                    <strong className="text-black font-bold">Optimal Use Case:</strong>{" "}
                    {comparison.optimalUseCasesA}
                  </div>
                </div>

                {/* Advantages B */}
                <div className="p-4 bg-white border-2 border-black rounded-xl space-y-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-xs font-extrabold text-sky-950 uppercase tracking-wider font-mono">
                    Advantages of {nodeB?.name}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-800 font-medium">
                    {comparison.advantagesB?.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t-2 border-black/10 text-[11px] text-slate-700 font-medium">
                    <strong className="text-black font-bold">Optimal Use Case:</strong>{" "}
                    {comparison.optimalUseCasesB}
                  </div>
                </div>
              </div>

              {/* Similarities & Differences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f8fafc] border-2 border-black rounded-xl space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-xs font-extrabold text-[#1a1a1a] uppercase font-mono">
                    Common Ground & Similarities
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {comparison.similarities?.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-1.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#f8fafc] border-2 border-black rounded-xl space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-xs font-extrabold text-[#1a1a1a] uppercase font-mono">
                    Architectural Differences
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {comparison.differences?.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0 mt-1.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
