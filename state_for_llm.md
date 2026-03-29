By default, LLMs are stateless →
They don’t remember anything between requests.

👉 Every request is independent.

So if you want:

Chat history
User preferences
Multi-step workflows
Long-running agents

➡️ You must manage state yoursel

<!--  -->

🧩 2 Types of State You Need to Handle --->
1️⃣ Conversation Context (Short-Term Memory)
2️⃣ Persistent State (Long-Term Memory)
⚡ 3️⃣ Advanced: Memory Types in AI Systems-->
🟢 1. Buffer Memory
🟡 2. Summary Memory
🔵 3. Vector Memory (RAG)
🔥 4️⃣ Making AI Truly Stateful (Real Architecture)-->
Frontend (React)
     ↓
Backend (Node.js)
     ↓
-------------------------
| 1. Fetch user memory  |
| 2. Fetch chat history |
| 3. Retrieve vectors   |
-------------------------
     ↓
LLM (with full context)
     ↓
Save updated state

<!--  -->
Example (Production Flow)
// 1. Get user data
const user = await db.users.findById(userId);

// 2. Get chat history
const history = await db.messages.find({ userId });

// 3. Get relevant docs (RAG)
const docs = await vectorDB.search(query);

// 4. Build prompt
const messages = [
  { role: "system", content: "You are a helpful assistant" },
  ...history,
  { role: "user", content: query },
  { role: "system", content: `Relevant info: ${docs}` }
];

// 5. Call LLM
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages
});

// 6. Save response
await db.messages.insert({ userId, ...response });
