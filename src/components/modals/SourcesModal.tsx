import React, { useState } from "react";
import { Source } from "../../types";
import { 
  X, 
  BookOpen, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Award, 
  FileText, 
  Layers,
  Filter
} from "lucide-react";

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: Source[];
}

export function SourcesModal({
  isOpen,
  onClose,
  sources,
}: SourcesModalProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  if (!isOpen) return null;

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
      s.summary.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === "All" || s.sourceType === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#fdfdfd] border-2 border-black w-full max-w-4xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] border-2 border-black flex items-center justify-center text-sky-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1a1a1a] flex items-center gap-2">
                <span>Bibliography & Source Quality Audit</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#e0f2fe] text-sky-950 border border-black">
                  {sources.length} Sources
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Transparent citation metadata, peer-review verification, and evidence excerpts
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

        {/* Search & Filter Bar */}
        <div className="p-4 bg-white border-b-2 border-black flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or snippet..."
              className="w-full bg-[#f8fafc] border-2 border-black rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1a1a1a] placeholder-slate-500 font-medium focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {["All", "paper", "academic", "doc", "web"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all border-2 border-black cursor-pointer ${
                  filterType === t
                    ? "bg-[#e0f2fe] text-sky-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-slate-700 hover:bg-[#f8fafc]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8fafc]">
          {filteredSources.length === 0 ? (
            <div className="py-12 text-center text-slate-600 text-xs font-mono font-bold">
              No matching sources found.
            </div>
          ) : (
            filteredSources.map((src, idx) => (
              <div
                key={src.id || idx}
                className="bg-white border-2 border-black rounded-2xl p-5 space-y-3 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {/* Header line */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#e0f2fe] text-sky-950 border border-black text-[10px] font-mono uppercase font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {src.venue || src.sourceType}
                    </span>
                    {src.peerReviewed && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#e2fce3] text-emerald-950 border border-black text-[10px] font-mono font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <CheckCircle2 className="w-3 h-3" />
                        Peer-Reviewed
                      </span>
                    )}
                    {src.citationCount && (
                      <span className="text-[11px] text-slate-600 font-mono font-bold">
                        {src.citationCount} Citations
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-600 font-mono font-bold">
                    {src.publicationDate}
                  </span>
                </div>

                {/* Title & authors */}
                <div>
                  <h4 className="text-sm font-extrabold text-[#1a1a1a] leading-snug">
                    {src.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 font-mono font-medium">
                    {src.authors.join(", ")}
                  </p>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {src.summary}
                </p>

                {/* Snippet */}
                {src.snippet && (
                  <div className="p-3 bg-[#f8fafc] rounded-xl border border-black/20 text-xs text-slate-800 italic font-medium">
                    "{src.snippet}"
                  </div>
                )}

                {/* Quality indicator breakdown */}
                <div className="pt-2 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Award className="w-4 h-4 text-sky-700" />
                    <span className="font-bold text-emerald-800 font-mono">
                      Quality Score: {Math.round(src.qualityScore * 100)}%
                    </span>
                    <span>—</span>
                    <span className="text-slate-600 text-[11px] truncate max-w-sm">
                      {src.qualityReason}
                    </span>
                  </div>

                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-indigo-700 hover:text-black font-bold transition-colors"
                    >
                      <span>Open Paper / DOI</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
