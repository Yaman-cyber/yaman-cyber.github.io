// schema.js
import { z } from "zod";

export const DocSummary = z.object({
  title: z.string(),
  language: z.enum(["ar", "en"]),
  topics: z.array(z.string()).max(5),
  readingMinutes: z.number().int().positive(),
});

DocSummary.parse({ title: "Refunds", language: "en", topics: ["money"], readingMinutes: 2 }); // ok
DocSummary.parse({ title: "Refunds", language: "fr" });  // throws: language invalid, readingMinutes missing
