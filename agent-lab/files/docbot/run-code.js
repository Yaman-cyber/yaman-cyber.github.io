// Agent Lab · Module 10 · Lesson 3: E2B: sandboxes on demand
// https://yaman-cyber.github.io/agent-lab/m10/#m10-l2

import { Sandbox } from "@e2b/code-interpreter";

export async function runPython(code, csvText) {
  const sandbox = await Sandbox.create();
  try {
    await sandbox.files.write("/home/user/data.csv", csvText);
    const run = await sandbox.runCode(code);
    if (run.error) return "Error: " + run.error.value;
    return run.logs.stdout.join("").slice(0, 4000);   // keep results short
  } finally {
    await sandbox.kill();                             // always destroy it
  }
}
