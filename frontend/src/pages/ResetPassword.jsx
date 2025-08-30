import { useState, useParams } from 'react';
import { Lock, ArrowLeft, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate()

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) {
      return { strength: 4, label: 'Strong', color: 'bg-green-500' };
    }
    return { strength: 3, label: 'Good', color: 'bg-blue-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = confirmPassword && newPassword !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords don't match");
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, newPassword);
      toast.success(res.data.message);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login')
        toast.success('Redirecting to login...');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20 animate-in fade-in duration-500">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                <strong>What's next?</strong> You'll be redirected to the login page in a few seconds.
              </p>
            </div>
            <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
          <p className="text-gray-600">
            Choose a strong password to secure your account
          </p>
        </div>

        <div onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50/50 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {newPassword && (
              <div className="space-y-2 animate-in slide-in-from-top duration-300">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Password strength</span>
                  <span className={`font-medium ${passwordStrength.strength <= 1 ? 'text-red-600' :
                    passwordStrength.strength <= 2 ? 'text-yellow-600' :
                      passwordStrength.strength <= 3 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Password should contain:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <span className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                      • 8+ characters
                    </span>
                    <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
                      • Uppercase
                    </span>
                    <span className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
                      • Number
                    </span>
                    <span className={/[@$!%*?&]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
                      • Special char
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50/50 placeholder:text-gray-400 ${passwordsDontMatch
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                  : passwordsMatch
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500/10'
                    : 'border-gray-200 focus:border-purple-500 focus:ring-purple-500/10'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {passwordsDontMatch && (
              <div className="flex items-center gap-2 text-red-500 text-sm animate-in slide-in-from-top duration-300">
                <AlertCircle className="w-4 h-4" />
                Passwords don't match
              </div>
            )}

            {passwordsMatch && (
              <div className="flex items-center gap-2 text-green-500 text-sm animate-in slide-in-from-top duration-300">
                <CheckCircle className="w-4 h-4" />
                Passwords match
              </div>
            )}
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting Password...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Reset Password
              </div>
            )}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;