// src/utils/constants.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const ORDER_STATUS_COLORS = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'danger'
};

export const PAYMENT_METHODS = {
  COD: 'Cash on Delivery',
  CARD: 'Credit/Debit Card',
  ONLINE: 'Online Payment',
  UPI: 'UPI',
  WALLET: 'Wallet'
};

export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Beauty',
  'Sports',
  'Toys',
  'Automotive'
];

export const PRODUCT_SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'name', label: 'Name A-Z' }
];

export const RATING_COLORS = {
  1: '#ff6b6b',
  2: '#ffa726',
  3: '#ffee58',
  4: '#9ccc65',
  5: '#66bb6a'
};