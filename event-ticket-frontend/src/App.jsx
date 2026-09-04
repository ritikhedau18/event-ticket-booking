import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import AdminPage from './pages/AdminPage';

export default function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<EventListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/events/:id"
                    element={<EventDetailPage />}
                />

                <Route
                    path="/bookings"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <MyBookingsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/organizer"
                    element={
                        <ProtectedRoute allowedRoles={['ORGANIZER']}>
                            <OrganizerDashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}