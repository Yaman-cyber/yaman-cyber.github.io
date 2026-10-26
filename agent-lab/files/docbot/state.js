// Agent Lab · Module 07 · Lesson 2: State: what the graph remembers
// https://yaman-cyber.github.io/agent-lab/m7/#m7-l1

import { Annotation } from "@langchain/langgraph";

export const State = Annotation.Root({
  question: Annotation(),
  notes: Annotation({
    reducer: (old, added) => old.concat(added), // append, don't replace
    default: () => [],
  }),
  draft: Annotation(),
});
