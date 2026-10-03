import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const ClientDetails = () => {
    const { clientId } = useParams();
    const { token } = useAuth();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);
    const [notes, setNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [clientPackages, setClientPackages] = useState([]);
    const [packagesLoading, setPackagesLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await axiosInstance.get(
                    `/clients/${clientId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setClient(response.data.client);

            } catch (error) {
                console.error("Fetch client details error:", error);

                setError(
                    error.response?.data?.message ||
                    "Could not load client."
                );

            } finally {
                setLoading(false);
            }
        };

        if (token && clientId) {
            fetchClient();
        }
    }, [token, clientId]);

    useEffect(() => {
    const fetchNotes = async () => {
        try {
            const response = await axiosInstance.get(
                `/notes/client/${clientId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNotes(response.data.notes);

        } catch (error) {
            console.error("Fetch client notes error:", error);

        } finally {
            setNotesLoading(false);
        }
    };

    if (token && clientId) {
        fetchNotes();
    }
}, [token, clientId]);

    useEffect(() => {
    const fetchClientPackages = async () => {
        try {
            const response = await axiosInstance.get(
                `/payments/clients/${clientId}/packages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setClientPackages(response.data.clientPackages);
        } catch (error) {
            console.error(
                "Fetch client packages error:",
                error
            );
        } finally {
            setPackagesLoading(false);
        }
    };

    if (token && clientId) {
        fetchClientPackages();
    }
}, [token, clientId]);

    const updateIntakeConsent = async (intakeCompleted, consentGiven) => {
    try {
        setUpdating(true);
        setError("");

        const response = await axiosInstance.put(
            `/clients/${clientId}/intake`,
            {
                intakeCompleted,
                consentGiven
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setClient(response.data.client);

    } catch (error) {
        console.error("Update intake/consent error:", error);

        setError(
            error.response?.data?.message ||
            "Could not update intake and consent."
        );

    } finally {
        setUpdating(false);
    }
};

    const handlePayment = async (packageId) => {
    try {
        const response = await axiosInstance.post(
            `/payments/clients/${clientId}/payment-order`,
            {
                packageId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const {
            order,
            package: selectedPackage
        } = response.data;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,

            amount: order.amount,
            currency: order.currency,

            name: "Unfazed",
            description: selectedPackage.name,

            order_id: order.id,

            handler: async function (paymentResponse) {
                try {
                    await axiosInstance.post(
                        "/payments/verify",
                        paymentResponse,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    alert("Payment successful!");

                } catch (error) {
                    console.error(
                        "Payment verification error:",
                        error
                    );

                    alert(
                        error.response?.data?.message ||
                        "Payment verification failed."
                    );
                }
            },

            prefill: {
                name: client?.name || "",
                email: client?.email || "",
                contact: client?.phone || ""
            },

            theme: {
                color: "#3399cc"
            }
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();

    } catch (error) {
        console.error(
            "Create payment order error:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Could not start payment."
        );
    }
};

    if (loading) {
        return <h2>Loading client...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!client) {
        return <h2>Client not found.</h2>;
    }

    return (
        <div>
            <h1>Client Details</h1>

            <hr />

            <h2>{client.name}</h2>

            <p>
                <strong>Email:</strong>{" "}
                {client.email}
            </p>

            <p>
                <strong>Phone:</strong>{" "}
                {client.phone || "Not provided"}
            </p>

            <p>
                <strong>Timezone:</strong>{" "}
                {client.timezone}
            </p>

            <hr />

            <h3>Intake & Consent</h3>

<p>
    <strong>Intake:</strong>{" "}
    {client.intakeCompleted
        ? "Completed"
        : "Pending"}
</p>

<button
    onClick={() =>
        updateIntakeConsent(
            !client.intakeCompleted,
            client.consentGiven
        )
    }
    disabled={updating}
>
    {client.intakeCompleted
        ? "Mark Intake as Pending"
        : "Mark Intake as Completed"}
</button>

<p>
    <strong>Consent:</strong>{" "}
    {client.consentGiven
        ? "Given"
        : "Pending"}
</p>

<button
    onClick={() =>
        updateIntakeConsent(
            client.intakeCompleted,
            !client.consentGiven
        )
    }
    disabled={updating}
>
    {client.consentGiven
        ? "Revoke Consent"
        : "Mark Consent as Given"}
</button>

{client.consentTimestamp && (
    <p>
        <strong>Consent Date:</strong>{" "}
        {new Date(
            client.consentTimestamp
        ).toLocaleString()}
    </p>
)}

            <hr />

            <h3>Sessions</h3>
            <p>No sessions loaded yet.</p>

           <h3>Packages</h3>

{packagesLoading ? (
    <p>Loading packages...</p>
) : clientPackages.length === 0 ? (
    <p>No packages assigned yet.</p>
) : (
    clientPackages.map((clientPackage) => {
        const remainingSessions =
            clientPackage.sessionsTotal -
            clientPackage.sessionsUsed;

        return (
            <div
                key={clientPackage._id}
                style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "8px"
                }}
            >
                <h4>
                    {clientPackage.package?.name}
                </h4>

                <p>
                    Sessions:{" "}
                    {clientPackage.sessionsUsed} /{" "}
                    {clientPackage.sessionsTotal}
                </p>

                <p>
                    Remaining: {remainingSessions}
                </p>

                <p>
                    Price: ₹
                    {clientPackage.package?.price}
                </p>

                <p>
                    Status: {clientPackage.status}
                </p>

                <p>
                    Expires:{" "}
                    {clientPackage.expiryDate
                        ? new Date(
                              clientPackage.expiryDate
                          ).toLocaleDateString()
                        : "No expiry date"}
                </p>
                <button
    onClick={() =>
        handlePayment(
            clientPackage.package?._id
        )
    }
    style={{
        padding: "10px 15px",
        marginTop: "10px",
        cursor: "pointer"
    }}
>
    Pay ₹{clientPackage.package?.price}
</button>
            </div>
        );
    })
)}

            <h3>Clinical Notes</h3>

{notesLoading ? (
    <p>Loading notes...</p>
) : notes.length === 0 ? (
    <p>No clinical notes yet.</p>
) : (
    notes.map((note) => (
        <div key={note._id}>
            <p>
                <strong>
                    {note.visibility === "private"
                        ? "Private Note"
                        : "Shared Note"}
                </strong>
            </p>

            <p>{note.content}</p>

            <p>
                <small>
                    {new Date(
                        note.createdAt
                    ).toLocaleString()}
                </small>
            </p>

            <hr />
        </div>
    ))
)}
        </div>
    );
};

export default ClientDetails;