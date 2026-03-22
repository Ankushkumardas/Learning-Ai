import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

async function chat(query) {
  const embeddings = new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    apiKey: process.env.HF_API_KEY,
    provider: "hf-inference",
  });

  const vectorstore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "nodejscollection",
    },
  );

  //k is used to get teh relevant 3 chunks from teh vector db and teh content too with teh  chunk

  const retriever = vectorstore.asRetriever({ k: 3 });
  const docs = await retriever.invoke(query);

  const contextText = docs.map((doc) => doc.pageContent).join("\n\n");
 
  const systemprompt = `
You are an AI assistant.
Answer ONLY from the given context.
If not found, say "Not in document".

Context:
${contextText}

`;

  const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  });

  const response = await openai.chat.completions.create({
    model: "gemini-flash-latest",
    messages: [
      { role: "system", content: systemprompt },
      { role: "user", content: query },
    ],
  });

  console.log("AI:-->", response.choices[0].message.content);
}

chat("what is debugging in node js?");
