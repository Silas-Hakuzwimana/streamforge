import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ||'http://localhost:5000/api',
  withCredentials: true, // send cookies for JWT
});

export default api;
