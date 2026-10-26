// Agent Lab · Module 03 · Lesson 6: Other models and databases
// https://yaman-cyber.github.io/agent-lab/m3/#m3-l5

import { search } from "./search.js";   // [added]

const tests = [
  { question: "how do I get my money back", expectedDoc: "refunds.md" },
  { question: "متى يتم استرداد المبلغ", expectedDoc: "refunds.md" },
];

let found = 0;
for (const t of tests) {
  const top5 = await search(t.question, 5);
  if (top5.some(r => r.doc === t.expectedDoc)) found++;
}
console.log("hit rate:", found / tests.length); // run once per model, compare
