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
