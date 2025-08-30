const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadFile = async (
  filePath,
  folder = 'streamforge_uploads',
  resourceType = 'auto',
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
    });
    fs.unlinkSync(filePath); // delete local file
    return result.secure_url;
  } catch (err) {
    throw new Error('Cloud upload failed: ' + err.message);
  }
};

module.exports = { uploadFile };
