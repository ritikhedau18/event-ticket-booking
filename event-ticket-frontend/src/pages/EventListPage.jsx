import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function EventListPage() {
    const [events, setEvents] = useState([]);
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
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
        };

        fetchEvents();
    }, [city, category, page]);

    return (
        <div>
            <h2>Upcoming Events</h2>

            <div className="filters">
                <input
                    placeholder="Filter by city"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                        setPage(0);
                    }}
                />

                <input
                    placeholder="Filter by category"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(0);
                    }}
                />
            </div>

            <div className="event-grid">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        to={`/events/${event.id}`}
                        className="event-card"
                    >
                        <h3>{event.title}</h3>
                        <p>
                            {event.venueName}, {event.venueCity}
                        </p>
                        <p>
                            {new Date(event.eventDateTime).toLocaleString()}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="pagination">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>

                <span>
                    Page {page + 1} of {Math.max(totalPages, 1)}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}