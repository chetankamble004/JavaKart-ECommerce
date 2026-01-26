export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const PAYMENT_METHODS = {
  COD: 'COD',
  ONLINE: 'ONLINE',
  RAZORPAY: 'RAZORPAY',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const CATEGORIES = [
  { id: 1, name: 'Electronics', icon: '💻' },
  { id: 2, name: 'Fashion', icon: '👕' },
  { id: 3, name: 'Home & Kitchen', icon: '🏠' },
  { id: 4, name: 'Books', icon: '📚' },
  { id: 5, name: 'Beauty', icon: '💄' },
  { id: 6, name: 'Sports', icon: '⚽' },
  { id: 7, name: 'Toys', icon: '🧸' },
  { id: 8, name: 'Automotive', icon: '🚗' },
];

export const CURRENCY = '₹';