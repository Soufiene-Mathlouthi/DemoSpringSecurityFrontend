import axios from 'axios';
import type { LoginRequest, LoginResponse } from './types';
import { setLogin, setLogout } from '../stores/authStore';
import router from '../router';

const AUTH_URL  = import.meta.env.VITE_AUTH_URL || 'http://localhost:8080/api/auth';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create an Axios instance for protected API calls
const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      setLogout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

// Login function
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${AUTH_URL}/login`,
    credentials,
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Save token + update reactive store
  setLogin(response.data.token);

  return response.data;
}

// Get auth headers (optional if you use api instance)
export function getAuthHeaders(): { Authorization?: string } {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// General GET request for protected data
export async function getProtectedData<T = any>(endpoint: string): Promise<T> {
  const response = await api.get<T>(endpoint);
  return response.data;
}

// Logout function
export function logout(): void {
  setLogout();
}