import React, { useEffect, useState } from "react";
import "./ChatSection.css";
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000")

function ChatSection({ groupData }){ 
    const [cookies, removeCookie] = useCookies();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([])

    const sendMessage = () => {
        if (message.length < 1){
            return false;
        }
        socket.emit("recieve",{"message":message, "username":cookies.user, "group": groupData.name})//, (data) =>{
    }

    useEffect(() => {
        socket.emit("join", 
            {"group": groupData.name, "username": cookies.user,}
        )
    }, [groupData, cookies.user])

    socket.on("message",(data) => {
        if (typeof data === "object"){
            setMessages([...messages, data])
        }
    })

    return (
          <div className="results-container">
            <div className="chat-container">
                <ul className="chat-messages">
                {messages.map((item, index) => (
                    <li className={item.username === cookies.user ? "my-message": "other-message"}>{item.username+ ": "+ item.message}</li>
                ))}
                </ul>
            </div>
            <div className="search-bar">
            <div className="search-input-wrapper">
                <input
                onChange={(e) => setMessage(e.target.value)}
                className="search-input"
                placeholder="Type a message"
                />
            </div>     
            <button type="submit" onClick={() => sendMessage()} className="search-button">
            send</button>  
            </div>
          </div>
      );
}

export default ChatSection;