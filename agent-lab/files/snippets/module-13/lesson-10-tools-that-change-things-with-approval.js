// services/agent/tools/create-ticket.tool.js
const config = require("config");

module.exports = {
  definition: {
    name: "create_support_ticket",
    description: "Open a support ticket for the user. Only use it when the user asks for help from a human.",
    input_schema: {
      type: "object",
      properties: {
        subject: { type: "string" },
        details: { type: "string", description: "What the user needs, in their own words" },
      },
      required: ["subject", "details"],
    },
  },
  needsApproval: true,                                   // the graph pauses before this runs

  async run({ subject, details }, ctx) {
    const res = await fetch(config.get("helpdeskUrl") + "/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.get("helpdeskKey"),   // the key never reaches the model
      },
      body: JSON.stringify({ subject, details, requesterId: String(ctx.userId) }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return "Could not create the ticket (status " + res.status + ").";

    const ticket = await res.json();
    return "Ticket created: #" + ticket.id;
  },
};
