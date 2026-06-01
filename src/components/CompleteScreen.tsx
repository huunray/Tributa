import React, { useState } from 'react';
import { SignupState } from '../types';
import { CheckCircle2, Play, ChevronRight, Sparkles, Building2, Receipt, BarChart3, Calendar, Compass, X } from 'lucide-react';

interface CompleteScreenProps {
  formData: SignupState;
  onGoToDashboard: () => void;
}

export default function CompleteScreen({ formData, onGoToDashboard }: CompleteScreenProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Parse formatted outcomes
  const getVatStatusText = () => {
    const rawTurnover = Number(formData.annualTurnover.replace(/[^0-9]/g, ''));
    if (rawTurnover >= 25000000) {
      return `Mandatory Registered (${formData.vatNumber})`;
    }
    if (formData.vatRegistered) {
      return `Voluntary Registered (${formData.vatNumber || 'Pending'})`;
    }
    return 'Exempt / Not Registered (Under Threshold)';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" id="complete-screen">
      {/* Scrollable details container */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10 min-h-0">
        <div className="w-full max-w-sm mx-auto space-y-6">
          {/* Title block with sparkling elements */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center justify-center p-3 bg-purple-50 rounded-full text-brand-purple border border-purple-100">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Welcome to Tributa, <br />
              <span className="text-brand-purple">{formData.fullName || 'User'}</span>!
            </h2>
            <p className="text-xs text-brand-gray-dark max-w-md mx-auto">
              Your tax compliance engine has been successfully provisioned. All parameters are compiled and ready.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F172A]">
                <Sparkles size={14} className="text-brand-purple" />
                <span>COMMITTED PROFILE CONFIGURATION</span>
              </div>
              <span className="text-[9px] font-bold bg-[#A78BFA]/20 text-brand-purple px-2 py-0.5 rounded-full uppercase tracking-wider">
                IAS-8 Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Business Type */}
              <div className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-[8px]">
                <Building2 size={14} className="text-brand-purple shrink-0" />
                <div>
                  <span className="block text-[10px] text-brand-gray-dark font-medium font-sans">Business Type</span>
                  <span className="block text-[#0F172A] font-bold capitalize truncate max-w-[100px]">
                    {formData.businessType === 'corporate' ? 'Corporate Entity' : 'Non-Corporate Entity'}
                  </span>
                </div>
              </div>

              {/* VAT Status */}
              <div className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-[8px]">
                <Receipt size={14} className="text-brand-purple shrink-0" />
                <div>
                  <span className="block text-[10px] text-brand-gray-dark font-medium font-sans">VAT Status</span>
                  <span className="block text-[#0F172A] font-bold truncate max-w-[100px]" title={getVatStatusText()}>
                    {getVatStatusText()}
                  </span>
                </div>
              </div>

              {/* Inventory Method */}
              <div className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-[8px]">
                <BarChart3 size={14} className="text-brand-purple shrink-0" />
                <div>
                  <span className="block text-[10px] text-brand-gray-dark font-medium font-sans">Inventory Method</span>
                  <span className="block text-[#0F172A] font-bold truncate max-w-[100px]">
                    {formData.inventoryMethod || 'Excluded (Service-only)'}
                  </span>
                </div>
              </div>

              {/* Financial Year-End */}
              <div className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-[8px]">
                <Calendar size={14} className="text-brand-purple shrink-0" />
                <div>
                  <span className="block text-[10px] text-brand-gray-dark font-medium font-sans">Financial Year-End</span>
                  <span className="block text-[#0F172A] font-bold truncate max-w-[100px]">
                    {formData.financialYearEnd
                      ? new Date(formData.financialYearEnd).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '31 December'}
                  </span>
                </div>
              </div>

              {/* Industry/Sector */}
              {formData.businessType === 'corporate' && (
                <div className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-[8px] sm:col-span-2">
                  <Compass size={14} className="text-brand-purple shrink-0" />
                  <div>
                    <span className="block text-[10px] text-brand-gray-dark font-medium font-sans">Industry/Sector Focus</span>
                    <span className="block text-[#0F172A] font-bold text-xs truncate max-w-[200px]">{formData.industry || 'Not Specified'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2.5 pb-2">
            <h3 className="text-sm font-bold text-[#0F172A]">Let&apos;s Get You Started</h3>
            
            <div className="space-y-2">
              {/* Action 1 */}
              <div className="flex gap-3 p-3 bg-white border border-slate-200/50 rounded-lg hover:border-slate-300 transition-colors">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-50 text-brand-purple font-bold text-xs shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#0F172A]">Set up your vendors and tax KYC</h4>
                  <p className="text-[10px] text-brand-gray-dark mt-0.5 leading-normal">
                    Add supplier profiles, declare withholding lines, and run automated NRS validations.
                  </p>
                </div>
              </div>

              {/* Action 2 */}
              <div className="flex gap-3 p-3 bg-white border border-slate-200/50 rounded-lg hover:border-slate-300 transition-colors">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-50 text-brand-purple font-bold text-xs shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#0F172A]">Configure your products and inventory</h4>
                  <p className="text-[10px] text-brand-gray-dark mt-0.5 leading-normal">
                    Create your product catalogs, establish bulk cost levels, and configure inventory stock alerts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY Bottom Primary CTAs */}
      <div className="bg-white border-t border-slate-100 shadow-[0_-12px_32px_rgba(0,0,0,0.06)] px-6 md:px-8 lg:px-10 py-5 shrink-0 z-20">
        <div className="w-full max-w-sm mx-auto space-y-3">
          <button
            onClick={onGoToDashboard}
            className="w-full py-2 bg-brand-purple hover:bg-opacity-95 text-white rounded-[6px] font-sans font-semibold text-sm shadow-sm transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Go to Dashboard</span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => setShowVideoModal(true)}
            className="w-full py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#0F172A] rounded-[6px] font-sans font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play size={12} className="fill-current text-brand-purple" />
            <span>Watch Quick Start Guide</span>
          </button>

          <div className="text-center pt-1">
            <button
              onClick={onGoToDashboard}
              className="text-brand-gray-dark text-[10px] font-semibold hover:text-[#0F172A] underline cursor-pointer"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full border border-slate-200">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200/50 bg-slate-50">
              <span className="font-bold text-sm text-[#0F172A]">Tributa Quick Start Video Guide</span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-[#6B7280] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Video Canvas Section */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 z-10">
                <p className="text-white font-bold text-lg">Tributa: Streamlined Tax Compliance</p>
                <p className="text-slate-300 text-xs mt-1">
                  Learn how Tributa automates VAT calculations, inventory flows, and generates perfect corporate audit files.
                </p>
              </div>
              
              {/* Play symbol mockup */}
              <div className="z-20 p-5 bg-brand-purple rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-purple-500/20 active:scale-95 animate-pulse">
                <Play size={32} fill="currentColor" />
              </div>

              {/* Simulated scanlines backgrounds, making it beautiful */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0,rgba(0,0,0,0)_70%)] opacity-80" />
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-1.5 bg-brand-purple text-white hover:bg-opacity-90 font-bold text-xs rounded-[6px] transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
