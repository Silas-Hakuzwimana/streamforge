import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Check, X, Shield } from 'lucide-react';
import { registerUser } from '../services/authService';

export default function Register({ onRegistered }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);


  const navigate = useNavigate();


  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength <= 1) return 'Very Weak';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Update password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(formData.name, formData.email, formData.password);
      setErrors({ success: res.message });
      setTimeout(() => onRegistered?.(), 2000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed. Please try again.' });
    }
    setLoading(false);
  };

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
    { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(formData.password), text: 'One number' },
    { met: /[^A-Za-z0-9]/.test(formData.password), text: 'One special character' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join StreamForge</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {errors.success ? (
              /* Success State */
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Account Created!</h2>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 text-sm flex items-center justify-center">
                    <Check className="w-4 h-4 mr-2" />
                    {errors.success}
                  </p>
                </div>
                <p className="text-gray-600 text-sm">Redirecting you to login...</p>
              </div>
            ) : (
              /* Registration Form */
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-600">Fill in your details to get started</p>
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 text-sm flex items-center">
                      <X className="w-4 h-4 mr-2" />
                      {errors.general}
                    </p>
                  </div>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200 focus:border-purple-300'
                        }`}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm flex items-center"><span className="mr-1">⚠️</span>{errors.name}</p>}
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
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200 focus:border-purple-300'
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
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={e => handleInputChange('password', e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200 focus:border-purple-300'
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Password Strength:</span>
                        <span className={`font-medium ${passwordStrength <= 2 ? 'text-red-600' :
                          passwordStrength <= 3 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                          {getPasswordStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength
                              ? getPasswordStrengthColor(passwordStrength)
                              : 'bg-gray-200'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={e => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-200' :
                        formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-300 focus:ring-green-200' :
                          'border-gray-200 focus:ring-purple-200 focus:border-purple-300'
                        }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm flex items-center"><span className="mr-1">⚠️</span>{errors.confirmPassword}</p>}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-green-600 text-sm flex items-center"><Check className="w-4 h-4 mr-1" />Passwords match</p>
                  )}
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Password Requirements
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center text-xs">
                          {req.met ? (
                            <Check className="w-3 h-3 text-green-600 mr-2" />
                          ) : (
                            <X className="w-3 h-3 text-gray-400 mr-2" />
                          )}
                          <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Register Button */}
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading || passwordStrength < 3}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </button>

                {/* Terms Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-700 text-xs text-center leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <button className="underline hover:text-blue-800 transition-colors">Terms of Service</button>
                    {' '}and{' '}
                    <button className="underline hover:text-blue-800 transition-colors">Privacy Policy</button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors underline"
              onClick={() => navigate('/login')}
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="w-4 h-4 bg-purple-600 rounded-full mr-2"></span>
            Demo Instructions:
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Try:</strong> Any name, any email (except existing@example.com), password with 8+ chars</p>
            <p><strong>Error Test:</strong> Use existing@example.com to see error handling</p>
          </div>
        </div>
      </div>
    </div>
  );
}