import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { updateUserProfile } from '../services/userService';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    const res = await getCurrentUser();
    setProfile(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('name', profile.name);
    formData.append('bio', profile.bio);

    try {
      await updateUserProfile(formData);
      alert('Profile updated!');
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={profile.name || ''}
          onChange={e => setProfile({ ...profile, name: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <textarea
          value={profile.bio || ''}
          onChange={e => setProfile({ ...profile, bio: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-2" />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
