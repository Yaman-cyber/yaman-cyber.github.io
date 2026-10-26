// tool definition
{
  name: "run_python",
  description: "Run Python code to analyze the user's CSV at /home/user/data.csv. Print the results you need.",
  input_schema: {
    type: "object",
    properties: { code: { type: "string" } },
    required: ["code"],
  },
}
