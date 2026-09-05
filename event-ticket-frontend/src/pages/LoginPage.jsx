import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axiosInstance.post('/auth/login', form);

            login(res.data);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Invalid username or password'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background-shape shape-one"></div>
            <div className="auth-background-shape shape-two"></div>

            <div className="auth-container">

                {/* Left branding section */}
                <div className="auth-showcase">
                    <div className="brand-mark">🎟️</div>

                    <h1>
                        Welcome back to
                        <span> Evently</span>
                    </h1>

                    <p>
                        Discover amazing events, book your tickets,
                        and make memories worth remembering.
                    </p>

                    <div className="showcase-features">
                        <div className="showcase-feature">
                            <span>✓</span>
                            <p>Discover exciting events</p>
                        </div>

                        <div className="showcase-feature">
                            <span>✓</span>
                            <p>Secure ticket booking</p>
                        </div>

                        <div className="showcase-feature">
                            <span>✓</span>
                            <p>Manage all your bookings</p>
                        </div>
                    </div>
                </div>

                {/* Login card */}
                <div className="auth-card">
                    <div className="auth-card-header">
                        <p className="auth-eyebrow">WELCOME BACK</p>

                        <h2>Sign in to your account</h2>

                        <p>
                            Enter your details to continue.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">

                        <div className="input-group">
                            <label htmlFor="username">
                                Username
                            </label>

                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <p className="auth-footer">
                        Don't have an account?
                        <Link to="/register">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}