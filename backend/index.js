import express from "express";
import cors from "cors";
import multer from 'multer';
import { Queue } from 'bullmq';
import client from "./redis.js"
import { CohereEmbeddings } from "@langchain/cohere";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: "" });

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
      apiKey : ""
  
    }); 

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
   
    embeddings,
    {
    url: "",
    collectionName: "langchainjs-testing",
    apiKey: "",
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
  }catch(err) {
    console.error('Error during vector store initialization or retrieval:', err);
    console.error('Gemini error:', err);
    console.error('Full error object:', JSON.stringify(err, null, 2)); // Log the entire error object
    return res.status(500).json({ error: err.message });
  }
} )

app.listen(8080,() => console.log(`Server running on port :${8080}`))