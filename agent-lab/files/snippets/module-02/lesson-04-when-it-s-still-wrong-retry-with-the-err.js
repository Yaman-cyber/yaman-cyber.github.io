// retry pattern
let feedback = "";
for (let attempt = 1; attempt <= 3; attempt++) {
  const input = await callModel(docText + feedback);     // the call from the last lesson
  const result = DocSummary.safeParse(input);
  if (result.success) return result.data;
  feedback = "\n\nYour last answer was invalid: " + result.error.message + ". Fix it.";
}
throw new Error("Could not get a valid summary");
