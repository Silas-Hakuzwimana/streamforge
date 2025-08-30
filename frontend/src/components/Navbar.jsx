import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
      {/* StreamForge Logo */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {/* Icon/Symbol */}
          <div className="relative">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="w-4 h-4 bg-gradient-to-br from-cyan-300 to-blue-400 rounded transform rotate-45"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-80"></div>
          </div>

          {/* Brand Name */}
          <h1 className="ml-3 font-bold text-2xl tracking-tight">
            <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Stream
            </span>
            <span className="bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
              Forge
            </span>
          </h1>
        </div>
      </div>

      {/* User Section */}
      {user ? (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="text-cyan-100 font-medium">{user.name}</span>
          </div>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-cyan-200 font-medium">Not logged in</span>
        </div>
      )}
    </nav>
  );
}