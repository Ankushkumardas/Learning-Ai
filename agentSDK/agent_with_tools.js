import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import dotenv from "dotenv";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
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
  tools: [weatherTool],
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
  tools: [cookingAgent.asTool(), codingtool],
  instructions: `
    You are a coding assistant.
    Give step-by-step code in js.
    Keep it simple and beginner-friendly.
    Use bullet points.
    `,
});

//thi sagent will tell to tak or pass teh request to which agent to process teh query --> agent to agent
const GatewayAgent = Agent.create({
  name: "gaetwayagent",
  //if you do nto want to write thi sinstruction for all the agenst that you make and everytime we have a built in soltion
  // "RECOMMENDED_PROMPT_PREFIX"
  instructions: `${RECOMMENDED_PROMPT_PREFIX}
  you have a list of handoffs which you need to use to handoff the current user query  to us eteh agent.
     you can use teh codingAgent if teh user asks query relaetd to coding and if query asks for cooking you can use teh cookingAgent `,
  handoffs: [cookingAgent, codingAgent],
});

async function ChatwithAgent(query) {
  //   const result = await run(cookingAgent, query);
  const result = await run(GatewayAgent, query);
  console.log(result);
  console.log(result.history);
  console.log(result.lastAgent.name);
}
ChatwithAgent(" I want to know teh weather of Assam?");
// -->will call the weather tool and get teh weather info
ChatwithAgent("I want to cook biryani");
// -->simple will give you teh recipe
ChatwithAgent("write a code for bubble sort in js");
// -->will call the coding agent and get teh code
