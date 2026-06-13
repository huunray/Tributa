import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onGoToSignup: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function LoginForm({ onGoToSignup, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide an email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email format (e.g., name@company.com)');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(email);
      }, 800);
    }, 1000);
  };

  const fillDemoCreds = () => {
    setEmail('john@company.com');
    setPassword('SuperSecurePassword2026!');
    setError('');
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-10 py-8 md:py-16 flex items-center justify-center min-h-0 bg-white" id="login-form-container">
      <div className="w-full max-w-sm mx-auto space-y-6 font-sans">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-1 font-sans">Sign In to Tributa</h2>
          <p className="text-sm text-brand-gray-dark mb-6">Enter your credentials to manage your tax compliance dashboard.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-brand-error rounded-[6px] text-xs">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-brand-success rounded-[6px] text-xs font-semibold">
            <CheckCircle size={16} className="shrink-0" />
            <span>Authentication successful! Accessing secure vault...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
                <Mail size={18} />
              </span>
              <input
                id="login-email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-[#0F172A] border border-slate-200 rounded-[6px] outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm font-sans"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="login-password">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-brand-purple hover:underline font-semibold cursor-pointer"
                onClick={() => {
                  alert('Password reset trigger is simulated. Fill in John Doe details via the quick filling button below.');
                }}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
                <Lock size={18} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-white text-[#0F172A] border border-slate-200 rounded-[6px] outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm font-sans"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6B7280] hover:text-[#0F172A]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading || success || !email.trim() || !password.trim()}
            className={`w-full py-2.5 rounded-[6px] font-sans font-semibold text-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              loading || success || !email.trim() || !password.trim()
                ? 'bg-slate-100 text-[#94A3B8] border border-slate-200 cursor-not-allowed'
                : 'bg-brand-purple hover:bg-opacity-95 text-white active:scale-[0.99] hover:scale-[1.01]'
            }`}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Sign-up link */}
          <p className="text-center text-sm text-brand-gray-dark mt-2 font-sans">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onGoToSignup}
              className="text-brand-purple font-semibold hover:underline cursor-pointer"
            >
              Create one
            </button>
          </p>
        </form>

        {/* Speed dial demo card */}
        <div className="border border-purple-100 bg-purple-50/50 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-bold text-brand-purple tracking-wider block font-sans uppercase">
            ⚡ PROTOTYPE EVALUATOR ASSISTANCE
          </span>
          <p className="text-xs text-slate-600 leading-normal font-sans">
            As a registered advisor, you can auto-fill pre-saved tax advisor metrics to simulate secure sessions immediately or click &quot;Create one&quot; to test the full 3-step sign-up flow.
          </p>
          <button
            onClick={fillDemoCreds}
            className="text-xs font-semibold bg-white border border-brand-purple/20 text-brand-purple px-3 py-1.5 rounded-[6px] hover:bg-purple-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Use Saved Profile (john@company.com)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
