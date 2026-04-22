export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'dhobi' | 'admin';
  mainUserId?: string;
  serviceAreas?: string;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Provider {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  serviceAreas?: string;
  services: Service[];
  rating?: number;
  totalReviews?: number;
}

export interface OrderItem {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User;
  provider: Provider;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Accepted' | 'In Process' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalOrders: number;
  earnings: number;
  completedOrders: number;
}
