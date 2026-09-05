import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/">Events</Link>

            {user ? (
                <>
                    <span>Hi, {user.username}</span>

                    {user.role === 'ORGANIZER' && (
                        <Link to="/organizer">
                            Organizer Dashboard
                        </Link>
                    )}

                    {user.role === 'ADMIN' && (
                        <Link to="/admin">
                            Admin Panel
                        </Link>
                    )}

                    {user.role === 'CUSTOMER' && (
                        <Link to="/my-bookings">
                            My Bookings
                        </Link>
                    )}

                    <button onClick={handleLogout}>
                        Logout
                    </button>
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