LLM ---> are stateless and not history or context is been saved in thi sstate or manner or we have to add a history /cached token as history each and every time we make a new call and append it to teh new call as context

<!--  -->

Context window is teh main issue -->with limit of 4k to 128k tokens

<!--  -->

Memory in AI agents -->

1.Short Term Memory--> Temporary memory (kitna temporary..) like session
we keep this messaegs in teh "Redis" in that in "List" and we have a Cron job that syncs.. our message in teh mongodb database
--> like making the context to store the last 50 message --> where it will have 25 of users and 25 of ai's responce/answer to query

2.Long Term Memory--> remembering name
we have 3 types-->
2.1. Factual Memory-->Really very very long term memory
2.2. Episodic Memory--> when we learn something from past events/episode based on an conversation or event
2.4. Semantic memory -->general knowledge not related to teh user as elon musk is teh ceo of x(twitter)

to solve teh issue related to long term memory --> the soltuion is -->
-->few short prompting + vecotr similarity + graphs

\*\*to understand in teh message session or cnversation to the llm to make sure what to keep in the long term what in teh short term what in teh factual /episodic/semantic memory --> we use an LLM with "Few Shot Prompting" and example and samples --> like hi STM , my name is Ank LTM, i preper to spek in englisg LTM and make teh LLM understand waht to keep in short term adn what to keep in teh long term than we --> if it is STM do nothing but if it is LTM than we need an LLM again to tell me if is Factual or Episodic or Semantic and store and use accordngly ---> with example for each we can train and make teh LLM smarter to strore them accodngly
if Fatucal --> (LLM) to extract teh facts ---> store in mongo db
if Episodic -->every mesage will be savedin teh vecotr DB--> (LLM) to extract teh episode ---> store in mongo db
if Semantic --> (LLM) to extract teh semantic ---> store in mongo db
above all a saving

now teh fetching part is as--->
Factual memory should be alwasy avalibale in teh system prompt

and like in teh new conversation teh user ask about teh past event or episode or factual or semantic memory --> we use teh vector similarity to fetch teh relevant memory and add it to teh context window

factual and episodic memeory are always about the user

<!--  -->

if we make or context space very big it can lead to --> hallucinations

<!--  -->
🏗️ Chatbot Memory Architecture

                ┌──────────────────────┐
                │      User Input       │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │   Memory Classifier   │  ← (LLM decides memory type)
                └─────────┬────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Short-Term   │  │ Long-Term     │  │ Ignore / Temp│
│ Memory       │  │ Memory        │  │ Data         │
└──────┬───────┘  └──────┬───────┘  └──────────────┘
       │                  │
       │        ┌─────────┼──────────────┐
       ▼        ▼         ▼              ▼
   Context   Factual   Episodic      Semantic
   (Cache)     (DB)      (Logs)        (Vector DB)

                          │
                          ▼
                ┌──────────────────────┐
                │  Memory Retriever     │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │        LLM            │
                │ (Response Generator)  │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │     Response          │
                └──────────────────────┘


2. MEMORY TYPES (Clear Understanding)
🔹 1. Short-Term Memory (Context)
Stores current conversation
Lives for session only
Stored in:
Cache (Redis / in-memory)
Has TTL (expiry)

👉 Example:

“Apply leave tomorrow” → used only in current chat

🔹 2. Long-Term Memory
📌 (A) Factual Memory
User-specific facts
Stored in DB

👉 Example:

“User name = Ankush”
“Default leave type = RH”
📌 (B) Episodic Memory
Past interactions / history
Stored as logs

👉 Example:

“User applied leave on 10th April”
📌 (C) Semantic Memory
Meaningful embeddings (vector search)
Stored in vector DB

👉 Example:

“User prefers casual leave for short trips”


1. User sends message
2. LLM analyzes intent
3. Memory classifier decides:
   - Short-term?
   - Long-term?
   - Ignore?

4. Store accordingly:
   - Cache (TTL)
   - DB
   - Vector DB

5. Retrieve relevant memory
6. Inject into prompt
7. LLM generates response
8. Update memory again

Short-Term Memory:
  → Redis / Cache
  → TTL: 5–30 mins

Factual Memory:
  → MongoDB / SQL
  → Permanent

Episodic Memory:
  → Logs / DB
  → Time-series

Semantic Memory:
  → Vector DB (Pinecone / FAISS)
  → Embeddings

  
<!--  -->

