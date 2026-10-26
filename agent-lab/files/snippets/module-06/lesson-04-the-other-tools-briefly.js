// the proxy idea (Helicone-style)
// Instead of calling Anthropic directly, call through a logging proxy
const client = new Anthropic({
  baseURL: "https://your-logging-proxy.example.com", // the proxy forwards and records
});
