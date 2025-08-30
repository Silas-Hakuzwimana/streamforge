const cloudinary = require('../config/cloudinary');

const uploadImage = async (filePath, folder = 'streamforge') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

module.exports = { uploadImage };
