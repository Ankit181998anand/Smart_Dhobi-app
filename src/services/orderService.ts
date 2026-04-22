import { Order } from '../types';
import apiClient from './apiClient';

export interface OrderResponse {
  order: Order;
}

export interface OrderListResponse {
  orders: Order[];
}

export const orderService = {
  create: async (payload: any): Promise<OrderResponse> => {
    const response = await apiClient.post('/order/create', payload);
    return response.data;
  },

  getUserOrders: async (userId: string): Promise<OrderListResponse> => {
    const response = await apiClient.get(`/order/userOrders/${userId}`);
    return response.data;
  },

  getDhobiOrders: async (userId: string): Promise<OrderListResponse> => {
    const response = await apiClient.get(`/order/dhobiOrders/${userId}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<OrderResponse> => {
    const response = await apiClient.patch(`/order/${id}/status`, { status });
    return response.data;
  },

  getDetails: async (id: string): Promise<OrderResponse> => {
    const response = await apiClient.get(`/order/${id}`);
    return response.data;
  },

  // Payment integration
  createRazorpayOrder: async (payload: { orderId: string; amount: string }): Promise<any> => {
    const response = await apiClient.post('/order/create-razorpay-order', payload);
    return response.data;
  },

  verifyPayment: async (payload: any): Promise<any> => {
    const response = await apiClient.post('/order/verify-payment', payload);
    return response.data;
  },

  getPaymentStatus: async (orderId: string): Promise<any> => {
    const response = await apiClient.post(`/order/payment-status/${orderId}`);
    return response.data;
  },

  refund: async (payload: { orderId: string; amount: string; reason: string }): Promise<any> => {
    const response = await apiClient.post('/order/refund', payload);
    return response.data;
  },
};
