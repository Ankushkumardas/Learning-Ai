import { Agent, run } from "@openai/agents";
import dotenv from "dotenv";
dotenv.config();

const cookingAgent = new Agent({
   //   model: "gpt-4o",
  name: "Cooking Agent",
  //instructions are the system prompt
  instructions: `
You are a cooking assistant.
Give step-by-step recipes.
Keep it simple and beginner-friendly.
Use bullet points.
`,
});

async function Chat(query) {
  const result = await run(cookingAgent, query);
  console.log(result);
}
Chat("  How to make mocha");
