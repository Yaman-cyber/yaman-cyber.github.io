// run-code.js
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
