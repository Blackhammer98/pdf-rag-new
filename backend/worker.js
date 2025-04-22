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
    apiKey : ""

  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
   
    embeddings,
    {
    url: "",
    collectionName: "langchainjs-testing",
    apiKey: "",
  });
  await vectorStore.addDocuments(docs);
  console.log("All docs are added to vector store")
},
{
  concurrency:10,
  connection : client,
}

  
);
