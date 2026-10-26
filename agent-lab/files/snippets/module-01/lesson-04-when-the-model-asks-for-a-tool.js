// handling tool_use
// res.content might look like:
// [{ type: "text", text: "Let me check." },
//  { type: "tool_use", id: "toolu_01A", name: "read_file", input: { filename: "refunds.md" } }]

const results = [];
for (const block of res.content) {
  if (block.type === "tool_use") {
    const output = await runTool[block.name](block.input);
    results.push({ type: "tool_result", tool_use_id: block.id, content: output });
  }
}
