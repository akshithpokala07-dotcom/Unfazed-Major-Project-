import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const BookingPage = () => {
    const { slug } = useParams();

    const [therapist, setTherapist] = useState(null);
    const [therapistId, setTherapistId] = useState("");

    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);

    const [selectedSlot, setSelectedSlot] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState("");

    // Get therapist information
    useEffect(() => {
        const fetchTherapist = async () => {
            try {
                const response = await axiosInstance.get(
                    `/therapists/public/${slug}`
                );

                setTherapist(response.data.therapist);
                setTherapistId(response.data.therapist._id);
            } catch (error) {
                console.error("Therapist fetch error:", error);
                setMessage("Therapist profile not found.");
            }
        };

        fetchTherapist();
    }, [slug]);

    // Get available slots when date changes
    useEffect(() => {
        if (!date || !therapistId) {
            setSlots([]);
            return;
        }

        const fetchSlots = async () => {
            try {
                setLoading(true);
                setMessage("");
                setSelectedSlot(null);

                const response = await axiosInstance.get(
                    `/scheduling/availability?therapistId=${therapistId}&date=${date}`
                );

                setSlots(response.data.slots);
            } catch (error) {
                console.error("Availability error:", error);

                setSlots([]);
                setMessage("Could not load available slots.");
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [date, therapistId]);

    const handleBooking = async (event) => {
        event.preventDefault();

        if (!selectedSlot) {
            setMessage("Please select a time slot.");
            return;
        }

        try {
            setBooking(true);
            setMessage("");

            await axiosInstance.post("/scheduling/book", {
                therapistId,
                name,
                email,
                phone,
                startTime: selectedSlot.startTime
            });

            setMessage("Session booked successfully!");

            // Remove booked slot from the displayed list
            setSlots((currentSlots) =>
                currentSlots.filter(
                    (slot) =>
                        slot.startTime !== selectedSlot.startTime
                )
            );

            setSelectedSlot(null);

            setName("");
            setEmail("");
            setPhone("");

        } catch (error) {
            console.error("Booking error:", error);

            setMessage(
                error.response?.data?.message ||
                "Could not book the session."
            );
        } finally {
            setBooking(false);
        }
    };

    if (!therapist) {
        return <h2>Loading therapist...</h2>;
    }

    return (
        <div>
            <h1>Book a Session</h1>

            <h2>Dr. {therapist.name}</h2>

            <p>{therapist.bio}</p>

            <hr />

            <label>
                Select Date:
            </label>

            <br />

            <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
            />

            {loading && (
                <p>Loading available slots...</p>
            )}

            {!loading && date && slots.length === 0 && (
                <p>No available slots for this date.</p>
            )}

            {slots.length > 0 && (
                <>
                    <h3>Available Time Slots</h3>

                    <div>
                        {slots.map((slot) => (
                            <button
                                type="button"
                                key={slot.startTime}
                                onClick={() =>
                                    setSelectedSlot(slot)
                                }
                            >
                                {new Date(
                                    slot.startTime
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {selectedSlot && (
                <>
                    <h3>
                        Selected:
                        {" "}
                        {new Date(
                            selectedSlot.startTime
                        ).toLocaleString()}
                    </h3>

                    <form onSubmit={handleBooking}>
                        <div>
                            <label>Name</label>
                            <br />

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Email</label>
                            <br />

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Phone</label>
                            <br />

                            <input
                                type="tel"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(event.target.value)
                                }
                            />
                        </div>

                        <br />

                        <button
                            type="submit"
                            disabled={booking}
                        >
                            {booking
                                ? "Booking..."
                                : "Confirm Booking"}
                        </button>
                    </form>
                </>
            )}

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
};

export default BookingPage;