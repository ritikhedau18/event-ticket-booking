import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function OrganizerDashboardPage() {
    const [myEvents, setMyEvents] = useState([]);
    const [venues, setVenues] = useState([]);

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        eventDateTime: '',
        venueId: ''
    });

    const [ticketForm, setTicketForm] = useState({});
    const [message, setMessage] = useState('');

    const loadEvents = async () => {
        const res = await axiosInstance.get('/events/mine');
        setMyEvents(res.data);
    };

    useEffect(() => {
        loadEvents();

        axiosInstance
            .get('/venues')
            .then((res) => setVenues(res.data));
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await axiosInstance.post('/events', form);

            setMessage(
                'Event created - pending admin approval.'
            );

            setForm({
                title: '',
                description: '',
                category: '',
                eventDateTime: '',
                venueId: ''
            });

            loadEvents();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Failed to create event'
            );
        }
    };

    const handleAddTicketType = async (eventId) => {
        const data = ticketForm[eventId];

        if (
            !data?.name ||
            !data?.price ||
            !data?.totalQuantity
        ) {
            return;
        }

        try {
            await axiosInstance.post(
                `/events/${eventId}/ticket-types`,
                {
                    name: data.name,
                    price: Number(data.price),
                    totalQuantity: Number(data.totalQuantity)
                }
            );

            setMessage('Ticket type added.');

            setTicketForm({
                ...ticketForm,
                [eventId]: {}
            });
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Failed to add ticket type'
            );
        }
    };

    return (
        <div>
            <h2>Organizer Dashboard</h2>

            {message && (
                <p className="notice">{message}</p>
            )}

            <h3>Create Event</h3>

            <form onSubmit={handleCreateEvent}>
                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title: e.target.value
                        })
                    }
                    required
                />

                <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            category: e.target.value
                        })
                    }
                    required
                />

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            description: e.target.value
                        })
                    }
                />

                <input
                    type="datetime-local"
                    value={form.eventDateTime}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            eventDateTime: e.target.value
                        })
                    }
                    required
                />

                <select
                    value={form.venueId}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            venueId: e.target.value
                        })
                    }
                    required
                >
                    <option value="">
                        Select venue
                    </option>

                    {venues.map((v) => (
                        <option
                            key={v.id}
                            value={v.id}
                        >
                            {v.name}, {v.city}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    Create Event
                </button>
            </form>

            <h3>My Events</h3>

            {myEvents.map((event) => (
                <div
                    key={event.id}
                    className="organizer-event-card"
                >
                    <h4>
                        {event.title} - {event.status}
                    </h4>

                    <p>
                        {event.venueName}, {event.venueCity}
                    </p>

                    {event.status === 'APPROVED' && (
                        <div>
                            <input
                                placeholder="Ticket name"
                                value={
                                    ticketForm[event.id]?.name || ''
                                }
                                onChange={(e) =>
                                    setTicketForm({
                                        ...ticketForm,
                                        [event.id]: {
                                            ...ticketForm[event.id],
                                            name: e.target.value
                                        }
                                    })
                                }
                            />

                            <input
                                placeholder="Price"
                                type="number"
                                value={
                                    ticketForm[event.id]?.price || ''
                                }
                                onChange={(e) =>
                                    setTicketForm({
                                        ...ticketForm,
                                        [event.id]: {
                                            ...ticketForm[event.id],
                                            price: e.target.value
                                        }
                                    })
                                }
                            />

                            <input
                                placeholder="Quantity"
                                type="number"
                                value={
                                    ticketForm[event.id]
                                        ?.totalQuantity || ''
                                }
                                onChange={(e) =>
                                    setTicketForm({
                                        ...ticketForm,
                                        [event.id]: {
                                            ...ticketForm[event.id],
                                            totalQuantity:
                                                e.target.value
                                        }
                                    })
                                }
                            />

                            <button
                                onClick={() =>
                                    handleAddTicketType(event.id)
                                }
                            >
                                Add Ticket Type
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}