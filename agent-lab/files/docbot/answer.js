// Agent Lab · Module 04 · Lesson 3: The prompt: sources, citations, and "I don't know"
// https://yaman-cyber.github.io/agent-lab/m4/#m4-l2

// No new packages
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { search } from "./search.js";

const client = new Anthropic();

export async function answer(question) {
  const pieces = await search(question, 5);
  const sources = pieces
    .map((p, i) => "<source id=\"" + (i + 1) + "\" doc=\"" + p.doc + "\">\n" + p.content + "\n</source>")
    .join("\n");

  const res = await client.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 600,
    system: "Answer ONLY from the sources. Cite like [1]. If the sources don't contain the answer, say \"I don't know.\"",
    messages: [{ role: "user", content: sources + "\n\nQuestion: " + question }],
  });
  return res.content[0].text;
}
