

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const system_prompt = `
You are an AI planner that solves tasks using structured steps.

You MUST respond in strict JSON.

Available steps:

start      → understand the problem
think      → break problem into smaller reasoning steps
code       → generate code for solving the task
evaluate   → compute or execute a result
review     → verify correctness
output     → final answer

Rules:

- Only perform ONE step at a time
- If programming is required → use "code"
- If calculation or result interpretation is needed → use "evaluate"
- Always do "review" before "output"

JSON format:

{
 "step": "start | think | code | evaluate | review | output",
 "content": "string"
}

When using code step:
Return only executable code.

When using evaluate step:
Return the expression or instruction to compute.
`;

const MAIN_MODEL = "gemini-2.0-flash";
const CODE_MODEL = "gemini-1.5-pro";
const EVAL_MODEL = "gemini-2.0-flash";

const messages = [
  { role: "system", content: system_prompt },
  { role: "user", content: "solve 4-2-5+34*565/88979%23" }
];

const history = [];

async function callModel(model, msgs) {
  const res = await client.chat.completions.create({
    model,
    messages: msgs
  });

  return res.choices[0].message.content;
}

async function runAgent() {

  while (true) {

    // MAIN MODEL (Planner)
    const raw = await callModel(MAIN_MODEL, messages);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.log("Invalid JSON:", raw);
      break;
    }

    messages.push({
      role: "assistant",
      content: JSON.stringify(parsed)
    });

    history.push(parsed);

    const { step, content } = parsed;

    if (step === "start" || step === "think") {
      console.log("🧠", step.toUpperCase(), content);
      continue;
    }

    // CODE STEP → call coding model
    if (step === "code") {

      console.log("💻 Generating code...");

      const codeResult = await callModel(
        CODE_MODEL,
        [{ role: "user", content }]
      );

      console.log("CODE RESULT:\n", codeResult);

      messages.push({
        role: "assistant",
        content: JSON.stringify({
          step: "code_result",
          content: codeResult
        })
      });

      continue;
    }

    // EVALUATE STEP → call evaluation model
    if (step === "evaluate") {

      console.log("📊 Evaluating...");

      const evalResult = await callModel(
        EVAL_MODEL,
        [{ role: "user", content }]
      );

      console.log("EVALUATION:", evalResult);

      messages.push({
        role: "assistant",
        content: JSON.stringify({
          step: "evaluation_result",
          content: evalResult
        })
      });

      continue;
    }

    if (step === "review") {
      console.log("🔍 Review:", content);
      continue;
    }

    if (step === "output") {
      console.log("✅ FINAL:", content);
      break;
    }

  }
}

runAgent();