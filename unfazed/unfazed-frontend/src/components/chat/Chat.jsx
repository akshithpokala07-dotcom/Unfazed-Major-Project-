import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const Chat = ({ roomId, senderId }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to chat:", newSocket.id);

            newSocket.emit("joinChat", {
                roomId
            });
        });

        newSocket.on("receiveMessage", (chatMessage) => {
            setMessages((previousMessages) => [
                ...previousMessages,
                chatMessage
            ]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    const sendMessage = () => {
        if (!message.trim() || !socket) {
            return;
        }

        socket.emit("sendMessage", {
            roomId,
            senderId,
            message: message.trim()
        });

        setMessage("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div
            style={{
                border: "1px solid #333",
                borderRadius: "10px",
                padding: "20px",
                background: "#1e1e1e",
                color: "#fff",
                maxWidth: "600px"
            }}
        >
            <h2>Chat</h2>

            <div
                style={{
                    minHeight: "250px",
                    maxHeight: "350px",
                    overflowY: "auto",
                    marginBottom: "15px",
                    padding: "10px",
                    background: "#151515",
                    borderRadius: "8px"
                }}
            >
                {messages.length === 0 ? (
                    <p style={{ color: "#999" }}>
                        No messages yet.
                    </p>
                ) : (
                    messages.map((item, index) => (
                        <div
                            key={`${item.createdAt}-${index}`}
                            style={{
                                padding: "8px 0",
                                borderBottom:
                                    "1px solid #2a2a2a"
                            }}
                        >
                            <strong>
                                {item.senderId === senderId
                                    ? "You"
                                    : "Client"}
                            </strong>

                            <p style={{ margin: "4px 0" }}>
                                {item.message}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px"
                }}
            >
                <input
                    value={message}
                    onChange={(event) =>
                        setMessage(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #444",
                        background: "#292929",
                        color: "#fff"
                    }}
                />

                <button onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;