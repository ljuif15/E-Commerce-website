// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (basic)
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(phone.replace(/[\D]/g, ''));
};

// Password strength validation
const validatePassword = (password) => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Validate product data
const validateProductData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Product name is required');
  }
  if (!data.price || isNaN(data.price) || data.price < 0) {
    errors.push('Valid price is required');
  }
  if (!data.description || data.description.trim() === '') {
    errors.push('Product description is required');
  }
  if (!data.category || data.category.trim() === '') {
    errors.push('Product category is required');
  }
  if (!data.stock || isNaN(data.stock) || data.stock < 0) {
    errors.push('Valid stock quantity is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate user data
const validateUserData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }
  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required');
  }
  if (!data.password || !validatePassword(data.password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
  }
  if (!data.address || data.address.trim() === '') {
    errors.push('Address is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateProductData,
  validateUserData,
};
