import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";
import { exec } from "child_process";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// 🌤️ Weather Tool
async function getWeatherDetails(city) {
  const url = `https://wttr.in/${city}?format=%t`;
  const { data } = await axios.get(url, { responseType: "text" });
  return data;
}

// 💻 Command Tool
async function executeCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return resolve(`Command Failed: ${err.message}`);
      return resolve(stdout || stderr || "Success");
    });
  });
}

async function main() {
  // 🔥 IMPROVED SYSTEM PROMPT
  const system_prompt = `
You are an AI assistant with access to tools.

Follow STRICT JSON format only:
{
  "step": "START | THINK | TOOL | OUTPUT",
  "content": "your message",
  "tool": "optional tool name",
  "input": "tool input"
}

Rules:
- START: Understand the question
- THINK: Decide what to do
- TOOL: Call a tool if needed
- OUTPUT: Final answer

Tools available:
1. getWeatherDetails(city) → returns temperature
2. executeCommand(cmd) → runs terminal command

IMPORTANT:
- Use TOOL only when needed
- If no tool needed → go directly to OUTPUT
- Always return valid JSON (no text outside JSON)
- You are running on a Windows system. Use appropriate Windows shell commands.
`;

  const messages = [
    { role: "system", content: system_prompt },
    {
      role: "user",
      content:
        "hey create a folder named todo app and make a simple todo application using html css and javascript which does simple crud operations ?",
    },
  ];

  while (true) {
    try {
      const response = await openai.chat.completions.create({
        // model: "nvidia/nemotron-3-super-120b-a12b:free",
        model: "gemini-3.1-flash-lite-preview",
        messages,
      });

      const rawContent = response.choices[0].message.content;

      let parsed;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        console.log("❌ Invalid JSON from model:", rawContent);
        break;
      }

      messages.push({
        role: "assistant",
        content: JSON.stringify(parsed),
      });

      // 🧠 STEP HANDLING
      if (parsed.step === "START") {
        console.log("START 👉", parsed.content);
        continue;
      }

      if (parsed.step === "THINK") {
        console.log("THINK 🧠", parsed.content);
        continue;
      }

      // 🛠️ TOOL EXECUTION
      if (parsed.step === "TOOL") {
        let result;

        try {
          if (parsed.tool === "getWeatherDetails") {
            result = await getWeatherDetails(parsed.input);
          } else if (parsed.tool === "executeCommand") {
            result = await executeCommand(parsed.input);
          } else {
            result = "Unknown tool";
          }
        } catch (toolErr) {
          result = "Tool Error: " + (toolErr.message || String(toolErr));
        }

        console.log("TOOL ⚙️", result);

        // Send tool result back to LLM
        messages.push({
          role: "user",
          content: JSON.stringify({
            step: "TOOL_RESULT",
            content: result,
          }),
        });

        continue;
      }

      if (parsed.step === "OUTPUT") {
        console.log("OUTPUT 🎯", parsed.content);
        break;
      }
    } catch (error) {
      console.log("Full Error:", error);
      console.log("Error message:", error?.message || error);
      break;
    }
  }
}

main();
