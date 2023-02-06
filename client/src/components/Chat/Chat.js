import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

let socket;

const Chat = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState("");
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

    return <h1>CHAT</h1>;
};
export default Chat;
