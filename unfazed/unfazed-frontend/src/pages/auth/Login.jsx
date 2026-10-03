import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axiosInstance.post("/auth/login", {
                email,
                password,
            });

            login(response.data);

            setMessage("Login successful");

            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);

            setMessage(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div>
            <h1>Unfazed Therapist Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Login</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;