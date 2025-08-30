import api from './api';

export const registerUser = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data; // { message, userId }
};

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // { message, userId }
};

export const verifyOtp = async (userId, otpCode) => {
  const res = await api.post('/auth/verify-otp', { userId, otpCode });
  return res.data; // { message }
};

export const forgotPassword = async (email) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
};
export const logoutUser = async () => {
  const res = await api.post('/auth/logout');
  return res.data; // { message }
};

export const getCurrentUser = async () => {
  const res = await api.get('/users/me');
  return res.data;
};
