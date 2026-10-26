// run.js
import { MemorySaver } from "@langchain/langgraph";

const graph = builder.compile({ checkpointer: new MemorySaver() }); // use Postgres in production

const config = { configurable: { thread_id: "question-42" } };
const result = await graph.invoke({ question: "How do refunds work?" }, config);
console.log(result.draft);
