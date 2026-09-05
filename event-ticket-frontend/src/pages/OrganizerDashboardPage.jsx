import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function OrganizerDashboardPage() {
    const [myEvents, setMyEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [ticketTypes, setTicketTypes] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        eventDateTime: '',
        venueId: ''
    });

    const [ticketForm, setTicketForm] = useState({});
    const [creatingEvent, setCreatingEvent] = useState(false);
    const [addingTicket, setAddingTicket] = useState(null);

    const loadEvents = async () => {
        try {
            const res = await axiosInstance.get('/events/mine');
            const events = res.data;

            setMyEvents(events);

            // Load existing ticket types for approved events.
            const approvedEvents = events.filter(
                (event) => event.status === 'APPROVED'
            );

            const ticketResults = await Promise.all(
                approvedEvents.map(async (event) => {
                    try {
                        const response = await axiosInstance.get(
                            `/events/${event.id}/ticket-types`
                        );

                        return {
                            eventId: event.id,
                            tickets: response.data
                        };
                    } catch {
                        return {
                            eventId: event.id,
                            tickets: []
                        };
                    }
                })
            );

            const ticketMap = {};

            ticketResults.forEach((result) => {
                ticketMap[result.eventId] = result.tickets;
            });

            setTicketTypes(ticketMap);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Unable to load your events.'
            );
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();

        axiosInstance
            .get('/venues')
            .then((res) => setVenues(res.data))
            .catch(() => {
                setMessage('Unable to load venues.');
                setMessageType('error');
            });
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        setMessage('');
        setCreatingEvent(true);

        try {
            await axiosInstance.post('/events', form);

            setMessage(
                'Event created successfully — pending admin approval.'
            );
            setMessageType('success');

            setForm({
                title: '',
                description: '',
                category: '',
                eventDateTime: '',
                venueId: ''
            });

            await loadEvents();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Failed to create event.'
            );
            setMessageType('error');
        } finally {
            setCreatingEvent(false);
        }
    };

    const handleTicketChange = (eventId, field, value) => {
        setTicketForm({
            ...ticketForm,
            [eventId]: {
                ...ticketForm[eventId],
                [field]: value
            }
        });
    };

    const handleAddTicketType = async (eventId) => {
        const data = ticketForm[eventId];

        if (
            !data?.name ||
            !data?.price ||
            !data?.totalQuantity
        ) {
            setMessage('Please fill in all ticket fields.');
            setMessageType('error');
            return;
        }

        setMessage('');
        setAddingTicket(eventId);

        try {
            await axiosInstance.post(
                `/events/${eventId}/ticket-types`,
                {
                    name: data.name,
                    price: Number(data.price),
                    totalQuantity: Number(data.totalQuantity)
                }
            );

            setMessage('Ticket type added successfully.');
            setMessageType('success');

            setTicketForm({
                ...ticketForm,
                [eventId]: {}
            });

            await loadEvents();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Failed to add ticket type.'
            );
            setMessageType('error');
        } finally {
            setAddingTicket(null);
        }
    };

    const approvedCount = myEvents.filter(
        (event) => event.status === 'APPROVED'
    ).length;

    const pendingCount = myEvents.filter(
        (event) => event.status === 'PENDING'
    ).length;

    const rejectedCount = myEvents.filter(
        (event) => event.status === 'REJECTED'
    ).length;

    const formatDate = (dateTime) => {
        if (!dateTime) return '';

        return new Date(dateTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateTime) => {
        if (!dateTime) return '';

        return new Date(dateTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="organizer-dashboard">

            {/* Dashboard hero */}
            <section className="dashboard-hero">

                <div>
                    <span className="dashboard-eyebrow">
                        ORGANIZER CENTER
                    </span>

                    <h1>Organizer Dashboard</h1>

                    <p>
                        Create events, manage your tickets, and keep
                        everything organized in one place.
                    </p>
                </div>

                <div className="dashboard-hero-icon">
                    🎟️
                </div>
            </section>

            {/* Stats */}
            <section className="dashboard-stats">

                <div className="dashboard-stat">
                    <div className="stat-icon">🎫</div>

                    <div>
                        <span>Total events</span>
                        <strong>{myEvents.length}</strong>
                    </div>
                </div>

                <div className="dashboard-stat">
                    <div className="stat-icon approved-icon">✓</div>

                    <div>
                        <span>Approved</span>
                        <strong>{approvedCount}</strong>
                    </div>
                </div>

                <div className="dashboard-stat">
                    <div className="stat-icon pending-icon">◷</div>

                    <div>
                        <span>Pending</span>
                        <strong>{pendingCount}</strong>
                    </div>
                </div>

                <div className="dashboard-stat">
                    <div className="stat-icon rejected-icon">!</div>

                    <div>
                        <span>Rejected</span>
                        <strong>{rejectedCount}</strong>
                    </div>
                </div>

            </section>

            {/* Message */}
            {message && (
                <div
                    className={
                        messageType === 'success'
                            ? 'dashboard-message success'
                            : 'dashboard-message error'
                    }
                >
                    <span>
                        {messageType === 'success' ? '✓' : '!'}
                    </span>

                    <p>{message}</p>
                </div>
            )}

            {/* Create event */}
            <section className="create-event-section">

                <div className="section-heading">
                    <div>
                        <span className="section-label">
                            CREATE
                        </span>

                        <h2>Create a new event</h2>

                        <p>
                            Submit your event for admin approval.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleCreateEvent}
                    className="create-event-form"
                >

                    <div className="form-field">
                        <label>Event title</label>

                        <input
                            type="text"
                            placeholder="e.g. Spring Boot Workshop"
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Category</label>

                        <input
                            type="text"
                            placeholder="e.g. Technology"
                            value={form.category}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-field full-width">
                        <label>Description</label>

                        <textarea
                            placeholder="Tell attendees what your event is about..."
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }
                            rows="4"
                        />
                    </div>

                    <div className="form-field">
                        <label>Date & time</label>

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
                    </div>

                    <div className="form-field">
                        <label>Venue</label>

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
                                Select a venue
                            </option>

                            {venues.map((venue) => (
                                <option
                                    key={venue.id}
                                    value={venue.id}
                                >
                                    {venue.name}, {venue.city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-submit-area">
                        <button
                            type="submit"
                            className="dashboard-primary-button"
                            disabled={creatingEvent}
                        >
                            {creatingEvent
                                ? 'Creating event...'
                                : 'Create Event →'}
                        </button>

                        <span>
                            Your event will appear after admin approval.
                        </span>
                    </div>

                </form>
            </section>

            {/* My events */}
            <section className="my-events-section">

                <div className="section-heading events-heading">
                    <div>
                        <span className="section-label">
                            MANAGEMENT
                        </span>

                        <h2>My Events</h2>

                        <p>
                            Manage your events and ticket types.
                        </p>
                    </div>

                    <span className="event-total">
                        {myEvents.length} event
                        {myEvents.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {loading ? (
                    <div className="dashboard-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your events...</p>
                    </div>
                ) : myEvents.length === 0 ? (
                    <div className="dashboard-empty">
                        <div>🎟️</div>

                        <h3>No events yet</h3>

                        <p>
                            Create your first event using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="organizer-events-list">

                        {myEvents.map((event) => (
                            <article
                                key={event.id}
                                className="organizer-event"
                            >

                                {/* Event header */}
                                <div className="organizer-event-header">

                                    <div className="organizer-event-title">

                                        <div className="event-mini-icon">
                                            🎫
                                        </div>

                                        <div>
                                            <span className="event-id">
                                                EVENT #{event.id}
                                            </span>

                                            <h3>{event.title}</h3>

                                            <p>
                                                {event.category}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`event-status ${event.status.toLowerCase()}`}
                                    >
                                        <span></span>
                                        {event.status}
                                    </span>

                                </div>

                                {/* Event details */}
                                <div className="organizer-event-meta">

                                    <div>
                                        <span>📍</span>
                                        <div>
                                            <small>Venue</small>
                                            <strong>
                                                {event.venueName}
                                            </strong>
                                            <em>
                                                {event.venueCity}
                                            </em>
                                        </div>
                                    </div>

                                    <div>
                                        <span>📅</span>
                                        <div>
                                            <small>Date</small>
                                            <strong>
                                                {formatDate(
                                                    event.eventDateTime
                                                )}
                                            </strong>
                                            <em>
                                                {formatTime(
                                                    event.eventDateTime
                                                )}
                                            </em>
                                        </div>
                                    </div>

                                </div>

                                {/* Ticket management */}
                                {event.status === 'APPROVED' && (
                                    <div className="event-tickets-management">

                                        <div className="tickets-management-header">
                                            <div>
                                                <span className="section-label">
                                                    TICKETS
                                                </span>

                                                <h4>
                                                    Ticket types
                                                </h4>
                                            </div>

                                            <span>
                                                {(ticketTypes[event.id] || []).length}{' '}
                                                type
                                                {(ticketTypes[event.id] || []).length !== 1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                        </div>

                                        {/* Existing tickets */}
                                        {(ticketTypes[event.id] || []).length > 0 && (
                                            <div className="organizer-ticket-list">

                                                {ticketTypes[event.id].map(
                                                    (ticket) => (
                                                        <div
                                                            key={ticket.id}
                                                            className="organizer-ticket"
                                                        >

                                                            <div className="organizer-ticket-info">

                                                                <div className="ticket-small-icon">
                                                                    🎟️
                                                                </div>

                                                                <div>
                                                                    <strong>
                                                                        {ticket.name}
                                                                    </strong>

                                                                    <span>
                                                                        ₹{Number(
                                                                            ticket.price
                                                                        ).toFixed(2)}
                                                                        {' '}per ticket
                                                                    </span>
                                                                </div>

                                                            </div>

                                                            <div className="ticket-stock">
                                                                <span>
                                                                    AVAILABLE
                                                                </span>

                                                                <strong>
                                                                    {ticket.availableQuantity}
                                                                </strong>

                                                                <small>
                                                                    tickets
                                                                </small>
                                                            </div>

                                                            {/* Future functionality */}
                                                            <div className="ticket-management-placeholder">
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    title="Ticket editing will be implemented after the UI redesign."
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    title="Quantity management will be implemented after the UI redesign."
                                                                >
                                                                    Manage
                                                                </button>
                                                            </div>

                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        )}

                                        {/* Add ticket */}
                                        <div className="add-ticket-box">

                                            <div className="add-ticket-heading">
                                                <span>＋</span>

                                                <div>
                                                    <strong>
                                                        Add ticket type
                                                    </strong>

                                                    <small>
                                                        Add another ticket category
                                                        for this event.
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="ticket-form-grid">

                                                <input
                                                    placeholder="Ticket name"
                                                    value={
                                                        ticketForm[event.id]?.name ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleTicketChange(
                                                            event.id,
                                                            'name',
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <input
                                                    placeholder="Price"
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        ticketForm[event.id]?.price ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleTicketChange(
                                                            event.id,
                                                            'price',
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <input
                                                    placeholder="Quantity"
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        ticketForm[event.id]
                                                            ?.totalQuantity || ''
                                                    }
                                                    onChange={(e) =>
                                                        handleTicketChange(
                                                            event.id,
                                                            'totalQuantity',
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <button
                                                    type="button"
                                                    className="add-ticket-button"
                                                    onClick={() =>
                                                        handleAddTicketType(
                                                            event.id
                                                        )
                                                    }
                                                    disabled={
                                                        addingTicket === event.id
                                                    }
                                                >
                                                    {addingTicket === event.id
                                                        ? 'Adding...'
                                                        : 'Add Ticket'}
                                                </button>

                                            </div>
                                        </div>

                                    </div>
                                )}

                                {/* Pending */}
                                {event.status === 'PENDING' && (
                                    <div className="event-status-message pending-message">
                                        <span>◷</span>

                                        <div>
                                            <strong>
                                                Waiting for admin approval
                                            </strong>

                                            <p>
                                                Ticket types can be added once
                                                this event is approved.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Rejected */}
                                {event.status === 'REJECTED' && (
                                    <div className="event-status-message rejected-message">
                                        <span>!</span>

                                        <div>
                                            <strong>
                                                Event rejected
                                            </strong>

                                            <p>
                                                This event is not currently
                                                available for ticket management.
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </article>
                        ))}

                    </div>
                )}

            </section>
        </div>
    );
}