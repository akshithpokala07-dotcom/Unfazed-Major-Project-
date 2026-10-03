import Chat from "../../components/chat/Chat";
import { useAuth } from "../../context/AuthContext";

const ChatPage = () => {
    const { therapist } = useAuth();

    const roomId = "test-chat-room";

    const senderId = therapist?._id || "therapist";

    return (
        <div style={{ padding: "30px" }}>
            <h1>Unfazed Chat</h1>

            <p>
                Real-time communication between therapist
                and client.
            </p>

            <Chat
                roomId={roomId}
                senderId={senderId}
            />
        </div>
    );
};

export default ChatPage;