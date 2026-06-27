import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9999',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
