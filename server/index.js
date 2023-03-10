const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const PORT = process.env.PORT || 5000;

const router = require("./router");
const { SocketAddress } = require("net");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("We have a new connection!");

    socket.on("join", ({ name, room }, callback) => {
        console.log(name, room);
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);
        if (error) return console.log(error);
        socket.emit("message", { user: "admin", text: `${user.name}, welcome to room ${user.room}` });
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name}, has joined!` });
        socket.join(user.room);
        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        console.log(message);
        console.log(socket.id);
        console.log(getUser(socket.id));
        const user = getUser(socket.id);
        console.log("name is", user.name);
        io.to(user.room).emit("message", { user: user.name, text: message });

        callback();
    });

    socket.on("disconnect", () => {
        console.log("User has left!");
    });
});
app.use(cors());

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
