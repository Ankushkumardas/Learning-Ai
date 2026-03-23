// import dotenv from "dotenv";
// import { HfInference } from "@huggingface/inference";
// import { StateGraph } from "@langchain/langgraph";

// dotenv.config();

// const hf = new HfInference(process.env.API);

// // ✅ LLM NODE (THIS IS WHERE HF SHOULD BE CALLED)
// async function callLLMNode(state) {
//   console.log("Incoming State -->", state);

//   const response = await hf.chatCompletion({
//     model: "Qwen/Qwen3-Coder-Next:novita",
//     messages: [
//       {
//         role: "user",
//         content: state.messages[state.messages.length - 1] || "Hello",
//       },
//     ],
//   });

//   const aiMessage = response.choices[0].message.content;

//   return {
//     messages: [...state.messages, aiMessage], // ✅ update state properly
//   };
// }

// // ✅ CREATE GRAPH
// const workflow = new StateGraph({
//   channels: {
//     messages: {
//       value: (x, y) => x.concat(y), // merge messages
//       default: () => [],
//     },
//   },
// });

// workflow.addNode("huggingFaceAi", callLLMNode);

// workflow.addEdge("__start__", "huggingFaceAi");
// workflow.addEdge("huggingFaceAi", "__end__");

// const graph = workflow.compile();

// // ✅ RUN GRAPH
// async function runGraph() {
//   const updatedState = await graph.invoke({
//     messages: ["Explain LangGraph simply"],
//   });

//   console.log("Final State -->", updatedState);
// }

// runGraph();


// <----!  !---->


import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";

dotenv.config();

// const hf = new HfInference(process.env.API);
// const response = await hf.chatCompletion({
//   model: "Qwen/Qwen3-Coder-Next:novita"
// });

// const graphAnnotation = Annotation.Root({
//   messages: Annotation({
//     reducer: (x, y) => x.concat(y),
//     default: () => [],
//   }),
// });

async function callLLM(state) {
  console.log("Insode LLM Node -->", state);
  return {
    messages: ["i just updated the state"],
  };
}

async function callAfterLLm(state) {
  console.log("Inside CAllAfterLLm", state);
  return { messages: ["i just udated CallAfterLLm"] };
}
const workflow = new StateGraph(MessagesAnnotation);
workflow.addNode("callLLM", callLLM); //will register a node
workflow.addNode("callAfterLLm", callAfterLLm); //will register a node
workflow.addEdge("__start__", "callLLM");
workflow.addEdge("callLLM", "callAfterLLm");
workflow.addEdge("callAfterLLm", "__end__");

//this will compile teh whole graph
const graph = workflow.compile();

async function runGraph() {
  const updatedState = await graph.invoke({
    messages: [],
  });
  console.log("Final State -->", updatedState);
}

runGraph();
