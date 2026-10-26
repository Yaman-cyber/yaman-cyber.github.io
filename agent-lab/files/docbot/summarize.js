// Agent Lab · Module 02 · Lesson 3: Make the model fill your shape
// https://yaman-cyber.github.io/agent-lab/m2/#m2-l2

import { DocSummary } from "./schema.js";
import { z } from "zod";
import "dotenv/config";                      // [added] so this file runs on its own
import fs from "node:fs/promises";           // [added]
import Anthropic from "@anthropic-ai/sdk";   // [added]

const client = new Anthropic();                                                         // [added]
const docText = await fs.readFile("docs/" + (process.argv[2] || "refunds.md"), "utf8");  // [added] node summarize.js billing.md

const res = await client.messages.create({
  model: "claude-sonnet-5-5",
  max_tokens: 500,
  tools: [{ name: "save_summary", description: "Save the document summary",
            input_schema: z.toJSONSchema(DocSummary) }],
  tool_choice: { type: "tool", name: "save_summary" },   // must use this tool
  messages: [{ role: "user", content: "Summarize this document:\n\n" + docText }],
});

const call = res.content.find(b => b.type === "tool_use");
const summary = DocSummary.parse(call.input);              // checked, safe to use

console.log(summary);   // [added]
