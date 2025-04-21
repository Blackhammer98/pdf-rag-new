import express from "express";
import cors from "cors";
import multer from 'multer';
import { Queue } from 'bullmq';
import client from "./redis.js"
import { CohereEmbeddings } from "@langchain/cohere";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: "AIzaSyC8722U2IDm6sIdnsnHOdmO8XwOZBAVrFI" });

const myQueue = new Queue('file-upload-queue', {
    connection : client
});


  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
  })

  
  const upload = multer({ storage: storage })

const app = express();


app.use(cors());


app.get("/" , (req, res) => {
    return res.status(200).json({
        message : "All good"
    })
})
app.post("/upload/pdf",upload.single('pdf'),async (req, res) => {
  await  myQueue.add("file-ready" , JSON.stringify({
         filename: req.file.originalname,
         source : req.file.destination,
         path : req.file.path,
    }))
    return res.json({
        message : "Uploaded"
    })
})

app.get("/chat" , async (req ,res) => {
  try{
    const userQuery =  req.query.message;
    console.log('User query:', userQuery);
  

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


  const retriever = vectorStore.asRetriever({ k: 2 });

  const result = await retriever.invoke(userQuery);
  const context = result.map(item => item.pageContent.substring(0,1000)).join("\n\n");

    const geminiPrompt = `
    You are a helpful AI assistant. Use the information from the context below to answer the user's question.  Do not use any information outside of this context.
    
    ${context}

   And answer the user's query : ${userQuery}
    `;
    
    

    const geminiResult = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: geminiPrompt ,

    });

    const response = geminiResult.candidates[0].content.parts[0].text;
    
    return res.json(
      {
        message: response,
       

    })
  } catch(err) {
   
    console.error('Gemini error:', err);

    return res.status(500).json({ error: err.message });
  }
} )

app.listen(8080,() => console.log(`Server running on port :${8080}`))