export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  createdAt: string;
  signature: string;
}

export interface CreateUserDTO {
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
}

export interface UpdateUserDTO {
  email?: string;
  role?: 'admin' | 'user' | 'guest';
  status?: 'active' | 'inactive';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}