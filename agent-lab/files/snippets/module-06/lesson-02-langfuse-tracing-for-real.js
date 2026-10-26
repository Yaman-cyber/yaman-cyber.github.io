// traced-answer.js
import { Langfuse } from "langfuse";
const langfuse = new Langfuse(); // keys from .env

export async function tracedAnswer(question, userId) {
  const trace = langfuse.trace({ name: "docbot-answer", userId, input: question });

  const s = trace.span({ name: "search", input: question });
  const pieces = await search(question, 5);
  s.end({ output: pieces.map(p => p.doc) });

  const gen = trace.generation({ name: "answer", model: "claude-sonnet-5-5", input: question });
  const res = await client.messages.create({ /* same as Module 04 */ });
  gen.end({ output: res.content[0].text, usage: { input: res.usage.input_tokens, output: res.usage.output_tokens } });

  await langfuse.flushAsync(); // send before the process exits
  return res.content[0].text;
}
