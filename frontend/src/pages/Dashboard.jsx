// src/pages/Dashboard.jsx
import UploadForm from '../components/UploadForm';
import DownloadForm from '../components/DownloadForm';
import MediaHistory from '../components/MediaHistory';
import { useState, useEffect } from 'react';
import { getMediaHistory } from '../services/downloadService';

export default function Dashboard() {
  const [mediaList, setMediaList] = useState([]);

  const fetchHistory = async () => {
    try {
      const list = await getMediaHistory();
      setMediaList(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      <UploadForm onUpload={fetchHistory} />
      <DownloadForm onDownload={fetchHistory} />
      <MediaHistory mediaList={mediaList} />
    </div>
  );
}
