const express = require("express");
const router = express.Router();

const auth = require("../../../middlewares/auth/auth");
const api = require("../../../controllers/api/v1/docbot.controller");

router.post("/ask", auth, api.ask);               // POST /api/v1/docbot/ask
router.post("/decide", auth, api.decide);         // POST /api/v1/docbot/decide
router.post("/ask/stream", auth, api.askStream);  // next lesson

module.exports = router;

// Response from /ask:
// { "data": { "status": "done", "threadId": "…", "answer": "Refunds are issued within 30 days [1]." },
//   "success": true, "message": "Answered", "metadata": {} }
