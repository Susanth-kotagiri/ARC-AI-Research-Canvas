# 🧠 ARC — AI Research Canvas

> **Research. Connect. Visualize. Understand.**

ARC (AI Research Canvas) is an AI-powered visual research workspace that transforms complex research into an interactive knowledge graph.

Instead of giving users a long block of AI-generated text, ARC researches a topic across multiple sources, extracts important concepts, identifies relationships, evaluates evidence, and organizes the results visually on an interactive canvas.

The goal is simple:

**Turn scattered information into connected knowledge.**

---

## ✨ Why ARC?

Traditional AI research tools usually provide a list of links or a long text response.

ARC takes a different approach.

```text
Question
   ↓
Research
   ↓
Sources
   ↓
Extract Knowledge
   ↓
Find Relationships
   ↓
Verify Evidence
   ↓
Build Knowledge Graph
   ↓
Interactive Research Canvas
```

Instead of simply asking:

> "What is Multimodal RAG?"

ARC helps you **see how Multimodal RAG works, what concepts it depends on, which technologies are involved, and where the information came from.**

---

# 🚀 Core Features

### 🔎 AI-Powered Research

Enter a research topic and ARC gathers relevant information from multiple sources.

### 🧩 Knowledge Extraction

ARC identifies:

* Concepts
* Technologies
* Methods
* Definitions
* Problems
* Applications
* Research areas

### 🔗 Relationship Mapping

ARC identifies relationships between concepts and converts them into a visual knowledge graph.

Example:

```text
                  RAG
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   Embeddings   Retrieval   Generation
        │          │          │
        ↓          ↓          ↓
    Vector DB    BM25        LLM
```

### 🧠 AI Research Agents

ARC can divide the research workflow into specialized AI roles:

```text
Researcher
    ↓
Extractor
    ↓
Organizer
    ↓
Critic
    ↓
Visualizer
```

Each agent has a specific responsibility rather than simply generating another chatbot response.

### 🎨 Interactive Canvas

Research is displayed on an interactive canvas where users can:

* Move nodes
* Explore relationships
* Select concepts
* Expand topics
* Inspect sources
* Ask questions
* Navigate the knowledge graph

### 📚 Source Traceability

Every important concept can be connected to its supporting sources.

This helps users understand:

> **Where did this information come from?**

### 💬 Ask the Canvas

Users can ask questions about the current research canvas.

For example:

> "Why is vector search important here?"

ARC uses the current research context and selected concepts to generate an explanation.

### ➕ Expand Concepts

Select a node and expand it.

```text
Embeddings
    ↓
├── Dense Embeddings
├── Sparse Embeddings
├── Multimodal Embeddings
├── Text Embeddings
└── Cross-Modal Embeddings
```

### ⚠️ Research Critic

ARC can identify:

* Unsupported claims
* Conflicting information
* Weak evidence
* Missing concepts
* Potential research gaps

---

# 🏗️ System Architecture

```text
                         USER
                          │
                          ↓
                  RESEARCH INTERFACE
                          │
                          ↓
                    FASTAPI BACKEND
                          │
                    ┌─────┴─────┐
                    ↓           ↓
                AI ENGINE    SEARCH
                    │           │
          ┌─────────┼─────────┐ │
          ↓         ↓         ↓ │
     Researcher Extractor Critic│
          │         │         │ │
          └─────────┼─────────┘ │
                    ↓           │
                Organizer       │
                    │           │
                    ↓           │
                Visualizer      │
                    │           │
                    └─────┬─────┘
                          ↓
                   STRUCTURED DATA
                          │
                          ↓
                  KNOWLEDGE GRAPH
                          │
                          ↓
                   INTERACTIVE CANVAS
                          │
                          ↓
                     USER EXPLORES
```

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* tldraw

## Backend

* Python
* FastAPI
* Pydantic

## AI

* LLM API
* Structured Outputs
* AI Agents
* Vision / multimodal models where required

## Research

* Web Search APIs
* Source extraction
* Source metadata
* Citation tracking

## Data

* JSON
* Knowledge graph structure
* SQLite/PostgreSQL for persistent research projects

## Deployment

* Vercel / equivalent frontend hosting
* Render / Railway / equivalent backend hosting

---

# 📁 Project Structure

```text
ARC-ai-research-canvas/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas/
│   │   │   ├── ResearchPanel/
│   │   │   ├── SourcePanel/
│   │   │   ├── NodeInspector/
│   │   │   ├── ResearchProgress/
│   │   │   └── Header/
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── types/
│   │   │   └── research.ts
│   │   │
│   │   └── App.tsx
│   │
│   └── package.json
│
├── backend/
│   ├── agents/
│   │   ├── researcher.py
│   │   ├── extractor.py
│   │   ├── organizer.py
│   │   ├── critic.py
│   │   └── visualizer.py
│   │
│   ├── services/
│   │   ├── search.py
│   │   ├── llm.py
│   │   └── source_manager.py
│   │
│   ├── models/
│   │   └── research.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── README.md
├── .env.example
└── .gitignore
```

---

# 🔄 Research Workflow

When a user enters:

```text
Multimodal RAG
```

ARC processes the request through a research pipeline.

