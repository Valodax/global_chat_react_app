import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

let socket;

const Chat = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const ENDPOINT = "localhost:5000";
    const location = useLocation();

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit("join", { name, room }, () => {});

        return () => {
            socket.emit("disconnect");
            socket.off();
        };
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on("messages", (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit("sendMessage", message, () => setMessage(""));
        }
    };

    console.log(message, messages);

    return (
        <h1>
            <div className="outerContainer">
                <div className="container">
                    <input
                        type="text"
                        defaultValue={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={(event) => (event.key === "Enter" ? sendMessage(event) : null)}
                    />
                </div>
            </div>
        </h1>
    );
};
export default Chat;
