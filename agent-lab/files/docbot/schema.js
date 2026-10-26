// Agent Lab · Module 02 · Lesson 2: Describe the shape with Zod
// https://yaman-cyber.github.io/agent-lab/m2/#m2-l1

import { z } from "zod";

export const DocSummary = z.object({
  title: z.string(),
  language: z.enum(["ar", "en"]),
  topics: z.array(z.string()).max(5),
  readingMinutes: z.number().int().positive(),
});

if (/[\\/]schema\.js$/.test(process.argv[1])) {   // [added] run the demo only with `node schema.js`, so other files can import DocSummary
  DocSummary.parse({ title: "Refunds", language: "en", topics: ["money"], readingMinutes: 2 }); // ok
  DocSummary.parse({ title: "Refunds", language: "fr" });  // throws: language invalid, readingMinutes missing
}
