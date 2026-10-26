// Agent Lab · Module 01 · Lessons 2–3: Describe a tool + Write the real function
// https://yaman-cyber.github.io/agent-lab/m1/#m1-l1

import fs from "node:fs/promises";
import path from "node:path";

export const tools = [
  {
    name: "read_file",
    description: "Read one document from the docs folder. Use it whenever the user asks about a document.",
    input_schema: {
      type: "object",
      properties: {
        filename: { type: "string", description: "For example: refunds.md" },
      },
      required: ["filename"],
    },
  },
];

export const runTool = {
  read_file: async ({ filename }) => {
    const safeName = path.basename(filename);          // blocks "../../secret"
    try {
      const text = await fs.readFile("docs/" + safeName, "utf8");
      return text.slice(0, 8000);                      // don't flood the model
    } catch {
      return "File not found: " + safeName;
    }
  },
};

// [added] DocBot v1 project: a second tool so DocBot can see what's in docs/
tools.push({
  name: "list_files",
  description: "List the documents in the docs folder. Use it first when you don't know which file has the answer.",
  input_schema: { type: "object", properties: {} },
});
runTool.list_files = async () => (await fs.readdir("docs")).join("\n");
