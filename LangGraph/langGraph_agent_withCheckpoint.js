import { MemorySaver } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";

// Define STATE
const State = {
  messages: [],
  currentStep: "",
  toolResult: "",
};

// Create Steps (Nodes)
// Step 1: Think
async function think(state) {
  console.log("Thinking...");

  return {
    ...state,
    currentStep: "tool",
    messages: [...state.messages, "AI: I will call a tool"],
  };
}

// Step 2: Tool
async function callTool(state) {
  console.log("Calling tool...");

  return {
    ...state,
    toolResult: "Weather is 30°C",
    currentStep: "final",
  };
}

// Step 3: Final Answer
async function finalAnswer(state) {
  console.log("Generating final answer...");

  return {
    ...state,
    messages: [...state.messages, `AI: Final Answer → ${state.toolResult}`],
    currentStep: "done",
  };
}

// Add CHECKPOINTING
const checkpointer = new MemorySaver();
// 👉 This automatically saves state after every step

// Create Graph

const graph = new StateGraph();

// Add nodes
graph.addNode("think", think);
graph.addNode("tool", callTool);
graph.addNode("final", finalAnswer);

// Define flow
graph.setEntryPoint("think");

graph.addEdge("think", "tool");
graph.addEdge("tool", "final");

// Compile with checkpointing
const app = graph.compile({
  checkpointer,
});

// Run Workflow
const initialState = {
  messages: ["User: What's the weather?"],
  currentStep: "think",
  toolResult: "",
};

// Run
await app.invoke(initialState);

// 🔥 Now the IMPORTANT PART (How checkpoint helps)
// Suppose this happens:
// Thinking... ✅ (saved)
// Calling tool... ❌ (crash here)
// 🔄 Resume from checkpoint
// await app.invoke(null, {
//   configurable: { thread_id: "1" }
// });

// 👉 LangGraph will:

// Load last saved state
// See currentStep = "tool"
// Continue from tool step
// 🧠 What was actually saved?

// After "think" step:

// {
//   messages: [
//     "User: What's the weather?",
//     "AI: I will call a tool"
//   ],
//   currentStep: "tool",
//   toolResult: ""
// }

// 👉 This is the checkpoint

// ❌ If you only saved last message
// "AI: I will call a tool"

// 👉 You wouldn’t know:

// Next step
// Tool result
// Workflow position
// ✅ But with checkpoint

// You know:

// Where you are → "tool"
// What to do next
// Full history
// ⚡ Real-world version (what YOU should do)

// Instead of MemorySaver, use DB:

// const checkpointer = new PostgresSaver();

// 👉 So even if server restarts → state is safe

// 🧠 Super Simple Summary

// 👉 Each step:

// Runs logic
// Updates state
// LangGraph saves it

// 👉 If crash:

// Reload state
// Continue from currentStep
