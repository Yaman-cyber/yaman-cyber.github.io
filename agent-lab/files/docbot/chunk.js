// Agent Lab · Module 04 · Lesson 2: Chunking: cut docs into pieces
// https://yaman-cyber.github.io/agent-lab/m4/#m4-l1

// No imports needed: plain JavaScript
export function chunk(text, size = 800, overlap = 150) {
  const chunks = [];
  for (let start = 0; start < text.length; start += size - overlap) {
    chunks.push(text.slice(start, start + size));
  }
  return chunks;
}
