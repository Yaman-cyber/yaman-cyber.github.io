// an eval is just a test
const reply = await answer("What is the refund window?");

if (!reply.includes("30 days")) {
  throw new Error("FAIL: refund window answer is wrong");
}
