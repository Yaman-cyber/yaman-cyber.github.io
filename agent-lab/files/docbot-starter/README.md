# DocBot starter · Agent Lab

The finished DocBot project from the **Agent Lab** course (Modules 12–13), plus everything you need to practice: sample documents in English and Arabic, an orders CSV, an eval set, and prompt-injection test material.

These files sit **on top of** a microflame project. They are not a standalone app.

## 1. Create the project

```bash
npm install -g microflame
microflame init docbot-api
cd docbot-api && npm install
npm install @anthropic-ai/sdk @langchain/langgraph @langchain/anthropic pg zod socket.io
```

Then copy everything from this starter (folders and files) into `docbot-api/`, keeping the same paths.

## 2. Settings

`microflame init` doesn't create a `.env.development`, and `microflame add-env` only fills in `.env` files that already exist. So create it first:

```bash
cp .env.example .env.development
```

Put your Anthropic and Voyage keys in it. The database values already match `docker-compose.yml` (note the `@` at the start of `DB_HOST`: microflame joins the password and host directly). Then map each DocBot setting in config, which also adds a startup check for the required ones:

```bash
microflame add-env ANTHROPIC_API_KEY sk-ant-xxx anthropicKey true
microflame add-env VOYAGE_API_KEY pa-xxx voyageKey true
microflame add-env AI_MODEL claude-sonnet-5-5 aiModel true
microflame add-env VECTOR_DATABASE_URL postgres://postgres:pw@localhost:5432/postgres vectorDbUrl true
microflame add-env HELPDESK_URL https://your-helpdesk.example.com/api helpdeskUrl false
microflame add-env HELPDESK_KEY xxx helpdeskKey false
```

`add-env` writes the value you pass into `.env.development`, so use your real keys here (or re-copy them in afterwards).

## 3. Wire it into microflame

| File | Add |
| --- | --- |
| `index.js` | `require("./start/sockets")(server);` after `app.listen(...)` |
| `start/event.js` | `require("../events/ingest.event")(eventEmitter);` |
| `start/cron.js` | `schedule.scheduleJob("0 3 * * *", require("../crons/reindex.cron"));` |
| `constants/messages.json` | merge the keys from `constants/messages.additions.json` |
| `constants/events.json` | already includes the `docs.uploaded` event |
| `package.json` scripts | `"ingest": "node scripts/ingest.js"`, `"eval": "node scripts/eval.js"` |

## 4. Run it

```bash
docker compose up -d          # pgvector (with schema.sql) + MongoDB (with the docbot user)
npm run ingest                # index docs/ (safe to re-run: it replaces each doc's chunks)
npm run eval                  # run tests/evals/golden.json
npm run dev                   # API on http://localhost:3000
```

Port 5432 or 27017 already taken by a local Postgres or MongoDB? Change the left side of `ports` in `docker-compose.yml` (for example `"27018:27017"`) and the matching port in `.env.development`.

### Get a token and ask DocBot

microflame only gives a token to verified users, and its template has no verify endpoint yet. For local testing, sign up, mark yourself verified, and add a sample order for the order-status tool:

```bash
curl -X POST localhost:3000/api/v1/auth/signup -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret123"}'

docker compose exec mongo mongosh -u docbot -p pw docbot --quiet --eval '
  const u = db.users.findOneAndUpdate({ email: "you@example.com" }, { $set: { verifiedAt: new Date() } });
  db.orders.insertOne({ number: "ORD-10023", user: u._id, status: "delivered", total: 389, createdAt: new Date(), updatedAt: new Date() });'

curl -X POST localhost:3000/api/v1/auth/login -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret123"}'          # copy data.token
```

```bash
curl -X POST localhost:3000/api/v1/docbot/ask \
  -H "Content-Type: application/json" -H "authorization: <data.token>" \
  -d '{"question":"What is the refund window?"}'
```

Try `"What's the status of ORD-10023?"`, `"How much is 250 USD in AED?"`, and `"My order ORD-10023 arrived broken, please get someone to help me"`. The last one returns `"status": "pending"`; answer it with `POST /api/v1/docbot/decide` and `{ "threadId": "…", "approved": true }` (or `false`).

## What's inside

| Path | What it is | Module |
| --- | --- | --- |
| `docs/` | 11 sample company documents (7 English, 4 Arabic) DocBot answers from, for the fictional store Acme Home | 01, 03–04 |
| `data/orders.csv` | 23 sample orders for the sandbox "data analyst" exercise | 10 |
| `tests/evals/golden.json` | 32 golden questions, including Arabic and ones DocBot must refuse | 05 |
| `attacks/` | a poisoned document and injection prompts for red-teaming | 11 |
| `sql/schema.sql`, `docker-compose.yml` | local pgvector + MongoDB | 03 |
| `services/`, `helpers/`, `constants/prompts.js`, `scripts/` | the refactored DocBot core | 12 |
| `controllers/`, `routes/`, `validators/`, `start/sockets.js`, `events/`, `handlers/`, `crons/`, `models/` | the real-app layer | 13 |

`attacks/poisoned-review.md` contains a deliberate injection. Only copy it into `docs/` while doing the Module 11 exercise.

### The sample documents

| File | Language | Good for practicing |
| --- | --- | --- |
| `refunds.md`, `refunds-ar.md` | EN, AR | the course's own examples ("money back", the refund window) |
| `shipping.md`, `shipping-ar.md` | EN, AR | tables, cross-language search |
| `warranty.md`, `warranty-ar.md` | EN, AR | the same facts in two languages |
| `company-faq.md` | EN | many short answers in one file |
| `billing.md` | EN | hybrid search on exact codes like `INV-20931` (Module 04) |
| `privacy.md` | EN | memory you can see and delete (Module 09) |
| `assembly-and-installation.md` | EN | prices in tables |
| `expenses-policy-ar.md` | AR | an internal finance doc: metadata filters, English questions with Arabic-only answers |

Acme Home is a fictional company; every name, number and email address in these files is made up for practice.
