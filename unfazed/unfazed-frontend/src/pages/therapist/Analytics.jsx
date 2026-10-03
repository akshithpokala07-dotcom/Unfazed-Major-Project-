import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axiosInstance.get(
                    "/analytics",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setAnalytics(response.data.analytics);

            } catch (err) {
                console.error("Analytics error:", err);

                setError(
                    err.response?.data?.message ||
                    "Could not load analytics"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div style={styles.page}>
                <h1>Analytics</h1>
                <p>Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.page}>
                <h1>Analytics</h1>

                <div style={styles.error}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Analytics</h1>
                    <p style={styles.subtitle}>
                        Overview of your practice
                    </p>
                </div>
            </div>

            <div style={styles.cards}>

                <div style={styles.card}>
                    <p style={styles.label}>
                        Active Clients
                    </p>

                    <h2 style={styles.value}>
                        {analytics.activeClients}
                    </h2>
                </div>

                <div style={styles.card}>
                    <p style={styles.label}>
                        Total Revenue
                    </p>

                    <h2 style={styles.value}>
                        ₹{analytics.totalRevenue}
                    </h2>
                </div>

                <div style={styles.card}>
                    <p style={styles.label}>
                        No-Shows
                    </p>

                    <h2 style={styles.value}>
                        {analytics.noShows}
                    </h2>
                </div>

            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    Session Overview
                </h2>

                {analytics.sessionStats.length === 0 ? (
                    <p style={styles.empty}>
                        No session data available yet.
                    </p>
                ) : (
                    <div style={styles.sessionList}>
                        {analytics.sessionStats.map((item) => (
                            <div
                                key={item._id}
                                style={styles.sessionRow}
                            >
                                <span>
                                    {item._id}
                                </span>

                                <strong>
                                    {item.count}
                                </strong>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        padding: "30px",
        color: "#ffffff",
        minHeight: "100vh"
    },

    header: {
        marginBottom: "30px"
    },

    title: {
        margin: 0,
        fontSize: "32px"
    },

    subtitle: {
        marginTop: "8px",
        color: "#a0a0a0"
    },

    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "30px"
    },

    card: {
        background: "#1e1e1e",
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "24px"
    },

    label: {
        margin: 0,
        color: "#a0a0a0",
        fontSize: "14px"
    },

    value: {
        marginTop: "12px",
        marginBottom: 0,
        fontSize: "30px"
    },

    section: {
        background: "#1e1e1e",
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "24px"
    },

    sectionTitle: {
        marginTop: 0
    },

    empty: {
        color: "#a0a0a0"
    },

    sessionList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    sessionRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "14px",
        background: "#292929",
        borderRadius: "8px"
    },

    error: {
        padding: "15px",
        background: "#3a1f1f",
        border: "1px solid #6b3030",
        borderRadius: "8px",
        color: "#ffb3b3"
    }
};

export default Analytics;