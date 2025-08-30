import { useEffect, useState } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

export default function Navbar() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="flex justify-between p-4 bg-indigo-600 text-white">
      <h1 className="font-bold text-xl">StreamForge</h1>
      {user ? (
        <div>
          <span className="mr-4">{user.name}</span>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      ) : (
        <span>Not logged in</span>
      )}
    </nav>
  );
}
