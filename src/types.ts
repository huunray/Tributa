export interface SignupState {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Step 2: Business Profiling
  businessType: 'corporate' | 'non-corporate';
  cacNumber: string;
  tin: string;
  tinVerified: boolean;
  tinVerificationManualOverride: boolean;
  financialYearEnd: string; // YYYY-MM-DD
  industry: string;
  isSubsidiary: boolean;

  // Step 3: VAT & Inventory Settings
  annualTurnover: string; // Naira amount e.g. "25,000,000"
  vatRegistered: boolean; // Voluntary registration if < ₦25m
  vatNumber: string;
  inventoryMethod: 'FIFO' | 'Weighted Average' | '';
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  cacNumber?: string;
  tin?: string;
  financialYearEnd?: string;
  industry?: string;
  annualTurnover?: string;
  vatNumber?: string;
  inventoryMethod?: string;
}

export const INITIAL_SIGNUP_STATE: SignupState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  businessType: 'corporate',
  cacNumber: '',
  tin: '',
  tinVerified: false,
  tinVerificationManualOverride: false,
  financialYearEnd: '2026-12-31', // Default modern date
  industry: '',
  isSubsidiary: false,
  annualTurnover: '',
  vatRegistered: false,
  vatNumber: '',
  inventoryMethod: '',
};

export const INDUSTRY_OPTIONS = [
  'Retail',
  'Manufacturing',
  'Professional Services',
  'Hospitality',
  'Technology',
  'Telecommunications',
  'Agriculture',
  'Healthcare',
  'Finance & Insurance',
  'Construction',
  'Other',
];
