export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
} 