import { useState } from 'react';
import { downloadMedia } from '../services/downloadService';

export default function DownloadForm({ onDownload }) {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('video');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return alert('Enter URL');

    setLoading(true);
    try {
      await downloadMedia(url, type);
      setUrl('');
      onDownload(); // refresh history
    } catch (err) {
      console.error(err);
      alert('Download failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-4">
      <input
        type="text"
        placeholder="Video or audio URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="border p-2 w-3/4 rounded"
      />
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="ml-2 border p-2 rounded"
      >
        <option value="video">Video</option>
        <option value="audio">Audio</option>
      </select>
      <button
        className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Download'}
      </button>
    </form>
  );
}
