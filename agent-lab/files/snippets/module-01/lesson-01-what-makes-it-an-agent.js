// the agent loop, in plain words
while (true) {
  const reply = await askTheModel(messages);
  if (reply.isDone) return reply.text;          // finished
  const result = await runTheTool(reply.tool);  // it asked for a tool
  messages.push(result);                        // show it the result, go again
}
