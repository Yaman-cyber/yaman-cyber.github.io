// Agent Lab · Module 07 · Lesson 5: Pause for a human
// https://yaman-cyber.github.io/agent-lab/m7/#m7-l4

import { interrupt, Command } from "@langchain/langgraph";
import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";   // [added]
import { State } from "./state.js";             // [added]
import { research, write } from "./graph.js";   // [added]

const approve = async (state) => {
  const answer = interrupt({ draft: state.draft });   // pauses here
  return answer === "approve" ? {} : { notes: ["Reviewer rejected the draft. Research more."] };
};

// [added] the flowchart from Lesson 1: research → write → approve → END
const graph = new StateGraph(State)
  .addNode("research", research)
  .addNode("write", write)
  .addNode("approve", approve)
  .addEdge(START, "research")
  .addConditionalEdges("research", s => (s.notes.length >= 3 ? "write" : "research"))
  .addEdge("write", "approve")
  .addEdge("approve", END)
  .compile({ checkpointer: new MemorySaver() });
const config = { configurable: { thread_id: "question-42" } };

// first call runs until the pause...
await graph.invoke({ question: "How do refunds work?" }, config);
console.log("Waiting for approval:", (await graph.getState(config)).tasks[0].interrupts[0].value.draft.slice(0, 120));   // [added]
// ...a human reviews, then you resume with their answer: "approve" or "reject"
await graph.invoke(new Command({ resume: "approve" }), config);
console.log("Approved:", (await graph.getState(config)).values.draft.slice(0, 120));   // [added]
process.exit(0);   // [added] close the database pool
