// chat.js
const messages = [
  { role: "user", content: "My name is Yaman." },
  { role: "assistant", content: "Nice to meet you, Yaman!" },
  { role: "user", content: "What's my name?" }, // works only because we resent the history
];

const res = await client.messages.create({
  model: "claude-sonnet-5-5",
  max_tokens: 200,
  system: "You are DocBot, a friendly assistant. Keep answers short.",
  messages,
});
