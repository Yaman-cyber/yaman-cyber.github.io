// Agent Lab · Module 10 · Lesson 4: Make it a DocBot tool (the DocBot v10 project)
// https://yaman-cyber.github.io/agent-lab/m10/#m10-l3
// The Module 01 agent loop with one tool, run_python, that runs Claude's code in an E2B sandbox (run-code.js).
//   node analyze-csv.js "What is the average order value?"
import "dotenv/config";
import fs from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";
import { runPython } from "./run-code.js";

const client = new Anthropic();
const csvText = await fs.readFile("data/orders.csv", "utf8");

const tools = [{
  name: "run_python",
  description: "Run Python code to analyze the user's CSV at /home/user/data.csv. Print the results you need.",
  input_schema: {
    type: "object",
    properties: { code: { type: "string" } },
    required: ["code"],
  },
}];

async function analyze(question, maxSteps = 6) {
  const header = csvText.split("\n")[0];
  const messages = [{ role: "user", content: question + "\n\nThe CSV's columns: " + header }];

  for (let step = 0; step < maxSteps; step++) {
    const res = await client.messages.create({ model: "claude-sonnet-5-5", max_tokens: 1024, tools, messages });
    messages.push({ role: "assistant", content: res.content });
    if (res.stop_reason !== "tool_use") return res.content.filter(b => b.type === "text").map(b => b.text).join("");

    const results = [];
    for (const block of res.content) {
      if (block.type !== "tool_use") continue;
      const output = await runPython(block.input.code, csvText);   // a fresh sandbox every time
      results.push({ type: "tool_result", tool_use_id: block.id, content: output });
    }
    messages.push({ role: "user", content: results });
  }
  throw new Error("Stopped after " + maxSteps + " steps");
}

console.log(await analyze(process.argv.slice(2).join(" ") || "What is the average order value in AED?"));
