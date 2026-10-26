require("dotenv").config({ path: ".env.development" });
const golden = require("../tests/evals/golden.json");
const docbot = require("../services/agent/docbot.service");
const crypto = require("node:crypto");

(async () => {
  let passed = 0;
  for (const g of golden) {
    const res = await docbot.ask({ question: g.question, userId: "eval", threadId: crypto.randomUUID() });
    if ((res.answer || "").toLowerCase().includes(g.mustInclude.toLowerCase())) passed++;
  }
  console.log("passed", passed, "/", golden.length);
  process.exit(passed === golden.length ? 0 : 1);   // a failing exit code fails CI
})();
