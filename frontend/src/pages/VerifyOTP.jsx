import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  
  const { email, type } = location.state || {}; // type: 'register' or 'login'

  useEffect(() => {
    if (!email || !type) {
      navigate('/login');
    }
  }, [email, type, navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const endpoint = type === 'register' 
        ? '/auth/verify-register-otp'
        : '/auth/verify-login-otp';
      
      const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
        
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });
      
      const data = await response.json();

      if (data.success === true) {
        
        try {
          // Save to localStorage
          localStorage.setItem('token', data.data.token);
          
          // Update auth store
          setUser(data.data);
          
          // Show success message
          toast.success(data.message || 'Verification successful!');
          
          // Navigate to papers
          setTimeout(() => {
            navigate('/papers', { replace: true });
          }, 100);
        } catch (err) {
          console.error('Error during login process:', err);
          toast.error('Login successful but navigation failed. Please refresh.');
        }
      } else {
        console.error('❌ Verification failed');
        console.error('Success value:', data.success);
        console.error('Message:', data.message);
        toast.error(data.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      console.error('Error details:', error.message);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('OTP resent to your email');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Card */}
        <div className="bg-white dark:bg-[#13131a] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Verify OTP
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Enter the 6-digit code sent to<br />
            <span className="font-medium text-neon-blue">{email}</span>
          </p>

          {/* OTP Input */}
          <form onSubmit={handleVerify}>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white dark:bg-[#1a1a24] border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-neon-blue transition-colors"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-lg hover:shadow-neon-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          {/* Resend Button */}
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full text-sm text-neon-blue hover:text-neon-purple transition-colors disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Didn\'t receive code? Resend OTP'}
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-[#1a1a24] rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              ⏱️ OTP is valid for 10 minutes<br />
              💡 Check your spam folder if you don't see the email
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
