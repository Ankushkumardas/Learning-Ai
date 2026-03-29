import { Agent, run, tool } from "@openai/agents";
import { query } from "express";
import { z } from "zod";

let database = [];

//math agent
const mathagent = new Agent({
  name: "math agent",
  instructions: `heck if user is asking over math question`,
  outputType: z.object({
    ismathHomework: z
      .boolean()
      .describe("set thi sto true of it is a math homework"),
  }),
});

//guardRail
const InputMathGuardRail = {
  name: "mathGuardRail",
  execute: async ({ input }) => {
    //process over this input
    const res = await run(mathagent, input);
    return {
      tripwireTriggered: res.finalOutput.ismathHomework ? true : false,
    };
  },
};

const customerSupportAgent = new Agent({
  name: "customer_support_agent",
  instructions: "You are a helpful assistant for customer support agent",
  inputGuardrails: [InputMathGuardRail],
});

async function runAgent(query) {
  const res = await run(
    customerSupportAgent,
    database.concat({ role: "user", context: query }),
  );
  console.log(res.finalOutput);
}

runAgent("hello");

// we can also bypass gueardrails by prompt injections
