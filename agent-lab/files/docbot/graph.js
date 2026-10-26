// Agent Lab · Module 07 · Lesson 3: Nodes and edges
// https://yaman-cyber.github.io/agent-lab/m7/#m7-l2

import { StateGraph, START, END } from "@langchain/langgraph";
import "dotenv/config";                      // [added] so this file runs on its own
import Anthropic from "@anthropic-ai/sdk";   // [added]
import { State } from "./state.js";          // [added] Lesson 2
import { search } from "./search.js";        // [added] Module 03

const client = new Anthropic();              // [added] the model call write() uses
const callModel = async (prompt) => {        // [added]
  const res = await client.messages.create({ model: "claude-sonnet-5-5", max_tokens: 600, messages: [{ role: "user", content: prompt }] });
  return res.content[0].text;
};

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

export { research, write };   // [added] approval.js reuses these nodes
