import { useState } from 'react';
import {
  Download,
  ExternalLink,
  Image,
  Video,
  Music,
  File,
  Calendar,
  Filter,
  Search,
  Grid3X3,
  List,
  Eye,
  Trash2,
  Upload
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function MediaHistory({ mediaList, onDelete }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const getFileIcon = (type, size = 'w-6 h-6') => {
    if (type === 'image') return <Image className={`${size} text-blue-500`} />;
    if (type === 'video') return <Video className={`${size} text-red-500`} />;
    if (type === 'audio') return <Music className={`${size} text-green-500`} />;
    return <File className={`${size} text-gray-500`} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'video': return 'bg-red-100 text-red-700 border-red-200';
      case 'audio': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSourceBadge = (source) => {
    const sources = {
      'youtube': 'bg-red-100 text-red-700',
      'vimeo': 'bg-blue-100 text-blue-700',
      'instagram': 'bg-pink-100 text-pink-700',
      'tiktok': 'bg-gray-800 text-white',
      'upload': 'bg-green-100 text-green-700',
      'twitter': 'bg-blue-100 text-blue-700'
    };

    const colorClass = sources[source?.toLowerCase()] || 'bg-gray-100 text-gray-700';

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colorClass}`}>
        {source || 'Upload'}
      </span>
    );
  };

  const filteredAndSortedMedia = mediaList
    .filter(media => {
      const matchesType = filterType === 'all' || media.type === filterType;
      const matchesSearch = media.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.uploadDate || 0) - new Date(a.createdAt || a.uploadDate || 0);
        case 'oldest':
          return new Date(a.createdAt || a.uploadDate || 0) - new Date(b.createdAt || b.uploadDate || 0);
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        case 'size':
          return (b.fileSize || 0) - (a.fileSize || 0);
        default:
          return 0;
      }
    });

  const handleDelete = async (mediaId, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        if (onDelete) {
          await onDelete(mediaId);
        }
        toast.success('File deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Failed to delete file');
      }
    }
  };

  const handleDownload = async (url, fileName) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Download failed');
    }
  };

  const handleView = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setSortBy('newest');
  };

  // Loading state
  if (!mediaList) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Loading media library...</p>
      </div>
    );
  }

  // Empty state
  if (mediaList.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <File className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Media Files</h3>
        <p className="text-gray-600 mb-6">Upload or download your first file to get started</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Upload className="w-4 h-4 mr-1" />
            Upload files
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Download from URLs
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Controls */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
        <div className="flex flex-col space-y-4">
          {/* Title and Stats */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <File className="w-6 h-6 mr-2 text-indigo-600" />
                Media Library
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {filteredAndSortedMedia.length} of {mediaList.length} files
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-sm"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-sm cursor-pointer"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="size">Size (Large to Small)</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || filterType !== 'all' || sortBy !== 'newest') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMedia.map(media => (
              <div key={media._id} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-gray-300 hover:-translate-y-1">
                {/* Media Preview */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {media.type === 'image' ? (
                    <img
                      src={media.cloudUrl}
                      alt={media.fileName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback for non-images or broken images */}
                  <div className={`${media.type === 'image' ? 'hidden' : 'flex'} items-center justify-center h-full`}>
                    {getFileIcon(media.type, 'w-12 h-12')}
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getTypeColor(media.type)}`}>
                      {media.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(media.cloudUrl, media.fileName)}
                        className="p-3 bg-white/90 hover:bg-white rounded-full transition-all duration-200 hover:scale-110"
                        title="View File"
                      >
                        <Eye className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDownload(media.cloudUrl, media.fileName)}
                        className="p-3 bg-white/90 hover:bg-white rounded-full transition-all duration-200 hover:scale-110"
                        title="Download File"
                      >
                        <Download className="w-5 h-5 text-gray-700" />
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(media._id, media.fileName)}
                          className="p-3 bg-red-500/90 hover:bg-red-500 rounded-full transition-all duration-200 hover:scale-110"
                          title="Delete File"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate mb-1" title={media.fileName}>
                      {media.fileName}
                    </h3>
                    <div className="flex items-center justify-between">
                      {getSourceBadge(media.source)}
                      {media.fileSize && (
                        <span className="text-xs text-gray-500">{formatFileSize(media.fileSize)}</span>
                      )}
                    </div>
                  </div>

                  {(media.createdAt || media.uploadDate) && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(media.createdAt || media.uploadDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredAndSortedMedia.map(media => (
              <div key={media._id} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group">
                {/* File Icon & Preview */}
                <div className="flex-shrink-0 mr-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                    {media.type === 'image' ? (
                      <img
                        src={media.cloudUrl}
                        alt={media.fileName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`${media.type === 'image' ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                      {getFileIcon(media.type, 'w-6 h-6')}
                    </div>
                  </div>
                </div>

                {/* File Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{media.fileName}</h3>
                    <span className={`px-2 py-1 rounded-lg border text-xs font-medium flex-shrink-0 ${getTypeColor(media.type)}`}>
                      {media.type}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {getSourceBadge(media.source)}

                    {media.fileSize && (
                      <span>{formatFileSize(media.fileSize)}</span>
                    )}

                    {(media.createdAt || media.uploadDate) && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(media.createdAt || media.uploadDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleView(media.cloudUrl, media.fileName)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View File"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(media.cloudUrl, media.fileName)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(media._id, media.fileName)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Filtered Results */}
        {filteredAndSortedMedia.length === 0 && (searchTerm || filterType !== 'all') && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? `No files match "${searchTerm}"` : `No ${filterType} files found`}
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {filteredAndSortedMedia.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Image className="w-4 h-4 mr-1 text-blue-500" />
                {mediaList.filter(m => m.type === 'image').length} Images
              </span>
              <span className="flex items-center">
                <Video className="w-4 h-4 mr-1 text-red-500" />
                {mediaList.filter(m => m.type === 'video').length} Videos
              </span>
              <span className="flex items-center">
                <Music className="w-4 h-4 mr-1 text-green-500" />
                {mediaList.filter(m => m.type === 'audio').length} Audio
              </span>
            </div>

            <div className="text-xs text-gray-500">
              Total: {mediaList.length} files
            </div>
          </div>
        </div>
      )}
    </div>
  );
}