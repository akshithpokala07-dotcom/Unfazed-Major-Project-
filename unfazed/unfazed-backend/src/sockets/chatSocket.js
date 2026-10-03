const { Server } = require("socket.io");

const setupChatSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Chat client connected:", socket.id);

        socket.on("joinChat", ({ roomId }) => {
            if (!roomId) {
                return;
            }

            socket.join(roomId);

            console.log(
                `Socket ${socket.id} joined chat room ${roomId}`
            );
        });

        socket.on("sendMessage", ({ roomId, senderId, message }) => {
            if (!roomId || !senderId || !message) {
                return;
            }

            const chatMessage = {
                roomId,
                senderId,
                message,
                createdAt: new Date()
            };

            io.to(roomId).emit(
                "receiveMessage",
                chatMessage
            );
        });

        socket.on("disconnect", () => {
            console.log(
                "Chat client disconnected:",
                socket.id
            );
        });
    });

    return io;
};

module.exports = setupChatSocket;