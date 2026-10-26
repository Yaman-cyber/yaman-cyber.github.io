// naming rules
# Good                          # Bad
search-docs.tool.js             searchDocs.js, SearchDocsTool.js, search_docs.js
retrieval.service.js            retrieval.js, RetrievalService.js
docbot.controller.js            docbotController.js
docbot.routes.js                routes.js
ask-valid.js                    askValidator.js
reindex.cron.js                 cron1.js

# One folder per area, one job per file:
services/ai/        talks to AI providers and the vector DB
services/agent/     decides what to do (graph, tools)
helpers/            small pure functions with no outside calls
