import type { UserRole, UserStatus } from './enums';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  signature: string;
}

export interface CreateUserDTO {
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserDTO {
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DailyStats {
  date: string;
  count: number;
}

export interface PublicKeyResponse {
  publicKey: string;
  algorithm: string;
  curve: string;
  hash: string;
}