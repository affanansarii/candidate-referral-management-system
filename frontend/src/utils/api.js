import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to include auth token
api.interceptors.request.use(
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

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const candidateAPI = {
    getAll: () => api.get('/candidates'),
    create: (formData) => api.post('/candidates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateStatus: (id, status) => api.put(`/candidates/${id}/status`, { status }),
    delete: (id) => api.delete(`/candidates/${id}`)
};

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
    getMe: () => api.get('/auth/me')
};

export default api;