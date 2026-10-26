// Agent Lab · Module 05 · Lesson 4: Let an AI grade fuzzy things
// https://yaman-cyber.github.io/agent-lab/m5/#m5-l3

import "dotenv/config";                      // [added] so this file runs on its own
import Anthropic from "@anthropic-ai/sdk";   // [added]
const client = new Anthropic();              // [added]

export async function judge(question, sources, reply) {
  const res = await client.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 10,
    system: "You grade answers. Reply with only PASS or FAIL.",
    messages: [{ role: "user", content:
      "Sources:\n" + sources + "\n\nQuestion: " + question + "\nAnswer: " + reply +
      "\n\nPASS only if every claim in the answer is supported by the sources." }],
  });
  return res.content[0].text.trim() === "PASS";
}

// [added] try it: node judge.js
if (/[\\/]judge\.js$/.test(process.argv[1])) console.log(await judge("What is the refund window?", "[1] Refunds within 30 days of delivery.", "30 days [1]") ? "PASS" : "FAIL");
