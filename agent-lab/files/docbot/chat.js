// Agent Lab · Module 00 · Lesson 5: Conversations and the system prompt
// https://yaman-cyber.github.io/agent-lab/m0/#m0-l4

import "dotenv/config";                      // [added] so this file runs on its own
import Anthropic from "@anthropic-ai/sdk";   // [added]
const client = new Anthropic();              // [added]

const messages = [
  { role: "user", content: "My name is Yaman." },
  { role: "assistant", content: "Nice to meet you, Yaman!" },
  { role: "user", content: "What's my name?" }, // works only because we resent the history
];

const res = await client.messages.create({
  model: "claude-sonnet-5-5",
  max_tokens: 200,
  system: "You are DocBot, a friendly assistant. Keep answers short.",
  messages,
});

console.log(res.content[0].text);   // [added]
