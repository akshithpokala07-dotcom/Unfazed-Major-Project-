import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const PublicTherapistProfile = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [therapist, setTherapist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTherapist = async () => {
            try {
                const response = await axiosInstance.get(
                    `/therapists/public/${slug}`
                );

                setTherapist(response.data.therapist);
            } catch (error) {
                console.error("Public profile error:", error);

                setError("Therapist profile not found.");
            } finally {
                setLoading(false);
            }
        };

        fetchTherapist();
    }, [slug]);

    if (loading) {
        return <h2>Loading therapist profile...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>{therapist.name}</h1>

            <p>{therapist.bio}</p>

            <h3>Specializations</h3>

            {therapist.specializations.length > 0 ? (
                <ul>
                    {therapist.specializations.map((specialization, index) => (
                        <li key={index}>{specialization}</li>
                    ))}
                </ul>
            ) : (
                <p>Specializations not listed.</p>
            )}

            <h3>Languages</h3>

            {therapist.languages.length > 0 ? (
                <ul>
                    {therapist.languages.map((language, index) => (
                        <li key={index}>{language}</li>
                    ))}
                </ul>
            ) : (
                <p>Languages not listed.</p>
            )}

            <button onClick={() => navigate(`/${slug}/book`)}>
    Book a Session
</button>
        </div>
    );
};

export default PublicTherapistProfile;