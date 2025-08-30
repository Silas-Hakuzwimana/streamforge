const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['video', 'audio', 'image'],
      required: true,
    },
    cloudUrl: {
      type: String,
      required: true,
    },
    originalUrl: {
      type: String, // for downloads
      default: '',
    },
    fileName: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ['download', 'upload'],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Media', mediaSchema);