### 1. Research

The Researcher Agent gathers relevant sources.

### 2. Extract

The Extractor identifies important concepts and claims.

### 3. Organize

The Organizer groups related concepts and identifies relationships.

### 4. Critique

The Critic checks evidence, contradictions, and unsupported claims.

### 5. Visualize

The Visualizer converts the structured research into nodes and relationships.

### 6. Explore

The user interacts with the resulting knowledge graph.

---

# 📊 Example Data Model

### Node

```json
{
  "id": "vector-db",
  "title": "Vector Database",
  "type": "technology",
  "description": "Stores and retrieves vector representations.",
  "importance": 0.87,
  "sources": ["source-1", "source-3"]
}
```

### Relationship

```json
{
  "source": "embedding",
  "target": "vector-db",
  "relationship": "stored_in"
}
```

This structured approach allows the AI output to be directly converted into visual canvas elements.

---

# 🎯 MVP

The initial MVP focuses on the core research-to-visualization pipeline.

### MVP Features

* [x] Research topic input
* [x] AI research pipeline
* [x] Source collection
* [x] Concept extraction
* [x] Relationship extraction
* [x] Knowledge graph generation
* [x] Interactive canvas
* [x] Source references
* [x] Node inspection
* [x] AI explanations
* [ ] Persistent research projects
* [ ] Advanced multi-agent orchestration
* [ ] Research gap detection
* [ ] Collaboration
* [ ] Export

---

# 🧪 Example Use Case

### Input

```text
Research Multimodal RAG
```

### ARC generates

```text
                    MULTIMODAL RAG
                           │
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
          TEXT           IMAGE          AUDIO
            │              │              │
        Embeddings      Vision Model   Audio Model
            │              │              │
            └──────────────┼──────────────┘
                           ↓
                       RETRIEVAL
                           ↓
                      VECTOR DB
                           ↓
                          LLM
```

The user can then select **Vector DB**, inspect its explanation, view supporting sources, or expand the concept.

---

# 🔮 Future Roadmap

## Phase 1 — Foundation

* Interactive canvas
* AI research
* Knowledge extraction
* Source tracking

## Phase 2 — Intelligence

* Multi-agent research
* Research critic
* Evidence analysis
* Research gap detection
* Semantic search

## Phase 3 — Advanced Research

* PDF and academic paper ingestion
* Literature review generation
* Citation management
* Vector database
* Persistent projects

## Phase 4 — Collaboration

* Shared research canvases
* Real-time collaboration
* Comments
* Version history
* Team workspaces

## Phase 5 — AI Research Assistant

ARC evolves from a research visualization tool into an AI research environment capable of:

```text
Research
   ↓
Understand
   ↓
Visualize
   ↓
Challenge
   ↓
Discover
   ↓
Generate Ideas
   ↓
Build Projects
```

---

# 💡 Long-Term Vision

The long-term goal of ARC is not to replace traditional research tools.

It is to change **how people think about research**.

Instead of:

```text
Search → Read → Take Notes → Forget
```

ARC aims to create:

```text
Research
    ↓
Connect
    ↓
Visualize
    ↓
Question
    ↓
Understand
    ↓
Discover
```

The canvas becomes a living representation of knowledge rather than a static collection of notes.

---

# 🎓 Who Is ARC For?

ARC can be useful for:

* Students
* Developers
* AI/ML engineers
* Researchers
* Technical writers
* Product builders
* Startup founders
* Anyone exploring complex subjects

---

# 📌 Project Goals

ARC is designed around five principles:

**1. Visual**
Complex information should be easy to see.

**2. Connected**
Ideas should show how they relate.

**3. Source-grounded**
Research should be traceable to evidence.

**4. Interactive**
Users should explore knowledge instead of simply reading it.

**5. Intelligent**
AI should help users discover relationships, gaps, and insights.

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ARC-ai-research-canvas.git

cd ARC-ai-research-canvas
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Create your environment file:

```text
AI_API_KEY=your_api_key
SEARCH_API_KEY=your_search_api_key
```

Never commit your real API keys to GitHub.

---

# 🤝 Contributing

Contributions, ideas, and improvements are welcome.

Potential areas for contribution include:

* New AI agents
* Better graph layouts
* Research source integrations
* Citation improvements
* Canvas components
* UI/UX improvements
* Research evaluation
* Performance optimization

---

# ⭐ Future Ideas

Some experimental ideas for future versions:

* 🎓 **Teach Me This Canvas**
* 🔍 **Research Gap Detector**
* ⚔️ **AI Debate**
* 🧠 **Concept Expansion**
* 📑 **Automatic Literature Review**
* 🕸️ **Semantic Knowledge Graph**
* 🎙️ **Voice Research**
* 🤝 **Collaborative Research**
* 🚀 **Research → Project Generator**
* 🔬 **Research Experiment Planner**

---

# 📜 License

This project is currently intended as an experimental AI research project.

License details will be added as the project matures.

---

# 👨‍💻 Author

**Sai Sushant Kotagiri**

Built as an exploration of:

**AI × Research × Knowledge Graphs × Agents × Visualization**

---

## ⭐ ARC

> **Don't just search for knowledge. Build a map of it.**
