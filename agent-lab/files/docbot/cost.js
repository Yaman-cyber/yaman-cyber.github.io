// Agent Lab · Module 06 · Lesson 3: Know your cost per question
// https://yaman-cyber.github.io/agent-lab/m6/#m6-l2

// prices are per 1 million tokens; fill in today's numbers
const PRICE = { input: 3.00, output: 15.00 };

export function costOf(usage) {
  return (usage.input_tokens * PRICE.input + usage.output_tokens * PRICE.output) / 1_000_000;
}

costOf({ input_tokens: 4000, output_tokens: 300 }); // ≈ $0.0165 per question
