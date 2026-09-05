import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function AdminPanelPage() {
    const [pendingEvents, setPendingEvents] = useState([]);

    const [venueForm, setVenueForm] = useState({
        name: '',
        address: '',
        city: '',
        capacity: ''
    });

    const [message, setMessage] = useState('');

    const loadPending = async () => {
        const res = await axiosInstance.get('/events/pending');
        setPendingEvents(res.data);
    };

    useEffect(() => {
        loadPending();
    }, []);

    const handleApprove = async (id) => {
        await axiosInstance.put(`/events/${id}/approve`);

        setMessage('Event approved.');

        loadPending();
    };

    const handleCreateVenue = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await axiosInstance.post('/venues', {
                ...venueForm,
                capacity: Number(venueForm.capacity)
            });

            setMessage('Venue created.');

            setVenueForm({
                name: '',
                address: '',
                city: '',
                capacity: ''
            });
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Failed to create venue'
            );
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>

            {message && (
                <p className="notice">{message}</p>
            )}

            <h3>Add Venue</h3>

            <form onSubmit={handleCreateVenue}>
                <input
                    placeholder="Name"
                    value={venueForm.name}
                    onChange={(e) =>
                        setVenueForm({
                            ...venueForm,
                            name: e.target.value
                        })
                    }
                    required
                />

                <input
                    placeholder="Address"
                    value={venueForm.address}
                    onChange={(e) =>
                        setVenueForm({
                            ...venueForm,
                            address: e.target.value
                        })
                    }
                    required
                />

                <input
                    placeholder="City"
                    value={venueForm.city}
                    onChange={(e) =>
                        setVenueForm({
                            ...venueForm,
                            city: e.target.value
                        })
                    }
                    required
                />

                <input
                    placeholder="Capacity"
                    type="number"
                    value={venueForm.capacity}
                    onChange={(e) =>
                        setVenueForm({
                            ...venueForm,
                            capacity: e.target.value
                        })
                    }
                />

                <button type="submit">
                    Add Venue
                </button>
            </form>

            <h3>Pending Events</h3>

            {pendingEvents.length === 0 && (
                <p>Nothing pending.</p>
            )}

            {pendingEvents.map((event) => (
                <div
                    key={event.id}
                    className="admin-event-card"
                >
                    <h4>{event.title}</h4>

                    <p>
                        {event.venueName}, {event.venueCity}
                        {' - '}
                        by {event.organizerUsername}
                    </p>

                    <button
                        onClick={() =>
                            handleApprove(event.id)
                        }
                    >
                        Approve
                    </button>
                </div>
            ))}
        </div>
    );
}