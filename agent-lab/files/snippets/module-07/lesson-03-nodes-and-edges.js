// graph.js
import { StateGraph, START, END } from "@langchain/langgraph";

const research = async (state) => {
  const pieces = await search(state.question, 5);   // your Module 03 search
  return { notes: pieces.map(p => p.content) };
};

const write = async (state) => {
  const text = await callModel("Answer from these notes:\n" + state.notes.join("\n---\n"));
  return { draft: text };
};

export const builder = new StateGraph(State)
  .addNode("research", research)
  .addNode("write", write)
  .addEdge(START, "research")
  .addConditionalEdges("research", s => (s.notes.length >= 3 ? "write" : "research"))
  .addEdge("write", END);
