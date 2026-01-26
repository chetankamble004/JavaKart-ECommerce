// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate order status badge
export const getStatusBadge = (status) => {
  const statusConfig = {
    PENDING: { variant: 'warning', text: 'Pending' },
    PROCESSING: { variant: 'info', text: 'Processing' },
    SHIPPED: { variant: 'primary', text: 'Shipped' },
    DELIVERED: { variant: 'success', text: 'Delivered' },
    CANCELLED: { variant: 'danger', text: 'Cancelled' },
  };
  return statusConfig[status] || { variant: 'secondary', text: status };
};

// Generate payment status badge
export const getPaymentStatusBadge = (status) => {
  const statusConfig = {
    PENDING: { variant: 'warning', text: 'Pending' },
    SUCCESS: { variant: 'success', text: 'Success' },
    FAILED: { variant: 'danger', text: 'Failed' },
    REFUNDED: { variant: 'info', text: 'Refunded' },
  };
  return statusConfig[status] || { variant: 'secondary', text: status };
};

// Calculate total with discount
export const calculateTotal = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  return { subtotal, discountAmount, total };
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get user initials
export const getUserInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Generate random ID
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};