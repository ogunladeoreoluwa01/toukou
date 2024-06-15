// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: "https://toukou-19di.onrender.com", // replace with your backend server URL and port
});

export default api;
