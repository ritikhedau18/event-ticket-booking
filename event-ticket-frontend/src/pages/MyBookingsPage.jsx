import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const res = await axiosInstance.get('/bookings/my');
                setBookings(res.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your bookings.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, []);

    const formatDate = (dateTime) => {
        if (!dateTime) return 'Date unavailable';

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
        <div className="bookings-page">

            {/* Header */}
            <section className="bookings-header">
                <div>
                    <span className="section-label">YOUR TICKETS</span>

                    <h1>My Bookings</h1>

                    <p>
                        Keep track of your tickets and upcoming experiences.
                    </p>
                </div>

                {!loading && bookings.length > 0 && (
                    <div className="booking-summary">
                        <span>{bookings.length}</span>
                        <small>
                            booking{bookings.length !== 1 ? 's' : ''}
                        </small>
                    </div>
                )}
            </section>

            {/* Loading */}
            {loading && (
                <div className="bookings-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your bookings...</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="bookings-error">
                    <span>!</span>

                    <div>
                        <strong>Something went wrong</strong>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && bookings.length === 0 && (
                <div className="bookings-empty">

                    <div className="empty-booking-icon">
                        🎟️
                    </div>

                    <h2>No bookings yet</h2>

                    <p>
                        You haven't booked any tickets yet.
                        Discover an event and get your next experience started.
                    </p>

                    <Link to="/" className="browse-events-button">
                        Browse Events →
                    </Link>
                </div>
            )}

            {/* Booking cards */}
            {!loading && !error && bookings.length > 0 && (
                <section className="booking-list">

                    {bookings.map((booking) => (
                        <article
                            key={booking.id}
                            className="booking-card"
                        >
                            {/* Ticket visual */}
                            <div className="booking-ticket-side">
                                <div className="booking-ticket-icon">
                                    🎟️
                                </div>

                                <span>EVENTLY</span>
                            </div>

                            {/* Main information */}
                            <div className="booking-main">

                                <div className="booking-top">
                                    <div>
                                        <span className="booking-label">
                                            EVENT
                                        </span>

                                        <h2>{booking.eventTitle}</h2>
                                    </div>

                                    <span
                                        className={`booking-status ${
                                            booking.status?.toLowerCase()
                                        }`}
                                    >
                                        <span className="status-dot"></span>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="booking-details">

                                    <div className="booking-detail">
                                        <span className="booking-detail-icon">
                                            🎫
                                        </span>

                                        <div>
                                            <small>Ticket type</small>
                                            <strong>
                                                {booking.ticketTypeName}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="booking-detail">
                                        <span className="booking-detail-icon">
                                            🔢
                                        </span>

                                        <div>
                                            <small>Quantity</small>
                                            <strong>
                                                {booking.quantity}{' '}
                                                ticket
                                                {booking.quantity !== 1
                                                    ? 's'
                                                    : ''}
                                            </strong>
                                        </div>
                                    </div>

                                    {booking.bookedAt && (
                                        <div className="booking-detail">
                                            <span className="booking-detail-icon">
                                                📅
                                            </span>

                                            <div>
                                                <small>Booked on</small>
                                                <strong>
                                                    {formatDate(
                                                        booking.bookedAt
                                                    )}
                                                </strong>

                                                <span className="booking-time">
                                                    {formatTime(
                                                        booking.bookedAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Price */}
                            <div className="booking-price-section">

                                <small>Total paid</small>

                                <strong>
                                    ₹{Number(booking.totalPrice).toFixed(2)}
                                </strong>

                                <span className="booking-reference">
                                    Booking #{booking.id}
                                </span>
                            </div>
                        </article>
                    ))}

                </section>
            )}

            {/* Bottom CTA */}
            {!loading && !error && bookings.length > 0 && (
                <div className="booking-bottom-cta">
                    <div>
                        <strong>Looking for your next event?</strong>
                        <span>
                            Discover more experiences and book your next ticket.
                        </span>
                    </div>

                    <Link to="/" className="browse-events-button">
                        Explore Events →
                    </Link>
                </div>
            )}
        </div>
    );
}