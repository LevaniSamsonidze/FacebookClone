import { io } from "socket.io-client";

export const socket = io("https://facebookclone-45ym.onrender.com", {
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ["websocket"]
});