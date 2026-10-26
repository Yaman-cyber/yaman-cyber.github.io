// Agent Lab · Module 07 · Lesson 4: Checkpoints: save every step
// https://yaman-cyber.github.io/agent-lab/m7/#m7-l3

import { builder } from "./graph.js";   // [added]

import { MemorySaver } from "@langchain/langgraph";

const graph = builder.compile({ checkpointer: new MemorySaver() }); // use Postgres in production

const config = { configurable: { thread_id: "question-42" } };
const result = await graph.invoke({ question: "How do refunds work?" }, config);
console.log(result.draft);

process.exit(0);   // [added] close the database pool
