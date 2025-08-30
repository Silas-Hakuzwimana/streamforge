import { useState } from 'react';
import { Download, Link, Video, Music, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { downloadMedia } from '../services/downloadService';

export default function DownloadForm({ onDownload }) {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('video');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!url.trim()) {
      setErrors({ url: 'Please enter a valid URL' });
      return;
    }

    if (!validateUrl(url)) {
      setErrors({ url: 'Please enter a valid URL format' });
      return;
    }

    setLoading(true);
    try {
      const result = await downloadMedia(url.trim(), type);

      toast.success(`${type === 'video' ? 'Video' : 'Audio'} download started successfully!`);
      setUrl('');

      if (onDownload) {
        onDownload(result);
      }
    } catch (err) {
      console.error('Download error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Download failed. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Download Media</h2>
            <p className="text-indigo-100 text-sm">Download videos and audio from various platforms</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Media URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.url ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-300'
                }`}
              disabled={loading}
              required
            />
          </div>
          {errors.url && (
            <p className="text-red-500 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.url}
            </p>
          )}
        </div>

        {/* Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Download Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${type === 'video'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
              <input
                type="radio"
                name="type"
                value="video"
                checked={type === 'video'}
                onChange={e => setType(e.target.value)}
                className="sr-only"
                disabled={loading}
              />
              <Video className="w-5 h-5 mr-2" />
              <span className="font-medium">Video</span>
            </label>

            <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${type === 'audio'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
              <input
                type="radio"
                name="type"
                value="audio"
                checked={type === 'audio'}
                onChange={e => setType(e.target.value)}
                className="sr-only"
                disabled={loading}
              />
              <Music className="w-5 h-5 mr-2" />
              <span className="font-medium">Audio</span>
            </label>
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.general}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Download...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download {type === 'video' ? 'Video' : 'Audio'}
            </>
          )}
        </button>

        {/* Supported Platforms */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-700 text-sm font-medium mb-2">Supported Platforms:</p>
          <p className="text-blue-600 text-xs">YouTube, Vimeo, TikTok, Instagram, Twitter, and many more...</p>
        </div>
      </form>
    </div>
  );
}