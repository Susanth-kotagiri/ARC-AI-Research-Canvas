import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";
import { ConceptNode, RelationshipEdge } from "../types";

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 260;
  const nodeHeight = 130;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 60,
    ranksep: 90,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export function transformProjectToFlow(
  projectNodes: ConceptNode[],
  projectEdges: RelationshipEdge[],
  direction: "TB" | "LR" = "TB"
): { nodes: Node[]; edges: Edge[] } {
  const rawNodes: Node[] = projectNodes.map((n) => ({
    id: n.id,
    type: "conceptNode",
    data: { ...n },
    position: { x: 0, y: 0 },
  }));

  const rawEdges: Edge[] = projectEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: "relationshipEdge",
    data: { ...e },
    animated: e.relationship === "USES" || e.relationship === "DEPENDS_ON" || e.relationship === "IMPROVES",
  }));

  return getLayoutedElements(rawNodes, rawEdges, direction);
}
