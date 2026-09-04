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

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axiosInstance.post('/auth/login', form);

            login(res.data);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Login failed'
            );
        }
    };

    return (
        <div className="form-page">
            <h2>Login</h2>

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
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Login</button>
            </form>

            <p>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}