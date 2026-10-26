// a homemade tracer
async function step(name, fn) {
  const start = Date.now();
  const result = await fn();
  console.log("[" + name + "]", Date.now() - start, "ms");
  return result;
}

const pieces = await step("search", () => search(question));
const reply  = await step("answer", () => callModel(pieces, question));
