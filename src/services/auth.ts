import axios from 'axios';
import type { LoginRequest, LoginResponse } from './types';
import { setLogin, setLogout } from '../stores/authStore';
import router from '../router';

const API_URL = 'http://localhost:8080/api/auth';

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/login`,
    credentials,
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Save token + update reactive state
  setLogin(response.data.token);

  return response.data;
}

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export function getAuthHeaders(): { Authorization?: string } {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProtectedData(): Promise<any> {
  const response = await axios.get(
    'http://localhost:8080/api/employees',
    {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  );

  return response.data;
}

export function logout(): void {
  setLogout();
}
