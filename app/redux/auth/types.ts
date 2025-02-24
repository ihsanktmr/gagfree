export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  postsCount: number;
  rating: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}
