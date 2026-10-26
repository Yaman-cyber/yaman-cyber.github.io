// Agent Lab · Module 11 · Lesson 3: The real fix: limit what the agent can do
// https://yaman-cyber.github.io/agent-lab/m11/#m11-l2

import { runTool } from "./tools.js";   // [added] Module 01

const NEEDS_APPROVAL = new Set(["send_email", "delete_record", "refund_order"]);

export async function runToolSafely(name, input, askHuman) {
  if (NEEDS_APPROVAL.has(name)) {
    const ok = await askHuman("DocBot wants to " + name + ": " + JSON.stringify(input));
    if (!ok) return "Blocked by the user.";
  }
  return runTool[name](input);
}

// [added] try it: node approval-gate.js
if (/[\\/]approval-gate\.js$/.test(process.argv[1])) {
  console.log(await runToolSafely("send_email", { to: "x@evil.example" }, async (q) => { console.log("asked:", q); return false; }));
  console.log((await runToolSafely("read_file", { filename: "refunds.md" }, async () => true)).split("\n")[0]);
}
