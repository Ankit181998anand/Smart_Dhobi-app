import { Provider, Analytics, Order } from '../types';
import apiClient from './apiClient';

export interface ProviderProfileResponse {
  provider: Provider;
}

export interface ProviderListResponse {
  providers: Provider[];
}

export interface ProviderOrdersResponse {
  orders: Order[];
}

export const providerService = {
  create: async (payload: any): Promise<ProviderProfileResponse> => {
    const response = await apiClient.post('/providers/create', payload);
    return response.data;
  },

  getAll: async (): Promise<ProviderListResponse> => {
    const response = await apiClient.get('/providers/');
    return response.data;
  },

  getProfile: async (id: string): Promise<ProviderProfileResponse> => {
    const response = await apiClient.get(`/providers/profile/${id}`);
    return response.data;
  },

  updateProfile: async (id: string, payload: Partial<Provider>): Promise<ProviderProfileResponse> => {
    const response = await apiClient.patch(`/providers/profile/${id}`, payload);
    return response.data;
  },

  toggleActive: async (id: string): Promise<ProviderProfileResponse> => {
    const response = await apiClient.patch(`/providers/toggle-active/${id}`);
    return response.data;
  },

  getOrders: async (): Promise<ProviderOrdersResponse> => {
    const response = await apiClient.get('/providers/orders');
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<{ order: Order }> => {
    const response = await apiClient.patch(`/providers/order/${id}/status`, { status });
    return response.data;
  },

  getAnalytics: async (): Promise<Analytics> => {
    const response = await apiClient.get('/providers/analytics');
    return response.data;
  },

  addService: async (id: string, payload: { name: string; price: string }): Promise<ProviderProfileResponse> => {
    const response = await apiClient.post(`/providers/profile/${id}/services`, payload);
    return response.data;
  },

  updateService: async (id: string, serviceId: string, payload: any): Promise<ProviderProfileResponse> => {
    const response = await apiClient.patch(`/providers/profile/${id}/services/${serviceId}`, payload);
    return response.data;
  },

  deleteService: async (id: string, serviceId: string): Promise<ProviderProfileResponse> => {
    const response = await apiClient.delete(`/providers/profile/${id}/services/${serviceId}`);
    return response.data;
  },
};
