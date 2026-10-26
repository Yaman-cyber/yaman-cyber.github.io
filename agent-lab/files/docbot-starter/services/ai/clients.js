const config = require("config");
const { Anthropic } = require("@anthropic-ai/sdk");
const { Pool } = require("pg");

const anthropic = new Anthropic({ apiKey: config.get("anthropicKey") });
const vectorDb = new Pool({ connectionString: config.get("vectorDbUrl") });

module.exports = { anthropic, vectorDb };
