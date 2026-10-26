// embed.js
export async function embed(texts, inputType) {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.VOYAGE_API_KEY,
    },
    body: JSON.stringify({ input: texts, model: "voyage-3.5", input_type: inputType }),
  });
  const json = await res.json();
  return json.data.map(d => d.embedding);   // one vector (1,024 numbers) per text
}
