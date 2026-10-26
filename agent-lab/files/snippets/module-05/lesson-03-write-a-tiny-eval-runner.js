// eval.js
import golden from "./golden.json" with { type: "json" };

let searchHits = 0, answerHits = 0;
for (const g of golden) {
  if (g.doc) {
    const top5 = await search(g.question, 5);
    if (top5.some(p => p.doc === g.doc)) searchHits++;
  }
  const reply = await answer(g.question);
  if (reply.toLowerCase().includes(g.mustInclude.toLowerCase())) answerHits++;
}
console.log("search:", searchHits, "answers:", answerHits, "/", golden.length);
