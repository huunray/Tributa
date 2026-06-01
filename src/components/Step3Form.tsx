import React, { useState } from 'react';
import { SignupState, FormErrors } from '../types';
import { Layers, Scale, AlertTriangle, Check, ShieldAlert } from 'lucide-react';

interface Step3FormProps {
  formData: SignupState;
  onChange: (updates: Partial<SignupState>) => void;
  onComplete: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export default function Step3Form({
  formData,
  onChange,
  onComplete,
  onBack,
  onCancel,
}: Step3FormProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  // Parse formatted currency string to number
  const cleanNumber = (val: string): number => {
    return Number(val.replace(/[^0-9]/g, ''));
  };

  // Turn raw numeric sequence into formatted thousands separator string
  const formatCurrency = (val: string): string => {
    const raw = val.replace(/[^0-9]/g, '');
    if (!raw) return '';
    return Number(raw).toLocaleString('en-US');
  };

  const handleTurnoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericOnly = rawValue.replace(/[^0-9]/g, '');
    const formatted = formatCurrency(numericOnly);
    const numericValue = numericOnly ? Number(numericOnly) : 0;

    // Determine conditions based on threshold
    const isAboveThreshold = numericValue >= 25000000;

    onChange({
      annualTurnover: formatted,
      vatRegistered: isAboveThreshold ? true : formData.vatRegistered,
      vatNumber: isAboveThreshold ? formData.vatNumber : (formData.vatRegistered ? formData.vatNumber : ''),
    });

    // Validate turnover
    if (!numericOnly) {
      setErrors(prev => ({ ...prev, annualTurnover: 'Annual Turnover is required' }));
    } else {
      setErrors(prev => {
        const next = { ...prev };
        delete next.annualTurnover;
        return next;
      });
    }

    // Dynamic reset of VAT number validation if toggle disappears
    if (!isAboveThreshold && !formData.vatRegistered) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.vatNumber;
        return next;
      });
    }
  };

  const handleVatToggle = () => {
    const nextRegistered = !formData.vatRegistered;
    onChange({
      vatRegistered: nextRegistered,
      vatNumber: nextRegistered ? formData.vatNumber : '',
    });

    if (!nextRegistered) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.vatNumber;
        return next;
      });
    }
  };

  const handleVatNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({ vatNumber: val });

    // Format target is 11-digit check or XXXXXXXXXX-XXXX
    // Spec says format is "XXXXXXXXXX-XXXX" (10 digits, dash, 4 alphanumeric/digits)
    const isValidFormat = /^\d{10}-\w{4}$/.test(val);
    if (!val) {
      setErrors(prev => ({ ...prev, vatNumber: 'VAT Registration Number is required' }));
    } else if (!isValidFormat) {
      setErrors(prev => ({ ...prev, vatNumber: 'Must match format XXXXXXXXXX-XXXX (e.g. 1234567890-1234)' }));
    } else {
      setErrors(prev => {
        const next = { ...prev };
        delete next.vatNumber;
        return next;
      });
    }
  };

  const handleInventoryMethodSelect = (method: 'FIFO' | 'Weighted Average') => {
    onChange({ inventoryMethod: method });
    setErrors(prev => {
      const next = { ...prev };
      delete next.inventoryMethod;
      return next;
    });
  };

  const checkValidation = () => {
    const turnoverNum = cleanNumber(formData.annualTurnover);
    
    if (!formData.annualTurnover) return false;
    if (errors.annualTurnover) return false;

    // Check VAT specific constraints
    const isMandatory = turnoverNum >= 25000000;
    if (isMandatory || formData.vatRegistered) {
      if (!formData.vatNumber) return false;
      if (errors.vatNumber) return false;
    }

    if (!formData.inventoryMethod) return false;

    return true;
  };

  const isFormValid = checkValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden" id="step3-form">
      {/* Scrollable form fields body container */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10 min-h-0">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-1 font-sans">VAT Registration &amp; Preferences</h2>
            <p className="text-sm text-brand-gray-dark mb-6">Estimate your annual business turnover to configure VAT, and select your valuation parameters.</p>
          </div>

          {/* Section 1: VAT Assessment */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-[#0F172A]">Estimate Your Business Turnover</h3>
            
            {/* Turnover Currency Input */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="annualTurnover">
                Annual Turnover (Estimated or Actual)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#0F172A] font-bold text-sm">
                  ₦
                </span>
                <input
                  id="annualTurnover"
                  name="annualTurnover"
                  type="text"
                  required
                  placeholder="e.g. 30,000,000"
                  value={formData.annualTurnover}
                  onChange={handleTurnoverChange}
                  className={`w-full pl-8 pr-4 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                    errors.annualTurnover
                      ? 'border-brand-error focus:ring-1 focus:ring-brand-error'
                      : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                  }`}
                />
              </div>
              <p className="text-xs text-brand-gray-dark">Used to determine your VAT registration eligibility under NTA 2025</p>
              {errors.annualTurnover && <p className="text-xs text-brand-error mt-1">{errors.annualTurnover}</p>}
            </div>

            {/* Dynamic VAT Status Display Banners */}
            {formData.annualTurnover && (
              <div className="mt-2 text-sm">
                {cleanNumber(formData.annualTurnover) >= 25000000 ? (
                  <div className="p-3.5 rounded-[6px] bg-red-50 border border-red-200 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-error text-white rounded-full">
                        MANDATORY
                      </span>
                      <span className="font-bold text-brand-error text-xs font-sans">VAT Registration Required</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-normal">
                      Your estimated annual turnover of <strong>₦{formData.annualTurnover}</strong> is meet/greater than the <strong>₦25,000,000</strong> threshold. VAT registration is mandatory under Nigerian Tax regulations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-[6px] bg-amber-50/70 border border-amber-200 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-warning text-white rounded-full">
                          OPTIONAL
                        </span>
                        <span className="font-bold text-brand-warning text-xs font-sans">VAT Registration Voluntary</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">
                        Your estimated annual turnover of <strong>₦{formData.annualTurnover}</strong> is below the statutory threshold of <strong>₦25,000,000</strong>. You are exempt from mandatory VAT compliance.
                      </p>
                    </div>

                    {/* Voluntary Registration Toggle Switch */}
                    <div className="flex items-start justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-[6px]">
                      <div className="space-y-0.5 max-w-[80%]">
                        <span className="block text-sm font-semibold text-[#0F172A]">
                          Register for VAT Anyway?
                        </span>
                        <span className="block text-xs text-brand-gray-dark leading-normal">
                          Select Yes if you would like to voluntarily opt-in to VAT registry to reclaim inputs
                        </span>
                      </div>
                      
                      <button
                        id="vat-voluntary-toggle"
                        type="button"
                        onClick={handleVatToggle}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                          formData.vatRegistered ? 'bg-brand-purple' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            formData.vatRegistered ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VAT Registration Number Field */}
            {(cleanNumber(formData.annualTurnover) >= 25000000 || (cleanNumber(formData.annualTurnover) < 25000000 && formData.vatRegistered)) && (
              <div className="space-y-1 pt-2">
                <label className="block text-sm font-semibold text-[#0F172A]" htmlFor="vatNumber">
                  VAT Registration Number
                </label>
                <input
                  id="vatNumber"
                  name="vatNumber"
                  type="text"
                  required
                  placeholder="e.g. 1234567890-1234"
                  value={formData.vatNumber}
                  onChange={handleVatNumberChange}
                  className={`w-full px-3 py-2 bg-white text-[#0F172A] border rounded-[6px] outline-none transition-all text-sm font-sans ${
                    errors.vatNumber
                      ? 'border-brand-error focus:ring-1 focus:ring-brand-error font-mono'
                      : 'border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple'
                  }`}
                />
                <p className="text-xs text-brand-gray-dark">Your NRS VAT registration number (Format: 10 digits, secondary dash, 4 codes)</p>
                {errors.vatNumber && <p className="text-xs text-brand-error mt-1">{errors.vatNumber}</p>}
              </div>
            )}
          </div>

          {/* Section 2: Inventory Valuation Method */}
          <div className="space-y-3.5 pt-3 border-t border-slate-100">
            <h3 className="text-md font-bold text-[#0F172A]">Select Your Inventory Accounting Method</h3>
            <p className="text-xs text-brand-gray-dark leading-normal">
              Choose how you value your inventory. This method affects your Cost of Goods Sold (COGS) calculation and cannot be changed without special statutory approval.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* FIFO Card */}
              <div
                onClick={() => handleInventoryMethodSelect('FIFO')}
                className={`cursor-pointer p-4 rounded-[8px] border-2 transition-all relative flex flex-col justify-between min-h-[12rem] ${
                  formData.inventoryMethod === 'FIFO'
                    ? 'border-brand-purple bg-purple-50/40 ring-1 ring-brand-purple'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`p-1.5 rounded-[6px] ${formData.inventoryMethod === 'FIFO' ? 'bg-brand-purple text-white' : 'bg-slate-100 text-[#0F172A]'}`}>
                      <Layers size={18} />
                    </span>
                    {formData.inventoryMethod === 'FIFO' && (
                      <span className="bg-brand-purple text-white rounded-full p-0.5 shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A] font-sans">FIFO (First In, First Out)</h4>
                  <p className="text-[11px] text-[#6B7280] leading-normal mt-1">
                    Assumes items purchased first are sold first. Creates realistic inventory flow for perishable and fast-moving goods.
                  </p>
                </div>
                
                <div className="mt-3 text-[10px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full w-fit leading-tight">
                  Recommended for: Retail, F&amp;B, Fast-moving goods
                </div>
              </div>

              {/* Weighted Average Card */}
              <div
                onClick={() => handleInventoryMethodSelect('Weighted Average')}
                className={`cursor-pointer p-4 rounded-[8px] border-2 transition-all relative flex flex-col justify-between min-h-[12rem] ${
                  formData.inventoryMethod === 'Weighted Average'
                    ? 'border-brand-purple bg-purple-50/40 ring-1 ring-brand-purple'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`p-1.5 rounded-[6px] ${formData.inventoryMethod === 'Weighted Average' ? 'bg-brand-purple text-white' : 'bg-slate-100 text-[#0F172A]'}`}>
                      <Scale size={18} />
                    </span>
                    {formData.inventoryMethod === 'Weighted Average' && (
                      <span className="bg-brand-purple text-white rounded-full p-0.5 shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A] font-sans">Weighted Average Cost</h4>
                  <p className="text-[11px] text-[#6B7280] leading-normal mt-1">
                    Uses average cost of all units in inventory. Creates stable COGS and is less volatile.
                  </p>
                </div>
                
                <div className="mt-3 text-[10px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full w-fit leading-tight">
                  Recommended for: Wholesale, Manufacturing, Stable inventory
                </div>
              </div>
            </div>

            {/* Warning Badge */}
            <div className="flex gap-2 p-3 bg-rose-50 border border-rose-100 text-brand-error rounded-[6px] text-xs leading-normal mb-6">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>
                ⚠️ This method cannot be changed without Super Admin approval and generates an IAS 8 audit log entry.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED Bottom Actions Bar (Side-by-Side Back and Complete) */}
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
              disabled={!isFormValid}
              className={`flex-1 py-2 px-3 rounded-[6px] font-sans font-semibold text-xs transition-colors duration-300 cursor-pointer text-center select-none shadow-sm ${
                isFormValid
                  ? 'bg-brand-purple hover:bg-opacity-95 text-white active:scale-[0.99]'
                  : 'bg-brand-gray-light text-brand-gray-dark border border-slate-200 cursor-not-allowed'
              }`}
            >
              Complete Setup
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
