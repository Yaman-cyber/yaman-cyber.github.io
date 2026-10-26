// terminal + what it generates
# microflame add-env <ENV_NAME> <value> <configKey> <required>
microflame add-env ANTHROPIC_API_KEY sk-ant-xxx anthropicKey true
microflame add-env VOYAGE_API_KEY pa-xxx voyageKey true
microflame add-env AI_MODEL claude-sonnet-5-5 aiModel true
microflame add-env VECTOR_DATABASE_URL postgres://postgres:pw@localhost:5432/postgres vectorDbUrl true

# config/custom-environment-variables.json now contains:
#   "anthropicKey": "ANTHROPIC_API_KEY",
#   "voyageKey": "VOYAGE_API_KEY", ...
# start/config.js now throws at startup if any of them is missing.

# Anywhere in the app:
#   const config = require("config");
#   config.get("anthropicKey");
