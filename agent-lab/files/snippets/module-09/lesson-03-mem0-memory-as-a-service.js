// mem0.js
import { MemoryClient } from "mem0ai";
const mem = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });

// before answering: recall what's relevant to THIS question
const found = await mem.search(question, { filters: { user_id: userId }, topK: 5 });
const known = found.results.map(m => "- " + m.memory).join("\n");

// after answering: let Mem0 extract and update facts
await mem.add(
  [{ role: "user", content: question }, { role: "assistant", content: reply }],
  { user_id: userId },
);
