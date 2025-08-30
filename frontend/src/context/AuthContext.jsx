import { createContext,useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {id, name, email, role}
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // -------------------- REGISTER --------------------
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setLoading(false);
      return res.data; // {message, userId}
    } catch (err) {
      setLoading(false);
      throw err.response?.data || { message: 'Registration failed' };
    }
  };

  // -------------------- LOGIN --------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setLoading(false);
      return res.data; // {message, userId}
    } catch (err) {
      setLoading(false);
      throw err.response?.data || { message: 'Login failed' };
    }
  };

  // -------------------- VERIFY OTP --------------------
  const verifyOtp = async (userId, otpCode) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { userId, otpCode });
      setUser(res.data.user);
      setToken(res.data.token); // optional if using cookies
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data || { message: 'OTP verification failed' };
    }
  };

  // -------------------- LOGOUT --------------------
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // -------------------- FORGOT PASSWORD --------------------
  const forgotPassword = async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Forgot password failed' };
    }
  };

  // -------------------- RESET PASSWORD --------------------
  const resetPassword = async (token, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Reset password failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        verifyOtp,
        logout,
        forgotPassword,
        resetPassword,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);