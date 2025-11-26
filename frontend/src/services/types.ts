export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
}