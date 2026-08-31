import React, { useState } from "react";
import { ResearchDepth, SourceType } from "../../types";
import { 
  BrainCircuit, 
  Search, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  Clock, 
  Scale, 
  FileText,
  HelpCircle,
  GitBranch,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

interface ResearchHeroProps {
  onStartResearch: (
    query: string,
    depth: ResearchDepth,
    sources: SourceType[],
    dateRange: string
  ) => void;
  isLoading: boolean;
}

const PRESET_TOPICS = [
  {
    title: "Multimodal RAG",
    tag: "Vision & Documents",
    desc: "ColPali, cross-modal reranking, vector indices & hallucination mitigation",
  },
  {
    title: "DeepSeek R1 & Reasoning LLMs",
    tag: "Inference & RL",
    desc: "Reinforcement learning without SFT, chain-of-thought verification & compute trade-offs",
  },
  {
    title: "Quantum Error Correction",
    tag: "Physics & Hardware",
    desc: "Surface codes, topological qubits, fault tolerance thresholds & decoding latency",
  },
  {
    title: "Graph Foundation Models",
    tag: "Biomedical AI",
    desc: "Geometric deep learning, molecular docking, pocket binding & representation alignment",
  },
];

export function ResearchHero({ onStartResearch, isLoading }: ResearchHeroProps) {
  const [query, setQuery] = useState("Multimodal RAG");
  const [depth, setDepth] = useState<ResearchDepth>("standard");
  const [sources, setSources] = useState<SourceType[]>([
    "paper",
    "academic",
    "doc",
    "web",
  ]);
  const [dateRange, setDateRange] = useState("2024 - 2026 (Recent SOTA)");

  const toggleSource = (s: SourceType) => {
    if (sources.includes(s)) {
      if (sources.length > 1) {
        setSources(sources.filter((item) => item !== s));
      }
    } else {
      setSources([...sources, s]);
    }
  };

  const handleRun = (customQuery?: string) => {
    const targetQuery = customQuery || query;
    if (!targetQuery.trim() || isLoading) return;
    onStartResearch(targetQuery.trim(), depth, sources, dateRange);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 z-10 space-y-16">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit text-sm font-bold shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <BrainCircuit className="w-4 h-4" />
            <span>Living AI Knowledge Graph Laboratory</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.05]">
            Turn complex research into{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500">
              living knowledge.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Instead of another flat AI summary, explore how concepts, claims, primary sources, empirical contradictions, and research gaps connect visually.
          </p>
        </motion.div>

        {/* Interactive Research Control Terminal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-10 max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/10 to-indigo-500/10 -z-10 blur-xl"></div>
          
          {/* Main Question Input */}
          <div className="space-y-4">
            <label className="text-sm font-black tracking-widest text-slate-400 uppercase flex items-center justify-between">
              <span>Primary Research Directive</span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 tracking-widest">
                Active Uplink
              </span>
            </label>

            <div className="relative flex items-center group">
              <Search className="w-6 h-6 text-slate-500 absolute left-6 pointer-events-none group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRun()}
                placeholder="e.g. Multimodal RAG, Quantum Error Correction..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-lg text-white placeholder-slate-600 focus:outline-none focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Research Depth Radios */}
          <div className="space-y-4">
            <label className="text-sm font-black tracking-widest text-slate-400 uppercase">
              Extraction Depth
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "quick", label: "Surface Scan", desc: "Core nodes & fast topology", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
                { id: "standard", label: "Deep Audit", desc: "Relational mapping & claims", bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
                { id: "deep", label: "Quantum Exhaustive", desc: "Full corpus & cognitive gaps", bg: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDepth(d.id as ResearchDepth)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    depth === d.id
                      ? `${d.bg} shadow-[0_0_20px_rgba(var(--tw-shadow-color),0.2)] scale-[1.02] backdrop-blur-md`
                      : "bg-black/20 border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/20"
                  }`}
                  style={depth === d.id && d.id === 'quick' ? { '--tw-shadow-color': '52,211,153' } as any : 
                         depth === d.id && d.id === 'standard' ? { '--tw-shadow-color': '99,102,241' } as any : 
                         depth === d.id && d.id === 'deep' ? { '--tw-shadow-color': '168,85,247' } as any : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-sans uppercase tracking-wider text-white">
                      {d.label}
                    </span>
                    {depth === d.id && (
                      <span className="w-2.5 h-2.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400/80 mt-2 font-medium line-clamp-1">
                    {d.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sources Checkboxes & Date Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
            {/* Sources Selection */}
            <div className="space-y-4">
              <label className="text-sm font-black tracking-widest text-slate-400 uppercase">
                Data Endpoints
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "paper", label: "ArXiv/Papers" },
                  { id: "academic", label: "Peer-Reviewed" },
                  { id: "doc", label: "System Docs" },
                  { id: "web", label: "Web Index" },
                ].map((src) => {
                  const isChecked = sources.includes(src.id as SourceType);
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => toggleSource(src.id as SourceType)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer ${
                        isChecked
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          : "bg-black/20 text-slate-500 border-white/5 hover:text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] border ${
                          isChecked ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-black/50 border-white/20"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span>{src.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="space-y-4">
              <label className="text-sm font-black tracking-widest text-slate-400 uppercase">
                Temporal Range
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-cyan-500 focus:bg-black/60 appearance-none transition-all cursor-pointer"
                >
                  <option value="2024 - 2026 (Recent SOTA)">2024 - 2026 (SOTA Breakthroughs)</option>
                  <option value="2020 - 2026 (Full Modern Era)">2020 - 2026 (Modern Era)</option>
                  <option value="Any date">Any Historical Baseline</option>
                </select>
              </div>
            </div>
          </div>

            {/* Launch Action Button */}
          <button
            onClick={() => handleRun()}
            disabled={!query.trim() || isLoading}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xl shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer disabled:shadow-none"
          >
            <BrainCircuit className="w-6 h-6" />
            <span>Initialize Cognitive Engine</span>
            <ArrowRight className="w-6 h-6 ml-1" />
          </button>
        </motion.div>

        {/* Preset Showcases & Integrations */}
        <div className="space-y-8 max-w-5xl mx-auto pt-8">
          <div className="text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
              Curated Research Exemplars
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRESET_TOPICS.map((preset, idx) => {
              const bgColors = ["border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400", "border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-400", "border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400", "border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-400"];
              const cardBg = bgColors[idx % bgColors.length];
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setQuery(preset.title);
                    handleRun(preset.title);
                  }}
                  className={`p-6 bg-white/5 border ${cardBg} rounded-3xl cursor-pointer transition-all space-y-3 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1 backdrop-blur-sm group`}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {preset.tag}
                    </span>
                    <span className="text-lg font-black text-white leading-tight group-hover:text-cyan-400 transition-colors">
                      {preset.title}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium line-clamp-3">
                    {preset.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Features / API Section */}
        <div className="max-w-5xl mx-auto w-full pt-12 pb-24 grid md:grid-cols-2 gap-8">
          <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-lg backdrop-blur-md space-y-6 group hover:border-cyan-500/30 transition-all">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Cpu className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-3xl font-black text-white">Developer API Access</h3>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              Integrate ARC directly into your workflows. Use our REST and GraphQL APIs to dynamically generate knowledge graphs, extract structured contradictions, and query the semantic canvas programmatically.
            </p>
            <button className="text-cyan-400 font-bold flex items-center gap-2 hover:gap-3 transition-all text-lg tracking-wide uppercase">
              View API Documentation <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="p-10 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-[2.5rem] border border-indigo-500/20 shadow-lg backdrop-blur-md space-y-6 group hover:border-purple-500/40 transition-all">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-3xl font-black text-white">Genuine Information</h3>
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              ARC relies exclusively on verified sources, academic databases, and high-fidelity documentation. Our strict RAG pipeline ensures that every single node and edge in your canvas is backed by real, verifiable evidence.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-bold border border-white/20">100% Sourced</div>
              <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-bold border border-white/20">Anti-Hallucination</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
