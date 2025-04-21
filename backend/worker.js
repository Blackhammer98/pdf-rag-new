import { Worker} from 'bullmq';
import client from './redis.js';
import { QdrantVectorStore } from "@langchain/qdrant";

import { CohereEmbeddings } from "@langchain/cohere";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";





const worker = new Worker("file-upload-queue",
  async (job) => {

    console.log('job:', job.data);
    const data = JSON.parse(job.data);
        
 

    const loader = new PDFLoader(data.path);
    const docs = await loader.load()
    
  console.log('DOCS:',docs);
 

  const embeddings = new CohereEmbeddings({
    model:"embed-english-v3.0",
    apiKey : "hWNBBBs6mfnvnavaD2PdFKD5n0NPoRzQ8LDZUYNm"

  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
   
    embeddings,
    {
    url: "https://64646006-d328-432e-bfd6-270a8cbab8ac.europe-west3-0.gcp.cloud.qdrant.io:6333",
    collectionName: "langchainjs-testing",
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.dKesVuQ_3Hyz2R0fsc5vmOYiqkR7giU2ctpVl4AJD0k",
  });
  await vectorStore.addDocuments(docs);
  console.log("All docs are added to vector store")
},
{
  concurrency:10,
  connection : client,
}

  
);
