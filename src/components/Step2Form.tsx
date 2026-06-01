import React, { useState } from 'react';
import { SignupState, FormErrors, INDUSTRY_OPTIONS } from '../types';
import { Building2, User, HelpCircle, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Check, Search, ChevronDown } from 'lucide-react';

interface Step2FormProps {
  formData: SignupState;
  onChange: (updates: Partial<SignupState>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export default function Step2Form({
  formData,
  onChange,
  onNext,
  onBack,
  onCancel,
}: Step2FormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  
  // TIN verification simulation states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  // Search-type dropdown states
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = INDUSTRY_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBusinessTypeChange = (type: 'corporate' | 'non-corporate') => {
    onChange({
      businessType: type,
      // Clear fields if switching to non-corporate
      cacNumber: type === 'non-corporate' ? '' : formData.cacNumber,
      tin: type === 'non-corporate' ? '' : formData.tin,
      tinVerified: type === 'non-corporate' ? false : formData.tinVerified,
      tinVerificationManualOverride: type === 'non-corporate' ? false : formData.tinVerificationManualOverride,
      industry: type === 'non-corporate' ? '' : formData.industry,
    });
    setErrors({});
    setVerificationAttempted(false);
    setVerificationError(false);
  };

  const validateField = (name: string, value: any) => {
    const fieldErrors = { ...errors };

    if (formData.businessType === 'corporate') {
      if (name === 'cacNumber') {
        const valueStr = String(value);
        // Format RC123456-XXXXX or digits-digits, let's look for a dash separated word
        const validPattern = /^[A-Za-z0-9]+-[A-Za-z0-9]+$/.test(valueStr);
        if (!valueStr) {
          fieldErrors.cacNumber = 'CAC Registration Number is required';
        } else if (!validPattern) {
          fieldErrors.cacNumber = 'Format must be XXXXXX-XXXXX (alphanumeric separated by single hyphen)';
        } else {
          delete fieldErrors.cacNumber;
        }
      }

      if (name === 'tin') {
        const valueStr = String(value).replace(/\D/g, ''); // digit check only
        if (!valueStr) {
          fieldErrors.tin = 'Tax Identification Number (TIN) is required';
        } else if (valueStr.length !== 11) {
          fieldErrors.tin = 'TIN must be exactly 11 digits';
        } else {
          delete fieldErrors.tin;
        }
      }

      if (name === 'industry') {
        if (!value) {
          fieldErrors.industry = 'Industry/Sector is required';
        } else {
          delete fieldErrors.industry;
        }
      }

      if (name === 'financialYearEnd') {
        if (!value) {
          fieldErrors.financialYearEnd = 'Financial Year-End Date is required';
        } else {
          // Check within 365 days from today
          const selectDate = new Date(value);
          const today = new Date();
          const oneYearFromNow = new Date();
          oneYearFromNow.setDate(today.getDate() + 365);
          const diffTime = selectDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (isNaN(selectDate.getTime())) {
            fieldErrors.financialYearEnd = 'Invalid Date Format';
          } else if (diffDays < -1 || diffDays > 365) {
            fieldErrors.financialYearEnd = 'Year-End date must be within 365 days from today';
          } else {
            delete fieldErrors.financialYearEnd;
          }
        }
      }
    }

    setErrors(fieldErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
    validateField(name, value);

    // If typing inside TIN, clear previous verification states so user has to re-verify
    if (name === 'tin') {
      onChange({ tinVerified: false, tinVerificationManualOverride: false });
      setVerificationAttempted(false);
      setVerificationError(false);
    }
  };

  const handleToggled = () => {
    onChange({ isSubsidiary: !formData.isSubsidiary });
  };

  // Simulate TIN Verification
  const verifyTIN = () => {
    if (!formData.tin || formData.tin.replace(/\D/g, '').length !== 11) {
      setErrors(prev => ({ ...prev, tin: 'Please enter an 11-digit TIN before verifying' }));
      return;
    }

    setIsVerifying(true);
    setVerificationAttempted(true);
    setVerificationError(false);

    setTimeout(() => {
      setIsVerifying(false);
      // Let's fail for TIN numbers ending in '999' or starting with '000' to demonstrate error states, and pass otherwise!
      const digitsOnly = formData.tin.replace(/\D/g, '');
      if (digitsOnly.endsWith('999') || digitsOnly.startsWith('000') || digitsOnly === '11111111111') {
        setVerificationError(true);
        onChange({ tinVerified: false });
      } else {
        setVerificationError(false);
        onChange({ tinVerified: true });
        // Clear manual override if verification is successful
        onChange({ tinVerificationManualOverride: false });
      }
    }, 1200);
  };

  // Step validation check
  const isFormValid = () => {
    if (formData.businessType === 'non-corporate') {
      return true;
    }

    const hasErrors =
      errors.cacNumber ||
      errors.tin ||
      errors.industry ||
      errors.financialYearEnd;

    const areFieldsFilled =
      formData.cacNumber &&
      formData.tin &&
      formData.industry &&
      formData.financialYearEnd;

    // Must be either verified OR manually overridden if verification failed
    const tinValid = formData.tinVerified || (verificationAttempted && verificationError && formData.tinVerificationManualOverride);

    return !hasErrors && areFieldsFilled && tinValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden" id="step2-form">
      {/* Scrollable inputs body container */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10 min-h-0">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-1 font-sans">Tell Us About Your Business</h2>
            <p className="text-sm text-brand-gray-dark mb-6">Select your business legal structure and provide company identifiers.</p>
          </div>

          {/* Section 1: Business Type Selection */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-[#0F172A]">Business Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Corporate card */}
              <div
                onClick={() => handleBusinessTypeChange('corporate')}
                className={`cursor-pointer p-4 rounded-[8px] border-2 transition-all relative flex flex-col justify-between h-36 ${
                  formData.businessType === 'corporate'
                    ? 'border-brand-purple bg-purple-50/40 ring-1 ring-brand-purple'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`p-1.5 rounded-[6px] ${formData.businessType === 'corporate' ? 'bg-brand-purple text-white' : 'bg-slate-100 text-[#0F172A]'}`}>
                      <Building2 size={20} />
                    </span>
                    {formData.businessType === 'corporate' && (
                      <span className="bg-brand-purple text-white rounded-full p-0.5 shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A] font-sans">Corporate Entity</h4>
                  <p className="text-xs text-brand-gray-dark leading-normal mt-1">
                    Registered company (Ltd, PLC, or other incorporated entity)
                  </p>
                </div>
              </div>

              {/* Non-corporate card */}
              <div
                onClick={() => handleBusinessTypeChange('non-corporate')}
                className={`cursor-pointer p-4 rounded-[8px] border-2 transition-all relative flex flex-col justify-between h-36 ${
                  formData.businessType === 'non-corporate'
                    ? 'border-brand-purple bg-purple-50/40 ring-1 ring-brand-purple'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`p-1.5 rounded-[6px] ${formData.businessType === 'non-corporate' ? 'bg-brand-purple text-white' : 'bg-slate-100 text-[#0F172A]'}`}>
                      <User size={20} />
                    </span>
                    {formData.businessType === 'non-corporate' && (
                      <span className="bg-brand-purple text-white rounded-full p-0.5 shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A] font-sans">Non-Corporate / Sole Trader</h4>
                  <p className="text-xs text-brand-gray-dark leading-normal mt-1">
                    Individual, partnership, or unincorporated business
                  </p>
                </div>
              </div>
            </div>
            
            {formData.businessType === 'corporate' ? (
              <p className="text-xs text-slate-500 font-sans italic">
                CIT and Development Levy modules will be active for registered corporates.
              </p>
            ) : (
              <div className="bg-slate-100 border-l-4 border-slate-400 p-3 rounded-[6px]">
                <p className="text-xs text-[#0F172A] font-medium leading-relaxed font-sans">
                  ℹ️ CIT module and Development Levy will be disabled for your account under NTA 2025.
                </p>
              </div>
            )}
          </div>

          {formData.businessType === 'corporate' && (
            <div className="space-y-5 pt-3 border-t border-slate-100">
              
              {/* CAC Registration Number */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="cacNumber">
                    CAC Registration Number
                  </label>
                  <div className="group relative">
                    <HelpCircle size={14} className="text-[#94A3B8] cursor-pointer" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-brand-navy text-white text-[10px] rounded-[4px] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all z-10 font-sans whitespace-normal leading-normal">
                      Usually formatted as numeric characters separated by a hyphen, e.g., RC123456-7890B
                    </span>
                  </div>
                </div>
                <input
                  id="cacNumber"
                  name="cacNumber"
                  type="text"
                  required
                  placeholder="e.g., RC123456-XXXXX"
                  value={formData.cacNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                    errors.cacNumber
                      ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                      : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                  }`}
                />
                <p className="text-xs text-brand-gray-dark">Found on your CAC registration certificate</p>
                {errors.cacNumber && <p className="text-xs text-brand-error mt-1">{errors.cacNumber}</p>}
              </div>

              {/* Tax Identification Number (TIN) & NRS Link */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="tin">
                  Tax Identification Number (TIN)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="tin"
                    name="tin"
                    type="text"
                    required
                    placeholder="e.g., 12345678901 (11 digits)"
                    value={formData.tin}
                    onChange={handleInputChange}
                    className={`flex-1 min-w-0 px-3 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                      errors.tin
                        ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                        : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={verifyTIN}
                    disabled={isVerifying || !formData.tin || !!errors.tin}
                    className={`flex gap-1.5 items-center justify-center shrink-0 whitespace-nowrap w-full sm:w-auto py-2 px-4 border border-brand-purple font-sans font-semibold text-xs rounded-[6px] select-none transition-colors duration-200 cursor-pointer ${
                      isVerifying || !formData.tin || !!errors.tin
                        ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
                        : 'text-brand-purple hover:bg-purple-50'
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify TIN with NRS</span>
                    )}
                  </button>
                </div>
                <p className="text-xs text-brand-gray-dark">Your unique NRS-issued 11-digit TIN</p>
                {errors.tin && <p className="text-xs text-brand-error mt-1">{errors.tin}</p>}

                {/* Test Hints */}
                {!verificationAttempted && !errors.tin && formData.tin.length === 11 && (
                  <p className="text-[11px] text-[#A78BFA] font-medium italic mt-1 font-sans">
                    💡 Tip: Try verifying. Entering a TIN ending in &apos;999&apos; simulates a failure, otherwise it succeeds!
                  </p>
                )}

                {/* TIN Verification status banners */}
                {verificationAttempted && !isVerifying && (
                  <div className="mt-2.5">
                    {formData.tinVerified ? (
                      <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 text-brand-success rounded-[6px] text-xs font-sans font-semibold">
                        <CheckCircle size={16} />
                        <span>TIN Verified with NRS Database ✓</span>
                      </div>
                    ) : verificationError ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 text-brand-error rounded-[6px] text-xs font-sans">
                          <AlertCircle size={16} className="mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold block mb-0.5">Could not verify TIN with NRS</span>
                            <span className="text-slate-500 leading-normal">
                              The tax directory returned no match for this registration. Double check your digits, or use manual override if you are certain this is valid.
                            </span>
                          </div>
                        </div>
                        
                        {/* Manual override checkbox */}
                        <div className="flex items-center gap-2 px-2">
                          <input
                            type="checkbox"
                            id="tinOverride"
                            checked={formData.tinVerificationManualOverride}
                            onChange={(e) => onChange({ tinVerificationManualOverride: e.target.checked })}
                            className="rounded border-slate-300 text-brand-purple focus:ring-brand-purple"
                          />
                          <label htmlFor="tinOverride" className="text-xs font-semibold text-[#0F172A] cursor-pointer">
                            I confirm this TIN is correct and valid
                          </label>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Financial Year-End Date */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="financialYearEnd">
                  Financial Year-End Date
                </label>
                <input
                  id="financialYearEnd"
                  name="financialYearEnd"
                  type="date"
                  required
                  value={formData.financialYearEnd}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                    errors.financialYearEnd
                      ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                      : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                  }`}
                />
                <p className="text-xs text-brand-gray-dark">When does your financial year end? Must be within 365 days from today.</p>
                {errors.financialYearEnd && <p className="text-xs text-brand-error mt-1">{errors.financialYearEnd}</p>}
              </div>

              {/* Industry/Sector & Search-Type Dropdown */}
              <div className="space-y-1 relative" id="industry-select-container">
                <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="industry">
                  Industry/Sector
                </label>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Search size={15} />
                  </div>

                  <input
                    id="industry"
                    type="text"
                    required
                    placeholder="Select or search industry..."
                    value={isOpen ? searchTerm : (formData.industry || searchTerm)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => {
                      // Slight delay to allow triggering onMouseDown
                      setTimeout(() => setIsOpen(false), 200);
                    }}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsOpen(true);
                    }}
                    className={`w-full pl-9 pr-10 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans cursor-pointer focus:bg-white select-none ${
                      errors.industry
                        ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                        : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                    }`}
                  />

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Dropdown list - absolute with white background */}
                {isOpen && (
                  <div 
                    id="industry-dropdown-list"
                    className="absolute left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-[6px] shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100"
                  >
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onMouseDown={() => {
                            onChange({ industry: opt });
                            validateField('industry', opt);
                            setSearchTerm('');
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-sans font-medium transition-colors hover:bg-slate-50 flex items-center justify-between ${
                            formData.industry === opt
                              ? 'bg-purple-50 text-brand-purple font-semibold'
                              : 'text-[#0F172A] bg-white'
                          }`}
                        >
                          <span>{opt}</span>
                          {formData.industry === opt && (
                            <Check size={14} className="text-brand-purple shrink-0" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-slate-400 font-sans italic bg-white">
                        No matches found for "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-brand-gray-dark">This affects your tax obligations and relief parameters</p>
                {errors.industry && <p className="text-xs text-brand-error mt-1">{errors.industry}</p>}

                {/* Professional Services Flagged Warning Banner */}
                {formData.industry === 'Professional Services' && (
                  <div className="flex gap-2.5 p-3.5 bg-amber-50 border border-amber-200 text-[#0F172A] rounded-[6px] text-xs leading-normal mt-2.5">
                    <AlertTriangle size={18} className="text-brand-warning shrink-0" />
                    <div>
                      <span className="font-semibold text-brand-warning block mb-0.5">Professional Services Firm Rule</span>
                      <span>Professional services firms are ineligible for small company tax relief rules regardless of annual turnover volume under the current NTA 2025 directives.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Subsidiary Toggle Switch */}
              <div className="flex items-start justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-[6px]">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="block text-sm font-semibold text-[#0F172A]">
                    Is this a subsidiary of a larger group?
                  </span>
                  <span className="block text-xs text-brand-gray-dark leading-normal">
                    Select Yes if this company is part of a larger corporate entity or conglomerate group
                  </span>
                </div>
                
                <button
                  id="subsidiary-toggle"
                  type="button"
                  onClick={handleToggled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    formData.isSubsidiary ? 'bg-brand-purple' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.isSubsidiary ? 'translate-x-[20px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FIXED Bottom Actions Bar (Side-by-Side Back and Next) */}
      <div className="bg-white border-t border-slate-100 shadow-[0_-12px_32px_rgba(0,0,0,0.06)] px-6 md:px-8 lg:px-10 py-5 shrink-0 z-20">
        <div className="w-full max-w-sm mx-auto space-y-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-xs border border-slate-200 rounded-[6px] cursor-pointer transition-colors text-center select-none"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 py-2 px-3 rounded-[6px] font-sans font-semibold text-xs transition-colors duration-300 cursor-pointer text-center select-none shadow-sm ${
                isFormValid()
                  ? 'bg-brand-purple hover:bg-opacity-95 text-white active:scale-[0.99]'
                  : 'bg-brand-gray-light text-brand-gray-dark border border-slate-200 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-brand-gray-dark text-[10px] font-medium hover:text-[#0F172A] underline cursor-pointer"
            >
              Cancel and exit onboarding
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
