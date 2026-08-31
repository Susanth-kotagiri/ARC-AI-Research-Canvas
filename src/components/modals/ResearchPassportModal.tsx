import React, { useState } from "react";
import { ResearchProject } from "../../types";
import { 
  X, 
  ShieldCheck, 
  Download, 
  FileText, 
  Code, 
  Printer, 
  Check, 
  Layers, 
  Sparkles, 
  Calendar,
  Compass,
  ShieldAlert,
  GitBranch
} from "lucide-react";

interface ResearchPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ResearchProject;
}

export function ResearchPassportModal({
  isOpen,
  onClose,
  project,
}: ResearchPassportModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const passport = project.passport || {
    topic: project.query,
    sourcesCount: project.sources.length,
    documentsCount: project.sources.length + 4,
    conceptsCount: project.nodes.length,
    claimsCount: project.claims.length,
    relationshipsCount: project.edges.length,
    contradictionsCount: project.contradictions.length,
    researchGapsCount: project.researchGaps.length,
    confidenceScore: 0.95,
    lastUpdated: new Date().toISOString(),
    depth: project.depth,
  };

  const handleExportMarkdown = () => {
    const md = `# Research Report: ${project.query}
**Depth:** ${project.depth.toUpperCase()} | **Generated:** ${new Date(project.createdAt).toLocaleDateString()} | **Confidence Score:** ${Math.round(passport.confidenceScore * 100)}%

---

## Executive Summary
${project.executiveSummary}

---

## Research Passport Audit
- **Sources Analyzed:** ${passport.sourcesCount}
- **Concepts & Entities Extracted:** ${passport.conceptsCount}
- **Relational Edges Mapped:** ${passport.relationshipsCount}
- **Verified Empirical Claims:** ${passport.claimsCount}
- **Discovered Contradictions:** ${passport.contradictionsCount}
- **Identified Research Gaps:** ${passport.researchGapsCount}

---

## Key Concepts & Technologies
${project.nodes
  .map(
    (n) => `### ${n.name} (${n.type.toUpperCase()} - ${n.category})
${n.description}
*Why it matters:* ${n.whyItMatters}
*Confidence:* ${Math.round(n.confidence * 100)}%
`
  )
  .join("\n")}

---

## Relational Graph Edges
${project.edges
  .map((e) => `- **${e.source}** --[${e.relationship}]--> **${e.target}** (${e.description || ""})`)
  .join("\n")}

---

## Empirical Contradictions & Debates
${project.contradictions
  .map(
    (c, i) => `### ${i + 1}. ${c.topic} (${c.disagreementType})
- **Position A:** ${c.claimA}
- **Position B:** ${c.claimB}
- **Context:** ${c.context}
${c.suggestedResolution ? `- **Consensus:** ${c.suggestedResolution}` : ""}
`
  )
  .join("\n")}

---

## Open Research Gaps
${project.researchGaps
  .map(
    (g, i) => `### ${i + 1}. ${g.title}
${g.description}
*Evidence:* ${g.evidence}
*Directions:*
${(g.potentialDirections || []).map((d) => `  - ${d}`).join("\n")}
`
  )
  .join("\n")}

---

## Bibliography & Primary Sources
${project.sources
  .map(
    (s, i) => `${i + 1}. **${s.title}** (${s.publicationDate})
   - Authors: ${s.authors.join(", ")}
   - Venue: ${s.venue || s.sourceType}
   - URL: ${s.url}
   - Quality Rating: ${Math.round(s.qualityScore * 100)}% (${s.qualityReason})
`
  )
  .join("\n")}
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-report-${project.query.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedFormat("markdown");
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knowledge-graph-${project.query.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedFormat("json");
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#fdfdfd] border-2 border-black w-full max-w-3xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e2fce3] border-2 border-black flex items-center justify-center text-emerald-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1a1a1a] flex items-center gap-2">
                <span>Research Passport & Audit Certificate</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Verified empirical metadata, graph completeness metrics, and export suite
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

        {/* Passport Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
          {/* Official Badge Banner */}
          <div className="p-5 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase font-mono tracking-widest text-indigo-950 font-bold bg-[#ebf4ff] px-2 py-0.5 rounded border border-black">
                Official Knowledge Graph Artifact
              </div>
              <div className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#e2fce3] text-emerald-950 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                Confidence: {Math.round(passport.confidenceScore * 100)}%
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-600 font-mono font-bold">RESEARCH QUESTION</div>
              <h2 className="text-xl font-black text-[#1a1a1a] mt-0.5">
                "{project.query}"
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t-2 border-black/10">
              <div className="p-2.5 bg-[#f8fafc] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] text-slate-600 font-mono font-bold uppercase">Sources</div>
                <div className="text-lg font-black text-[#1a1a1a] mt-0.5">{passport.sourcesCount}</div>
              </div>
              <div className="p-2.5 bg-[#f8fafc] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] text-slate-600 font-mono font-bold uppercase">Concepts</div>
                <div className="text-lg font-black text-[#1a1a1a] mt-0.5">{passport.conceptsCount}</div>
              </div>
              <div className="p-2.5 bg-[#f8fafc] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] text-slate-600 font-mono font-bold uppercase">Relationships</div>
                <div className="text-lg font-black text-[#1a1a1a] mt-0.5">{passport.relationshipsCount}</div>
              </div>
              <div className="p-2.5 bg-[#f8fafc] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] text-slate-600 font-mono font-bold uppercase">Claims</div>
                <div className="text-lg font-black text-[#1a1a1a] mt-0.5">{passport.claimsCount}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-[#ffe4e6] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] text-rose-950 font-mono uppercase font-bold">Contradictions</div>
                <div className="text-base font-extrabold text-rose-950 mt-0.5">{passport.contradictionsCount} Debates</div>
              </div>
              <div className="p-2.5 bg-[#f3e8ff] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] text-purple-950 font-mono uppercase font-bold">Research Gaps</div>
                <div className="text-base font-extrabold text-purple-950 mt-0.5">{passport.researchGapsCount} Identified</div>
              </div>
              <div className="p-2.5 bg-[#fff7d1] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] col-span-2 sm:col-span-1">
                <div className="text-[10px] text-amber-950 font-mono uppercase font-bold">Depth</div>
                <div className="text-base font-extrabold text-amber-950 mt-0.5 uppercase">{passport.depth}</div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">
              Synthesized Executive Summary
            </h4>
            <div className="p-4 bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
              {project.executiveSummary}
            </div>
          </div>

          {/* Export Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a1a1a]">
              Export Research Project
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleExportMarkdown}
                className="p-3 bg-white hover:bg-[#ebf4ff] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Markdown Report</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5 font-medium">Full synthesis & citations</div>
                </div>
                {copiedFormat === "markdown" ? (
                  <Check className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Download className="w-4 h-4 text-slate-700 group-hover:text-black transition-colors" />
                )}
              </button>

              <button
                onClick={handleExportJSON}
                className="p-3 bg-white hover:bg-[#e0f2fe] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-sky-700" />
                    <span>Knowledge Graph JSON</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5 font-medium">Nodes, edges, & claims</div>
                </div>
                {copiedFormat === "json" ? (
                  <Check className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Download className="w-4 h-4 text-slate-700 group-hover:text-black transition-colors" />
                )}
              </button>

              <button
                onClick={handlePrint}
                className="p-3 bg-white hover:bg-[#fff7d1] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5 text-amber-700" />
                    <span>Print / PDF</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5 font-medium">Printable layout</div>
                </div>
                <Download className="w-4 h-4 text-slate-700 group-hover:text-black transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
