// the same code, both ways
// ESM (Modules 00–11)                       // CommonJS (microflame)
import Anthropic from "@anthropic-ai/sdk";   // const { Anthropic } = require("@anthropic-ai/sdk");
import { z } from "zod";                     // const { z } = require("zod");
import { search } from "./search.js";        // const { search } = require("./search");

export async function search(q) { }          // async function search(q) { }
                                             // module.exports = { search };

export default router;                       // module.exports = router;

const rows = await search("refund");         // (async () => {
                                             //   const rows = await search("refund");
                                             // })();
