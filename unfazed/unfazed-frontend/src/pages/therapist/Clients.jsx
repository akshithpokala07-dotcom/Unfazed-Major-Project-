import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const Clients = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axiosInstance.get(
                    "/clients",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setClients(response.data.clients);

            } catch (error) {
                console.error("Fetch clients error:", error);

                setError(
                    error.response?.data?.message ||
                    "Could not load clients."
                );

            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchClients();
        }
    }, [token]);

    if (loading) {
        return <h2>Loading clients...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>Clients</h1>

            <p>
                Total Clients: {clients.length}
            </p>

            {clients.length === 0 ? (
                <p>No clients found.</p>
            ) : (
                <div>
                    {clients.map((client) => (
                        <div
                            key={client._id}
                            onClick={() => navigate(`/clients/${client._id}`)}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "8px"
                            }}
                        >
                            <h3>{client.name}</h3>

                            <p>
                                Email: {client.email}
                            </p>

                            <p>
                                Phone: {client.phone || "Not provided"}
                            </p>

                            <p>
                                Timezone: {client.timezone}
                            </p>

                            <p>
                                Intake:{" "}
                                {client.intakeCompleted
                                    ? "Completed"
                                    : "Pending"}
                            </p>

                            <p>
                                Consent:{" "}
                                {client.consentGiven
                                    ? "Given"
                                    : "Pending"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Clients;