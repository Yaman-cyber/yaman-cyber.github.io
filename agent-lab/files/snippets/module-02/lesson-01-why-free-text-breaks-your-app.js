// the fragile way
const reply = "The total comes to AED 1,250.00, due next week.";

const total = Number(reply.match(/\d+/)[0]); // → 1   (oops: "1,250" has a comma)
// Tomorrow the AI writes "one thousand two hundred fifty" and this crashes.
