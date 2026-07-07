import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // required to send/receive the HTTP-only cookie
  headers: {
    'Content-Type': 'application/json',
  },
});