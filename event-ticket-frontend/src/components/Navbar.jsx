import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav>
            <Link to="/">Events</Link>

            {user ? (
                <>
                    <span>Hi, {user.username}</span>

                    {user.role === 'ORGANIZER' && (
                        <Link to="/organizer">Organizer Dashboard</Link>
                    )}

                    {user.role === 'ADMIN' && (
                        <Link to="/admin">Admin Panel</Link>
                    )}

                    {user.role === 'CUSTOMER' && (
                        <Link to="/bookings">My Bookings</Link>
                    )}

                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}