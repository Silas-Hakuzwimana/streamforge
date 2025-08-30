const path = require('path');
const { downloadMedia } = require('../services/download.service');
const Media = require('../models/Media');

const download = async (req, res) => {
  const { url, type } = req.body;
  if (!url) return res.status(400).json({ message: 'URL is required' });

  try {
    const cloudUrl = await downloadMedia(url, type);
    const fileName = path.basename(cloudUrl);

    await Media.create({
      user: req.user._id,
      type: type || 'video',
      cloudUrl,
      originalUrl: url,
      fileName,
      source: 'download',
    });

    res.status(200).json({ message: 'Download successful', cloudUrl, type });
  } catch (err) {
    res.status(500).json({ message: 'Download failed', error: err.message });
  }
};

const getHistory = async (req, res) => {
  const mediaList = await Media.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json({ mediaList });
};

module.exports = {
  download,
  getHistory,
};
