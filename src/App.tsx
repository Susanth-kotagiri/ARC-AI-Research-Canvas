/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ResearchProject, 
  ConceptNode, 
  CanvasMode, 
  ChatMessage, 
  ResearchDepth, 
  SourceType 
} from "./types";
import { Navbar } from "./components/layout/Navbar";
import { ResearchHero } from "./components/research/ResearchHero";
import { LiveProgressPanel } from "./components/research/LiveProgressPanel";
import { InteractiveCanvas } from "./components/canvas/InteractiveCanvas";
import { NodeDetailDrawer } from "./components/panels/NodeDetailDrawer";
import { AskTheCanvasDrawer } from "./components/chat/AskTheCanvasDrawer";
import { CompareModal } from "./components/modals/CompareModal";
import { ContradictionsModal } from "./components/modals/ContradictionsModal";
import { ResearchGapsModal } from "./components/modals/ResearchGapsModal";
import { TimelineModal } from "./components/modals/TimelineModal";
import { ResearchPassportModal } from "./components/modals/ResearchPassportModal";
import { LiveVoiceChat } from "./components/chat/LiveVoiceChat";
import { SourcesModal } from "./components/modals/SourcesModal";
import { SavedProjectsModal } from "./components/modals/SavedProjectsModal";
import { LoginPage } from "./components/auth/LoginPage";
import { auth } from "./firebase";
import { saveProjectToDb } from "./lib/db";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState("");
  const [loadingDepth, setLoadingDepth] = useState<ResearchDepth>("standard");
  const [isSavingProject, setIsSavingProject] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthInitialized(true);
    });
    return unsubscribe;
  }, []);

  // Canvas & Interaction States
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [canvasMode, setCanvasMode] = useState<CanvasMode>("default");
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [highlightedEdgeIds, setHighlightedEdgeIds] = useState<string[]>([]);

  // Modals & Drawers
  const [isAskCanvasOpen, setIsAskCanvasOpen] = useState(false);
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isContradictionsOpen, setIsContradictionsOpen] = useState(false);
  const [isGapsOpen, setIsGapsOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isSavedProjectsOpen, setIsSavedProjectsOpen] = useState(false);

  // Compare modal
  const [compareNodeA, setCompareNodeA] = useState<ConceptNode | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Chat History
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatGenerating, setIsChatGenerating] = useState(false);

  const handleSaveProject = async () => {
    if (!project || !user) return;
    setIsSavingProject(true);
    try {
      const savedProject = await saveProjectToDb(user.uid, project);
      setProject(savedProject);
    } catch (err) {
      console.error("Failed to save project", err);
      alert("Failed to save workspace.");
    } finally {
      setIsSavingProject(false);
    }
  };

  // Research Pipeline execution handler
  const handleStartResearch = async (
    query: string,
    depth: ResearchDepth,
    sources: SourceType[],
    dateRange: string
  ) => {
    setIsLoading(true);
    setLoadingQuery(query);
    setLoadingDepth(depth);
    setSelectedNode(null);
    setHighlightedNodeIds([]);
    setHighlightedEdgeIds([]);
    setChatMessages([]);

    try {
      const res = await fetch("/api/research/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          depth,
          sourcesSelected: sources,
          dateRange,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const projectData: ResearchProject = await res.json();
      
      // Allow progress animation to complete cleanly
      setTimeout(() => {
        setProject(projectData);
        setIsLoading(false);
      }, 1400);
    } catch (err) {
      console.error("Error executing research run:", err);
      setIsLoading(false);
    }
  };

  // Node Expansion (Dynamic recursive addition to knowledge graph)
  const handleExpandNode = async (node: ConceptNode) => {
    if (!project) return;
    try {
      const res = await fetch("/api/nodes/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node,
          existingNodeNames: project.nodes.map((n) => n.name),
          projectQuery: project.query,
        }),
      });

      const data = await res.json();
      if (data.newNodes && data.newNodes.length > 0) {
        setProject((prev) => {
          if (!prev) return prev;
          const updatedNodes = [...prev.nodes, ...data.newNodes];
          const updatedEdges = [...prev.edges, ...(data.newEdges || [])];
          return {
            ...prev,
            nodes: updatedNodes,
            edges: updatedEdges,
            passport: {
              ...prev.passport,
              conceptsCount: updatedNodes.length,
              relationshipsCount: updatedEdges.length,
            },
          };
        });

        // Highlight newly expanded nodes
        setHighlightedNodeIds(data.newNodes.map((n: any) => n.id));
        setTimeout(() => setHighlightedNodeIds([]), 3500);
      }
    } catch (err) {
      console.error("Error expanding node:", err);
    }
  };

  // Ask the Canvas RAG Question Handler
  const handleSendChatMessage = async (question: string) => {
    if (!project) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: question,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatGenerating(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          project,
          chatHistory: chatMessages,
        }),
      });

      const assistantMsg: ChatMessage = await res.json();
      setChatMessages((prev) => [...prev, assistantMsg]);

      // Automatically illuminate corresponding canvas path
      if (assistantMsg.highlightedNodeIds && assistantMsg.highlightedNodeIds.length > 0) {
        setHighlightedNodeIds(assistantMsg.highlightedNodeIds);
        setHighlightedEdgeIds(assistantMsg.highlightedEdgeIds || []);
      }
    } catch (err) {
      console.error("Error asking canvas:", err);
    } finally {
      setIsChatGenerating(false);
    }
  };

  const handleHighlightPath = (nodeIds: string[], edgeIds: string[]) => {
    setHighlightedNodeIds(nodeIds);
    setHighlightedEdgeIds(edgeIds);
  };

  const handleOpenCompare = (nodeA: ConceptNode) => {
    setCompareNodeA(nodeA);
    setIsCompareOpen(true);
  };

  const handleToggleFocus = (node: ConceptNode) => {
    if (canvasMode === "focus" && selectedNode?.id === node.id) {
      setCanvasMode("default");
    } else {
      setSelectedNode(node);
      setCanvasMode("focus");
    }
  };

  if (!authInitialized) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className={`w-full bg-[#fdfdfd] text-[#1a1a1a] flex flex-col font-sans ${project || isLoading ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Top Navbar */}
      <Navbar
        project={project}
        user={user}
        onNewResearch={() => setProject(null)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenSources={() => setIsSourcesOpen(true)}
        onOpenContradictions={() => {
          setCanvasMode("contradictions");
          setIsContradictionsOpen(true);
        }}
        onOpenGaps={() => {
          setCanvasMode("gaps");
          setIsGapsOpen(true);
        }}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenAskCanvas={() => setIsAskCanvasOpen(true)}
        onToggleVoiceChat={() => setIsVoiceChatOpen(!isVoiceChatOpen)}
        onSaveProject={handleSaveProject}
        onOpenSavedProjects={() => setIsSavedProjectsOpen(true)}
        isSaving={isSavingProject}
      />

      {/* Main View Area */}
      <main className={`flex-1 relative ${project || isLoading ? 'overflow-hidden' : ''}`}>
        {isVoiceChatOpen && (
          <LiveVoiceChat onClose={() => setIsVoiceChatOpen(false)} />
        )}
        
        {isLoading && (
          <LiveProgressPanel
            query={loadingQuery}
            depth={loadingDepth}
            isComplete={false}
          />
        )}

        {!project ? (
          <ResearchHero
            onStartResearch={handleStartResearch}
            isLoading={isLoading}
          />
        ) : (
          <div className="w-full h-full relative">
            <InteractiveCanvas
              project={project}
              selectedNode={selectedNode}
              onSelectNode={(n) => setSelectedNode(n)}
              canvasMode={canvasMode}
              onChangeCanvasMode={(mode) => setCanvasMode(mode)}
              highlightedNodeIds={highlightedNodeIds}
              highlightedEdgeIds={highlightedEdgeIds}
              onOpenAskCanvas={() => setIsAskCanvasOpen(true)}
              onOpenTimeline={() => setIsTimelineOpen(true)}
              onOpenContradictions={() => setIsContradictionsOpen(true)}
              onOpenGaps={() => setIsGapsOpen(true)}
              onOpenPassport={() => setIsPassportOpen(true)}
              onOpenSources={() => setIsSourcesOpen(true)}
            />

            {/* Node Detail Drawer */}
            <NodeDetailDrawer
              node={selectedNode}
              allNodes={project.nodes}
              edges={project.edges}
              sources={project.sources}
              projectQuery={project.query}
              onClose={() => setSelectedNode(null)}
              onSelectNode={(n) => setSelectedNode(n)}
              onExpandNode={handleExpandNode}
              onOpenCompare={handleOpenCompare}
              onToggleFocus={handleToggleFocus}
              isFocused={canvasMode === "focus" && selectedNode !== null}
            />

            {/* Ask the Canvas Drawer */}
            <AskTheCanvasDrawer
              project={project}
              isOpen={isAskCanvasOpen}
              onClose={() => setIsAskCanvasOpen(false)}
              onHighlightPath={handleHighlightPath}
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              isGenerating={isChatGenerating}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {project && (
        <>
          <CompareModal
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            nodeA={compareNodeA || project.nodes[0] || null}
            allNodes={project.nodes}
            projectQuery={project.query}
          />

          <ContradictionsModal
            isOpen={isContradictionsOpen}
            onClose={() => setIsContradictionsOpen(false)}
            contradictions={project.contradictions}
            sources={project.sources}
          />

          <ResearchGapsModal
            isOpen={isGapsOpen}
            onClose={() => setIsGapsOpen(false)}
            researchGaps={project.researchGaps}
          />

          <TimelineModal
            isOpen={isTimelineOpen}
            onClose={() => setIsTimelineOpen(false)}
            timeline={project.timeline}
            allNodes={project.nodes}
            onSelectNode={(n) => setSelectedNode(n)}
          />

          <ResearchPassportModal
            isOpen={isPassportOpen}
            onClose={() => setIsPassportOpen(false)}
            project={project}
          />

          <SourcesModal
            isOpen={isSourcesOpen}
            onClose={() => setIsSourcesOpen(false)}
            sources={project.sources}
          />
        </>
      )}

      {user && (
        <SavedProjectsModal
          userId={user.uid}
          isOpen={isSavedProjectsOpen}
          onClose={() => setIsSavedProjectsOpen(false)}
          onLoadProject={(proj) => {
            setProject(proj);
            setCanvasMode("default");
            setSelectedNode(null);
            setHighlightedNodeIds([]);
            setHighlightedEdgeIds([]);
            setChatMessages([]);
          }}
        />
      )}
    </div>
  );
}
