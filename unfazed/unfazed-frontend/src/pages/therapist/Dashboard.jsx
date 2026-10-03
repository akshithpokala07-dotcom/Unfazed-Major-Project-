import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { therapist, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <h1>Unfazed Therapist Dashboard</h1>

            {therapist ? (
                <>
                    <h2>Welcome, {therapist.name}</h2>

                    <p>Email: {therapist.email}</p>
                    <p>Slug: {therapist.slug}</p>

                    <p>
                        Your therapist profile is ready.
                    </p>

                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={() =>
                                navigate("/dashboard/analytics")
                            }
                        >
                            View Analytics
                        </button>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <button onClick={logout}>
                            Logout
                        </button>
                    </div>
                </>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

export default Dashboard;