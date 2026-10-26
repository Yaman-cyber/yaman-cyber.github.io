// Agent Lab · Module 01 · Lesson 5: Put it together: the loop
// https://yaman-cyber.github.io/agent-lab/m1/#m1-l4

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { tools, runTool } from "./tools.js";

const client = new Anthropic();

export async function ask(question, maxSteps = 8) {
  const messages = [{ role: "user", content: question }];

  for (let step = 0; step < maxSteps; step++) {
    const res = await client.messages.create({
      model: "claude-sonnet-5-5", max_tokens: 1024, tools, messages,
    });
    messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason !== "tool_use") {
      return res.content.filter(b => b.type === "text").map(b => b.text).join("");
    }

    const results = [];
    for (const block of res.content) {
      if (block.type !== "tool_use") continue;
      const output = await runTool[block.name](block.input);
      results.push({ type: "tool_result", tool_use_id: block.id, content: output });
    }
    messages.push({ role: "user", content: results });
  }
  throw new Error("Stopped after " + maxSteps + " steps");
}

console.log(await ask("What is our refund policy?"));
