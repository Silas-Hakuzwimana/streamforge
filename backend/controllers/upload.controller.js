const { uploadFile } = require('../services/upload.service');
const Media = require('../models/Media');

const uploadMedia = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file provided' });

  try {
    const mime = req.file.mimetype;
    let type = 'image';
    if (mime.startsWith('video/')) type = 'video';
    else if (mime.startsWith('audio/')) type = 'audio';

    const cloudUrl = await uploadFile(
      req.file.path,
      'streamforge_uploads',
      type,
    );

    await Media.create({
      user: req.user._id,
      type,
      cloudUrl,
      fileName: req.file.originalname,
      source: 'upload',
    });

    res.status(200).json({ message: 'Upload successful', cloudUrl, type });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

module.exports = uploadMedia;
