a real working RAG pipeline using LangChain (step-by-step, simple + practical).

I’ll keep it MERN-friendly + Node.js style so you can actually build it 💻

🧠 What we are building

👉 Advanced RAG with:

Query refinement
Retrieval
Judge (relevance check)
Retry loop
Final answer
🧱 Tech Stack
LangChain (core logic)
OpenAI (LLM + embeddings)
Pinecone (vector DB)
📦 Step 1: Install dependencies
npm install langchain @langchain/openai @langchain/community pinecone-client dotenv
🔑 Step 2: Setup environment
OPENAI_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_INDEX=your_index
⚙️ Step 3: Initialize models
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const llm = new ChatOpenAI({
model: "gpt-4o-mini",
temperature: 0,
});

const embeddings = new OpenAIEmbeddings();
🧠 Step 4: Query Translation (Refinement)

👉 Improve user query

async function refineQuery(query) {
const prompt = `   Improve this query for better semantic search:
  "${query}"
  Return only improved query.
  `;

const res = await llm.invoke(prompt);
return res.content;
}
📚 Step 5: Vector DB (Retriever)
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";

const pinecone = new Pinecone({
apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
pineconeIndex: index,
});

const retriever = vectorStore.asRetriever({
k: 5, // get top 5 chunks
});
⚖️ Step 6: Judge Model (Relevance Check)
async function judgeChunks(query, docs) {
const context = docs.map((d, i) => `Chunk ${i + 1}: ${d.pageContent}`).join("\n");

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
return indices.map(i => docs[i - 1]);
} catch {
return [];
}
}
🔁 Step 7: RAG Loop (MAIN LOGIC 🔥)
async function advancedRAG(userQuery) {
let attempts = 0;
let relevantDocs = [];

while (attempts < 3) {
// 1. Refine Query
const refinedQuery = await refineQuery(userQuery);

    // 2. Retrieve Docs
    const docs = await retriever.invoke(refinedQuery);

    // 3. Judge Relevance
    relevantDocs = await judgeChunks(refinedQuery, docs);

    console.log(`Attempt ${attempts + 1}: Found ${relevantDocs.length} relevant docs`);

    if (relevantDocs.length >= 2) break;

    attempts++;

}

// 4. Final Answer
const finalContext = relevantDocs.map(d => d.pageContent).join("\n");

const finalPrompt = `
Answer the question using the context below.

Question: ${userQuery}

Context:
${finalContext}
`;

const answer = await llm.invoke(finalPrompt);

return answer.content;
}
🚀 Step 8: Run it
const result = await advancedRAG("What is Docker?");
console.log(result);
🔥 What you just built

👉 A production-level RAG system with:

✅ Query optimization
✅ Smart retrieval
✅ Relevance filtering
✅ Retry loop
✅ Accurate answers

🎯 Upgrade Ideas (VERY IMPORTANT for resume)

Add these to stand out 🚀

1️⃣ Add Memory (chat history)

Use LangChain memory

2️⃣ Add Streaming response

Better UX like ChatGPT

3️⃣ Add Hybrid Search

Combine:

Vector search
Keyword search
4️⃣ Add UI (React)
Chat UI
Show retrieved chunks
