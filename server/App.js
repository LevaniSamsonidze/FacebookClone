const express = require('express');
const http = require('http');
require("dotenv").config();
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const authRouter = require('./routes/Auth.router');
const { handleError } = require('./utils/AppErrorHandler');
const postRouter = require('./routes/post.router');
const commentRoute = require('./routes/Comment.route');
const friendRouter = require('./routes/Friend.route');
const messageRouter = require('./routes/Message.route');
const Messages = require('./modules/Message.modules');
const shearchRoute = require('./routes/Search.route');

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: "*",
    }
})
app.use(cors());
app.use(express.json());

app.use("/imgs", express.static("imgs"));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "server start"
    });
});

app.use("/api", authRouter);
app.use("/api", postRouter)
app.use("/api", commentRoute)
app.use("/api", friendRouter)
app.use("/api", messageRouter)
app.use("/api", shearchRoute)

// IO

io.on("connection", (socket) =>{

    socket.on("join", ({ user, id }) => {
        const chatId = [user, id].sort().join("_");
        socket.join(chatId);
    });

    socket.on("message", async ({message, id, user}) =>{

        const chatId = [user, id].sort().join("_");

        const newMessage = await Messages({
            senderId: user,
            eceiverId: id,
            text: message
        })

        await newMessage.save()
        

        io.to(chatId).emit("message", newMessage);
        
    });
})

app.use(handleError);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongo connected");

        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    })
    .catch((err) => {
        console.log("MONGO ERROR:", err);
    });