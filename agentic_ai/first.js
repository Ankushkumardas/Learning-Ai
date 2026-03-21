import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",

      messages: [
        {
          role: "system",
          content:
            "You are a helpful javascript assistant and will always give responce in ocntext of js only and if question is asked out of js context just say out of conetxt question asked and give all teh answers under 10 words always",
        },
        { role: "user", content: "write a simple code to add 2 numbers ?" },
      ],
    });

    console.log("Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
