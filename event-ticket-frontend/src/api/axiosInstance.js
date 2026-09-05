import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use((config) => {
    const stored = localStorage.getItem('user');

    if (stored) {
        const { token } = JSON.parse(stored);
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosInstance;