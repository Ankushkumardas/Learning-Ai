import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const weatherTool = tool({
  name: "get_current_weather",
  description: "This tool gets the current weather of a city",
  parameters: z.object({}),
  execute: async () => {
    return "weather is sunny";
  },
});

const codingtool = tool({
  name: "get_coding",
  parameters: z.object({}),
  description: "this tool gives you the coding related answer",
  execute: async () => {
    return {
      code: "console.log('hello world')",
      language: "javascript",
    };
  },
});

const cookingAgent = new Agent({
  //   model: "gpt-4o",
  name: "Cooking Agent",
  //multi tool agents are hear depending on teh need will select the tool and use it and will generate teh responce
  tools: [weatherTool, codingtool],
  //instructions are the system prompt
  instructions: `
You are a cooking assistant and also you are an agent who give generic answer to user query apart from cooking recipies
Give step-by-step recipes.
Keep it simple and beginner-friendly.
Use bullet points.
`,
});

const codingAgent = new Agent({
  name: "Coding Agent",
  tools: [codingtool],
  instructions: `
    You are a coding assistant.
    Give step-by-step code in js.
    Keep it simple and beginner-friendly.
    Use bullet points.
    `,
});

//thi sagent will tell to tak or pass teh request to which agent to process teh query --> agent to agent
const GatewayAgent = new Agent.create({
  name: "gaetwayagent",
  instructions:
    "you determin which agent to choose to perform teh query of user accordngly ",
  handoffs: [cookingAgent, codingAgent],
});

async function ChatwithAgent(query) {
  //   const result = await run(cookingAgent, query);
  const result = await run(GatewayAgent, query);
  console.log(result);
}
ChatwithAgent(" I want to know teh weather of Assam?");
// -->will call the weather tool and get teh weather info
ChatwithAgent("I want to cook biryani");
// -->simple will give you teh recipe
ChatwithAgent("write a code for bubble sort in js");
// -->will call the coding agent and get teh code
