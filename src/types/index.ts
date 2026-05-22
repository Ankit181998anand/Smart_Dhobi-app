export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'dhobi' | 'admin';
  mainUserId?: string;
  serviceAreas?: string;
  profilePicture?: string;
  location?: {
    type?: string;
    coordinates: number[];
  };
  isVerified?: boolean;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Provider {
  _id: string;
  userId?: string | User;
  name: string;
  owner?: string;
  email: string;
  mobile: string;
  address?: string;
  serviceAreas?: string;
  location?: {
    type?: string;
    coordinates: number[];
  };
  commissionRate?: number;
  services: Service[];
  pricing?: Record<string, number>;
  rating?: number;
  totalReviews?: number;
  ordersCompleted?: number;
  images?: string[];
  isApproved?: 'pending' | 'approved' | 'rejected' | string;
  isActive?: boolean;
  earnings?: string | number;
  dhobiId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: User | any;
  providerId: Provider | any;
  services: {
    name: string;
    quantity: number;
    price: number;
    _id?: string;
  }[];
  amount: number | string;
  status: string;
  paymentStatus: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupTime: string;
  deliveryTime: string;
  pickupLocation?: {
    type: 'Point' | string;
    coordinates: number[];
  };
  deliveryLocation?: {
    type: 'Point' | string;
    coordinates: number[];
  };
  createdAt: string;
  updatedAt: string;
  razorpayOrderId?: string;
}

export interface Analytics {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalEarnings: number;
  rating: number;
  statusBreakdown?: {
    pending?: number;
    accepted?: number;
    in_progress?: number;
    ready?: number;
    delivered?: number;
    cancelled?: number;
  };
  monthlyRevenue?: any[];
}

export interface Address {
  _id: string;
  title: string;
  address: string;
  isDefault: boolean;
}

