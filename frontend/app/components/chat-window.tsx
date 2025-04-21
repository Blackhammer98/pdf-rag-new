"use client";

import React from "react";


const ChatComponent : React.FC = () => {
    return (
        <div className="p-4">
            <div className="fixed bottom-10">
                <input placeholder="type your query here"
                className=""/>
            </div>
        </div>
    )
}

export default ChatComponent;