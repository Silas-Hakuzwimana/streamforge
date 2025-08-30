import { useState, useRef } from 'react';
import { Upload, File, Image, Video, Music, X, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadFile } from '../services/uploadService';

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return <Image className="w-6 h-6 text-blue-500" />;
    if (fileType?.startsWith('video/')) return <Video className="w-6 h-6 text-red-500" />;
    if (fileType?.startsWith('audio/')) return <Music className="w-6 h-6 text-green-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'image/', 'video/', 'audio/', 'application/pdf',
      'text/', 'application/json', 'application/zip'
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 100MB';
    }

    const isValidType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isValidType) {
      return 'File type not supported';
    }

    return null;
  };

  const handleFileSelect = (selectedFile) => {
    setErrors({});

    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setErrors({ file: validationError });
      toast.error(validationError);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!file) {
      setErrors({ file: 'Please select a file to upload' });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress (replace with actual progress if your service supports it)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      const result = await uploadFile(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success('File uploaded successfully!');
      setFile(null);
      setUploadProgress(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUpload) {
        onUpload(result);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Upload failed. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Upload File</h2>
            <p className="text-green-100 text-sm">Upload images, videos, audio, and documents</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* File Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
              ? 'border-indigo-400 bg-indigo-50'
              : errors.file
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={e => handleFileSelect(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />

          {!file ? (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Drop your file here, or <span className="text-indigo-600">browse</span>
                </p>
                <p className="text-sm text-gray-500">
                  Supports images, videos, audio, PDF, and text files (max 100MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                {getFileIcon(file.type)}
                <div className="text-left">
                  <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  disabled={loading}
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Upload Progress */}
              {loading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{Math.round(uploadProgress)}% uploaded</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {errors.file && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.file}
            </p>
          </div>
        )}

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
          disabled={loading || !file}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload File
            </>
          )}
        </button>
      </form>
    </div>
  );
}
