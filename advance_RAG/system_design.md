<!-- an advanced RAG pipeline with query refinement + chunk validation loop (this is actually 🔥 interview-level stuff). -->

🧠 What you’re building (Layman)
👉 A smart AI search system that:
Fixes user question
Finds best data
Double-checks if data is useful
If not → retries smarter
Then gives final answer

User Query
   ↓
Query Translation (LLM improves query)
   ↓
Embedding Model
   ↓
Vector DB Search (get chunks)
   ↓
Judge LLM (check relevance)
   ↓
IF chunks < 2 → retry (loop 🔁)
   ↓
Final Context
   ↓
Answer LLM
   ↓
Response to User


async function ragPipeline(userQuery) {
  let attempts = 0;
  let relevantChunks = [];

  while (attempts < 3) {
    // 1. Query Translation
    const refinedQuery = await llmRefine(userQuery);

    // 2. Embedding
    const embedding = await getEmbedding(refinedQuery);

    // 3. Vector Search
    const chunks = await vectorDB.search(embedding);

    // 4. Judge Model
    relevantChunks = await judgeChunks(refinedQuery, chunks);

    if (relevantChunks.length >= 2) {
      break;
    }

    attempts++;
  }

  // 5. Final Answer
  const answer = await generateAnswer(userQuery, relevantChunks);

  return answer;
}