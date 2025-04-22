"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface Message {
    text: string;
    isUser: boolean;
  }

const ChatComponent : React.FC = () => {

    const [message , setMessage] = useState("")
    const [messages , setMessages] = useState<Message[]>([]);
    const [isLoading , setIsLoading] = useState(false)


    const handleSendClick = async () => {
        const userMessage :Message = {text : message , isUser : true};
        setMessages((prevMessages) => [...prevMessages , userMessage])
        setMessage("");
        setIsLoading(true);

       try {
        const res = await fetch(`http://localhost:8080/chat?message=${message}`);
        const data = await res.json()
        console.log({data});
  
        const aiMessage:Message = {text: data.message ||"No response received.", isUser : false}
        setMessages((prevMessages) => [...prevMessages , aiMessage])
       } catch (error) {
        console.error("Error fetching response:", error);
         const errorMessage: Message = { text: "Failed to get response.", isUser: false };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        
       } finally {
        setIsLoading(false)
       }
     
    }
    return (
        <div className="p-4">
         <div className="chat-window flex-grow overflow-y-auto mb-16">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-md ${
              msg.isUser ? "bg-blue-200 text-blue-800 self-end" : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="text-gray-500 self-start">Thinking...</div>}
      </div>
            <div className="fixed bottom-10 flex gap-5 w-[30vw] ">
              <Input 
              value={message} 
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter your message here"/>
                <Button 
                onClick={handleSendClick}
                 disabled={!message.trim()} >
                    send
                </Button>
            </div>
        </div>
    )
}

export default ChatComponent;