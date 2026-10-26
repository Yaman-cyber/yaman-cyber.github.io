// Agent Lab · Module 02 · Lesson 5: Other tools, briefly
// https://yaman-cyber.github.io/agent-lab/m2/#m2-l4

class DocSummary {
  title string
  topics string[]
}

function Summarize(doc: string) -> DocSummary {
  client "anthropic/claude-sonnet-5-5"
  prompt #"
    Summarize this document: {{ doc }}
    {{ ctx.output_format }}
  "#
}
