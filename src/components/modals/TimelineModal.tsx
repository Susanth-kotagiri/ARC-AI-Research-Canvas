import React from "react";
import { TimelineEvent, ConceptNode } from "../../types";
import { 
  X, 
  Clock, 
  Sparkles, 
  GitCommit, 
  FileText, 
  Cpu, 
  Layers, 
  ArrowRight,
  Calendar
} from "lucide-react";

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: TimelineEvent[];
  allNodes: ConceptNode[];
  onSelectNode: (node: ConceptNode) => void;
}

export function TimelineModal({
  isOpen,
  onClose,
  timeline,
  allNodes,
  onSelectNode,
}: TimelineModalProps) {
  if (!isOpen) return null;

  // Sort timeline chronologically
  const sortedTimeline = [...timeline].sort((a, b) => a.year - b.year);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#fdfdfd] border-2 border-black w-full max-w-4xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fff7d1] border-2 border-black flex items-center justify-center text-amber-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1a1a1a] flex items-center gap-2">
                <span>Field Evolution & Chronological Timeline</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#fff7d1] text-amber-950 border border-black">
                  {sortedTimeline.length} Milestones
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Key architectural breakthroughs, benchmark papers, and paradigm shifts
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

        {/* Timeline Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
          <div className="relative border-l-2 border-black ml-4 space-y-8 py-2">
            {sortedTimeline.map((item, idx) => {
              const connectedNodes = allNodes.filter((n) =>
                item.nodeIds?.includes(n.id)
              );

              return (
                <div key={item.id || idx} className="relative pl-6 group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-black group-hover:scale-125 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>

                  <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-2.5 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#fff7d1] text-amber-950 border border-black text-xs font-bold font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          {item.year}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#ebf4ff] text-indigo-950 border border-black text-[10px] font-mono uppercase font-bold">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#1a1a1a]">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    {connectedNodes.length > 0 && (
                      <div className="pt-2 border-t-2 border-black/10 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-slate-600 font-bold">
                          Related Canvas Nodes:
                        </span>
                        {connectedNodes.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => {
                              onSelectNode(n);
                              onClose();
                            }}
                            className="px-2 py-0.5 rounded bg-[#f8fafc] hover:bg-[#ebf4ff] border border-black text-[11px] text-[#1a1a1a] font-bold transition-all flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <span>{n.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
