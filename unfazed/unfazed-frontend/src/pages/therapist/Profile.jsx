import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const { therapist } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        specializations: "",
        languages: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (therapist) {
            setFormData({
                name: therapist.name || "",
                bio: therapist.bio || "",
                specializations: therapist.specializations
                    ? therapist.specializations.join(", ")
                    : "",
                languages: therapist.languages
                    ? therapist.languages.join(", ")
                    : ""
            });
        }
    }, [therapist]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await axiosInstance.put(
                "/therapists/profile",
                {
                    name: formData.name,
                    bio: formData.bio,
                    specializations: formData.specializations
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    languages: formData.languages
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                }
            );

            setMessage("Profile updated successfully");

            console.log(response.data);

        } catch (error) {
            console.error("Profile update error:", error);
            setMessage(
                error.response?.data?.message ||
                "Profile update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Unfazed Therapist Profile</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Specializations</label>
                    <input
                        type="text"
                        name="specializations"
                        placeholder="Anxiety, Stress Management"
                        value={formData.specializations}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Languages</label>
                    <input
                        type="text"
                        name="languages"
                        placeholder="English, Hindi"
                        value={formData.languages}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                </button>

            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Profile;