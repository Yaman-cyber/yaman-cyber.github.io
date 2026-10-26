// simple-memory.js
const facts = {};   // userId -> [facts]  (use a database in real life)

export async function remember(userId, conversationText) {
  const res = await client.messages.create({
    model: "claude-sonnet-5-5", max_tokens: 200,
    messages: [{ role: "user", content:
      "List lasting facts about the user from this chat, one per line. Reply NONE if none.\n\n" + conversationText }],
  });
  const text = res.content[0].text.trim();
  if (text !== "NONE") facts[userId] = [...(facts[userId] || []), ...text.split("\n")];
}

export const systemFor = (userId) =>
  "You are DocBot. Known facts about this user:\n" + (facts[userId] || []).join("\n");
