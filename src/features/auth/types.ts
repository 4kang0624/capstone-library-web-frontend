import type { UserRole, UserStatus } from '@/types/enums';

export interface User {
  id: number;
  email: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
