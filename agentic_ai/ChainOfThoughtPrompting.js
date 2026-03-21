import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Testing this specific base URL for stability
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const system_prompt = "You are an AI assistant using START, THINK, EVALUATE, OUTPUT format. Output ONLY valid JSON for each step. Format: {\"step\":\"...\", \"content\":\"...\"}";

  const messages = [
    { role: "system", content: system_prompt },
    { role: "user", content: "Solve 234+425-123*11/2%3 exactly." },
  ];

  while (true) {
    try {
      console.log("   --- Requesting step... ---");
      await sleep(6000); 

      const response = await openai.chat.completions.create({
        model: "gemini-1.5-flash-latest", 
        messages: messages,
      });

      let rawContent = response.choices[0].message.content.trim();
      // Clean markdown if AI insists on it
      if (rawContent.includes("```")) {
        rawContent = rawContent.split("```")[1].replace(/^json\n?/, "").trim();
      }

      const parsed = JSON.parse(rawContent.split("\n")[0]);
      messages.push({ role: "assistant", content: JSON.stringify(parsed) });

      if (parsed.step === "START") {
        console.log("START👉", parsed.content);
      } else if (parsed.step === "THINK") {
        console.log("THINK🧠", parsed.content);

        console.log("   --- (Reviewing Log step...) ---");
        await sleep(4000); 
        const reviewResponse = await openai.chat.completions.create({
          model: "gemini-1.5-flash-latest",
          messages: [
            { role: "system", content: "Review logic. JSON only: {\"step\":\"EVALUATE\", \"content\":\"...\"}" },
            { role: "user", content: `Review this thinking step: ${parsed.content}` }
          ],
        });

        let reviewRaw = reviewResponse.choices[0].message.content.trim();
        if (reviewRaw.includes("```")) {
            reviewRaw = reviewRaw.split("```")[1].replace(/^json\n?/, "").trim();
        }
        
        const review = JSON.parse(reviewRaw.split("\n")[0]);
        console.log("EVALUATE🧐", review.content);
        messages.push({ role: "user", content: `Reviewer analysis: ${review.content}` });

      } else if (parsed.step === "EVALUATE") {
        console.log("EVALUATE🧐", parsed.content);
      } else if (parsed.step === "OUTPUT") {
        console.log("OUTPUT🎅", parsed.content);
        return;
      }
    } catch (error) {
      if (error.status === 429) {
        console.log("Rate limit (429). Waiting 25s...");
        await sleep(25000);
        continue;
      }
      console.error("Error encountered:", error.message);
      if (error.status === 404) {
          console.log("Switching baseURL to trial v1beta...");
          openai.baseURL = "https://generativelanguage.googleapis.com/v1beta";
          continue;
      }
      break;
    }
  }
}

main();
