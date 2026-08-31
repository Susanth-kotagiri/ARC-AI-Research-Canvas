/**
 * ARC - Global Type Definitions
 */

export type ResearchDepth = 'quick' | 'standard' | 'deep';

export type SourceType = 'paper' | 'web' | 'doc' | 'github' | 'academic';

export interface Source {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  sourceType: SourceType;
  url: string;
  doi?: string;
  venue?: string;
  summary: string;
  snippet: string;
  qualityScore: number; // 0 to 1
  qualityReason: string;
  citationCount?: number;
  peerReviewed?: boolean;
  isOpenAccess?: boolean;
}

export type NodeType =
  | 'concept'
  | 'technology'
  | 'model'
  | 'method'
  | 'dataset'
  | 'paper'
  | 'organization'
  | 'problem'
  | 'gap';

export interface ConceptNode {
  id: string;
  name: string;
  type: NodeType;
  category: string; // e.g. 'Fundamentals', 'Architecture', 'Retrieval', 'Evaluation', 'Frontier'
  description: string;
  whyItMatters: string;
  confidence: number; // 0 to 1
  sourceIds: string[];
  claimIds: string[];
  properties?: Record<string, string>;
  year?: number;
  isExpanded?: boolean;
  isContradictionFocus?: boolean;
  isResearchGap?: boolean;
}

export type RelationshipType =
  | 'USES'
  | 'DEPENDS_ON'
  | 'RELATED_TO'
  | 'PART_OF'
  | 'IMPLEMENTS'
  | 'IMPROVES'
  | 'COMPARES_WITH'
  | 'ALTERNATIVE_TO'
  | 'SUPPORTS'
  | 'CONTRADICTS'
  | 'EXTENDS'
  | 'PRECEDES';

export interface RelationshipEdge {
  id: string;
  source: string;
  target: string;
  relationship: RelationshipType;
  confidence: number; // 0 to 1
  sourceIds: string[];
  claimIds: string[];
  description?: string;
}

export interface Claim {
  id: string;
  text: string;
  supportedBySources: string[];
  confidence: number;
  category?: string;
  contradictionWithClaimId?: string;
}

export interface Contradiction {
  id: string;
  topic: string;
  claimA: string;
  sourceAId: string;
  claimB: string;
  sourceBId: string;
  context: string;
  disagreementType: 'benchmark' | 'methodology' | 'data_regime' | 'tradeoff' | 'scope';
  suggestedResolution?: string;
}

export interface ResearchGap {
  id: string;
  title: string;
  description: string;
  evidence: string;
  sourceCountAnalyzed: number;
  confidence: 'high' | 'medium' | 'low';
  potentialDirections: string[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  type: 'paper' | 'model' | 'architecture' | 'dataset' | 'breakthrough';
  sourceId?: string;
  nodeIds: string[];
}

export interface ResearchPassport {
  topic: string;
  sourcesCount: number;
  documentsCount: number;
  conceptsCount: number;
  claimsCount: number;
  relationshipsCount: number;
  contradictionsCount: number;
  researchGapsCount: number;
  confidenceScore: number;
  lastUpdated: string;
  depth: ResearchDepth;
}

export interface ResearchPlan {
  mainQuestion: string;
  subquestions: string[];
  dimensions: string[];
  strategy: string[];
  suggestedSearchQueries: string[];
}

export interface AgentEvent {
  id: string;
  stage: string;
  agentName: string;
  message: string;
  detail?: string;
  timestamp: number;
  type: 'info' | 'agent' | 'success' | 'warn';
  statUpdate?: {
    sourcesFound?: number;
    documentsProcessed?: number;
    conceptsExtracted?: number;
    claimsDetected?: number;
    relationships?: number;
    contradictions?: number;
    researchGaps?: number;
  };
}

export interface ResearchProject {
  id: string;
  query: string;
  depth: ResearchDepth;
  sourcesSelected: SourceType[];
  dateRange: string;
  status: 'idle' | 'running' | 'complete' | 'error';
  createdAt: string;
  passport: ResearchPassport;
  plan?: ResearchPlan;
  sources: Source[];
  nodes: ConceptNode[];
  edges: RelationshipEdge[];
  claims: Claim[];
  contradictions: Contradiction[];
  researchGaps: ResearchGap[];
  timeline: TimelineEvent[];
  executiveSummary: string;
}

export type CanvasMode =
  | 'default'
  | 'focus'
  | 'evidence'
  | 'contradictions'
  | 'gaps'
  | 'timeline';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  citedSourceIds?: string[];
}

export interface NodeExplanation {
  level: 'beginner' | 'student' | 'engineer' | 'researcher';
  explanation: string;
  keyTakeaways: string[];
  practicalApplication: string;
  citedSourceIds: string[];
}

export interface NodeComparison {
  nodeA: {
    id: string;
    name: string;
    description: string;
  };
  nodeB: {
    id: string;
    name: string;
    description: string;
  };
  similarities: string[];
  differences: string[];
  advantagesA: string[];
  advantagesB: string[];
  tradeoffs: string;
  optimalUseCasesA: string;
  optimalUseCasesB: string;
  supportingSourceIds: string[];
}
