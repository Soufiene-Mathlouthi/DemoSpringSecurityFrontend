export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}
export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
}