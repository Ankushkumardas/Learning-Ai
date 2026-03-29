import { Agent, run, tool } from "@openai/agents";

// load mesaegs from DB
let database = [];

const customerAgent = new Agent({
  name: "customerSupportAgent",
  instructions: `
    You are a customer support agent for a telecom company.
    Your job is to answer customer queries about billing, plans, and services.
    Be polite, professional, and helpful.
    If you cannot answer a question, say so and offer to transfer the customer to a human agent.
    `,
});

async function runAgent(query = "") {
  //to keep a conetxt ror history pf previous conversation we can use checpoint and thread in langGraph
  //and in agent sdk we can use thi sbelow
  //   const res = await run(customerAgent, query);
  const res = await run(
    customerAgent,
    database.concat({ role: "user", content: query }),
  );
  //after this above step teh databse will have the query and teh context with the role and also in the next line will also have teh previous fata with teh hostory of teh resukt to
  database = res.history;
  console.log(res.finalOutput);
}

runAgent("hey how are you!I am Rahul").then(() => {
  runAgent("what is my name?");
});

//agent SDK is also stateless
// untill an unless it is doing multiple task and actions it has teh context of all information but once it is over is has no context empty of teh previous info
