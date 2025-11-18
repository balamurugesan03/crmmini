import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            console.error('Backend server is not running on http://localhost:5000');
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;
