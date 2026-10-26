// Agent Lab · Module 04: ask DocBot from the terminal, using answer() from Lesson 3
//   node ask.js "What is the refund window?"
import { answer } from "./answer.js";

console.log(await answer(process.argv.slice(2).join(" ") || "What is the refund window?"));
process.exit(0);   // close the database pool
