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
