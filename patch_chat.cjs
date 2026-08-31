const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldChatBlock = `      const prompt = \\\`You are "Ask the Canvas", an interactive AI Research Assistant grounded strictly in the current research project knowledge graph.

Research Topic: "\\\${project.query}"
Research Executive Summary: \\\${project.executiveSummary}

Knowledge Graph Entities:
\\\${nodesSummary}

Knowledge Graph Relationships:
\\\${edgesSummary}

Evidence Claims:
\\\${claimsSummary}

Scholarly Sources & Evidence:
\\\${sourcesSummary}

Discovered Contradictions:
\\\${contradictionsSummary}

User Question: "\\\${question}"

Instructions:
1. Answer the user's question directly, accurately, and authoritatively using ONLY the research evidence and graph connections.
2. When referencing facts, cite the sources by their titles or IDs (e.g. "[Paper 1]", "[arXiv:2024...]").
3. Identify the EXACT node IDs and edge IDs in the knowledge graph that correspond to this explanation so the UI canvas can visually illuminate them!
4. Return valid JSON matching:
{
  "content": "Your thorough, clear, evidence-backed answer with markdown formatting and citations...",
  "highlightedNodeIds": ["node_1", "node_2"],
  "highlightedEdgeIds": ["edge_1"],
  "citedSourceIds": ["src_1"]
}\\\`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });`;

const newChatBlock = `      const systemInstruction = \\\`You are "Ask the Canvas", an interactive AI Research Assistant grounded strictly in the current research project knowledge graph.

Research Topic: "\\\${project.query}"
Research Executive Summary: \\\${project.executiveSummary}

Knowledge Graph Entities:
\\\${nodesSummary}

Knowledge Graph Relationships:
\\\${edgesSummary}

Evidence Claims:
\\\${claimsSummary}

Scholarly Sources & Evidence:
\\\${sourcesSummary}

Discovered Contradictions:
\\\${contradictionsSummary}

Instructions:
1. Answer the user's question directly, accurately, and authoritatively using ONLY the research evidence and graph connections.
2. When referencing facts, cite the sources by their titles or IDs (e.g. "[Paper 1]", "[arXiv:2024...]").
3. Identify the EXACT node IDs and edge IDs in the knowledge graph that correspond to this explanation so the UI canvas can visually illuminate them!
4. Return valid JSON matching:
{
  "content": "Your thorough, clear, evidence-backed answer with markdown formatting and citations...",
  "highlightedNodeIds": ["node_1", "node_2"],
  "highlightedEdgeIds": ["edge_1"],
  "citedSourceIds": ["src_1"]
}\\\`;

      const contents = chatHistory
        .filter((msg: any) => msg.content !== question)
        .map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));
      
      contents.push({
        role: 'user',
        parts: [{ text: question }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: { 
          systemInstruction,
          responseMimeType: "application/json" 
        },
      });`;

content = content.replace(oldChatBlock, newChatBlock);
fs.writeFileSync('server.ts', content);
