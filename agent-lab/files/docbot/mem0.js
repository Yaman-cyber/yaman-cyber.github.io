// Agent Lab · Module 09 · Lesson 3: Mem0: memory as a service
// https://yaman-cyber.github.io/agent-lab/m9/#m9-l2

import { MemoryClient } from "mem0ai";
import "dotenv/config";                      // [added] so this file runs on its own
import Anthropic from "@anthropic-ai/sdk";   // [added]
const mem = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });
const userId = "demo-user";                                                                    // [added] who is asking
const question = process.argv[2] || "Please answer in Arabic. What is the refund window?";   // [added]

// before answering: recall what's relevant to THIS question
const found = await mem.search(question, { filters: { user_id: userId }, topK: 5 });
const known = found.results.map(m => "- " + m.memory).join("\n");

// [added] answer with what Mem0 recalled (in DocBot this is your Module 04 answer())
const client = new Anthropic();
const res = await client.messages.create({ model: "claude-sonnet-5-5", max_tokens: 400,
  system: "You are DocBot. Known facts about this user:\n" + known, messages: [{ role: "user", content: question }] });
const reply = res.content[0].text;
console.log(reply);

// after answering: let Mem0 extract and update facts
await mem.add(
  [{ role: "user", content: question }, { role: "assistant", content: reply }],
  { user_id: userId },
);
