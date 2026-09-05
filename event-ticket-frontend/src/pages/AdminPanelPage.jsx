import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function AdminPanelPage() {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [venues, setVenues] = useState([]);

    const [venueForm, setVenueForm] = useState({
        name: '',
        address: '',
        city: '',
        capacity: ''
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [loading, setLoading] = useState(true);
    const [approvingEvent, setApprovingEvent] = useState(null);
    const [creatingVenue, setCreatingVenue] = useState(false);

    const loadData = async () => {
        try {
            const [pendingRes, venuesRes] = await Promise.all([
                axiosInstance.get('/events/pending'),
                axiosInstance.get('/venues')
            ]);

            setPendingEvents(pendingRes.data);
            setVenues(venuesRes.data);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Unable to load admin data.'
            );
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleApprove = async (id) => {
        setMessage('');
        setApprovingEvent(id);

        try {
            await axiosInstance.put(`/events/${id}/approve`);

            setMessage('Event approved successfully.');
            setMessageType('success');

            await loadData();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Failed to approve event.'
            );
            setMessageType('error');
        } finally {
            setApprovingEvent(null);
        }
    };

    const handleVenueChange = (field, value) => {
        setVenueForm({
            ...venueForm,
            [field]: value
        });
    };

    const handleCreateVenue = async (e) => {
        e.preventDefault();

        setMessage('');
        setCreatingVenue(true);

        try {
            await axiosInstance.post('/venues', {
                ...venueForm,
                capacity: Number(venueForm.capacity)
            });

            setMessage('Venue created successfully.');
            setMessageType('success');

            setVenueForm({
                name: '',
                address: '',
                city: '',
                capacity: ''
            });

            await loadData();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Failed to create venue.'
            );
            setMessageType('error');
        } finally {
            setCreatingVenue(false);
        }
    };

    return (
        <div className="admin-dashboard">

            {/* Hero */}
            <section className="admin-hero">

                <div>
                    <span className="admin-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>Admin Panel</h1>

                    <p>
                        Review events, manage venues, and keep the
                        Evently platform running smoothly.
                    </p>
                </div>

                <div className="admin-hero-icon">
                    ⚙️
                </div>

            </section>

            {/* Stats */}
            <section className="admin-stats">

                <div className="admin-stat-card">
                    <div className="admin-stat-icon pending">
                        ◷
                    </div>

                    <div>
                        <span>Awaiting approval</span>
                        <strong>{pendingEvents.length}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon venues">
                        📍
                    </div>

                    <div>
                        <span>Total venues</span>
                        <strong>{venues.length}</strong>
                    </div>
                </div>

            </section>

            {/* Message */}
            {message && (
                <div
                    className={
                        messageType === 'success'
                            ? 'admin-message success'
                            : 'admin-message error'
                    }
                >
                    <span>
                        {messageType === 'success' ? '✓' : '!'}
                    </span>

                    <p>{message}</p>
                </div>
            )}

            {/* Pending events */}
            <section className="admin-section">

                <div className="admin-section-heading">

                    <div>
                        <span className="admin-section-label">
                            REVIEW
                        </span>

                        <h2>Pending Events</h2>

                        <p>
                            Review and approve events submitted by
                            organizers.
                        </p>
                    </div>

                    <span className="admin-count">
                        {pendingEvents.length} pending
                    </span>

                </div>

                {loading ? (
                    <div className="admin-loading">
                        <div className="admin-spinner"></div>
                        <p>Loading pending events...</p>
                    </div>
                ) : pendingEvents.length === 0 ? (
                    <div className="admin-empty">

                        <div className="admin-empty-icon">
                            ✓
                        </div>

                        <h3>Nothing pending</h3>

                        <p>
                            All submitted events have been reviewed.
                        </p>

                    </div>
                ) : (
                    <div className="pending-events-list">

                        {pendingEvents.map((event) => (
                            <article
                                key={event.id}
                                className="pending-event-card"
                            >

                                <div className="pending-event-main">

                                    <div className="pending-event-icon">
                                        🎫
                                    </div>

                                    <div>
                                        <span className="pending-event-id">
                                            EVENT #{event.id}
                                        </span>

                                        <h3>{event.title}</h3>

                                        <span className="pending-category">
                                            {event.category}
                                        </span>
                                    </div>

                                </div>

                                <div className="pending-event-details">

                                    <div>
                                        <span>📍</span>

                                        <div>
                                            <small>VENUE</small>

                                            <strong>
                                                {event.venueName}
                                            </strong>

                                            <em>
                                                {event.venueCity}
                                            </em>
                                        </div>
                                    </div>

                                    <div>
                                        <span>👤</span>

                                        <div>
                                            <small>ORGANIZER</small>

                                            <strong>
                                                {event.organizerUsername}
                                            </strong>
                                        </div>
                                    </div>

                                    <div>
                                        <span>📅</span>

                                        <div>
                                            <small>EVENT DATE</small>

                                            <strong>
                                                {new Date(
                                                    event.eventDateTime
                                                ).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }
                                                )}
                                            </strong>

                                            <em>
                                                {new Date(
                                                    event.eventDateTime
                                                ).toLocaleTimeString(
                                                    'en-US',
                                                    {
                                                        hour: 'numeric',
                                                        minute: '2-digit'
                                                    }
                                                )}
                                            </em>
                                        </div>
                                    </div>

                                </div>

                                <div className="pending-event-action">

                                    <span className="pending-badge">
                                        <span></span>
                                        PENDING
                                    </span>

                                    <button
                                        type="button"
                                        className="approve-button"
                                        onClick={() =>
                                            handleApprove(event.id)
                                        }
                                        disabled={
                                            approvingEvent === event.id
                                        }
                                    >
                                        {approvingEvent === event.id
                                            ? 'Approving...'
                                            : 'Approve Event →'}
                                    </button>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

            {/* Venue management */}
            <section className="admin-section venue-section">

                <div className="admin-section-heading">

                    <div>
                        <span className="admin-section-label">
                            MANAGEMENT
                        </span>

                        <h2>Venues</h2>

                        <p>
                            Add locations where organizers can host
                            their events.
                        </p>
                    </div>

                    <span className="admin-count">
                        {venues.length} venues
                    </span>

                </div>

                <div className="venue-management-layout">

                    {/* Create venue */}
                    <div className="venue-create-card">

                        <div className="venue-create-heading">

                            <div className="venue-create-icon">
                                ＋
                            </div>

                            <div>
                                <h3>Add a venue</h3>

                                <p>
                                    Create a new venue for organizers.
                                </p>
                            </div>

                        </div>

                        <form onSubmit={handleCreateVenue}>

                            <div className="admin-form-field">
                                <label>Venue name</label>

                                <input
                                    placeholder="e.g. City Arena"
                                    value={venueForm.name}
                                    onChange={(e) =>
                                        handleVenueChange(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="admin-form-field">
                                <label>Address</label>

                                <input
                                    placeholder="e.g. 123 Main Street"
                                    value={venueForm.address}
                                    onChange={(e) =>
                                        handleVenueChange(
                                            'address',
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="admin-form-row">

                                <div className="admin-form-field">
                                    <label>City</label>

                                    <input
                                        placeholder="Mumbai"
                                        value={venueForm.city}
                                        onChange={(e) =>
                                            handleVenueChange(
                                                'city',
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="admin-form-field">
                                    <label>Capacity</label>

                                    <input
                                        placeholder="1000"
                                        type="number"
                                        min="1"
                                        value={venueForm.capacity}
                                        onChange={(e) =>
                                            handleVenueChange(
                                                'capacity',
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={creatingVenue}
                            >
                                {creatingVenue
                                    ? 'Creating venue...'
                                    : 'Add Venue →'}
                            </button>

                        </form>

                    </div>

                    {/* Existing venues */}
                    <div className="existing-venues">

                        <div className="existing-venues-heading">
                            <h3>Existing venues</h3>
                            <span>{venues.length}</span>
                        </div>

                        {venues.length === 0 ? (
                            <div className="no-venues">
                                No venues available yet.
                            </div>
                        ) : (
                            <div className="venue-list">

                                {venues.map((venue) => (
                                    <div
                                        key={venue.id}
                                        className="venue-card"
                                    >

                                        <div className="venue-card-icon">
                                            📍
                                        </div>

                                        <div className="venue-card-info">
                                            <strong>
                                                {venue.name}
                                            </strong>

                                            <span>
                                                {venue.city}
                                            </span>

                                            <small>
                                                {venue.address}
                                            </small>
                                        </div>

                                        <div className="venue-capacity">
                                            <strong>
                                                {venue.capacity}
                                            </strong>

                                            <span>
                                                capacity
                                            </span>
                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>

            </section>

        </div>
    );
}