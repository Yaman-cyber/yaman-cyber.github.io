// Agent Lab · Module 04 · Lesson 6: Same thing with LlamaIndex.TS
// https://yaman-cyber.github.io/agent-lab/m4/#m4-l5

import "dotenv/config";
import { Settings, VectorStoreIndex } from "llamaindex";
import { Anthropic } from "@llamaindex/anthropic";
import { VoyageAIEmbedding } from "@llamaindex/voyage-ai";
import { SimpleDirectoryReader } from "@llamaindex/readers/directory";

// 1) choose the models once, for the whole app
Settings.llm = new Anthropic({ model: "claude-sonnet-5-5" });   // uses ANTHROPIC_API_KEY
Settings.embedModel = new VoyageAIEmbedding();                    // uses VOYAGE_API_KEY

// 2) load every file in docs/
const documents = await new SimpleDirectoryReader().loadData({ directoryPath: "./docs" });

// 3) chunk + embed + store (in memory here)
const index = await VectorStoreIndex.fromDocuments(documents);

// 4) ask
const engine = index.asQueryEngine();
const res = await engine.query({ query: "What is the refund window?" });
console.log(res.toString());
