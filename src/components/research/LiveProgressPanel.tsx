import React, { useEffect, useState } from "react";
import { 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Cpu, 
  Search, 
  FileSearch, 
  ShieldAlert, 
  HelpCircle, 
  GitBranch,
  Bot
} from "lucide-react";

interface LiveProgressPanelProps {
  query: string;
  depth: string;
  isComplete: boolean;
}

interface AgentStage {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
}

const AGENT_STAGES: AgentStage[] = [
  { id: "plan", name: "Agent 1 — Research Planner", role: "Deconstructing research scope into subquestions & dimensions", icon: Bot },
  { id: "sources", name: "Agent 2 — Scholarly Retriever", role: "Searching arXiv, Semantic Scholar, OpenAlex, & docs", icon: Search },
  { id: "extract", name: "Agent 3 — Concept Extractor", role: "Extracting technologies, models, datasets & methods", icon: Cpu },
  { id: "organize", name: "Agent 4 — Hierarchical Organizer", role: "Structuring categories from Fundamentals to Frontier", icon: Layers },
  { id: "relationships", name: "Agent 5 — Relationship Engine", role: "Detecting USES, DEPENDS_ON, IMPROVES & EXTENDS edges", icon: GitBranch },
  { id: "critic", name: "Agent 6 — Scientific Critic", role: "Detecting empirical contradictions & benchmark debates", icon: ShieldAlert },
  { id: "verifier", name: "Agent 7 — Evidence Verifier", role: "Verifying DOI citations & grounding claims in passages", icon: FileSearch },
  { id: "gaps", name: "Agent 8 — Research Gap Detector", role: "Identifying unmapped frontiers & open questions", icon: HelpCircle },
  { id: "graph", name: "Graph Engine — Canvas Generation", role: "Building interactive React Flow topology & layout", icon: Sparkles },
];

export function LiveProgressPanel({ query, depth, isComplete }: LiveProgressPanelProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [stats, setStats] = useState({
    sourcesFound: 4,
    documentsProcessed: 3,
    conceptsExtracted: 6,
    claimsDetected: 4,
    relationships: 7,
    contradictions: 1,
    researchGaps: 1,
  });

  useEffect(() => {
    if (isComplete) {
      setCurrentStageIdx(AGENT_STAGES.length);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < AGENT_STAGES.length - 1) {
          const next = prev + 1;
          setStats({
            sourcesFound: Math.min(32, 4 + next * 3),
            documentsProcessed: Math.min(24, 3 + next * 2),
            conceptsExtracted: Math.min(68, 6 + next * 7),
            claimsDetected: Math.min(42, 4 + next * 4),
            relationships: Math.min(88, 7 + next * 9),
            contradictions: Math.min(5, Math.floor(next / 2)),
            researchGaps: Math.min(4, Math.floor(next / 2)),
          });
          return next;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border-2 border-black w-full max-w-2xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fff7d1] border-2 border-black flex items-center justify-center text-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Loader2 className="w-5 h-5 animate-spin text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1a1a1a] flex items-center gap-2">
                <span>Multi-Agent Research Pipeline</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#ebf4ff] text-indigo-900 border border-black">
                  {depth} Depth
                </span>
              </h3>
              <p className="text-xs text-slate-600 truncate max-w-md font-medium">
                Topic: <span className="text-[#1a1a1a] font-bold">"{query}"</span>
              </p>
            </div>
          </div>
        </div>

        {/* Real-time stats ticker (Bento cells) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono">
          <div className="p-2.5 bg-[#e0f2fe] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] text-sky-900 font-bold uppercase">Sources</div>
            <div className="text-base font-black text-sky-950">{stats.sourcesFound}</div>
          </div>
          <div className="p-2.5 bg-[#f1f5f9] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] text-slate-700 font-bold uppercase">Docs</div>
            <div className="text-base font-black text-slate-900">{stats.documentsProcessed}</div>
          </div>
          <div className="p-2.5 bg-[#ebf4ff] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] text-indigo-900 font-bold uppercase">Concepts</div>
            <div className="text-base font-black text-indigo-950">{stats.conceptsExtracted}</div>
          </div>
          <div className="p-2.5 bg-[#e2fce3] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] text-emerald-900 font-bold uppercase">Edges</div>
            <div className="text-base font-black text-emerald-950">{stats.relationships}</div>
          </div>
          <div className="p-2.5 bg-[#ffe4e6] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] text-rose-900 font-bold uppercase">Debates</div>
            <div className="text-base font-black text-rose-950">{stats.contradictions}</div>
          </div>
          <div className="p-2.5 bg-[#f3e8ff] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] text-purple-900 font-bold uppercase">Gaps</div>
            <div className="text-base font-black text-purple-950">{stats.researchGaps}</div>
          </div>
        </div>

        {/* Active Stage List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {AGENT_STAGES.map((stg, idx) => {
            const isFinished = idx < currentStageIdx || isComplete;
            const isCurrent = idx === currentStageIdx && !isComplete;
            const Icon = stg.icon;

            return (
              <div
                key={stg.id}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                  isFinished
                    ? "bg-[#f8fafc] border-black/30 text-slate-700"
                    : isCurrent
                    ? "bg-[#ebf4ff] border-black text-[#1a1a1a] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-semibold"
                    : "bg-white border-black/10 text-slate-400 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                      isFinished
                        ? "bg-[#e2fce3] text-emerald-900 border-black"
                        : isCurrent
                        ? "bg-black text-white border-black"
                        : "bg-slate-100 text-slate-400 border-slate-300"
                    }`}
                  >
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : isCurrent ? (
                      <Icon className="w-4 h-4 animate-pulse text-white" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold font-mono leading-tight text-[#1a1a1a]">
                      {stg.name}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                      {stg.role}
                    </div>
                  </div>
                </div>

                {isCurrent && (
                  <Loader2 className="w-4 h-4 text-indigo-700 animate-spin shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
