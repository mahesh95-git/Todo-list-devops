import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { AuthResponseData, LoginPayload, RegisterPayload, User } from '../types/auth';

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/api/auth/register', payload);
    if (!res.data.data) {
      throw new Error(res.data.message || 'Registration failed');
    }
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/api/auth/login', payload);
    if (!res.data.data) {
      throw new Error(res.data.message || 'Login failed');
    }
    return res.data.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/api/auth/me');
    if (!res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch user');
    }
    return res.data.data;
  },
};
