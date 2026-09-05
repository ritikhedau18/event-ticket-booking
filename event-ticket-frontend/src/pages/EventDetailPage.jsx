import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function EventDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [message, setMessage] = useState('');

    const loadData = async () => {
        const eventRes = await axiosInstance.get(`/events/${id}`);
        setEvent(eventRes.data);

        const ticketRes = await axiosInstance.get(
            `/events/${id}/ticket-types`
        );
        setTicketTypes(ticketRes.data);
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleBook = async (ticketTypeId) => {
        setMessage('');

        const quantity = quantities[ticketTypeId] || 1;

        try {
            await axiosInstance.post('/bookings', {
                ticketTypeId,
                quantity
            });

            setMessage('Booked! Check My Bookings.');
            loadData();
        } catch (err) {
            setMessage(
                err.response?.data?.message || 'Booking failed'
            );
        }
    };

    if (!event) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{event.title}</h2>

            <p>{event.description}</p>

            <p>
                {event.venueName}, {event.venueCity}
            </p>

            <p>
                {new Date(event.eventDateTime).toLocaleString()}
            </p>

            <h3>Tickets</h3>

            {message && <p className="notice">{message}</p>}

            {ticketTypes.map((t) => (
                <div key={t.id} className="ticket-row">
                    <span>
                        {t.name} - Rs. {t.price} (
                        {t.availableQuantity} left)
                    </span>

                    {user?.role === 'CUSTOMER' &&
                        t.availableQuantity > 0 && (
                            <>
                                <input
                                    type="number"
                                    min="1"
                                    max={t.availableQuantity}
                                    value={quantities[t.id] || 1}
                                    onChange={(e) =>
                                        setQuantities({
                                            ...quantities,
                                            [t.id]: Number(e.target.value)
                                        })
                                    }
                                />

                                <button
                                    onClick={() =>
                                        handleBook(t.id)
                                    }
                                >
                                    Book
                                </button>
                            </>
                        )}

                    {t.availableQuantity === 0 && (
                        <span>Sold out</span>
                    )}
                </div>
            ))}
        </div>
    );
}