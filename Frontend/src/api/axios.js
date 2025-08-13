import axios from 'axios';

// Create an Axios instance
const http = axios.create({
    baseURL: import.meta.env['VITE_API_BASE_URL'], // set your API base URL here
    timeout: 10000, // optional timeout
    headers: {
        'Content-Type': 'application/json',
        // Add other default headers if needed
    },
});

// Request interceptor
http.interceptors.request.use(
    config => {
        // Modify request before sending, e.g., add auth token
        const token = localStorage.getItem('token');  // or wherever you store it
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // You can also log or transform request data here
        return config;
    },
    error => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response interceptor
http.interceptors.response.use(
    response => {
        // Any response manipulation if needed
        return response;
    },
    error => {
        // Handle global errors, e.g., auth expiration, network errors
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized, maybe redirect to login
                console.log('Unauthorized! Redirect to login.');
            }
            // Other status code handling here
        } else if (error.request) {
            // Request was made but no response received
            console.log('Network error or no response');
        }
        return Promise.reject(error);
    }
);

export default http;