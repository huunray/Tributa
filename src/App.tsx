import React, { useState } from 'react';
import { SignupState, INITIAL_SIGNUP_STATE } from './types';
import Logo from './components/Logo';
import LoginForm from './components/LoginForm';
import Step1Form from './components/Step1Form';
import Step2Form from './components/Step2Form';
import Step3Form from './components/Step3Form';
import CompleteScreen from './components/CompleteScreen';
import Dashboard from './components/Dashboard';
import { Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ScreenState = 'login' | 'step1' | 'step2' | 'step3' | 'complete' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('login');
  const [formData, setFormData] = useState<SignupState>(INITIAL_SIGNUP_STATE);

  const handleFormDataChange = (updates: Partial<SignupState>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleGoToSignup = () => {
    setFormData(INITIAL_SIGNUP_STATE);
    setCurrentScreen('step1');
  };

  const handleLoginSuccess = (email: string) => {
    // Fill in John Doe details to simulate a successful advisor log in
    setFormData({
      ...INITIAL_SIGNUP_STATE,
      fullName: 'John Doe',
      email: email,
      phone: '+234 801 234 5678',
      businessType: 'corporate',
      cacNumber: 'RC123456-7890B',
      tin: '12345678901',
      tinVerified: true,
      financialYearEnd: '2026-12-31',
      industry: 'Technology',
      annualTurnover: '35,000,000',
      vatRegistered: true,
      vatNumber: '12345678-1234',
      inventoryMethod: 'FIFO',
    });
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setFormData(INITIAL_SIGNUP_STATE);
    setCurrentScreen('login');
  };

  // Determine current active vertical progress step index
  const getProgressStepIndex = () => {
    switch (currentScreen) {
      case 'step1':
        return 0;
      case 'step2':
        return 1;
      case 'step3':
        return 2;
      case 'complete':
        return 3;
      default:
        return -1;
    }
  };

  const progressIndex = getProgressStepIndex();

  // If dashboard is requested, render it (keep original routing intact, but onboarding was our redone focus)
  if (currentScreen === 'dashboard') {
    return (
      <Dashboard formData={formData} onLogout={handleLogout} />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-brand-purple/20">
      
      {/* LEFT COLUMN: Very Dark Blue Column, fixed/sticky on desktop so it never scrolls off-screen */}
      <div className="w-full md:w-[30%] lg:w-[28%] bg-[#0B0F19] text-white flex flex-col justify-between p-8 md:p-12 md:sticky md:top-0 md:h-screen relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-slate-800">
        
        {/* Ambient background visual glows that enhance contrast and keep deep blue from feeling flat */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          {/* Logo with White text and Purple Icon popping on dark blue background */}
          <Logo size={42} textColor="white" className="relative z-10" />
        </div>

        {/* Dynamic headings/indicators to guide user through onboarding milestones */}
        <div className="my-8 md:my-auto relative z-10 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brand-purple-light tracking-widest uppercase block">
              Tributa Regulators
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
              {currentScreen === 'login' ? (
                <>
                  Corporate <br />
                  Tax Workspace
                </>
              ) : (
                <>
                  Get Started <br />
                  with Us
                </>
              )}
            </h1>
            <p className="text-xs text-slate-350 leading-relaxed max-w-xs font-sans">
              {currentScreen === 'login' ? (
                'Sign in to calculate CIT, verify corporate certificates dynamically, and comply with NTA 2025 guidelines.'
              ) : (
                'Complete these easy steps to register and audit your workspace account with IAS 8 compliance.'
              )}
            </p>
          </div>

          {/* Stepper indicators - only visible during sign up onboarding */}
          {currentScreen !== 'login' && (
            <div className="pt-4 space-y-5">
              
              {/* Step 1 Indicator */}
              <div className={`flex items-center gap-4 transition-all duration-300 ${progressIndex >= 0 || currentScreen === 'login' ? 'opacity-100' : 'opacity-40'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-2 duration-300 shrink-0 ${
                  progressIndex > 0
                    ? 'bg-brand-purple text-white ring-brand-purple'
                    : progressIndex === 0 || currentScreen === 'login'
                    ? 'bg-white text-[#0B0F19] ring-white scale-110 shadow-lg shadow-purple-900/40'
                    : 'bg-transparent text-slate-400 ring-slate-700'
                }`}>
                  {progressIndex > 0 ? '✓' : '1'}
                </span>
                <div>
                  <span className={`block font-bold text-xs leading-none ${(progressIndex === 0 || currentScreen === 'login') ? 'text-white' : 'text-slate-200'}`}>
                    Personal Information
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Credentials Setup</span>
                </div>
              </div>

              {/* Step 2 Indicator */}
              <div className={`flex items-center gap-4 transition-all duration-300 ${progressIndex >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-2 duration-300 shrink-0 ${
                  progressIndex > 1
                    ? 'bg-brand-purple text-white ring-brand-purple'
                    : progressIndex === 1
                    ? 'bg-white text-[#0B0F19] ring-white scale-110 shadow-lg shadow-purple-900/40'
                    : 'bg-transparent text-slate-400 ring-slate-700'
                }`}>
                  {progressIndex > 1 ? '✓' : '2'}
                </span>
                <div>
                  <span className={`block font-bold text-xs leading-none ${progressIndex === 1 ? 'text-white' : 'text-slate-200'}`}>
                    Business Profiling
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Company Credentials</span>
                </div>
              </div>

              {/* Step 3 Indicator */}
              <div className={`flex items-center gap-4 transition-all duration-300 ${progressIndex >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-2 duration-300 shrink-0 ${
                  progressIndex > 2
                    ? 'bg-brand-purple text-white ring-brand-purple'
                    : progressIndex === 2
                    ? 'bg-white text-[#0B0F19] ring-white scale-110 shadow-lg shadow-purple-900/40'
                    : 'bg-transparent text-slate-400 ring-slate-700'
                }`}>
                  {progressIndex > 2 ? '✓' : '3'}
                </span>
                <div>
                  <span className={`block font-bold text-xs leading-none ${progressIndex === 2 ? 'text-white' : 'text-slate-200'}`}>
                    VAT &amp; Preference Settings
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Valuation Thresholds</span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Left Side Footer */}
        <div className="relative z-10 flex items-center gap-2 text-[10px] text-slate-400 font-medium pt-8 md:pt-4">
          <Shield size={12} className="text-brand-purple-light shrink-0" />
          <span>NTA 2025 Secured • IAS 8 Audit compliant</span>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Form Canvas - full height, overflow-hidden to control layout, padded within the scrollable children */}
      <div className="w-full md:w-[70%] lg:w-[72%] bg-white flex flex-col md:h-screen relative overflow-hidden" id="interactive-form-canvas">
        
        <div className="flex-1 flex flex-col h-full min-h-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col overflow-hidden min-h-0"
            >
              
              {currentScreen === 'login' && (
                <LoginForm
                  onGoToSignup={handleGoToSignup}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}

              {currentScreen === 'step1' && (
                <Step1Form
                  formData={formData}
                  onChange={handleFormDataChange}
                  onNext={() => setCurrentScreen('step2')}
                  onGoToLogin={() => setCurrentScreen('login')}
                />
              )}

              {currentScreen === 'step2' && (
                <Step2Form
                  formData={formData}
                  onChange={handleFormDataChange}
                  onNext={() => setCurrentScreen('step3')}
                  onBack={() => setCurrentScreen('step1')}
                  onCancel={handleLogout}
                />
              )}

              {currentScreen === 'step3' && (
                <Step3Form
                  formData={formData}
                  onChange={handleFormDataChange}
                  onComplete={() => setCurrentScreen('complete')}
                  onBack={() => setCurrentScreen('step2')}
                  onCancel={handleLogout}
                />
              )}

              {currentScreen === 'complete' && (
                <CompleteScreen
                  formData={formData}
                  onGoToDashboard={() => setCurrentScreen('dashboard')}
                />
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
