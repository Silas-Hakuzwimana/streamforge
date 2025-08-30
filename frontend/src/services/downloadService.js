import api from './api';

export const downloadMedia = async (url, type = 'video') => {
  if (!url) throw new Error('URL is required');

  const res = await api.post('/media/download', { url, type });
  return res.data; // { message, cloudUrl, type }
};

export const getMediaHistory = async () => {
  const res = await api.get('/media/history');
  return res.data.mediaList; // array of media
};
