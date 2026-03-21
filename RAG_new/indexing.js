import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";
dotenv.config();

async function init() {
  const pdffilepath = "./nodejs_pdf.pdf";
  const loader = new PDFLoader(pdffilepath);
  // page by page load pdf file
  const docs = await loader.load();

  // Split documents into smaller chunks for better embedding (crucial for 150 pages)
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  console.log(`Split ${docs.length} pages into ${splitDocs.length} chunks.`);

  // embedding by hugging face
  const embeddings = new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    apiKey: process.env.HF_API_KEY,
    provider: "hf-inference",
  });

  // qdrant store this code will loop over every docs and embed them and will store in the vector db
  const vectorstore = await QdrantVectorStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "nodejscollection",
    },
  );

  console.log("Indexing is done!!");
}
init();
