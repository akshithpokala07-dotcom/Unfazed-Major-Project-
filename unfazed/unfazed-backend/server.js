require("dotenv").config();

const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const setupChatSocket = require("./src/sockets/chatSocket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Connect MongoDB
connectDB();

// Setup real-time chat
setupChatSocket(server);

server.listen(PORT, () => {
    console.log(`Unfazed server running on port ${PORT}`);
});