function chunk(text, size = 800, overlap = 150) {
  const chunks = [];
  for (let start = 0; start < text.length; start += size - overlap) chunks.push(text.slice(start, start + size));
  return chunks;
}
module.exports = { chunk };
