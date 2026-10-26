// rough token math
// Rule of thumb for English: 1 token ≈ 4 characters
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

estimateTokens("Hello, how are you today?"); // ≈ 7 tokens
