// Agent Lab · Module 06 · Lesson 2: Langfuse: tracing for real
// https://yaman-cyber.github.io/agent-lab/m6/#m6-l1

import "dotenv/config";                      // [added] so this file runs on its own
import Anthropic from "@anthropic-ai/sdk";   // [added]
import { search } from "./search.js";        // [added]
const client = new Anthropic();              // [added]

import { Langfuse } from "langfuse";
const langfuse = new Langfuse(); // keys from .env

export async function tracedAnswer(question, userId) {
  const trace = langfuse.trace({ name: "docbot-answer", userId, input: question });

  const s = trace.span({ name: "search", input: question });
  const pieces = await search(question, 5);
  s.end({ output: pieces.map(p => p.doc) });

  const gen = trace.generation({ name: "answer", model: "claude-sonnet-5-5", input: question });
  const sources = pieces.map((p, i) => "<source id=\"" + (i + 1) + "\" doc=\"" + p.doc + "\">\n" + p.content + "\n</source>").join("\n");   // [added] from Module 04's answer.js
  const res = await client.messages.create({ /* same as Module 04 */
    model: "claude-sonnet-5-5",                                                                                                 // [added] the Module 04 call
    max_tokens: 600,
    system: "Answer ONLY from the sources. Cite like [1]. If the sources don't contain the answer, say \"I don't know.\"",
    messages: [{ role: "user", content: sources + "\n\nQuestion: " + question }],
  });
  gen.end({ output: res.content[0].text, usage: { input: res.usage.input_tokens, output: res.usage.output_tokens } });

  await langfuse.flushAsync(); // send before the process exits
  return res.content[0].text;
}

// [added] try it: node traced-answer.js "What is the refund window?"
if (/[\\/]traced-answer\.js$/.test(process.argv[1])) { console.log(await tracedAnswer(process.argv[2] || "What is the refund window?", "demo-user")); process.exit(0); }
