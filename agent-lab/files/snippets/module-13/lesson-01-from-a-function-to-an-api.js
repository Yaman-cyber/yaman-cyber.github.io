// server.js (plain Express)
require("dotenv").config({ path: ".env.development" });
const express = require("express");
const crypto = require("node:crypto");
const docbot = require("./services/agent/docbot.service");

const app = express();
app.use(express.json());                       // read JSON bodies

app.post("/ask", async (req, res) => {
  const { question, threadId } = req.body;
  if (!question) return res.status(400).send({ message: "question is required" });

  const result = await docbot.ask({ question, userId: "demo", threadId: threadId || crypto.randomUUID() });
  res.send(result);
});

app.listen(3000, () => console.log("DocBot API on http://localhost:3000"));

// try it:
// curl -X POST localhost:3000/ask -H "Content-Type: application/json" -d '{"question":"What is the refund window?"}'
