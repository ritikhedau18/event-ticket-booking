import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/login');
    };

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    const getInitial = () => {
        if (!user?.username) {
            return '?';
        }

        return user.username.charAt(0).toUpperCase();
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* Brand */}
                <Link
                    to="/"
                    className="navbar-brand"
                    onClick={closeMobileMenu}
                >
                    <div className="brand-icon">🎟️</div>

                    <span className="brand-text">
                        Event<span>Hub</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">

                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Events
                    </Link>

                    {user?.role === 'CUSTOMER' && (
                        <Link
                            to="/my-bookings"
                            className={`nav-link ${
                                isActive('/my-bookings') ? 'active' : ''
                            }`}
                        >
                            My Bookings
                        </Link>
                    )}

                    {user?.role === 'ORGANIZER' && (
                        <Link
                            to="/organizer"
                            className={`nav-link ${
                                isActive('/organizer') ? 'active' : ''
                            }`}
                        >
                            Organizer Dashboard
                        </Link>
                    )}

                    {user?.role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            className={`nav-link ${
                                isActive('/admin') ? 'active' : ''
                            }`}
                        >
                            Admin Panel
                        </Link>
                    )}
                </div>

                {/* Desktop Right Side */}
                <div className="navbar-right">

                    {user ? (
                        <>
                            <div className="user-pill">
                                <div className="user-avatar">
                                    {getInitial()}
                                </div>

                                <div className="user-info">
                                    <strong>{user.username}</strong>
                                    <span>{user.role}</span>
                                </div>
                            </div>

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                <span>↪</span>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="nav-login"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="nav-register"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="mobile-menu">

                    <Link
                        to="/"
                        className={`mobile-nav-link ${
                            isActive('/') ? 'active' : ''
                        }`}
                        onClick={closeMobileMenu}
                    >
                        Events
                    </Link>

                    {user?.role === 'CUSTOMER' && (
                        <Link
                            to="/my-bookings"
                            className={`mobile-nav-link ${
                                isActive('/my-bookings') ? 'active' : ''
                            }`}
                            onClick={closeMobileMenu}
                        >
                            My Bookings
                        </Link>
                    )}

                    {user?.role === 'ORGANIZER' && (
                        <Link
                            to="/organizer"
                            className={`mobile-nav-link ${
                                isActive('/organizer') ? 'active' : ''
                            }`}
                            onClick={closeMobileMenu}
                        >
                            Organizer Dashboard
                        </Link>
                    )}

                    {user?.role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            className={`mobile-nav-link ${
                                isActive('/admin') ? 'active' : ''
                            }`}
                            onClick={closeMobileMenu}
                        >
                            Admin Panel
                        </Link>
                    )}

                    {user ? (
                        <>
                            <div className="mobile-user">
                                <div className="user-avatar">
                                    {getInitial()}
                                </div>

                                <div>
                                    <strong>{user.username}</strong>
                                    <span>{user.role}</span>
                                </div>
                            </div>

                            <button
                                className="mobile-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="mobile-auth-links">
                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                onClick={closeMobileMenu}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}