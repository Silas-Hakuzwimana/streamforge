const ytdlp = require('yt-dlp-exec');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { uploadFile } = require('./upload.service');

const TEMP_DIR = path.join(__dirname, '../../temp_downloads');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const downloadMedia = async (url, type = 'video') => {
  try {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filePath = path.join(
      TEMP_DIR,
      `${fileName}.${type === 'audio' ? 'mp3' : 'mp4'}`,
    );

    if (type === 'video') {
      await ytdlp(url, { output: filePath, format: 'mp4' });
    } else {
      const tempVideoPath = path.join(TEMP_DIR, `${fileName}.mp4`);
      await ytdlp(url, { output: tempVideoPath, format: 'bestaudio' });

      await new Promise((resolve, reject) => {
        ffmpeg(tempVideoPath)
          .toFormat('mp3')
          .save(filePath)
          .on('end', () => {
            fs.unlinkSync(tempVideoPath);
            resolve();
          })
          .on('error', reject);
      });
    }

    // Upload to Cloud
    const cloudUrl = await uploadFile(filePath, 'streamforge_media', type);

    fs.unlinkSync(filePath); // remove temp file
    return cloudUrl;
  } catch (err) {
    throw new Error('Media download failed: ' + err.message);
  }
};

module.exports = { downloadMedia };
