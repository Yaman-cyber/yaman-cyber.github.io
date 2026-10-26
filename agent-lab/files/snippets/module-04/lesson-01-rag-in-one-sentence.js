// rag-v0.js: the three steps in one file
// No new packages: uses @anthropic-ai/sdk + dotenv (Module 00) and your search (Module 03)
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { search } from "./search.js";

const client = new Anthropic();
const question = "What is the refund window?";

// 1. retrieve: find the 5 most relevant chunks
const pieces = await search(question, 5);

// 2. augment: put them in the prompt
const prompt = pieces.map(p => p.content).join("\n---\n") +
               "\n\nUsing only the text above, answer: " + question;

// 3. generate: let the model answer
const res = await client.messages.create({
  model: "claude-sonnet-5-5",
  max_tokens: 400,
  messages: [{ role: "user", content: prompt }],
});

console.log(res.content[0].text);
