import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function EventDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingId, setBookingId] = useState(null);

    const loadData = async () => {
        try {
            const eventRes = await axiosInstance.get(`/events/${id}`);
            setEvent(eventRes.data);

            const ticketRes = await axiosInstance.get(
                `/events/${id}/ticket-types`
            );
            setTicketTypes(ticketRes.data);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                'Unable to load event details.'
            );
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleQuantityChange = (ticketTypeId, value, max) => {
        const quantity = Math.min(Math.max(value, 1), max);

        setQuantities({
            ...quantities,
            [ticketTypeId]: quantity
        });
    };

    const handleBook = async (ticketTypeId) => {
        setMessage('');
        setMessageType('');
        setBookingId(ticketTypeId);

        const quantity = quantities[ticketTypeId] || 1;

        try {
            await axiosInstance.post('/bookings', {
                ticketTypeId,
                quantity
            });

            setMessage('Ticket booked successfully! Check My Bookings.');
            setMessageType('success');

            await loadData();
        } catch (err) {
            setMessage(
                err.response?.data?.message || 'Booking failed'
            );
            setMessageType('error');
        } finally {
            setBookingId(null);
        }
    };

    if (loading) {
        return (
            <div className="detail-loading">
                <div className="loading-spinner"></div>
                <p>Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="detail-error-page">
                <div className="empty-icon">🎟️</div>
                <h2>Event not found</h2>
                <p>We couldn't find the event you're looking for.</p>
                <Link to="/" className="back-events-button">
                    ← Back to events
                </Link>
            </div>
        );
    }

    const eventDate = new Date(event.eventDateTime);

    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    return (
        <div className="event-detail-page">

            {/* Back navigation */}
            <Link to="/" className="back-link">
                ← Back to events
            </Link>

            {/* Event Hero */}
            <section className="event-detail-hero">

                <div className="detail-hero-pattern"></div>

                <div className="detail-hero-content">

                    <span className="detail-category">
                        {event.category || 'EVENT'}
                    </span>

                    <h1>{event.title}</h1>

                    <p className="detail-description">
                        {event.description}
                    </p>

                    <div className="detail-info-grid">

                        <div className="detail-info-item">
                            <div className="detail-info-icon">📍</div>

                            <div>
                                <span>VENUE</span>
                                <strong>{event.venueName}</strong>
                                <small>{event.venueCity}</small>
                            </div>
                        </div>

                        <div className="detail-info-item">
                            <div className="detail-info-icon">📅</div>

                            <div>
                                <span>DATE</span>
                                <strong>{formattedDate}</strong>
                                <small>{formattedTime}</small>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Booking message */}
            {message && (
                <div
                    className={
                        messageType === 'success'
                            ? 'booking-message booking-success'
                            : 'booking-message booking-error'
                    }
                >
                    <span>
                        {messageType === 'success' ? '✓' : '!'}
                    </span>

                    <p>{message}</p>
                </div>
            )}

            {/* Tickets */}
            <section className="tickets-section">

                <div className="tickets-header">
                    <div>
                        <span className="section-label">CHOOSE YOUR TICKET</span>
                        <h2>Available tickets</h2>
                    </div>

                    <span className="ticket-count">
                        {ticketTypes.length} option
                        {ticketTypes.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {ticketTypes.length === 0 ? (
                    <div className="no-tickets">
                        <div className="empty-icon">🎫</div>
                        <h3>No tickets available</h3>
                        <p>
                            Tickets for this event haven't been added yet.
                        </p>
                    </div>
                ) : (
                    <div className="ticket-list">

                        {ticketTypes.map((ticket) => {
                            const quantity =
                                quantities[ticket.id] || 1;

                            const soldOut =
                                ticket.availableQuantity === 0;

                            const totalPrice =
                                Number(ticket.price) * quantity;

                            return (
                                <div
                                    key={ticket.id}
                                    className={`ticket-card ${
                                        soldOut ? 'ticket-sold-out' : ''
                                    }`}
                                >

                                    <div className="ticket-card-left">

                                        <div className="ticket-icon">
                                            🎟️
                                        </div>

                                        <div>
                                            <h3>{ticket.name}</h3>

                                            <p className="ticket-price">
                                                ₹{Number(ticket.price).toFixed(2)}
                                                <span> / ticket</span>
                                            </p>

                                            <div className="ticket-availability">
                                                {soldOut ? (
                                                    <span className="sold-out-badge">
                                                        SOLD OUT
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="availability-dot"></span>
                                                        {ticket.availableQuantity}{' '}
                                                        ticket
                                                        {ticket.availableQuantity !== 1
                                                            ? 's'
                                                            : ''}{' '}
                                                        remaining
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                    </div>

                                    {!soldOut &&
                                        user?.role === 'CUSTOMER' && (
                                            <div className="ticket-purchase">

                                                <div className="quantity-control">
                                                    <button
                                                        type="button"
                                                        disabled={quantity <= 1}
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                ticket.id,
                                                                quantity - 1,
                                                                ticket.availableQuantity
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>

                                                    <span>
                                                        {quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            quantity >=
                                                            ticket.availableQuantity
                                                        }
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                ticket.id,
                                                                quantity + 1,
                                                                ticket.availableQuantity
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="ticket-total">
                                                    <span>Total</span>
                                                    <strong>
                                                        ₹{totalPrice.toFixed(2)}
                                                    </strong>
                                                </div>

                                                <button
                                                    className="book-ticket-button"
                                                    onClick={() =>
                                                        handleBook(ticket.id)
                                                    }
                                                    disabled={
                                                        bookingId === ticket.id
                                                    }
                                                >
                                                    {bookingId === ticket.id
                                                        ? 'Booking...'
                                                        : 'Book Ticket →'}
                                                </button>

                                            </div>
                                        )}

                                    {!soldOut &&
                                        !user && (
                                            <Link
                                                to="/login"
                                                className="login-to-book"
                                            >
                                                Sign in to book →
                                            </Link>
                                        )}

                                    {!soldOut &&
                                        user?.role !== 'CUSTOMER' && (
                                            <span className="customer-only">
                                                Customer accounts can book
                                                tickets.
                                            </span>
                                        )}

                                </div>
                            );
                        })}
                    </div>
                )}

            </section>
        </div>
    );
}