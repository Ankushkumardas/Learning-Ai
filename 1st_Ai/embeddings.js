import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { GoogleGenAI } from "@google/genai";

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: "What is the meaning of life?",
  });

  console.log(response.embeddings);
}

main();

//positonal encodding -->initially it wwill set postiosn for vector embeddings
// Dog chase cat 
//cat chase dog

//self attention --> let vector talk to each other and position teh vectors accoding to context as if -
//A river bank
//a icici bank 
//both same banks but diffetnt meaninag adn with self attendtion in teh vector embedding teh move to diffent places acornf to teh conetxt adn also lest them to update themseleevs acco. to conext 

//multi head attention-->see about teh diffent aspect sof teh conditon or scenario see vecotr embeddings in multiple aspects for better context

//transformer-->training phase, inferance (using phase)