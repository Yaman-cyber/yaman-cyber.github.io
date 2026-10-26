// closeness between two vectors
// Cosine similarity: 1 = same meaning, 0 = unrelated
function similarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

similarity([0.9, 0.1], [0.8, 0.2]); // 0.99 → very similar
