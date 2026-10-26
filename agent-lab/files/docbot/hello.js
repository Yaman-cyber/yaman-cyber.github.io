// Agent Lab · Module 00 · Lesson 4: Your first AI call
// https://yaman-cyber.github.io/agent-lab/m0/#m0-l3

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from .env

const res = await client.messages.create({
  model: "claude-sonnet-5-5",
  max_tokens: 300,
  messages: [{ role: "user", content: "Explain what an API is to a 10-year-old." }],
});

console.log(res.content[0].text);
console.log("tokens used:", res.usage.input_tokens, "in,", res.usage.output_tokens, "out");
