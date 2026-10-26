// DocBot today
docbot/
├─ agent.js        # loop + tools + prompt, all mixed
├─ answer.js       # creates its own Anthropic client
├─ chunk.js
├─ embed.js        # reads process.env.VOYAGE_API_KEY
├─ eval.js
├─ golden.json
├─ graph.js
├─ hybrid.js       # creates its own pg Pool
├─ ingest.js       # creates another pg Pool
├─ mcp-server.js
├─ rerank.js       # reads process.env.VOYAGE_API_KEY again
├─ search.js       # and another pg Pool
├─ state.js
├─ tools.js
└─ .env
