import api from './api';

export const uploadFile = async (file) => {
  if (!file) throw new Error('No file provided');

  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/media/upload', formData);
  return res.data; // { message, cloudUrl, type }
};
