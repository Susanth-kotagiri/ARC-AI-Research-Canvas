import React from "react";
import { ResearchGap } from "../../types";
import { 
  X, 
  Sparkles, 
  HelpCircle, 
  ArrowUpRight, 
  Compass, 
  Lightbulb,
  CheckCircle2,
  FileSearch
} from "lucide-react";

interface ResearchGapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchGaps: ResearchGap[];
}

export function ResearchGapsModal({
  isOpen,
  onClose,
  researchGaps,
}: ResearchGapsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#fdfdfd] border-2 border-black w-full max-w-4xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] border-2 border-black flex items-center justify-center text-purple-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1a1a1a] flex items-center gap-2">
                <span>Identified Open Research Frontiers & Gaps</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#f3e8ff] text-purple-950 border border-black">
                  {researchGaps.length} Gaps
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Unexplored combinations, benchmark omissions, and critical literature blindspots
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
          {researchGaps.length === 0 ? (
            <div className="py-12 text-center text-slate-600 font-medium">
              <p className="text-sm">No critical research gaps detected in this corpus.</p>
            </div>
          ) : (
            researchGaps.map((gap, idx) => (
              <div
                key={gap.id || idx}
                className="bg-white border-2 border-black rounded-2xl p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {/* Title and metadata */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#f3e8ff] border-2 border-black text-purple-950 flex items-center justify-center text-xs font-bold font-mono mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1a1a1a]">
                        {gap.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-600 font-mono font-bold">
                        <span>Analyzed {gap.sourceCountAnalyzed} Sources</span>
                        <span>•</span>
                        <span className="text-purple-900 uppercase font-extrabold">
                          Confidence: {gap.confidence}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-800 leading-relaxed bg-[#f8fafc] p-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium">
                  {gap.description}
                </p>

                {/* Evidence */}
                <div className="p-3.5 bg-[#f3e8ff] border-2 border-black rounded-xl space-y-1 text-xs text-purple-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium">
                  <div className="text-[10px] font-mono uppercase text-purple-950 font-extrabold flex items-center gap-1.5">
                    <FileSearch className="w-3.5 h-3.5 text-purple-800" />
                    <span>Corpus Evidence & Benchmarking Deficit</span>
                  </div>
                  <p className="leading-relaxed text-slate-800 font-medium">{gap.evidence}</p>
                </div>

                {/* Potential Research Directions */}
                {gap.potentialDirections && gap.potentialDirections.length > 0 && (
                  <div className="p-3.5 bg-white border-2 border-black rounded-xl space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-[10px] font-mono uppercase text-amber-950 font-extrabold flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                      <span>Promising Investigation Pathways</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                      {gap.potentialDirections.map((dir, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-800 shrink-0 mt-0.5" />
                          <span>{dir}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
