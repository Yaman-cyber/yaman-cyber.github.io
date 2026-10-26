// summary.baml (BAML's own language)
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
