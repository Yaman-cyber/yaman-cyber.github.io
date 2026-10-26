// judge.js
export async function judge(question, sources, reply) {
  const res = await client.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 10,
    system: "You grade answers. Reply with only PASS or FAIL.",
    messages: [{ role: "user", content:
      "Sources:\n" + sources + "\n\nQuestion: " + question + "\nAnswer: " + reply +
      "\n\nPASS only if every claim in the answer is supported by the sources." }],
  });
  return res.content[0].text.trim() === "PASS";
}
