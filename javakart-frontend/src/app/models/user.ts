export interface User {
  userId?: number;
  username: string;
  email: string;
  mobile?: string;
  fullName?: string;
  password?: string;
  token?: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}