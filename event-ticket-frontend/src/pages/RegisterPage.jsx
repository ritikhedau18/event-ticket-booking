import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
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
            const res = await axiosInstance.post('/auth/register', form);

            login(res.data);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Registration failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background-shape shape-one"></div>
            <div className="auth-background-shape shape-two"></div>

            <div className="auth-container register-container">

                {/* Left branding section */}
                <div className="auth-showcase">
                    <div className="brand-mark">🎟️</div>

                    <h1>
                        Your next
                        <span> experience starts here</span>
                    </h1>

                    <p>
                        Create your account and start discovering
                        unforgettable events near you.
                    </p>

                    <div className="showcase-features">
                        <div className="showcase-feature">
                            <span>✓</span>
                            <p>Explore exciting events</p>
                        </div>

                        <div className="showcase-feature">
                            <span>✓</span>
                            <p>Book tickets with ease</p>
                        </div>

                        <div className="showcase-feature">
                            <span>✓</span>
                            <p>Keep your bookings organized</p>
                        </div>
                    </div>
                </div>

                {/* Register card */}
                <div className="auth-card register-card">

                    <div className="auth-card-header">
                        <p className="auth-eyebrow">GET STARTED</p>

                        <h2>Create your account</h2>

                        <p>
                            Fill in your details to join Evently.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">

                        {/* Username */}
                        <div className="input-group">
                            <label htmlFor="register-username">
                                Username
                            </label>

                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>

                                <input
                                    id="register-username"
                                    name="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="register-email">
                                Email address
                            </label>

                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>

                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>

                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
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

                            <span className="input-hint">
                                Password must be at least 6 characters.
                            </span>
                        </div>

                        {/* Role */}
                        <div className="input-group">
                            <label htmlFor="register-role">
                                Account type
                            </label>

                            <div className="input-wrapper">
                                <span className="input-icon">◉</span>

                                <select
                                    id="register-role"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="auth-select"
                                >
                                    <option value="CUSTOMER">
                                        Customer
                                    </option>

                                    <option value="ORGANIZER">
                                        Organizer
                                    </option>

                                    <option value="ADMIN">
                                        Admin
                                    </option>
                                </select>
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
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <p className="auth-footer">
                        Already have an account?
                        <Link to="/login">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}