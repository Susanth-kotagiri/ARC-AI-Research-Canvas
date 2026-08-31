import React, { useState, useRef, useEffect } from "react";
import { ResearchProject, ChatMessage } from "../../types";
import { 
  X, 
  Send, 
  Sparkles, 
  Layers, 
  FileText, 
  ExternalLink, 
  Loader2, 
  Bot, 
  User, 
  ChevronRight,
  Maximize2,
  Check
} from "lucide-react";

interface AskTheCanvasDrawerProps {
  project: ResearchProject;
  isOpen: boolean;
  onClose: () => void;
  onHighlightPath: (nodeIds: string[], edgeIds: string[]) => void;
  messages: ChatMessage[];
  onSendMessage: (question: string) => Promise<void>;
  isGenerating: boolean;
}

const SAMPLE_PROMPTS = [
  "Why is Vector Database connected to RAG?",
  "What empirical contradictions exist in retrieval architectures?",
  "What are the most pressing research gaps in this field?",
  "How does ColPali differ from standard dual-encoder embeddings?",
];

export function AskTheCanvasDrawer({
  project,
  isOpen,
  onClose,
  onHighlightPath,
  messages,
  onSendMessage,
  isGenerating,
}: AskTheCanvasDrawerProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const q = input.trim();
    setInput("");
    onSendMessage(q);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-[#fdfdfd] border-l-2 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] z-40 flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="p-4 border-b-2 border-black flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ebf4ff] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-4 h-4 text-indigo-950" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1a1a1a] flex items-center gap-2">
              <span>Ask the Canvas</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ebf4ff] text-indigo-950 border border-black">
                Grounded RAG
              </span>
            </h3>
            <p className="text-[11px] text-slate-600 font-medium truncate max-w-[280px]">
              Querying {project.nodes.length} nodes & {project.sources.length} sources
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

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
        {messages.length === 0 ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ebf4ff] border-2 border-black flex items-center justify-center mx-auto text-indigo-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#1a1a1a]">
                Interactive Knowledge Assistant
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1 leading-relaxed font-medium">
                Ask questions about graph topology, supporting evidence, empirical contradictions, or research boundaries.
              </p>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="space-y-2 pt-2 text-left">
              <div className="text-[10px] uppercase font-mono text-slate-600 font-bold px-1">
                Suggested Inquiries
              </div>
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#ebf4ff] border-2 border-black text-xs text-slate-800 hover:text-black font-semibold transition-all flex items-center justify-between group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  <span>{prompt}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-black transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed animate-in fade-in ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-[#ebf4ff] border-2 border-black flex items-center justify-center text-indigo-950 shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 border-2 border-black ${
                  msg.role === "user"
                    ? "bg-[#1a1a1a] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <div className="whitespace-pre-line font-medium">{msg.content}</div>

                {/* Highlight on Canvas Action */}
                {msg.role === "assistant" && (
                  <div className="pt-2 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-2">
                    {msg.highlightedNodeIds && msg.highlightedNodeIds.length > 0 && (
                      <button
                        onClick={() =>
                          onHighlightPath(
                            msg.highlightedNodeIds || [],
                            msg.highlightedEdgeIds || []
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#ebf4ff] hover:bg-[#dbeafe] border border-black text-[11px] font-bold text-indigo-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-700" />
                        <span>Highlight {msg.highlightedNodeIds.length} Nodes on Canvas</span>
                      </button>
                    )}

                    {msg.citedSourceIds && msg.citedSourceIds.length > 0 && (
                      <span className="text-[10px] text-slate-600 font-mono font-bold">
                        {msg.citedSourceIds.length} sources cited
                      </span>
                    )}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-[#fff7d1] border-2 border-black flex items-center justify-center text-amber-950 shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex gap-3 text-xs leading-relaxed animate-in fade-in">
            <div className="w-7 h-7 rounded-lg bg-[#ebf4ff] border-2 border-black flex items-center justify-center text-indigo-950 shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border-2 border-black rounded-2xl p-3.5 text-slate-800 flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-semibold">
              <Loader2 className="w-4 h-4 text-black animate-spin" />
              <span>Analyzing graph topology & citing evidence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t-2 border-black flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about the research canvas..."
          disabled={isGenerating}
          className="flex-1 bg-[#f8fafc] border-2 border-black rounded-xl px-3.5 py-2 text-xs text-[#1a1a1a] placeholder-slate-500 font-medium focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="p-2 bg-[#ebf4ff] hover:bg-[#dbeafe] disabled:opacity-50 text-indigo-950 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
