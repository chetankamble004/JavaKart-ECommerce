// src/utils/validators.js
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const re = /^\d{10}$/;
  if (!re.test(phone)) return 'Please enter a valid 10-digit phone number';
  return '';
};

export const validatePrice = (price) => {
  if (!price && price !== 0) return 'Price is required';
  if (isNaN(price)) return 'Price must be a number';
  if (parseFloat(price) <= 0) return 'Price must be greater than 0';
  return '';
};

export const validateStock = (stock) => {
  if (!stock && stock !== 0) return 'Stock quantity is required';
  if (isNaN(stock)) return 'Stock must be a number';
  if (parseInt(stock) < 0) return 'Stock cannot be negative';
  return '';
};

export const validateCardNumber = (cardNumber) => {
  if (!cardNumber) return 'Card number is required';
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return 'Invalid card number';
  return '';
};

export const validateCVV = (cvv) => {
  if (!cvv) return 'CVV is required';
  if (!/^\d{3,4}$/.test(cvv)) return 'Invalid CVV';
  return '';
};

export const validateExpiryDate = (expiryDate) => {
  if (!expiryDate) return 'Expiry date is required';
  
  const [year, month] = expiryDate.split('-').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return '';
};