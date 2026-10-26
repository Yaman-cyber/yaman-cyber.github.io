// services/agent/tools/search-docs.tool.js + index.js
// ---------- services/agent/tools/search-docs.tool.js ----------
const { retrieve } = require("../../ai/retrieval.service");
const { fence } = require("../../../helpers/fence");

module.exports = {
  definition: {
    name: "search_docs",
    description: "Search the company documents. Use it for any question about policies, products or procedures.",
    input_schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  },
  needsApproval: false,
  async run({ query }) {
    const pieces = await retrieve(query, 5);
    if (pieces.length === 0) return "No matching documents.";
    return pieces.map((p, i) => fence(p.doc, "[" + (i + 1) + "] " + p.content)).join("\n");
  },
};

// ---------- services/agent/tools/index.js ----------
const tools = [
  require("./search-docs.tool"),
  require("./exchange-rate.tool"),     // Module 13
  require("./order-status.tool"),      // Module 13
  require("./create-ticket.tool"),     // Module 13
];

const definitions = tools.map(t => t.definition);
const find = name => tools.find(t => t.definition.name === name);

const needsApproval = name => Boolean(find(name)?.needsApproval);

async function runTool(name, input, ctx) {
  const tool = find(name);
  if (!tool) return "Unknown tool: " + name;
  try {
    return await tool.run(input, ctx);
  } catch (err) {
    return "Tool " + name + " failed: " + err.message;   // the model reads this and can recover
  }
}

module.exports = { definitions, needsApproval, runTool };
