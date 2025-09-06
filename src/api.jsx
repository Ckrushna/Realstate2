import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Ensure this matches the backend
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;