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

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axiosInstance.post('/auth/register', form);

            login(res.data);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Registration failed'
            );
        }
    };

    return (
        <div className="form-page">
            <h2>Register</h2>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                />

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ORGANIZER">Organizer</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <button type="submit">Register</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}