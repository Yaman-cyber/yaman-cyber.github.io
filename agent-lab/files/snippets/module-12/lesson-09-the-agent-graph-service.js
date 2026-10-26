// services/agent/docbot.graph.js + docbot.service.js
// ---------- services/agent/docbot.graph.js ----------
const config = require("config");
const { StateGraph, Annotation, START, END, MemorySaver, interrupt } = require("@langchain/langgraph");
const { anthropic } = require("../ai/clients");
const prompts = require("../../constants/prompts");
const { definitions, needsApproval, runTool } = require("./tools");

const State = Annotation.Root({
  messages: Annotation({ reducer: (a, b) => a.concat(b), default: () => [] }),
  userId: Annotation(),
});

async function callModel(state) {
  const res = await anthropic.messages.create({
    model: config.get("aiModel"),
    max_tokens: 1024,
    system: prompts.docbot,
    tools: definitions,
    messages: state.messages,
  });
  return { messages: [{ role: "assistant", content: res.content }] };
}

async function callTools(state) {
  const calls = state.messages.at(-1).content.filter(b => b.type === "tool_use");

  // ask for every approval first: on resume, this node re-runs from the top
  const approved = {};
  for (const call of calls) {
    if (needsApproval(call.name)) approved[call.id] = interrupt({ tool: call.name, input: call.input }).approved;
  }

  const results = [];
  for (const call of calls) {
    const blocked = needsApproval(call.name) && !approved[call.id];
    const output = blocked ? "Blocked by the user." : await runTool(call.name, call.input, { userId: state.userId });
    results.push({ type: "tool_result", tool_use_id: call.id, content: output });
  }
  return { messages: [{ role: "user", content: results }] };
}

const next = state =>
  state.messages.at(-1).content.some(b => b.type === "tool_use") ? "tools" : END;

const graph = new StateGraph(State)
  .addNode("model", callModel)
  .addNode("tools", callTools)
  .addEdge(START, "model")
  .addConditionalEdges("model", next)
  .addEdge("tools", "model")
  .compile({ checkpointer: new MemorySaver() });   // PostgresSaver in production

module.exports = { graph };

// ---------- services/agent/docbot.service.js ----------
const { Command } = require("@langchain/langgraph");
const { graph } = require("./docbot.graph");

const settings = threadId => ({ configurable: { thread_id: threadId }, recursionLimit: 12 });

function toResult(state, threadId) {
  const pending = state.__interrupt__?.[0]?.value;
  if (pending) return { status: "pending", threadId, action: pending };
  const last = state.messages.at(-1);
  const answer = last.content.filter(b => b.type === "text").map(b => b.text).join("");
  return { status: "done", threadId, answer };
}

async function ask({ question, userId, threadId }) {
  const state = await graph.invoke(
    { messages: [{ role: "user", content: question }], userId },
    settings(threadId),
  );
  return toResult(state, threadId);
}

async function decide({ threadId, approved }) {
  const state = await graph.invoke(new Command({ resume: { approved } }), settings(threadId));   // an object: LangGraph ignores a bare false
  return toResult(state, threadId);
}

module.exports = { ask, decide };
