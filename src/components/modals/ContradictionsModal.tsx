import React from "react";
import { Contradiction, Source, ResearchProject } from "../../types";
import { 
  X, 
  ShieldAlert, 
  Scale, 
  ArrowRight, 
  FileText, 
  ExternalLink, 
  AlertTriangle,
  Sparkles
} from "lucide-react";

interface ContradictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contradictions: Contradiction[];
  sources: Source[];
  onSelectNodeByName?: (name: string) => void;
}

export function ContradictionsModal({
  isOpen,
  onClose,
  contradictions,
  sources,
  onSelectNodeByName,
}: ContradictionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#fdfdfd] border-2 border-black w-full max-w-4xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffe4e6] border-2 border-black flex items-center justify-center text-rose-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1a1a1a] flex items-center gap-2">
                <span>Discovered Empirical Contradictions</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#ffe4e6] text-rose-950 border border-black">
                  {contradictions.length} Debates
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Active scientific disagreements, conflicting benchmark findings, and methodology nuances
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
          {contradictions.length === 0 ? (
            <div className="py-12 text-center text-slate-600 font-medium">
              <p className="text-sm">No explicit contradictions detected across the analyzed corpus.</p>
            </div>
          ) : (
            contradictions.map((contra, idx) => {
              const srcA = sources.find((s) => s.id === contra.sourceAId);
              const srcB = sources.find((s) => s.id === contra.sourceBId);

              return (
                <div
                  key={contra.id || idx}
                  className="bg-white border-2 border-black rounded-2xl p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {/* Title & Disagreement Tag */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#ffe4e6] border-2 border-black text-rose-950 flex items-center justify-center text-xs font-bold font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-extrabold text-[#1a1a1a]">
                        {contra.topic}
                      </h4>
                    </div>

                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[#ffe4e6] text-rose-950 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      Disagreement: {contra.disagreementType}
                    </span>
                  </div>

                  {/* Competing Claims Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Claim A */}
                    <div className="p-4 bg-[#f8fafc] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono font-bold">
                        <span className="text-indigo-900 font-extrabold">Position A</span>
                        <span>{srcA?.venue || srcA?.sourceType || "Source A"}</span>
                      </div>
                      <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                        "{contra.claimA}"
                      </p>
                      {srcA && (
                        <div className="pt-1.5 border-t border-black/10 text-[11px] text-slate-600 truncate font-medium">
                          Citation: <span className="text-black font-semibold">{srcA.title}</span> ({srcA.publicationDate})
                        </div>
                      )}
                    </div>

                    {/* Claim B */}
                    <div className="p-4 bg-[#fff1f2] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono font-bold">
                        <span className="text-rose-950 font-extrabold">Position B (Disputing)</span>
                        <span>{srcB?.venue || srcB?.sourceType || "Source B"}</span>
                      </div>
                      <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                        "{contra.claimB}"
                      </p>
                      {srcB && (
                        <div className="pt-1.5 border-t border-black/10 text-[11px] text-slate-600 truncate font-medium">
                          Citation: <span className="text-black font-semibold">{srcB.title}</span> ({srcB.publicationDate})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Context and Reason for Divergence */}
                  <div className="p-3.5 bg-[#fff7d1] border-2 border-black rounded-xl space-y-1.5 text-xs text-amber-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium">
                    <div className="font-extrabold text-amber-950 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
                      <span>Context & Cause of Empirical Divergence</span>
                    </div>
                    <p className="leading-relaxed text-slate-800 font-medium">{contra.context}</p>
                  </div>

                  {/* Suggested Resolution / Synthesis */}
                  {contra.suggestedResolution && (
                    <div className="p-3 bg-[#e2fce3] border-2 border-black rounded-xl text-xs text-emerald-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium">
                      <div className="font-extrabold text-emerald-950 uppercase tracking-wider font-mono text-[10px] mb-1">
                        Synthesized Resolution & Modern Consensus
                      </div>
                      <p className="leading-relaxed text-slate-800 font-medium">{contra.suggestedResolution}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
