// Agent Lab · Module 09 · Lesson 2: Build memory by hand
// https://yaman-cyber.github.io/agent-lab/m9/#m9-l1

import "dotenv/config";                      // [added] so this file runs on its own
import Anthropic from "@anthropic-ai/sdk";   // [added]
const client = new Anthropic();              // [added]

const facts = {};   // userId -> [facts]  (use a database in real life)

export async function remember(userId, conversationText) {
  const res = await client.messages.create({
    model: "claude-sonnet-5-5", max_tokens: 200,
    messages: [{ role: "user", content:
      "List lasting facts about the user from this chat, one per line. Reply NONE if none.\n\n" + conversationText }],
  });
  const text = res.content[0].text.trim();
  if (text !== "NONE") facts[userId] = [...(facts[userId] || []), ...text.split("\n")];
}

export const systemFor = (userId) =>
  "You are DocBot. Known facts about this user:\n" + (facts[userId] || []).join("\n");

// [added] try it: node simple-memory.js
if (/[\\/]simple-memory\.js$/.test(process.argv[1])) {
  await remember("yaman", "User: Please answer in Arabic from now on. I work in the finance team.");
  console.log(systemFor("yaman"));
}
