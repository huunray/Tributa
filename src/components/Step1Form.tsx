import React, { useState, useEffect } from 'react';
import { SignupState, FormErrors } from '../types';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, X, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface Step1FormProps {
  formData: SignupState;
  onChange: (updates: Partial<SignupState>) => void;
  onNext: () => void;
  onGoToLogin: () => void;
}

export default function Step1Form({
  formData,
  onChange,
  onNext,
  onGoToLogin,
}: Step1FormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Real-time email exist check state
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailIsTaken, setEmailIsTaken] = useState(false);

  // Live checklist states
  const passwordChecklist = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  // Calculate password strength
  const calculateStrength = () => {
    if (!formData.password) return { percent: 0, label: 'None', color: 'bg-slate-700' };
    const passedChecks = Object.values(passwordChecklist).filter(Boolean).length;
    switch (passedChecks) {
      case 1:
        return { percent: 20, label: 'Very Weak 🔴', color: 'bg-brand-error' };
      case 2:
        return { percent: 40, label: 'Weak 🟠', color: 'bg-orange-500' };
      case 3:
        return { percent: 60, label: 'Fair 🟡', color: 'bg-brand-warning' };
      case 4:
        return { percent: 80, label: 'Strong 🟢', color: 'bg-teal-500' };
      case 5:
        return { percent: 100, label: 'Very Strong ✨', color: 'bg-brand-success' };
      default:
        return { percent: 10, label: 'Extremely Weak 🔴', color: 'bg-brand-error' };
    }
  };

  const strength = calculateStrength();

  // Simulated email availability check
  useEffect(() => {
    if (!formData.email) {
      setEmailIsTaken(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setEmailIsTaken(false);
      return;
    }

    setCheckingEmail(true);
    const timer = setTimeout(() => {
      setCheckingEmail(false);
      // Simulate that "taken@tributa.com" or "exist@company.com" is already registered
      if (['taken@tributa.com', 'exist@company.com', 'john@company.com'].includes(formData.email.toLowerCase())) {
        setEmailIsTaken(true);
      } else {
        setEmailIsTaken(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.email]);

  // Form-level validation
  const validateField = (name: string, value: string) => {
    const fieldErrors: FormErrors = { ...errors };

    if (name === 'fullName') {
      if (!value) {
        fieldErrors.fullName = 'Full Name is required';
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        fieldErrors.fullName = 'Letters and spaces only';
      } else if (value.length > 100) {
        fieldErrors.fullName = 'Max 100 characters';
      } else {
        delete fieldErrors.fullName;
      }
    }

    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        fieldErrors.email = 'Email address is required';
      } else if (!emailPattern.test(value)) {
        fieldErrors.email = 'Please enter a valid email address';
      } else {
        delete fieldErrors.email;
      }
    }

    if (name === 'phone') {
      if (!value) {
        fieldErrors.phone = 'Phone number is required';
      } else {
        // Permissive phone check that accepts any numeric string from 8 to 15 digits (supporting Nigerian/international numbers with spaces/hyphens)
        const digits = value.replace(/[\s\-\(\)\+]+/g, '');
        const isValidPhone = /^[0-9]{8,15}$/.test(digits);
        if (!isValidPhone) {
          fieldErrors.phone = 'Please enter a valid phone number (at least 8 digits)';
        } else {
          delete fieldErrors.phone;
        }
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        fieldErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete fieldErrors.confirmPassword;
      }
    }

    setErrors(fieldErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
    validateField(name, value);
  };

  // Check if form is submittable
  const isFormValid =
    formData.fullName &&
    !errors.fullName &&
    formData.email &&
    !errors.email &&
    !emailIsTaken &&
    formData.phone &&
    !errors.phone &&
    formData.password &&
    passwordChecklist.length &&
    formData.confirmPassword === formData.password &&
    agreedToTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden" id="step1-form">
      {/* Scrollable form fields body container */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10 min-h-0">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-1 font-sans">Create Your Account</h2>
            <p className="text-sm text-brand-gray-dark mb-6">Enter your personal information to get started.</p>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
                <User size={18} />
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                maxLength={100}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                  errors.fullName
                    ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                    : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-brand-error mt-1">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
                <Mail size={18} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@company.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                  errors.email || emailIsTaken
                    ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                    : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                }`}
              />
              {checkingEmail && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-brand-purple border-t-transparent"></span>
                </span>
              )}
            </div>
            <p className="text-xs text-brand-gray-dark">We&apos;ll send a confirmation to this email</p>
            {emailIsTaken && (
              <div className="flex items-center gap-1.5 text-xs text-brand-error font-medium mt-1">
                <ShieldAlert size={14} />
                <span>This email is already in use (try another, or use john@company.com to test dynamic warnings)</span>
              </div>
            )}
            {errors.email && !emailIsTaken && <p className="text-xs text-brand-error mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
                <Phone size={18} />
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="e.g. +234 803 123 4567"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                  errors.phone
                    ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                    : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                }`}
              />
            </div>
            <p className="text-xs text-brand-gray-dark">We&apos;ll use this for important notifications</p>
            {errors.phone && <p className="text-xs text-brand-error mt-1">{errors.phone}</p>}
          </div>

          {/* Password & Live Requirements */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
                <Lock size={18} />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => {
                  handleInputChange(e);
                  // also validate confirmPassword if it exists
                  if (formData.confirmPassword) {
                    validateField('confirmPassword', formData.confirmPassword);
                  }
                }}
                className={`w-full pl-10 pr-10 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple`}
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

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="mt-2 space-y-1.5 p-2 bg-slate-50 border border-slate-100 rounded-[6px]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-gray-dark">Password Strength:</span>
                  <span className="font-semibold text-[#0F172A]">{strength.label}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${strength.percent}%` }}
                    className={`h-full duration-300 ${strength.color}`}
                  />
                </div>
              </div>
            )}

            {/* Live Checklist */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 p-2.5 bg-slate-50 border border-slate-100 rounded-[6px] text-xs font-sans">
              <div className="flex items-center gap-2">
                {passwordChecklist.length ? (
                  <Check size={14} className="text-brand-success shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  </span>
                )}
                <span className={passwordChecklist.length ? 'text-[#0F172A]' : 'text-brand-gray-dark'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordChecklist.uppercase ? (
                  <Check size={14} className="text-brand-success shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  </span>
                )}
                <span className={passwordChecklist.uppercase ? 'text-[#0F172A]' : 'text-brand-gray-dark'}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordChecklist.lowercase ? (
                  <Check size={14} className="text-brand-success shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  </span>
                )}
                <span className={passwordChecklist.lowercase ? 'text-[#0F172A]' : 'text-brand-gray-dark'}>
                  One lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordChecklist.number ? (
                  <Check size={14} className="text-brand-success shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  </span>
                )}
                <span className={passwordChecklist.number ? 'text-[#0F172A]' : 'text-brand-gray-dark'}>
                  One number
                </span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                {passwordChecklist.special ? (
                  <Check size={14} className="text-brand-success shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  </span>
                )}
                <span className={passwordChecklist.special ? 'text-[#0F172A]' : 'text-brand-gray-dark'}>
                  One special character (!@#$%^&amp;*)
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
                <Lock size={18} />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                  errors.confirmPassword
                    ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                    : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6B7280] hover:text-[#0F172A]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-brand-error mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2 pt-1 pb-1 mb-6">
            <input
              type="checkbox"
              id="agreedToTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-brand-purple focus:ring-brand-purple cursor-pointer shrink-0"
            />
            <label htmlFor="agreedToTerms" className="text-xs text-brand-gray-dark cursor-pointer font-sans leading-normal select-none">
              I agree to all the <span className="text-brand-purple font-semibold hover:underline">Terms and Conditions</span> and secure processing of corporate data.
            </label>
          </div>
        </div>
      </div>

      {/* FIXED Bottom Actions Bar (Spans full right pane container width beautifully) */}
      <div className="bg-white border-t border-slate-100 shadow-[0_-12px_32px_rgba(0,0,0,0.06)] px-6 md:px-8 lg:px-10 py-5 shrink-0 z-20">
        <div className="w-full max-w-sm mx-auto space-y-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onGoToLogin}
              className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-xs border border-slate-200 rounded-[6px] cursor-pointer transition-colors text-center select-none"
            >
              Back to Login
            </button>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 py-2 px-3 rounded-[6px] font-sans font-semibold text-xs transition-colors duration-300 cursor-pointer text-center select-none shadow-sm ${
                isFormValid
                  ? 'bg-brand-purple hover:bg-opacity-95 text-white active:scale-[0.99]'
                  : 'bg-brand-gray-light text-brand-gray-dark border border-slate-200 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>

          <p className="text-center text-[10px] text-brand-gray-dark font-sans">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="text-brand-purple font-semibold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}
