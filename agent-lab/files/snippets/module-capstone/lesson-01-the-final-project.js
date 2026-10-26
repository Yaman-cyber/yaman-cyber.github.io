// DocBot 1.0 architecture
// user question
//   → LangGraph.js agent (Module 07)
//       → search_docs over MCP (08) → Voyage + pgvector + rerank (03–04)
//       → run_python in E2B (10) when numbers are needed
//       → Mem0 for user memory (09)
//   → Zod-checked outputs (02), approval gates + fencing (11)
// every run traced in Langfuse (06), every change tested by evals (05)
