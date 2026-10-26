// approval-gate.js
const NEEDS_APPROVAL = new Set(["send_email", "delete_record", "refund_order"]);

export async function runToolSafely(name, input, askHuman) {
  if (NEEDS_APPROVAL.has(name)) {
    const ok = await askHuman("DocBot wants to " + name + ": " + JSON.stringify(input));
    if (!ok) return "Blocked by the user.";
  }
  return runTool[name](input);
}
