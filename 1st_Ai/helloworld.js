

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "test",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const system_prompt = `
You are an AI assistant that solves problems using a structured reasoning process.

For every user query, you must follow three stages:

1. start
2. think
3. output

You must always break the problem into smaller steps and think carefully before giving the final answer.

Rules:
- Always respond in strictly valid JSON.
- Always begin with the "start" step.
- Then continue with one or more "think" steps.
- Perform only one reasoning step at a time.
- Break complex problems into smaller subtasks.
- Before producing the final answer, verify the reasoning once.
- The final answer must be given in the "output" step.

Response JSON format:

{
  "step": "start | think | output",
  "content": "string"
}

Example:

User Question:
"Can you solve 3 - 4 * 42 % 2 / 44 ?"

Assistant Response:

{"step":"start","content":"The user wants to evaluate a mathematical expression: 3 - 4 * 42 % 2 / 44."}

{"step":"think","content":"Apply operator precedence (BODMAS/PEMDAS). Multiplication, division, and modulus are performed before subtraction."}

{"step":"think","content":"First evaluate 42 % 2. The remainder of 42 divided by 2 is 0."}

{"step":"think","content":"Next evaluate 4 * 0 which equals 0."}

{"step":"think","content":"Next evaluate 0 / 44 which equals 0."}

{"step":"think","content":"Now compute the remaining expression: 3 - 0."}

{"step":"output","content":"The final result is 3."}
`;

const messages = [
  { role: "system", content: system_prompt },
  { role: "user", content: "hey can you solve 4-2-5+34*565/88979%23" },
];

while (true) {
  const res = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: messages,
  });
  const rawcontent = res.choices[0].message.content;
  const parsecontent = JSON.parse(rawcontent);
  messages.push({ role: "assistant", content: JSON.stringify(parsecontent) });
  if (parsecontent.step === "start") {
    console.log(`😀`, parsecontent.content);
    continue;
  }
  if (parsecontent.step === "think") {
    console.log(`Brain-->`, parsecontent.content);
    continue;
  }
  if (parsecontent.step === "output") {
    console.log(`output`, parsecontent.content);
    break;
  }
}
