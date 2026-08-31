import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { ConceptNode, RelationshipEdge, CanvasMode, ResearchProject } from "../../types";
import { CustomConceptNode } from "../graph/CustomConceptNode";
import { CustomRelationshipEdge } from "../graph/CustomRelationshipEdge";
import { transformProjectToFlow, getLayoutedElements } from "../../lib/graphLayout";
import { 
  Search, 
  RotateCcw, 
  Layers, 
  Eye, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Filter, 
  ArrowDownUp, 
  ArrowLeftRight,
  Maximize2,
  HelpCircle
} from "lucide-react";

interface InteractiveCanvasProps {
  project: ResearchProject;
  selectedNode: ConceptNode | null;
  onSelectNode: (node: ConceptNode | null) => void;
  canvasMode: CanvasMode;
  onChangeCanvasMode: (mode: CanvasMode) => void;
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  onOpenAskCanvas: () => void;
  onOpenTimeline: () => void;
  onOpenContradictions: () => void;
  onOpenGaps: () => void;
  onOpenPassport: () => void;
  onOpenSources: () => void;
}

const nodeTypes = {
  conceptNode: CustomConceptNode,
};

const edgeTypes = {
  relationshipEdge: CustomRelationshipEdge,
};

function CanvasInner({
  project,
  selectedNode,
  onSelectNode,
  canvasMode,
  onChangeCanvasMode,
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  onOpenAskCanvas,
  onOpenTimeline,
  onOpenContradictions,
  onOpenGaps,
  onOpenPassport,
  onOpenSources,
}: InteractiveCanvasProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const [direction, setDirection] = useState<"TB" | "LR">("TB");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showMinimap, setShowMinimap] = useState(true);

  // Compute connected node/edge IDs for Focus Mode
  const focusConnectedIds = useMemo(() => {
    if (!selectedNode || canvasMode !== "focus") return null;
    const nodeIds = new Set<string>([selectedNode.id]);
    const edgeIds = new Set<string>();

    project.edges.forEach((e) => {
      if (e.source === selectedNode.id || e.target === selectedNode.id) {
        nodeIds.add(e.source);
        nodeIds.add(e.target);
        edgeIds.add(e.id);
      }
    });

    return { nodeIds, edgeIds };
  }, [selectedNode, canvasMode, project.edges]);

  // Contradiction node IDs
  const contradictionNodeIds = useMemo(() => {
    const ids = new Set<string>();
    project.nodes.forEach((n) => {
      if (n.type === "problem" || n.isContradictionFocus) ids.add(n.id);
    });
    project.contradictions.forEach((c) => {
      // Find nodes that correspond to contradiction topics or claims
      project.nodes.forEach((n) => {
        if (n.name.toLowerCase().includes(c.topic.toLowerCase().slice(0, 5))) {
          ids.add(n.id);
        }
      });
    });
    return ids;
  }, [project.nodes, project.contradictions]);

  // Gap node IDs
  const gapNodeIds = useMemo(() => {
    const ids = new Set<string>();
    project.nodes.forEach((n) => {
      if (n.type === "gap" || n.isResearchGap) ids.add(n.id);
    });
    return ids;
  }, [project.nodes]);

  // Prepare nodes and edges with dynamic highlighting & styling
  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes: lNodes, edges: lEdges } = transformProjectToFlow(
      project.nodes,
      project.edges,
      direction
    );

    const formattedNodes: Node[] = lNodes.map((n) => {
      const nodeData = n.data as unknown as ConceptNode;
      const matchesSearch =
        !searchQuery ||
        nodeData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nodeData.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || nodeData.category === selectedCategory;

      let isDimmed = false;
      let isHighlighted = false;
      let isContradictionHighlighted = false;
      let isGapHighlighted = false;

      // Search & category filtering
      if (!matchesSearch || !matchesCategory) {
        isDimmed = true;
      }

      // Assistant Highlights
      if (highlightedNodeIds.length > 0) {
        isHighlighted = highlightedNodeIds.includes(n.id);
        if (!isHighlighted) isDimmed = true;
      }

      // Focus Mode
      if (canvasMode === "focus" && focusConnectedIds) {
        if (!focusConnectedIds.nodeIds.has(n.id)) {
          isDimmed = true;
        }
      }

      // Contradictions Mode
      if (canvasMode === "contradictions") {
        isContradictionHighlighted = contradictionNodeIds.has(n.id);
        if (!isContradictionHighlighted) isDimmed = true;
      }

      // Gaps Mode
      if (canvasMode === "gaps") {
        isGapHighlighted = gapNodeIds.has(n.id);
        if (!isGapHighlighted) isDimmed = true;
      }

      return {
        ...n,
        selected: selectedNode?.id === n.id,
        data: {
          ...nodeData,
          isDimmed,
          isHighlighted,
          isContradictionHighlighted,
          isGapHighlighted,
        },
      };
    });

    const formattedEdges: Edge[] = lEdges.map((e) => {
      const edgeData = e.data as unknown as RelationshipEdge;
      let isDimmed = false;
      let isHighlighted = false;

      if (highlightedEdgeIds.length > 0) {
        isHighlighted = highlightedEdgeIds.includes(e.id);
        if (!isHighlighted) isDimmed = true;
      }

      if (canvasMode === "focus" && focusConnectedIds) {
        if (!focusConnectedIds.edgeIds.has(e.id)) {
          isDimmed = true;
        }
      }

      if (canvasMode === "contradictions") {
        if (edgeData.relationship !== "CONTRADICTS") {
          isDimmed = true;
        }
      }

      return {
        ...e,
        data: {
          ...edgeData,
          isDimmed,
          isHighlighted,
          showEvidence: canvasMode === "evidence",
        },
      };
    });

    return { initialNodes: formattedNodes, initialEdges: formattedEdges };
  }, [
    project,
    direction,
    selectedNode,
    canvasMode,
    searchQuery,
    selectedCategory,
    highlightedNodeIds,
    highlightedEdgeIds,
    focusConnectedIds,
    contradictionNodeIds,
    gapNodeIds,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Node selection callback
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const target = project.nodes.find((n) => n.id === node.id);
      if (target) {
        onSelectNode(target);
      }
    },
    [project.nodes, onSelectNode]
  );

  const onPaneClick = useCallback(() => {
    if (canvasMode === "focus") {
      onChangeCanvasMode("default");
    }
  }, [canvasMode, onChangeCanvasMode]);

  const toggleDirection = useCallback(() => {
    const nextDir = direction === "TB" ? "LR" : "TB";
    setDirection(nextDir);
    const layouted = getLayoutedElements(nodes, edges, nextDir);
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  }, [direction, nodes, edges, setNodes, setEdges, fitView]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    project.nodes.forEach((n) => set.add(n.category));
    return ["All", ...Array.from(set)];
  }, [project.nodes]);

  return (
    <div className="relative w-full h-full bg-[#fdfdfd] overflow-hidden flex flex-col">
      {/* Top Floating Control Bar (Bento Hub) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] pointer-events-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, models..."
              className="bg-[#f8fafc] border-2 border-black rounded-lg pl-8 pr-3 py-1 text-xs text-[#1a1a1a] placeholder-slate-400 focus:outline-none focus:bg-white w-48 md:w-56 transition-all font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-xs text-slate-500 hover:text-black font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown/Chips */}
          <div className="hidden sm:flex items-center gap-1 border-l-2 border-black/15 pl-2">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#fff7d1] text-[#1a1a1a] border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "text-slate-600 hover:text-black hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Mode Switcher Bar (Bento Buttons) */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] pointer-events-auto overflow-x-auto">
          <button
            onClick={() => onChangeCanvasMode("default")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              canvasMode === "default"
                ? "bg-[#ebf4ff] text-[#1a1a1a] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "text-slate-600 hover:text-black hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-700" />
            <span>Graph</span>
          </button>

          <button
            onClick={() => onChangeCanvasMode("evidence")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              canvasMode === "evidence"
                ? "bg-[#e0f2fe] text-[#1a1a1a] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "text-slate-600 hover:text-black hover:bg-slate-100"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-sky-700" />
            <span>Evidence</span>
          </button>

          <button
            onClick={() => {
              onChangeCanvasMode("contradictions");
              onOpenContradictions();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              canvasMode === "contradictions"
                ? "bg-[#ffe4e6] text-[#1a1a1a] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "text-slate-600 hover:text-black hover:bg-slate-100"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            <span>Contradictions</span>
            {project.contradictions.length > 0 && (
              <span className="bg-[#ffe4e6] text-rose-950 border border-black text-[10px] px-1.5 rounded font-mono font-bold">
                {project.contradictions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              onChangeCanvasMode("gaps");
              onOpenGaps();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              canvasMode === "gaps"
                ? "bg-[#f3e8ff] text-[#1a1a1a] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "text-slate-600 hover:text-black hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Research Gaps</span>
            {project.researchGaps.length > 0 && (
              <span className="bg-[#f3e8ff] text-purple-950 border border-black text-[10px] px-1.5 rounded font-mono font-bold">
                {project.researchGaps.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenTimeline}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-black hover:bg-[#fff7d1] border border-transparent hover:border-black transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="w-full h-full flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          className="bg-[#f8fafc]"
        >
          <Background
            color="#94a3b8"
            gap={20}
            size={1.5}
            variant={BackgroundVariant.Dots}
            className="opacity-50"
          />
          <Controls showInteractive={false} position="bottom-left" />
          {showMinimap && (
            <MiniMap
              position="bottom-right"
              nodeStrokeWidth={2}
              nodeStrokeColor="#000000"
              zoomable
              pannable
              nodeColor={(node) => {
                const data = node.data as unknown as ConceptNode;
                switch (data?.category) {
                  case "Architecture":
                    return "#ebf4ff";
                  case "Retrieval":
                    return "#e0f2fe";
                  case "Generation":
                    return "#e2fce3";
                  case "Limitations":
                    return "#ffe4e6";
                  case "Frontier":
                    return "#f3e8ff";
                  default:
                    return "#fff7d1";
                }
              }}
              maskColor="rgba(241, 245, 249, 0.7)"
            />
          )}
        </ReactFlow>
      </div>

      {/* Bottom Floating Canvas Action Hub (Bento Bar) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={toggleDirection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#f8fafc] hover:bg-[#fff7d1] text-[#1a1a1a] transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          title="Toggle Hierarchical (Top-to-Bottom / Left-to-Right)"
        >
          {direction === "TB" ? (
            <ArrowDownUp className="w-3.5 h-3.5 text-indigo-700" />
          ) : (
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-700" />
          )}
          <span>{direction === "TB" ? "Vertical" : "Horizontal"}</span>
        </button>

        <button
          onClick={() => fitView({ padding: 0.25, duration: 400 })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#f8fafc] hover:bg-slate-100 text-[#1a1a1a] transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          title="Recenter & Fit Graph in Canvas"
        >
          <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
          <span>Fit View</span>
        </button>

        <div className="w-[2px] h-5 bg-black/15 mx-1" />

        <button
          onClick={onOpenAskCanvas}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black bg-[#ebf4ff] hover:bg-[#dbeafe] text-[#1a1a1a] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-700" />
          <span>Ask the Canvas</span>
        </button>
      </div>
    </div>
  );
}

export function InteractiveCanvas(props: InteractiveCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
