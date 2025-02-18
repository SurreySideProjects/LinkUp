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

    socket.on("message",(message) => {
        console.log(message)
        if (typeof message === "object"){
            setMessages(messages.concat([message]))
        }
    })

    return (
          <div className="results-container">
            <div className="chat-container">
                <ul className="chat-messages">
                {messages.map((item, index) => (
                    <li key={index}>{item.username+ ": "+ item.message}</li>
                ))}
                </ul>
            </div>
            <input
            onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" onClick={() => sendMessage()}>submit</button>
          </div>
      );
}

export default ChatSection;