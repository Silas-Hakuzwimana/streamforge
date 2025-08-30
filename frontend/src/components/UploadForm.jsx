import { useState } from 'react';
import { uploadFile } from '../services/uploadService';

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a file');

    setLoading(true);
    try {
      await uploadFile(file);
      setFile(null);
      onUpload(); // refresh history
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button
        className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
