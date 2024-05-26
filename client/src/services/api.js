// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // replace with your backend server URL and port
});

export default api;
