// Agent Lab · Module 08 · Lesson 2: Your first MCP server
// https://yaman-cyber.github.io/agent-lab/m8/#m8-l1

import "dotenv/config";                                   // search() needs DATABASE_URL and VOYAGE_API_KEY
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { search } from "./search.js";

const server = new McpServer({ name: "docbot", version: "1.0.0" });

server.registerTool(
  "search_docs",
  {
    description: "Search the company documents by meaning. Returns the best matching passages.",
    inputSchema: { query: z.string() },
  },
  async ({ query }) => {
    const pieces = await search(query, 5);
    return { content: [{ type: "text", text: JSON.stringify(pieces, null, 2) }] };
  },
);

await server.connect(new StdioServerTransport());
