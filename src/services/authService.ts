import { User } from '../types';
import apiClient from './apiClient';

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  mainUserId?: string;
}

export const authService = {
  register: async (payload: any): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  verifyOtp: async (payload: { email: string; otp: string }): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/verify-otp', payload);
    return response.data;
  },

  login: async (payload: any): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (payload: any): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset-password', payload);
    return response.data;
  },
};
