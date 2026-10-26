// tools.js
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
