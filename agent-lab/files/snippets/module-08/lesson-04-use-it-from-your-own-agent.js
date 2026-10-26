// mcp-client.js
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const mcp = new Client({ name: "docbot-agent", version: "1.0.0" });
await mcp.connect(new StdioClientTransport({ command: "node", args: ["mcp-server.js"] }));

const { tools } = await mcp.listTools();
console.log(tools.map(t => t.name));                 // ["search_docs"]

const result = await mcp.callTool({ name: "search_docs", arguments: { query: "refunds" } });
