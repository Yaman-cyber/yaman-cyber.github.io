// summarize.js
import { DocSummary } from "./schema.js";
import { z } from "zod";

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
