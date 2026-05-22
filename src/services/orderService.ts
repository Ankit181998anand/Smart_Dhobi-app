import { Order } from '../types';
import apiClient from './apiClient';

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  data: Order[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentInitiateResponse {
  success: boolean;
  message: string;
  data: {
    razorpayOrderId: string;
    key: string;
    amount: number;
    currency: string;
  };
}

export const orderService = {
  create: async (payload: any): Promise<OrderResponse> => {
    const response = await apiClient.post('/orders/create', payload);
    return response.data;
  },

  initiatePayment: async (payload: { orderId: string }): Promise<PaymentInitiateResponse> => {
    const response = await apiClient.post('/orders/create-razorpay-order', payload);
    return response.data;
  },

  verifyPayment: async (payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<any> => {
    const response = await apiClient.post('/orders/verify-payment', payload);
    return response.data;
  },

  getUserOrders: async (userId: string): Promise<OrderListResponse> => {
    const response = await apiClient.get(`/orders/userOrders/${userId}`);
    return response.data;
  },

  getDhobiOrders: async (userId: string): Promise<OrderListResponse> => {
    const response = await apiClient.get(`/orders/dhobiOrders/${userId}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<OrderResponse> => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  getDetails: async (id: string): Promise<OrderResponse> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  getPaymentStatus: async (orderId: string): Promise<any> => {
    const response = await apiClient.post(`/orders/payment-status/${orderId}`);
    return response.data;
  },

  refund: async (payload: { orderId: string; amount: string; reason: string }): Promise<any> => {
    const response = await apiClient.post('/orders/refund', payload);
    return response.data;
  },
};
