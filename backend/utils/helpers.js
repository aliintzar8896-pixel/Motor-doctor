export function generateOTP(length = 4) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function successResponse(data = {}, message = 'Success') {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message = 'An error occurred', error = null) {
  return {
    success: false,
    message,
    error,
  };
}
