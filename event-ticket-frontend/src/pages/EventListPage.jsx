import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function EventListPage() {
    const [events, setEvents] = useState([]);
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError('');

            try {
                const res = await axiosInstance.get('/events', {
                    params: {
                        city,
                        category,
                        page,
                        size: 6
                    }
                });

                setEvents(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load events. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [city, category, page]);

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);

        return {
            day: date.toLocaleDateString('en-US', {
                day: '2-digit'
            }),
            month: date.toLocaleDateString('en-US', {
                month: 'short'
            }),
            weekday: date.toLocaleDateString('en-US', {
                weekday: 'short'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
            })
        };
    };

    return (
        <div className="events-page">

            {/* Hero */}
            <section className="events-hero">
                <div className="events-hero-content">
                    <span className="hero-badge">
                        ✦ DISCOVER YOUR NEXT EXPERIENCE
                    </span>

                    <h1>
                        Find events worth
                        <span> remembering.</span>
                    </h1>

                    <p>
                        Explore concerts, workshops, conferences and
                        experiences happening around you.
                    </p>
                </div>
            </section>

            {/* Search / Filters */}
            <section className="event-search-panel">

                <div className="search-panel-heading">
                    <div>
                        <span className="section-label">EXPLORE</span>
                        <h2>Find your perfect event</h2>
                    </div>

                    {(city || category) && (
                        <button
                            className="clear-filters"
                            onClick={() => {
                                setCity('');
                                setCategory('');
                                setPage(0);
                            }}
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                <div className="event-filters">

                    <div className="filter-input">
                        <span>📍</span>

                        <input
                            type="text"
                            placeholder="Search by city"
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>

                    <div className="filter-input">
                        <span>🏷️</span>

                        <input
                            type="text"
                            placeholder="Search by category"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Events */}
            <section className="events-section">

                <div className="events-section-header">
                    <div>
                        <span className="section-label">UPCOMING</span>
                        <h2>Featured events</h2>
                    </div>

                    {!loading && events.length > 0 && (
                        <span className="event-count">
                            {events.length} event
                            {events.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {loading && (
                    <div className="events-loading">
                        <div className="loading-spinner"></div>
                        <p>Finding amazing events...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="events-error">
                        <span>!</span>
                        <div>
                            <strong>Something went wrong</strong>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {!loading && !error && events.length === 0 && (
                    <div className="events-empty">
                        <div className="empty-icon">🎟️</div>

                        <h3>No events found</h3>

                        <p>
                            We couldn't find any events matching
                            your current filters.
                        </p>

                        {(city || category) && (
                            <button
                                onClick={() => {
                                    setCity('');
                                    setCategory('');
                                    setPage(0);
                                }}
                            >
                                View all events
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && events.length > 0 && (
                    <div className="modern-event-grid">

                        {events.map((event) => {
                            const date = formatDate(
                                event.eventDateTime
                            );

                            return (
                                <Link
                                    key={event.id}
                                    to={`/events/${event.id}`}
                                    className="modern-event-card"
                                >
                                    {/* Visual header */}
                                    <div className="event-card-visual">
                                        <div className="event-pattern"></div>

                                        <div className="event-date">
                                            <span>
                                                {date.month}
                                            </span>

                                            <strong>
                                                {date.day}
                                            </strong>

                                            <small>
                                                {date.weekday}
                                            </small>
                                        </div>

                                        <span className="event-category">
                                            {event.category || 'EVENT'}
                                        </span>
                                    </div>

                                    {/* Card body */}
                                    <div className="event-card-body">

                                        <h3>{event.title}</h3>

                                        {event.description && (
                                            <p className="event-description">
                                                {event.description.length > 100
                                                    ? `${event.description.substring(0, 100)}...`
                                                    : event.description}
                                            </p>
                                        )}

                                        <div className="event-meta">

                                            <div className="event-meta-row">
                                                <span>📍</span>
                                                <div>
                                                    <strong>
                                                        {event.venueName}
                                                    </strong>
                                                    <small>
                                                        {event.venueCity}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="event-meta-row">
                                                <span>🕐</span>
                                                <div>
                                                    <strong>
                                                        {date.time}
                                                    </strong>
                                                    <small>
                                                        {date.weekday}, {date.month} {date.day}
                                                    </small>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="event-card-footer">
                                            <span>View event</span>
                                            <span className="event-arrow">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && events.length > 0 && (
                    <div className="modern-pagination">

                        <button
                            className="pagination-button"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            ← Previous
                        </button>

                        <div className="pagination-info">
                            <span>
                                Page <strong>{page + 1}</strong> of{' '}
                                <strong>{Math.max(totalPages, 1)}</strong>
                            </span>
                        </div>

                        <button
                            className="pagination-button"
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next →
                        </button>

                    </div>
                )}
            </section>
        </div>
    );
}