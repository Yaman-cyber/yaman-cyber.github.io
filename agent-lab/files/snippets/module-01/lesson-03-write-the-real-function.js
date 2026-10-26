// tools.js
import fs from "node:fs/promises";
import path from "node:path";

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
