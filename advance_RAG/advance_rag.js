import "dotenv/config";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { documents } from "./data.js";

// ----------------------------
// 1. Initialize Models
// ----------------------------
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const embeddings = new OpenAIEmbeddings();

// ----------------------------
// 2. Setup Pinecone
// ----------------------------
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

// ----------------------------
// 3. Store Data in Pinecone (Run Once)
// ----------------------------
async function storeData() {
  console.log("Storing documents...");

  await PineconeStore.fromTexts(
    documents,
    documents.map(() => ({})), // metadata
    embeddings,
    {
      pineconeIndex: index,
    },
  );

  console.log("Data stored!");
}

// ----------------------------
// 4. Query Refinement
// ----------------------------
async function refineQuery(query) {
  const prompt = `
  Improve this query for better semantic search:
  "${query}"
  Return only improved query.
  `;

  const res = await llm.invoke(prompt);
  return res.content;
}

// ----------------------------
// 5. Retriever
// ----------------------------
async function getRetriever() {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  return vectorStore.asRetriever({
    k: 5,
  });
}

// ----------------------------
// 6. Judge (Relevance Filter)
// ----------------------------
async function judgeChunks(query, docs) {
  const context = docs
    .map((d, i) => `Chunk ${i + 1}: ${d.pageContent}`)
    .join("\n");

  const prompt = `
Query: ${query}

Below are chunks:
${context}

Return only the relevant chunk numbers as array.
Example: [1,2]
`;

  const res = await llm.invoke(prompt);

  try {
    const indices = JSON.parse(res.content);
    return indices.map((i) => docs[i - 1]);
  } catch {
    return [];
  }
}

// ----------------------------
// 7. MAIN RAG PIPELINE 🔥
// ----------------------------
async function advancedRAG(userQuery) {
  const retriever = await getRetriever();

  let attempts = 0;
  let relevantDocs = [];

  while (attempts < 3) {
    console.log(`\nAttempt ${attempts + 1}`);

    // Step 1: Refine Query
    const refinedQuery = await refineQuery(userQuery);
    console.log("Refined Query:", refinedQuery);

    // Step 2: Retrieve Docs
    const docs = await retriever.invoke(refinedQuery);
    console.log("Retrieved Docs:", docs.length);

    // Step 3: Judge
    relevantDocs = await judgeChunks(refinedQuery, docs);
    console.log("Relevant Docs:", relevantDocs.length);

    if (relevantDocs.length >= 2) break;

    attempts++;
  }

  // Step 4: Final Answer
  const finalContext = relevantDocs.map((d) => d.pageContent).join("\n");

  const finalPrompt = `
Answer the question using ONLY the context below.

Question: ${userQuery}

Context:
${finalContext}
`;

  const answer = await llm.invoke(finalPrompt);

  return answer.content;
}

// ----------------------------
// 8. RUN EVERYTHING 🚀
// ----------------------------
async function main() {
  // Run once to store data
  // await storeData();

  const question = "What is Docker?";

  const result = await advancedRAG(question);

  console.log("\nFinal Answer:\n", result);
}

main();
