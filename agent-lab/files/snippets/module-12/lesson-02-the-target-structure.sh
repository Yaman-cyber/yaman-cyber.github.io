// docbot-api/ (new files marked ★)
docbot-api/
├─ index.js                          # starts the app (from microflame)
├─ config/
│  └─ custom-environment-variables.json   # ★ AI keys added here
├─ constants/
│  ├─ messages.json  responseCodes.json  events.json
│  └─ prompts.js                     # ★ every system prompt in one place
├─ helpers/
│  ├─ chunk.js                       # ★ split text into chunks
│  └─ fence.js                       # ★ wrap untrusted text (Module 11)
├─ services/
│  ├─ ai/
│  │  ├─ clients.js                  # ★ Anthropic + Postgres, created once
│  │  ├─ embedding.service.js        # ★ Voyage embed + rerank
│  │  └─ retrieval.service.js        # ★ hybrid search → rerank
│  └─ agent/
│     ├─ tools/
│     │  ├─ index.js                 # ★ tool registry
│     │  ├─ search-docs.tool.js      # ★ one file per tool
│     │  └─ ...
│     ├─ docbot.graph.js             # ★ the LangGraph agent
│     └─ docbot.service.js           # ★ ask() / decide(): what the API calls
├─ controllers/api/v1/   routes/api/v1/   validators/   # Module 13
├─ events/  handlers/  crons/                            # Module 13
├─ scripts/
│  ├─ ingest.js                      # ★ index docs/
│  └─ eval.js                        # ★ run the golden set
├─ tests/evals/golden.json           # ★ from Module 05
└─ docs/                             # ★ the documents DocBot answers from
