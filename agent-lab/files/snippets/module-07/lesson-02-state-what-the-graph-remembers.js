// state.js
import { Annotation } from "@langchain/langgraph";

export const State = Annotation.Root({
  question: Annotation(),
  notes: Annotation({
    reducer: (old, added) => old.concat(added), // append, don't replace
    default: () => [],
  }),
  draft: Annotation(),
});
