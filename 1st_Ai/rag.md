<!-- RAG -->

//> initially to et all teh information and uplaod them into teh system prompt if teh token and context window is not an issue than it will work --> but it willbe nieve way
//1st issue is context window --> The maximum amount of text an AI model can see and remember at one time.


<!-- RAG -->
📚 RAG (Retrieval Augmented Generation) — Simple Explanation

RAG is a technique used in AI systems where the model retrieves relevant information from external documents before generating an answer.

Instead of relying only on what the model learned during training, it can look up knowledge from your documents, PDFs, databases, etc.

🧩 Two Main Phases of RAG

RAG works in two major phases:

1️⃣ Indexing Phase (Prepare Data)
2️⃣ Retrieval / Chat Phase (Answer User Query)
1️⃣ 📦 Indexing Phase (Preparing the Documents)

This step happens before the user asks any question.

The goal is to convert documents into searchable vector embeddings.

🪜 Step-by-Step Process
1️⃣ Upload Documents

Unstructured data like:

📄 PDFs

📚 Books

📝 Text files

🌐 Web pages

Example:

AI Handbook.pdf
2️⃣ Split Documents into Chunks

Large documents are split into smaller parts (chunks) so the AI can process them easily.

Common chunking methods:

Page-by-page

Paragraph-based

Fixed token chunks

Example:

Document: AI Handbook

Chunk 1 → Page 1
Chunk 2 → Page 2
Chunk 3 → Page 3
3️⃣ Create Vector Embeddings

Each chunk is converted into a vector embedding.

A vector embedding is a numerical representation of the semantic meaning of text.

Example:

Text:
"Artificial Intelligence is the simulation of human intelligence"

Vector:
[0.12, -0.45, 0.88, 0.03, ...]

This helps the system understand meaning instead of just keywords.

4️⃣ Store Vectors in a Vector Database

Each vector is stored along with:

the original text chunk

metadata (optional)

Example metadata:

{
page: 5,
document: "AI Handbook",
topic: "Machine Learning"
}

Popular vector databases:

Pinecone

Weaviate

Chroma

Example stored record:

Vector → [0.45, 0.21, -0.78 ...]
Chunk → "Machine learning allows systems to learn from data"
Metadata → page 5
2️⃣ 🔎 Retrieval / Chat Phase

This happens when the user asks a question.

The system searches the vector database to find relevant information.

🪜 Step-by-Step Retrieval Process
1️⃣ User Asks a Question

Example:

User: What is machine learning?
2️⃣ Convert Query into Vector

The user query is converted into an embedding vector.

Example:

"What is machine learning?"

Vector:
[0.13, -0.22, 0.91 ...]
3️⃣ Search the Vector Database

The system finds similar vectors using similarity search.

Common techniques:

Cosine similarity

Dot product

Euclidean distance

It retrieves the Top K similar chunks.

Example:

Top 3 similar chunks found
4️⃣ Retrieve the Relevant Chunks

Example retrieved chunks:

Chunk 1:
Machine learning allows computers to learn from data.

Chunk 2:
ML algorithms improve performance through experience.

Chunk 3:
Supervised learning is a type of machine learning.
5️⃣ Send Context to the LLM

These retrieved chunks are added to the system prompt or context.

Example prompt to the LLM:

Context:
Machine learning allows computers to learn from data.

User Question:
What is machine learning?
6️⃣ LLM Generates the Final Answer

Now the LLM generates an answer based on the retrieved context.

Example response:

Machine learning is a branch of artificial intelligence that allows computers to learn patterns from data and improve performance without explicit programming.
🧠 Complete RAG Flow
Documents
↓
Chunking
↓
Embeddings
↓
Vector Database
↓
User Query
↓
Query Embedding
↓
Similarity Search
↓
Retrieve Top K Chunks
↓
Add Context to Prompt
↓
LLM Generates Answer
🌍 Real-World Example

Imagine a company chatbot trained on company documents.

Documents stored:

Employee Handbook
HR Policies
Technical Documentation

User asks:

"What is the leave policy?"

RAG system:

1️⃣ searches handbook
2️⃣ retrieves leave policy chunk
3️⃣ sends it to LLM

Final answer:

Employees are entitled to 20 days of annual leave per year.
