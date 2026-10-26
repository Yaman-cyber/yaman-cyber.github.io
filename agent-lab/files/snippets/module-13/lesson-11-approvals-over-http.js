// the conversation, as HTTP calls
// 1) user asks
// POST /api/v1/docbot/ask
{ "question": "My order ORD-10023 arrived broken, please get someone to help me" }

// 2) DocBot wants to open a ticket → it pauses and asks
{ "data": {
    "status": "pending",
    "threadId": "5b1e…",
    "action": { "tool": "create_support_ticket",
                "input": { "subject": "Broken item in ORD-10023", "details": "Arrived broken" } } } }

// 3) your app shows "Open a support ticket?" → user taps Yes
// POST /api/v1/docbot/decide
{ "threadId": "5b1e…", "approved": true }

// 4) the graph resumes, runs the tool, and Claude finishes the answer
{ "data": { "status": "done", "threadId": "5b1e…",
            "answer": "I've opened ticket #4821. Our team will contact you within 24 hours." } }
