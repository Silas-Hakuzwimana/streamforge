import api from './api';

export const getUserProfile = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const updateUserProfile = async (userData) => {
  const res = await api.put('/users/me', userData);
  return res.data; 
};

export const changePassword = async (data) => {
  const res = await api.put('/auth/verify-otp', data);
  return res.data; 
};

export const deleteAccount = async () => {
  const res = await api.delete('/users/me');
  return res.data; 
};

