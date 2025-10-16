import axios, { AxiosInstance, AxiosError } from 'axios';
import { User, CreateUserDTO, UpdateUserDTO, ApiResponse, DailyStats, PublicKeyResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const handleError = (error: AxiosError): never => {
  if (error.response) {
    const apiError = error.response.data as ApiResponse<never>;
    throw new Error(apiError.error || 'An error occurred');
  } else if (error.request) {
    throw new Error('No response from server. Please check if backend is running.');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};


export const getPublicKey = async (): Promise<PublicKeyResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<PublicKeyResponse>>('/api/public-key');
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch public key');
    }
    
    return response.data.data;
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<ApiResponse<User[]>>('/api/users');
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch users');
    }
    
    return response.data.data;
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>(`/api/users/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch user');
    }
    
    return response.data.data;
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  try {
    const response = await apiClient.post<ApiResponse<User>>('/api/users', userData);
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create user');
    }
    
    return response.data.data;
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

export const updateUser = async (id: number, userData: UpdateUserDTO): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(`/api/users/${id}`, userData);
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update user');
    }
    
    return response.data.data;
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/users/${id}`);
    
    if (!response.data.success) {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

export const getUserStats = async (): Promise<DailyStats[]> => {
  try {
    const response = await apiClient.get<ApiResponse<DailyStats[]>>('/api/users/stats');
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch statistics');
    }
    
    return response.data.data;
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

export const exportUsersProtobuf = async (): Promise<ArrayBuffer> => {
  try {
    const response = await apiClient.get('/api/users/export', {
      responseType: 'arraybuffer',
      headers: { Accept: 'application/x-protobuf' },
    });
    
    return response.data;
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.data.success === true;
  } catch {
    return false;
  }
};

export default apiClient;