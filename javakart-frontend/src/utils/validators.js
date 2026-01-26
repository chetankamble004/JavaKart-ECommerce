import * as Yup from 'yup';

// Common validation schemas
export const loginSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export const addressSchema = Yup.object({
  street: Yup.string()
    .required('Street address is required')
    .min(5, 'Address must be at least 5 characters'),
  city: Yup.string()
    .required('City is required'),
  state: Yup.string()
    .required('State is required'),
  country: Yup.string()
    .required('Country is required'),
  zipCode: Yup.string()
    .required('ZIP code is required')
    .matches(/^[0-9]{6}$/, 'ZIP code must be 6 digits'),
  isDefault: Yup.boolean(),
});

export const productSchema = Yup.object({
  productName: Yup.string()
    .required('Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name cannot exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .typeError('Price must be a number'),
  stockQuantity: Yup.number()
    .required('Stock quantity is required')
    .integer('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .typeError('Stock quantity must be a number'),
  categoryName: Yup.string()
    .required('Category is required'),
});

export const reviewSchema = Yup.object({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .typeError('Rating must be a number'),
  comment: Yup.string()
    .required('Review comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment cannot exceed 500 characters'),
});

// Custom validation functions
export const validateFile = (file, maxSizeMB = 10, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  if (!file) return { valid: false, error: 'No file selected' };
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed. Allowed: JPEG, PNG, GIF' };
  }
  
  return { valid: true, error: null };
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('At least 6 characters');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('At least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('At least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('At least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};