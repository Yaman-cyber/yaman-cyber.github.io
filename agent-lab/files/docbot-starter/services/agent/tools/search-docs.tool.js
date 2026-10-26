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
