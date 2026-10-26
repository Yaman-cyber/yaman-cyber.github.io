module.exports = {
  definition: {
    name: "get_exchange_rate",
    description: "Get today's exchange rate between two currencies. Use it for any currency conversion question.",
    input_schema: {
      type: "object",
      properties: {
        from: { type: "string", description: "3-letter currency code, e.g. USD" },
        to: { type: "string", description: "3-letter currency code, e.g. AED" },
      },
      required: ["from", "to"],
    },
  },
  needsApproval: false,

  async run({ from, to }) {
    const base = encodeURIComponent(from.toUpperCase());
    const res = await fetch("https://open.er-api.com/v6/latest/" + base, {
      signal: AbortSignal.timeout(5000),            // give up after 5 seconds
    });
    if (!res.ok) return "Exchange rate service unavailable (status " + res.status + ").";

    const data = await res.json();
    const rate = data.rates?.[to.toUpperCase()];
    if (!rate) return "Unknown currency code: " + to;

    return JSON.stringify({ from, to, rate, updated: data.time_last_update_utc });
  },
};

// The model then does the math itself:
// "250 USD is about 918 AED at today's rate of 3.6725."
