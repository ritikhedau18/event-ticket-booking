import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axiosInstance
            .get('/bookings/my')
            .then((res) => setBookings(res.data));
    }, []);

    return (
        <div>
            <h2>My Bookings</h2>

            {bookings.length === 0 && (
                <p>No bookings yet.</p>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Ticket</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id}>
                            <td>{b.eventTitle}</td>
                            <td>{b.ticketTypeName}</td>
                            <td>{b.quantity}</td>
                            <td>Rs. {b.totalPrice}</td>
                            <td>{b.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}