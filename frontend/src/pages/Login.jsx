import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft, LogIn, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { loginUser, verifyOtp } from '../services/authService';

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(1); // 1=login, 2=OTP
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      toast.success(res.message || 'Login OTP sent to your email');
      setUserId(res.userId);
      setStep(2);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Login failed. Please try again.' });
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp) {
      setErrors({ otp: 'Please enter the OTP code' });
      return;
    }

    if (otp.length !== 6) {
      setErrors({ otp: 'OTP must be 6 digits' });
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(userId, otp);
      if (res.success) toast.success(res.message || 'OTP verified, login successful');

      setStep(3);

      if (onLoggedIn) {
        onLoggedIn(res.data);
      }

      // Redirect or update app state
      setRedirecting(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setErrors({ otp: err.response?.data?.message || 'OTP verification failed' });
    }
    setLoading(false);
  };

  const handleBackToLogin = () => {
    setStep(1);
    setOtp('');
    setErrors({});
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action(e);
    }
  };

  // Success State
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600 mb-6">
                Login successful. Redirecting to your dashboard...
              </p>
              {redirecting && (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">StreamForge</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className={`flex items-center ${step === 1 ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                Credentials
              </span>
              <div className="flex-1 mx-4 h-px bg-gray-200"></div>
              <span className={`flex items-center ${step === 2 ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                Verification
              </span>
            </div>
          </div>

          <div className="p-8">
            {step === 1 ? (
              /* Login Section */
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Please sign in to your account</p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyPress={e => handleKeyPress(e, handleLogin)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-300'
                        }`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm flex items-center"><span className="mr-1">⚠️</span>{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyPress={e => handleKeyPress(e, handleLogin)}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-300'
                        }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm flex items-center"><span className="mr-1">⚠️</span>{errors.password}</p>}
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 text-sm flex items-center">
                      <span className="mr-2">❌</span>
                      {errors.general}
                    </p>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors underline"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            ) : (
              /* OTP Verification Section */
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
                  <p className="text-gray-600">We've sent a 6-digit code to your email</p>
                  <p className="text-sm text-indigo-600 font-medium mt-2 bg-indigo-50 px-3 py-1 rounded-lg inline-block">{email}</p>
                </div>

                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-center">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyPress={e => handleKeyPress(e, handleVerifyOtp)}
                    className={`w-full px-4 py-4 text-center text-2xl font-mono tracking-widest border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.otp ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200 focus:border-green-300'
                      }`}
                    maxLength={6}
                    autoComplete="one-time-code"
                    required
                  />
                  {errors.otp && <p className="text-red-500 text-sm text-center flex items-center justify-center"><span className="mr-1">⚠️</span>{errors.otp}</p>}
                </div>

                {/* Timer/Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-700 text-sm text-center flex items-center justify-center">
                    <span className="mr-2">⏰</span>
                    Code expires in 10 minutes. Check your email for the verification code.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Verify Code
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors underline"
              onClick={() => navigate('/register')}
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="w-4 h-4 bg-indigo-600 rounded-full mr-2"></span>
            Demo Instructions:
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Login:</strong> myemail@gmail.com / password</p>
            <p><strong>OTP:</strong> 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}