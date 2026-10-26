// approval.js
import { interrupt, Command } from "@langchain/langgraph";

const approve = async (state) => {
  const answer = interrupt({ draft: state.draft });   // pauses here
  return answer === "approve" ? {} : { notes: ["Reviewer rejected the draft. Research more."] };
};

// first call runs until the pause...
await graph.invoke({ question: "How do refunds work?" }, config);
// ...a human reviews, then you resume with their answer: "approve" or "reject"
await graph.invoke(new Command({ resume: "approve" }), config);
