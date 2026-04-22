import { User, Order } from '../types';
import apiClient from './apiClient';

export interface UserProfileResponse {
  user: User;
}

export interface UserOrdersResponse {
  orders: Order[];
}

export const userService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  updateProfile: async (payload: Partial<User>): Promise<UserProfileResponse> => {
    const response = await apiClient.patch('/users/profile', payload);
    return response.data;
  },

  getOrders: async (): Promise<UserOrdersResponse> => {
    const response = await apiClient.get('/users/orders');
    return response.data;
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete('/users/account');
    return response.data;
  },
};
