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
  
  getAddresses: async (): Promise<{ addresses: any[] }> => {
    // Note: Assuming endpoint /users/addresses exists based on requirement
    const response = await apiClient.get('/users/addresses');
    return response.data;
  },

  addAddress: async (payload: any): Promise<{ address: any }> => {
    const response = await apiClient.post('/users/addresses', payload);
    return response.data;
  },

  updateAddress: async (id: string, payload: any): Promise<{ address: any }> => {
    const response = await apiClient.patch(`/users/addresses/${id}`, payload);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/addresses/${id}`);
    return response.data;
  },
};

