# DocBot · Agent Lab, Modules 00–11

DocBot as you build it in the **Agent Lab** course: every file is a lesson, in its real place, ready to run.
Course: https://yaman-cyber.github.io/agent-lab/

Modules 12–13 move this code into a microflame app. That finished version is `docbot-starter`, a separate download on the course page.

## Setup

You need Node.js 20 or newer and Docker (for the databases from Module 03 on).

```bash
npm install
cp .env.example .env          # add your keys; each module says which ones it needs
```

## Run it, module by module

| Module | Files | Try it | Needs |
| --- | --- | --- | --- |
| 00 | `hello.js`, `chat.js` | `node hello.js` | `ANTHROPIC_API_KEY` |
| 01 | `tools.js`, `agent.js` | `node agent.js` | |
| 02 | `schema.js`, `summarize.js`, `summary.baml` | `node summarize.js billing.md` | `summary.baml` needs [BAML](https://docs.boundaryml.com) |
| 03 | `embed.js`, `schema.sql`, `search.js`, `compare-models.js`, `chroma.js`, `qdrant.js`, `store.js` | `docker compose up -d`, `npm run ingest`, then `node compare-models.js` | `VOYAGE_API_KEY`, Docker |
| 04 | `rag-v0.js`, `chunk.js`, `ingest.js`, `answer.js`, `hybrid.js`, `rerank.js`, `llama-docbot.js` | `node ask.js "What is the refund window?"` | |
| 05 | `golden.json`, `eval.js`, `judge.js`, `promptfooconfig.yaml` | `npm run eval`, `npx promptfoo@latest eval` | |
| 06 | `traced-answer.js`, `cost.js` | `node traced-answer.js` | `LANGFUSE_*` |
| 07 | `state.js`, `graph.js`, `run.js`, `approval.js` | `node run.js`, `node approval.js` | |
| 08 | `mcp-server.js`, `mcp-client.js`, `claude_desktop_config.json` | `node mcp-client.js`, `npm run mcp:inspect` | |
| 09 | `simple-memory.js`, `mem0.js` | `node simple-memory.js`, `node mem0.js` | `MEM0_API_KEY` |
| 10 | `run-code.js`, `analyze-csv.js`, `data/orders.csv` | `node analyze-csv.js` | `E2B_API_KEY` |
| 11 | `fence.js`, `approval-gate.js`, `canary.js`, `attacks/` | `node approval-gate.js` | |

Module 03 searches the chunks that Module 04's `ingest.js` creates, so run `npm run ingest` once after `docker compose up -d`.

The sample documents in `docs/` belong to Acme Home, a fictional store. `golden.json` has 32 questions written for them.

## How these files differ from the lessons

Each file starts with the lesson it comes from and a link to it. The lesson code itself is unchanged, except for lines marked `// [added]`: imports and small helpers so the file runs on its own (lessons show only the new part), and a "try it" block at the end of files that only export functions.

Written for this download, not shown in the lessons:

- `stores/` and `ingest-store.js`: the three stores that Module 03's `store.js` imports.
- `ask.js`: ask DocBot from the terminal (Module 04).
- `analyze-csv.js`: the Module 10 project (agent loop + `run_python` in E2B).
- the `list_files` tool at the end of `tools.js`: the Module 01 project.

`package.json` has an `overrides` entry so mem0ai uses the same `@anthropic-ai/sdk` as the rest of DocBot; Module 09 shows the one command that adds it. The Docker images are pinned to the versions this project was tested with.

## Tips

- `ingest.js` replaces each document's chunks, so you can run it again after editing `docs/`. To start completely over: `docker compose down -v && docker compose up -d`, then `npm run ingest`.
- Scripts that use Postgres stay open a few seconds after printing, until the connection pool closes.
- For Claude Desktop, put the full path to `mcp-server.js` in `claude_desktop_config.json` and fill in its `env` block: Claude Desktop starts the server from its own folder, so your `.env` isn't found.
- Port 5432, 8000 or 6333 already taken? Change the left side of `ports` in `docker-compose.yml`, and the matching URL (`DATABASE_URL`, `new ChromaClient({ port })`, or the Qdrant `url`).
