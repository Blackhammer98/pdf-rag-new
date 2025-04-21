"use client" ;
import ChatComponent from "./components/chat-window";
import FileUploadComponent from "./components/file-upload";

export default function Home() {
  return (
   <div className="min-h-screen w-screen flex ">
       <div className=" min-h-screen w-[50vw]  p-4  flex items-center justify-center ">
        
        <FileUploadComponent/>
        
        
       </div>
       <div className=" min-h-screen w-[50vw] border-l-2 pl-4  flex items-center text-3xl ">
        <ChatComponent/>
       </div>
    </div>
  );
}
