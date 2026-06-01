import React, { useState, useEffect } from 'react';
import { SignupState } from '../types';
import Logo from './Logo';
import POSTerminal from './POSTerminal';
import InventoryModule from './InventoryModule';
import VATModule from './VATModule';
import {
  Home,
  ShoppingCart,
  Package,
  Percent,
  Link as LinkIcon,
  Building2,
  TrendingUp,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  ChevronDown,
  HelpCircle,
  ArrowRight,
  Info,
  Plus,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  ArrowLeft,
  X,
  LogOut,
  ChevronRight,
  Sliders,
  Calendar,
  Eye,
  EyeOff,
  UserCheck,
  FileSpreadsheet,
  Menu,
  Minus,
  CreditCard,
  Banknote,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  formData: SignupState;
  onLogout: () => void;
}

interface TourStep {
  title: string;
  description: string;
  targetId: string;
}

// Extended types for dynamic operations
interface Transaction {
  id: string;
  date: string;
  type: 'Sale' | 'Payment' | 'Receipt';
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface EmptyStateProps {
  tab: string;
  formData: SignupState;
  onAction: (msg: string) => void;
}

function EmptyState({ tab, formData, onAction }: EmptyStateProps) {
  const getTabDetails = () => {
    switch (tab) {
      case 'pos':
        return {
          title: "Point of Sale (POS) Terminal",
          subtitle: "Process instant sales transactions, print responsive FIRS-compliant customer invoice receipts, and update stock counts automatically.",
          primaryAction: "Connect POS Network Hub",
          description: "Establish automated live data streams from retail cash registers to post receipts directly inside your workspace."
        };
      case 'inventory':
        return {
          title: "Sovereign Inventory & Cost Tracking",
          subtitle: `Track raw compounds, manufacturing stocks, and bulk items utilizing live valuation computed under the ${formData.inventoryMethod || 'FIFO'} method.`,
          primaryAction: "Perform Physical Cost Audit",
          description: "Configuring safety thresholds allows Tributa to trigger persistent status notifications on active items."
        };
      case 'vat':
        return {
          title: "VAT Management & Return Registry",
          subtitle: "Standard 7.5% outward VAT collector, compliant invoice registries, and fast FIRS digital return generators.",
          primaryAction: "Run Automated VAT Return Draft",
          description: "Scan processed invoices to detect exemption categories, calculate advanced liability, and draft regulatory reports."
        };
      case 'wht':
        return {
          title: "Withholding Tax (WHT) Schedules",
          subtitle: "Process advanced statutory deductions, construct scheduled invoice logs, and collect FIRS credit note claims.",
          primaryAction: "Reconcile WHT Deductions",
          description: "Track credit assets from transactions to deduct from annual CIT computations, with professional guidance."
        };
      case 'vendors':
        return {
          title: "Supplier Audits & KYC Directory",
          subtitle: "Verify supplier Tax Identification Numbers (TIN) and corporate compliance status records dynamically to authorize payouts.",
          primaryAction: "Register Vendor TIN Credential",
          description: "Tributa cross-references Nigerian Corporate Affairs Commission data to shield your business from auditing penalties."
        };
      case 'financials':
        return {
          title: "IAS-8 Compliant Financial Statements",
          subtitle: "Real-time balance sheets, Profit & Loss reports, and cash flow models updated based on live trading registries.",
          primaryAction: "Compile Professional Statement",
          description: "Generate complete certified general ledger reports structured for standard regulatory review and banking."
        };
      case 'cit':
        return {
          title: "Companies Income Tax (CIT) Hub",
          subtitle: `Track, project, and claim capital allowance reliefs customized for corporate tiers and small business exclusions.`,
          primaryAction: "Draft CIT Annual Projection",
          description: "Calculate standard corporate liabilities, analyze industry exemptions, and export structured ledger reports."
        };
      case 'advisory':
        return {
          title: "Sovereign Tax Advisory & Inquiry Portal",
          subtitle: "Explore changing Nigerian tax codes, verify corporate relief qualifications, and run advisory calculations.",
          primaryAction: "Consult Advisory Assistant",
          description: "Get certified assistance targeted directly to your enterprise size, location scale, and industry classification."
        };
      case 'reports':
        return {
          title: "Analytical Reports & Audit Logs",
          subtitle: "Download chronological general ledger exports, interactive compliance records, and structured tax schedules.",
          primaryAction: "Extract Standard Compliance Report",
          description: "Organize complete financial activities and tax metrics into clean, print-ready summaries for corporate meetings."
        };
      case 'settings':
        return {
          title: "Workspace Parameters & Security Setup",
          subtitle: "Configure active registered entity profile records, corporate tax IDs, and cryptographic audit security keys.",
          primaryAction: "Review Entity Compliance Scheme",
          description: "Adjust systemic configurations, notification thresholds, and administrator account details."
        };
      default:
        return {
          title: "Enterprise Compliance Channel",
          subtitle: "Automate financial operations and tax schedules tailored specifically to FIRS regulatory requirements.",
          primaryAction: "Query FIRS Sync Channel",
          description: "Keep system metrics fully integrated with FIRS APIs for real-time reporting."
        };
    }
  };

  const details = getTabDetails();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 max-w-xl mx-auto my-16 text-center space-y-7"
    >
      <div className="mx-auto h-14 w-14 rounded-2xl bg-[#7C3AED]/5 border border-[#7C3AED]/20 flex items-center justify-center text-brand-purple">
        <Logo size={24} showText={false} />
      </div>

      <div className="space-y-2">
        <span className="text-[9px] font-bold text-brand-purple tracking-widest uppercase bg-purple-50 border border-purple-200/50 px-2 py-0.5 rounded-md inline-block">
          Module Offline
        </span>
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
          {details.title}
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {details.subtitle}
        </p>
      </div>

      <div className="border border-dashed border-slate-200 bg-white/50 rounded-xl p-5 space-y-3.5">
        <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-xs mx-auto">
          {details.description}
        </p>
        <div className="flex justify-center gap-1.5 opacity-30 select-none">
          <span className="h-1.5 w-16 bg-slate-200 rounded-full" />
          <span className="h-1.5 w-8 bg-slate-350 rounded-full" />
        </div>
      </div>

      <button
        onClick={() => onAction(`Initiated active test context: '${details.primaryAction}' for ${details.title}.`)}
        className="px-4.5 py-2 bg-brand-purple hover:bg-opacity-95 text-white font-sans font-semibold text-xs rounded-lg transition-all cursor-pointer shadow-sm hover:translate-y-[-1px]"
      >
        {details.primaryAction}
      </button>
    </motion.div>
  );
}

export default function Dashboard({ formData, onLogout }: DashboardProps) {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sync activeTab with URL 'page' parameter on load and popstate
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const validTabs = ['dashboard', 'pos', 'inventory', 'vat', 'wht', 'vendors', 'financials', 'cit', 'advisory', 'reports', 'settings'];
      
      if (pageParam && validTabs.includes(pageParam)) {
        setActiveTab(pageParam);
      } else {
        setActiveTab('dashboard');
      }
    };

    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL parameters when activeTab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    params.set('screen', 'dashboard');
    params.set('page', activeTab);
    
    const newSearch = `?${params.toString()}`;
    if (window.location.search !== newSearch) {
      window.history.pushState({}, '', `${url.pathname}${newSearch}`);
    }
  }, [activeTab]);
  
  // Search state across transactions, products, and vendors
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown states
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active Interactive Modals for action buttons
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);

  // Success alert states
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Interactive mock database for transactions (last 10 transactions)
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-10512', date: '2026-05-29', type: 'Sale', description: 'Invoice #NFT-905 Acme Advisory', amount: 3100000, status: 'Completed' },
    { id: 'TX-10511', date: '2026-05-28', type: 'Receipt', description: 'VAT Payment Ack Receipt #822', amount: 840000, status: 'Completed' },
    { id: 'TX-10510', date: '2026-05-27', type: 'Sale', description: 'Invoice #NFT-904 Zest Retailers', amount: 1550000, status: 'Completed' },
    { id: 'TX-10509', date: '2026-05-25', type: 'Payment', description: 'Withholding Tax Remittance - FIRS', amount: 180000, status: 'Completed' },
    { id: 'TX-10508', date: '2026-05-24', type: 'Sale', description: 'Invoice #NFT-903 Crestline Partners', amount: 4800000, status: 'Completed' },
    { id: 'TX-10507', date: '2026-05-22', type: 'Payment', description: 'Raw stock materials - Cargo hub', amount: 1250000, status: 'Completed' },
    { id: 'TX-10506', date: '2026-05-20', type: 'Sale', description: 'Invoice #NFT-902 Delta Aviation Ltd', amount: 2200000, status: 'Completed' },
    { id: 'TX-10505', date: '2026-05-18', type: 'Receipt', description: 'Refund allowance overpayment FIRS', amount: 450000, status: 'Pending' },
    { id: 'TX-10504', date: '2026-05-15', type: 'Sale', description: 'Invoice #NFT-901 Sterling Bankers', amount: 6400000, status: 'Completed' },
    { id: 'TX-10503', date: '2026-05-14', type: 'Payment', description: 'Supplier restock - West Bulk Depot', amount: 980000, status: 'Completed' }
  ]);

  // Modal support states
  const [prepVatMonth, setPrepVatMonth] = useState('May 2026');
  const [vatReceiptType, setVatReceiptType] = useState('standard');
  const [newInvoiceDesc, setNewInvoiceDesc] = useState('');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState('');
  const [newInvoiceType, setNewInvoiceType] = useState<'Sale' | 'Payment' | 'Receipt'>('Sale');

  // Interactive vendors KYC tracking list
  const [kycVendors, setKycVendors] = useState([
    { id: 'VND-301', name: 'West Bulk Depot Ltd', sector: 'Raw Materials', taxID: 'TIN-482910-X', status: 'Pending' },
    { id: 'VND-302', name: 'Alpha Logistics Tech', sector: 'Transportation', taxID: 'Pending', status: 'Requires KYC' },
    { id: 'VND-303', name: 'Lagos Energy Grid', sector: 'Utilities', taxID: 'TIN-301928-Y', status: 'Completed' },
    { id: 'VND-304', name: 'Prime Security Assoc', sector: 'Professional Services', taxID: 'Pending', status: 'Requires KYC' }
  ]);

  // Inventory value states (dynamic with low stock counts)
  const [inventoryItems, setInventoryItems] = useState([
    { id: 'SKU-801', name: 'Industrial Silica Compound', qty: 15, cost: 120000, threshold: 20 },
    { id: 'SKU-802', name: 'Synthetic Polymer Resin', qty: 8, cost: 75000, threshold: 10 },
    { id: 'SKU-803', name: 'Organic Catalyst Solutions', qty: 40, cost: 45000, threshold: 15 },
    { id: 'SKU-804', name: 'Heavy Duty Packaging Roll', qty: 4, cost: 25000, threshold: 12 },
    { id: 'SKU-805', name: 'Standard Epoxy Hardener', qty: 25, cost: 35000, threshold: 8 },
    { id: 'SKU-806', name: 'Activated Carbon Powder', qty: 10, cost: 55050, threshold: 5 },
    { id: 'SKU-807', name: 'Polyethylene Stretch Wrap', qty: 18, cost: 18000, threshold: 10 },
    { id: 'SKU-808', name: 'Acrylic Acid Monomer', qty: 14, cost: 95000, threshold: 8 },
    { id: 'SKU-809', name: 'Titanium Dioxide Pigment', qty: 3, cost: 140050, threshold: 6 },
    { id: 'SKU-810', name: 'Pure Acetone Solvent', qty: 30, cost: 20000, threshold: 12 },
    { id: 'SKU-811', name: 'Silicone Release Agent', qty: 5, cost: 28000, threshold: 4 }
  ]);

  // Tour States
  const [tourActive, setTourActive] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // 6-step guided tour specification targeting new design items without backdrop masking
  const tourSteps: TourStep[] = [
    {
      title: "Real-time Quick Stats KPIs",
      description: "Keep absolute control over your core accounts YTD. Tracks revenue, pending VAT & WHT, stock valuation at cost with your chosen valuation method, and estimated PBT estimates instantly.",
      targetId: "quick-stats-section"
    },
    {
      title: "Tax Compliance Status (RAG)",
      description: "Your live status for VAT, Withholding Tax, Companies Income Tax, and Financial Statements. Green is on track, Amber/Red needs immediate focus. Use the buttons inside each box to file, review, or compute in real-time.",
      targetId: "compliance-rag-section"
    },
    {
      title: "Interactive Recent Transactions",
      description: "Lists your last 10 entries. Use the main search bar to instantly query transaction IDs, customers, or status. Updates immediately when actions are completed.",
      targetId: "recent-transactions-section"
    },
    {
      title: "Upcoming Actions & Reminders",
      description: "Don't miss a statutory date! These smart action alerts inform you of tax deadlines, vendor KYC reviews, recommended quarters for CIT computations, and low stock alarms.",
      targetId: "upcoming-actions-section"
    },
    {
      title: "Optimized Side Navigation Layout",
      description: "Our navigation is engineered specifically to match high-end fintech design. The sidebar occupies a concise, professional space while providing immediate access across modules.",
      targetId: "navigation-sidebar"
    },
    {
      title: "Integrated Command & Search Engine",
      description: "Search transactions, look up tax rules, run settings, or manage alerts easily from the top header without losing your workspace context.",
      targetId: "top-search-header"
    }
  ];

  const handleNextTour = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setTourActive(false);
    }
  };

  const handlePrevTour = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipTour = () => {
    setTourActive(false);
  };

  const restartTour = () => {
    setCurrentStep(0);
    setTourActive(true);
  };

  // Scroll active target elements into center of viewport on tour steps change
  useEffect(() => {
    if (tourActive) {
      const step = tourSteps[currentStep];
      if (step && step.targetId) {
        const el = document.getElementById(step.targetId);
        if (el) {
          const timer = setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 120);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [currentStep, tourActive]);

  // Handler for adding dynamic user invoices
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceDesc || !newInvoiceAmount) return;

    const parsedAmount = Number(newInvoiceAmount.replace(/[^0-9]/g, ''));
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTx: Transaction = {
      id: `TX-${Math.floor(10513 + Math.random() * 999)}`,
      date: new Date().toISOString().split('T')[0],
      type: newInvoiceType,
      description: newInvoiceDesc,
      amount: parsedAmount,
      status: 'Completed'
    };

    setTransactions([newTx, ...transactions]);
    setNewInvoiceDesc('');
    setNewInvoiceAmount('');
    setActiveActionModal(null);
    triggerNotification(`Successfully registered: ${newTx.description} for ₦${newTx.amount.toLocaleString()}`);
  };

  // Helper inside interaction handlers
  const triggerNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4500);
  };

  // Dynamic calculations based on mock databases & formula choices
  const totalYtdRevenue = transactions
    .filter(t => t.type === 'Sale' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Remaining VAT pending computation (Nigerian standard 7.5%)
  const calculatedVatCollected = totalYtdRevenue * (formData.vatRegistered ? 0.075 : 0);
  const whtDueAmount = totalYtdRevenue * 0.05; // Standard 5% WHT
  const outstandingTaxObligations = calculatedVatCollected + whtDueAmount;

  // Real-time stocks at cost
  const totalStockAtCost = inventoryItems.reduce((sum, i) => sum + (i.qty * i.cost), 0);
  const lowStockAlertsCount = inventoryItems.filter(i => i.qty <= i.threshold).length;

  // Estimated Profit Before Tax YTD (assuming 65% profit margin ratio as system default)
  const estProfitBeforeTax = totalYtdRevenue * 0.65;

  // Professional services tax relief exclusion rule
  const isEligibleForTaxRelief = formData.businessType === 'corporate' && formData.industry !== 'Professional Services';

  // Format Nigerian Naira currency
  const formatNaira = (value: number) => {
    return '₦' + value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  };

  // Filtered transactions for center search bar
  const filteredTransactions = transactions.filter(t => {
    const query = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query) ||
      t.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="h-screen bg-[#F8FAFC] flex font-sans text-slate-800 antialiased overflow-hidden" id="dashboard-root">
      
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION: Slim percentage with light gray background, matching screenshot */}
      <aside
        id="navigation-sidebar"
        className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-[260px] md:w-[240px] xl:w-[220px] bg-slate-50 text-slate-700 flex flex-col justify-between shrink-0 border-r border-slate-200/70 select-none transition-transform duration-300 ${
          tourActive && currentStep === 4 ? 'ring-4 ring-[#7C3AED] ring-offset-2 scale-[1.01] bg-slate-50 shadow-2xl relative z-50' : ''
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Logo Header element - Exactly h-18 (72px) to match Top Nav */}
          <div className="h-[73px] flex items-center px-6 border-b border-slate-200/60 cursor-pointer shrink-0" onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
            <Logo size={24} showText={true} textColor="dark" />
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2">Main Menu</span>

            {/* Primary Modules Links */}
            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home size={15} className={activeTab === 'dashboard' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Dashboard</span>
                </div>
                <span className="w-1.5 h-1.5 bg-brand-purple rounded-full shrink-0" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('pos');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'pos'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart size={15} className={activeTab === 'pos' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Point of Sale</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('inventory');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package size={15} className={activeTab === 'inventory' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Inventory</span>
                </div>
                {lowStockAlertsCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-rose-50 text-rose-600 border border-rose-100 rounded-full font-bold">
                    {lowStockAlertsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('vat');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'vat'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Percent size={15} className={activeTab === 'vat' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>VAT Management</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('wht');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'wht'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LinkIcon size={15} className={activeTab === 'wht' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Withholding Tax</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('vendors');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'vendors'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 size={15} className={activeTab === 'vendors' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Vendor Management</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('financials');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'financials'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={15} className={activeTab === 'financials' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Financial Statements</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('cit');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'cit'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase size={15} className={activeTab === 'cit' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Companies Income Tax</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('advisory');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'advisory'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={15} className={activeTab === 'advisory' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Tax Advisory</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('reports');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'reports'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 size={15} className={activeTab === 'reports' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Reports</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-purple-50 text-brand-purple font-bold'
                    : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings size={15} className={activeTab === 'settings' ? 'text-brand-purple' : 'text-slate-400'} />
                  <span>Settings</span>
                </div>
              </button>
            </nav>
          </div>

          {/* User profile bottom item styled cleanly to match design aesthetics */}
          <div className="p-4 border-t border-slate-200/70 bg-slate-100/30 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-bold text-xs flex items-center justify-center">
              {formData.fullName ? formData.fullName.split(' ').map(n=>n[0]).join('') : 'JD'}
            </div>
            <div className="truncate flex-1">
              <span className="block text-slate-950 text-xs font-bold leading-none truncate">
                {formData.fullName || 'Operator Profile'}
              </span>
              <span className="block text-slate-400 text-[10px] font-sans truncate">
                {formData.email || 'operator@tributa.ng'}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-1.5 flex items-center justify-center gap-2 rounded-lg text-xs font-semibold bg-slate-200/50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-700 border border-slate-300/40 cursor-pointer transition-all"
          >
            <LogOut size={13} />
            <span>Sign Out Workspace</span>
          </button>
          
          <span className="block text-[8px] text-center text-slate-400 mt-3 font-mono font-normal">
            © 2026 Tributa. FIRS-compliant.
          </span>
        </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT: Occupies the larger rest of the screen width */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC] min-w-0">
        
        {/* TOP NAVIGATION: Clean and premium navigation header with transparent aesthetic */}
        <header 
          id="top-search-header"
          className={`h-[73px] px-4 sm:px-6 bg-transparent border-b border-slate-200/60 flex justify-between items-center gap-4 shrink-0 transition-all ${
            tourActive && currentStep === 5 ? 'ring-4 ring-[#7C3AED] ring-offset-2 z-50 relative bg-slate-50 shadow-2xl' : ''
          }`}
        >
          {/* Left part: Title "Overview" & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-brand-purple hover:bg-slate-100 transition-colors"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight hidden sm:block capitalize">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
            </h1>
          </div>

          {/* Center part: Interactive global search bar */}
          <div className="flex-1 max-w-sm w-full mx-auto relative hidden md:block">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search size={14} />
            </div>
            <input
              id="search-input"
              type="text"
              placeholder="Search invoices, products, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple pl-9 pr-4 py-1.5 rounded-lg text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 font-sans font-medium hover:bg-slate-100"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
          
          {/* Mobile search fallback icon */}
          <button className="md:hidden p-1.5 rounded-lg text-slate-500 ml-auto mr-1 hover:bg-slate-100 shrink-0">
            <Search size={16} />
          </button>

          {/* Right part: Notification alert bell, user dropdown option list, and settings quick link */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 relative">
            
            {/* Dynamic Status Notification banner */}
            <div className="text-right hidden xl:block font-mono text-[10px] text-slate-400 bg-slate-100 border border-slate-200 py-0.5 px-2 rounded-full">
              UT TIME: <strong>2026-05-29</strong> • <strong>FIRS ACTIVE</strong>
            </div>

            {/* Quick Tour play button */}
            <button
              onClick={restartTour}
              className="hidden sm:flex text-xs font-semibold px-2.5 py-1.5 rounded-lg text-brand-purple border border-purple-200/50 hover:bg-purple-50 transition-colors items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Tour</span>
            </button>

            {/* Custom Settings Gear Icon */}
            <button
              onClick={() => {
                setActiveTab('settings');
              }}
              title="System Admin Configuration"
              className="hidden sm:block p-1.5 rounded-lg text-slate-500 hover:text-brand-purple hover:bg-slate-100 transition-colors shrink-0"
            >
              <Settings size={18} />
            </button>

            {/* Notification trigger with count badge in top navigation */}
            <div className="relative shrink-0">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-brand-purple hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white font-bold text-[8px] flex items-center justify-center rounded-full scale-90">
                  3
                </span>
              </button>

              {/* Notifications Dropdown Panel */}
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 font-sans text-xs divide-y divide-slate-100"
                    >
                      <div className="pb-2 flex justify-between items-center">
                        <span className="font-bold text-slate-900">Notifications &amp; Alerts</span>
                        <span className="text-[10px] text-brand-purple font-semibold hover:underline cursor-pointer" onClick={() => triggerNotification("Cleared all workspace notifications.")}>Mark all read</span>
                      </div>
                      <div className="py-2.5 space-y-2">
                        <div className="p-1.5 hover:bg-slate-50 rounded transition-colors cursor-pointer">
                          <p className="font-bold text-slate-800">VAT return submission due</p>
                          <p className="text-[10px] text-slate-500">Nigeria statutory monthly VAT file is due in 4 days.</p>
                        </div>
                        <div className="p-1.5 hover:bg-slate-50 rounded transition-colors cursor-pointer">
                          <p className="font-bold text-slate-800">4 low-stock alarms active</p>
                          <p className="text-[10px] text-slate-500">Inventory levels have dropped below mandatory margins.</p>
                        </div>
                        <div className="p-1.5 hover:bg-slate-50 rounded transition-colors cursor-pointer">
                          <p className="font-bold text-[#7C3AED]">Small Business CIT relief active</p>
                          <p className="text-[10px] text-slate-500">You qualify for a dynamic 15% rate tier under your entities registry.</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Clickable User Avatar + Dropdown Menu */}
            <div className="relative shrink-0">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-purple text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {formData.fullName ? formData.fullName.split(' ').map(n=>n[0]).join('') : 'JD'}
                </div>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 font-sans text-xs overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                        <span className="block font-bold text-slate-900 truncate">{formData.fullName || 'Operator Account'}</span>
                        <span className="block text-[10px] text-slate-500 truncate">{formData.email}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setActiveActionModal('profile');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2"
                      >
                        <User size={13} className="text-slate-400" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setActiveTab('settings');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2"
                      >
                        <Settings size={13} className="text-slate-400" />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2"
                      >
                        <Sliders size={13} className="text-slate-400" />
                        <span>Change Password</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          restartTour();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2"
                      >
                        <HelpCircle size={13} className="text-slate-400" />
                        <span>Help</span>
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <LogOut size={13} className="text-red-400" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Global Feedback and Success Toasts */}
        <AnimatePresence>
          {actionSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-6 mt-4 p-3 bg-emerald-55 bg-white border-l-4 border-emerald-500 rounded-r-lg shadow-sm text-xs font-semibold text-emerald-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Check size={16} className="text-emerald-500" />
                <span>{actionSuccessMessage}</span>
              </div>
              <button onClick={() => setActionSuccessMessage(null)}>
                <X size={14} className="text-slate-400 hover:text-slate-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Scroll Container for main dashboard views */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' ? (
            <div className="p-6 space-y-6">
              
              {/* Dynamic welcome and onboarding parameter information summary */}
              <div className="p-4 bg-white border-0 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-purple-50 text-brand-purple text-[10px] font-bold tracking-wider rounded-md uppercase">
                    Active FIRS Portal Sync
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Welcome back, {formData.fullName || 'Tributa Partner'}!
                  </h2>
                  <p className="text-xs text-slate-500">
                    Registered entity is classified as a <strong>{formData.businessType === 'corporate' ? 'corporate tax unit' : 'sole proprietor'}</strong> tied to <strong>{formData.industry || 'General Commerce'}</strong>. Stock evaluation model: <strong>{formData.inventoryMethod || 'FIFO'}</strong>.
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1 font-mono text-slate-600 min-w-[210px]">
                  <div className="flex justify-between">
                    <span>ENTITY TYPE:</span>
                    <span className="font-bold text-slate-800 capitalize">{formData.businessType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT REGISTRY:</span>
                    <span className={`font-bold ${formData.vatRegistered ? 'text-red-500' : 'text-slate-500'}`}>
                      {formData.vatRegistered ? 'Registered' : 'Exempt'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>TAX ID (TIN):</span>
                    <span className="font-bold text-slate-800">{formData.vatNumber || 'Not Configured'}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: QUICK STATS */}
              <div
                id="quick-stats-section"
                className={`transition-all duration-300 ${
                  tourActive && currentStep === 0 ? 'ring-4 ring-[#7C3AED] rounded-xl z-50 bg-slate-50 border border-slate-200/60 scale-[1.01] relative p-3 shadow-2xl' : 'p-0'
                }`}
              >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Monthly Revenue (YTD) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Monthly Revenue (YTD)</span>
                  <Sliders size={13} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold font-mono text-slate-900 tracking-tight mt-1.5">
                  {formatNaira(totalYtdRevenue)}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Total revenue (excluding VAT)</p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 text-[10px] text-emerald-600 font-bold">
                  <span className="bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-700 font-extrabold">+15%</span>
                  <span>vs last month</span>
                </div>
              </div>

              {/* Card 2: Outstanding Tax Obligations */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Outstanding Tax Obligations</span>
                  <span className="px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold rounded-lg uppercase tracking-wider">
                    {outstandingTaxObligations > 0 ? 'Due' : 'On Track'}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-mono text-slate-900 tracking-tight mt-1.5">
                  {formatNaira(outstandingTaxObligations)}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Total VAT + WHT due</p>
                <div className="flex items-center gap-1 pb-1 mt-2.5 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500">
                  <Info size={11} className="text-slate-400 font-bold" />
                  <span>Calculated at standard monthly rate tracker</span>
                </div>
              </div>

              {/* Card 3: Inventory Value */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Inventory Value</span>
                  {lowStockAlertsCount > 0 ? (
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold rounded-lg leading-none shrink-0 font-sans">
                      {lowStockAlertsCount} Alert{lowStockAlertsCount > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-lg leading-none shrink-0">
                      Standard
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-mono text-slate-900 tracking-tight mt-1.5">
                  {formatNaira(totalStockAtCost)}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Current stock at cost ({formData.inventoryMethod || 'FIFO'})</p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700 underline cursor-pointer" onClick={() => {
                    setActiveTab('inventory');
                  }}>
                    Manage catalog
                  </span>
                </div>
              </div>

              {/* Card 4: Profit Before Tax (YTD) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Profit Before Tax (YTD)</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-lg uppercase tracking-wider">
                    On Track
                  </span>
                </div>
                <h3 className="text-lg font-bold font-mono text-slate-900 tracking-tight mt-1.5">
                  {formatNaira(estProfitBeforeTax)}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Management estimate</p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 text-[10px] text-slate-550">
                  {isEligibleForTaxRelief ? (
                    <span className="text-brand-purple font-semibold">✓ Custom Small Biz Allowance Active</span>
                  ) : (
                    <span className="text-slate-400 italic">Excluded from small business relief tier</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: TAX COMPLIANCE STATUS (RAG) */}
          <div
            id="compliance-rag-section"
            className={`transition-all duration-300 ${
              tourActive && currentStep === 1 ? 'ring-4 ring-[#7C3AED] rounded-xl z-50 bg-slate-50 border border-slate-200/60 scale-[1.01] relative p-3 shadow-2xl' : 'p-0'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                TAX COMPLIANCE STATUS INDICATORS (FIRS RAG)
              </h3>
              <span className="text-[10px] text-slate-400 italic font-medium">Real-time parameters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Box 1: VAT */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900">VAT</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-semibold rounded-full uppercase">
                      Return Due
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600 font-medium">Deadline: <strong className="text-slate-800">Due: 21st of month</strong></p>
                    <p className="text-slate-500">Progress: <strong className="text-slate-800">4 of 12 months filed</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveActionModal('vat');
                  }}
                  className="w-full text-center py-2 bg-slate-100 hover:bg-brand-purple hover:text-white transition-all text-xs font-bold text-brand-purple rounded-lg cursor-pointer"
                >
                  View VAT Dashboard
                </button>
              </div>

              {/* Box 2: WHT */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900">Withholding Tax</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-semibold rounded-full uppercase">
                      Overdue
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600 font-medium">Deadline: <strong className="text-slate-800">Due: 21st monthly</strong></p>
                    <p className="text-slate-500">Amount: <strong className="text-slate-800">₦220k remitted, ₦85k pending</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveActionModal('wht');
                  }}
                  className="w-full text-center py-2 bg-slate-100 hover:bg-brand-purple hover:text-white transition-all text-xs font-bold text-brand-purple rounded-lg cursor-pointer"
                >
                  View WHT Schedule
                </button>
              </div>

              {/* Box 3: CIT */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900">Companies Income Tax</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-semibold rounded-full uppercase">
                      Estimated Liability
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600 font-medium">Tier: <strong className="text-brand-purple font-semibold">{formData.businessType === 'corporate' ? 'Small Company' : 'Exempt Individual'}</strong></p>
                    <p className="text-slate-500">Deadline: <strong className="text-slate-800">Due: 6 mo post year-end</strong></p>
                    <p className="text-slate-550 font-mono">Estimated: {formatNaira(totalYtdRevenue * 0.15)}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveActionModal('cit');
                  }}
                  className="w-full text-center py-2 bg-slate-100 hover:bg-brand-purple hover:text-white transition-all text-xs font-bold text-brand-purple rounded-lg cursor-pointer"
                >
                  Run CIT Computation
                </button>
              </div>

              {/* Box 4: Financial Statements */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900">Financial Statements</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-semibold rounded-full uppercase">
                      In Progress
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600 font-medium">Last Generated: <strong className="text-slate-800">May 28, 2026</strong></p>
                    <p className="text-slate-500">Includes: <strong className="text-slate-800">P&amp;L, Balance Sheet, Cash Flow</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveActionModal('statements');
                  }}
                  className="w-full text-center py-2 bg-slate-100 hover:bg-brand-purple hover:text-white transition-all text-xs font-bold text-brand-purple rounded-lg cursor-pointer"
                >
                  Generate Statements
                </button>
              </div>

            </div>
          </div>

          {/* TWO PANEL SECTION: LEFT IS RECENT TRANSACTIONS TABLE, RIGHT IS UPCOMING ACTIONS & REMINDERS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SECTION 3: RECENT TRANSACTIONS TABLE (LOVED REFACTOR) */}
            <div
              id="recent-transactions-section"
              className={`lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-4 transition-all duration-300 ${
                tourActive && currentStep === 2 ? 'ring-4 ring-[#7C3AED] z-50 scale-[1.01] relative shadow-2xl bg-white' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-sans flex items-center gap-2">
                    Recent Transactions
                    <span className="text-xs font-normal text-slate-400 font-mono">({filteredTransactions.length} entries)</span>
                  </h3>
                  <p className="text-xs text-slate-500">Real-time ledger audit trail indexed for tax calculation</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActiveActionModal('new_invoice');
                      triggerNotification("Opened quick ledger registration form.");
                    }}
                    className="px-3.5 py-1.5 bg-brand-purple hover:bg-opacity-90 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Register Invoice</span>
                  </button>
                </div>
              </div>

              {/* Table rendering of last 10 transactions */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                    {filteredTransactions.slice(0, 10).map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-mono font-medium">{t.date}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.type === 'Sale'
                              ? 'bg-purple-50 text-brand-purple border border-purple-150'
                              : t.type === 'Receipt'
                              ? 'bg-blue-50 text-blue-600 border border-blue-150'
                              : 'bg-amber-50 text-amber-700 border border-amber-150'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800">{t.description}</div>
                          <div className="text-[9px] text-slate-400 font-mono">{t.id}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatNaira(t.amount)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            t.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : t.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                          No transactions matching "{searchQuery}" found in active ledgers.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Expander list trigger */}
              <div className="pt-2 border-t border-slate-100 flex justify-center">
                <button
                  onClick={() => {
                    setActiveActionModal('audit_trail');
                  }}
                  className="text-xs text-brand-purple hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  View Full Transaction History
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* SECTION 4: UPCOMING ACTIONS & REMINDERS PANEL */}
            <div
              id="upcoming-actions-section"
              className={`lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-4 transition-all duration-300 ${
                tourActive && currentStep === 3 ? 'ring-4 ring-[#7C3AED] z-50 scale-[1.01] relative shadow-2xl bg-white' : ''
              }`}
            >
              <div className="border-b border-slate-200/50 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Calendar size={15} className="text-brand-purple" />
                  Upcoming Actions &amp; Reminders
                </h3>
                <p className="text-xs text-slate-400">Statutory countdown alarms &amp; tasks</p>
              </div>

              <div className="space-y-4">
                
                {/* Item 1: VAT Return Due */}
                <div className="p-3 bg-[#FFF3CD]/20 border border-[#FFEBAA]/60 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#856404] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                      VAT Return Due
                    </span>
                    <span className="text-[10px] bg-[#FFF3CD] text-[#856404] px-1.5 py-0.5 rounded font-mono font-bold">
                      In 4 days
                    </span>
                  </div>
                  <p className="text-[11px] text-[#856404]/90 font-sans leading-normal">
                    FIRS Nigeria VAT monthly cycle return filing due-date approaches on 21st.
                  </p>
                  <button
                    onClick={() => {
                      setActiveActionModal('vat');
                    }}
                    className="w-full text-center py-1.5 bg-white hover:bg-yellow-50 text-[#856404] border border-[#FFEBAA]/70 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Prepare Return
                  </button>
                </div>

                {/* Item 2: Vendors Requiring KYC */}
                <div className="p-3 bg-red-50/20 border border-red-150/40 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-red-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                      Vendors Requiring KYC
                    </span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono font-bold">
                      4 Pending
                    </span>
                  </div>
                  <p className="text-[11px] text-red-800/90 font-sans leading-normal">
                    4 active vendors require statutory TIN registration updates before next payment batch.
                  </p>
                  <button
                    onClick={() => {
                      setActiveActionModal('kyc');
                    }}
                    className="w-full text-center py-1.5 bg-white hover:bg-red-50 text-red-800 border border-red-200/50 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Review Vendors
                  </button>
                </div>

                {/* Item 3: Run CIT Computation */}
                <div className="p-3 bg-blue-50/30 border border-blue-150/40 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-800 flex items-center gap-1">
                      CIT Computation
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800/90 font-sans leading-normal">
                    Q2 is ending in June. Compute estimated corporate liability to claim active reliefs.
                  </p>
                  <button
                    onClick={() => {
                      setActiveActionModal('cit');
                    }}
                    className="w-full text-center py-1.5 bg-white hover:bg-blue-50 text-blue-800 border border-blue-200/55 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Run Now
                  </button>
                </div>

                {/* Item 4: Low Stock Alert */}
                <div className="p-3 bg-purple-50/20 border border-purple-150/40 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-brand-purple flex items-center gap-1">
                      Low Stock Alerts
                    </span>
                    <span className="text-[10px] bg-purple-100 text-brand-purple px-1.5 py-0.5 rounded font-mono font-bold">
                      {lowStockAlertsCount} Materials Low
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-purple/90 font-sans leading-normal">
                    Stock count has fallen below thresholds for items tracked with {formData.inventoryMethod || 'FIFO'} model.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('inventory');
                    }}
                    className="w-full text-center py-1.5 bg-white hover:bg-purple-100/40 text-brand-purple border border-purple-200/40 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    View Inventory
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      ) : activeTab === 'pos' ? (
        <POSTerminal 
          inventoryItems={inventoryItems}
          setInventoryItems={setInventoryItems}
          transactions={transactions}
          setTransactions={setTransactions}
          formData={formData}
          onAction={triggerNotification}
        />
      ) : activeTab === 'inventory' ? (
        <InventoryModule
          inventoryItems={inventoryItems}
          setInventoryItems={setInventoryItems}
          onAction={triggerNotification}
          formData={formData}
        />
      ) : activeTab === 'vat' ? (
        <VATModule
          formData={formData}
          onAction={triggerNotification}
        />
      ) : (
        <EmptyState tab={activeTab} formData={formData} onAction={triggerNotification} />
      )}
    </div>
  </main>

      {/* PORT PRESERVED: DYNAMIC INTERACTIVE FLUID MODALS */}
      <AnimatePresence>
        {activeActionModal && (
          <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-[1.5px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl font-sans"
            >
              
              {/* Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-brand-purple rounded-md flex items-center justify-center text-white">
                    T
                  </div>
                  <span className="font-bold text-slate-950 text-sm capitalize">
                    {activeActionModal === 'vat' && 'VAT Return Preparation Wizard'}
                    {activeActionModal === 'wht' && 'Withholding Tax Schedule & Claims'}
                    {activeActionModal === 'cit' && 'Companies Income Tax Estimator'}
                    {activeActionModal === 'statements' && 'Financial IAS-8 Compliant Compiler'}
                    {activeActionModal === 'kyc' && 'Vendor KYC Credentials Portal'}
                    {activeActionModal === 'new_invoice' && 'Register Instant Revenue Invoice'}
                    {activeActionModal === 'profile' && 'Corporate Configuration Detail'}
                    {activeActionModal === 'audit_trail' && 'Complete System Audit Ledger Log'}
                  </span>
                </div>
                
                <button
                  onClick={() => setActiveActionModal(null)}
                  className="p-1 text-slate-450 hover:text-slate-700 bg-slate-250/20 hover:bg-slate-200 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[460px] text-xs leading-relaxed space-y-4 text-slate-700">
                
                {/* VAT Modal Content */}
                {activeActionModal === 'vat' && (
                  <div className="space-y-4">
                    <span className="block text-[10px] bg-purple-50 text-brand-purple border border-purple-200 py-1 px-2.5 rounded font-bold font-mono">
                      NTA 2025 COMPLIANT EXEMPTION / REGISTER CHEK
                    </span>
                    <p>
                      Your active VAT registry status is set to: <strong>{formData.vatRegistered ? `Registered under Number: ${formData.vatNumber || 'Manual'}` : 'Exempt / voluntary registration not done.'}</strong>. 
                    </p>
                    <p>
                      FIRS specifies a standard rate of <strong>7.5%</strong>. Below is the compiled VAT return statement estimate for the current billing window:
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono space-y-2">
                      <div className="flex justify-between">
                        <span>Compiled Taxable Turnover:</span>
                        <span className="font-bold text-slate-900">{formatNaira(totalYtdRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT Rate Applied:</span>
                        <span className="font-bold text-brand-purple">{formData.vatRegistered ? "7.5%" : "0.0% (Exempt)"}</span>
                      </div>
                      <div className="border-t border-slate-200 my-2 pt-2 flex justify-between text-sm">
                        <span>Total VAT Due:</span>
                        <span className="font-extrabold text-[#7C3AED]">{formatNaira(calculatedVatCollected)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 bg-yellow-50 border border-yellow-200 text-yellow-800 text-[11px] rounded-lg">
                      <Info size={14} className="shrink-0" />
                      <span>Failing to file VAT returns before the 21st day post-month results in immediate FIRS administrative penalties.</span>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button 
                        onClick={() => setActiveActionModal(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          setActiveActionModal(null);
                          triggerNotification("Successfully compiled and filed the FIRS VAT Return document!");
                        }}
                        className="px-4 py-2 bg-brand-purple hover:bg-opacity-90 text-white rounded-lg font-bold"
                      >
                        File Return (₦{calculatedVatCollected.toLocaleString()})
                      </button>
                    </div>
                  </div>
                )}

                {/* WHT Modal Content */}
                {activeActionModal === 'wht' && (
                  <div className="space-y-4">
                    <p>
                      Withholding Tax is applied as an advanced tax payment. Your business is registered in the <strong>{formData.industry}</strong> industry.
                    </p>
                    <p>
                      The standard withholding tax holds a rate of 5% on advisory services.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Accrued turnover:</span>
                        <span className="font-semibold text-slate-900">{formatNaira(totalYtdRevenue)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>WHT Standard Rate:</span>
                        <span className="font-semibold text-slate-900">5%</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>FIRS Credit Note Assets:</span>
                        <span className="font-semibold text-emerald-600">{formatNaira(whtDueAmount)}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-150 text-blue-800 text-[11px] rounded-lg">
                      These credit notes can be fully offset against your annual Companies Income Tax (CIT) liability computation.
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button 
                        onClick={() => {
                          setActiveActionModal(null);
                          triggerNotification("Withholding Tax credit note ledger exported.");
                        }}
                        className="px-4 py-2 bg-brand-purple text-white rounded-lg font-bold"
                      >
                        Export WHT Claims Note
                      </button>
                    </div>
                  </div>
                )}

                {/* CIT Modal Content */}
                {activeActionModal === 'cit' && (
                  <div className="space-y-4">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#7C3AED] bg-purple-50 p-1.5 rounded">
                      NIGERIAN FINANCE ACT CIT TIER CODENAME
                    </span>
                    <p>
                      Your registered entity parameters:
                    </p>
                    <ul className="list-disc list-inside space-y-1 bg-slate-50 p-3 rounded-lg">
                      <li>Business Type Designation: <strong className="text-slate-950 font-sans capitalize">{formData.businessType}</strong></li>
                      <li>Selected Industry Sectors: <strong>{formData.industry}</strong></li>
                      <li>Tax Relief Qualifications: <strong className={isEligibleForTaxRelief ? 'text-emerald-700' : 'text-amber-800'}>
                        {isEligibleForTaxRelief ? 'Active Small Corporate Exemption (15% rate)' : 'Ineligible (Professional Services / Sole trader exempt)'}
                      </strong></li>
                    </ul>

                    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono space-y-2">
                      <p className="text-[10px] text-slate-400 font-sans">ESTIMATED CIT LIABILITY CALCULATION</p>
                      <div className="flex justify-between">
                        <span>Estimated Profit (PBT):</span>
                        <span>{formatNaira(estProfitBeforeTax)}</span>
                      </div>
                      <div className="flex justify-between text-amber-400">
                        <span>Relief Discount applied:</span>
                        <span>{isEligibleForTaxRelief ? "-₦3,500,000.00" : "-₦0.00"}</span>
                      </div>
                      <div className="border-t border-slate-700 my-2 pt-2 flex justify-between text-sm">
                        <span>Tax Obligation Estimate:</span>
                        <span className="text-brand-purple">{formatNaira(formData.businessType === 'corporate' ? Math.max(0, (estProfitBeforeTax * 0.15)) : 0)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button 
                        onClick={() => {
                          setActiveActionModal(null);
                          triggerNotification("Corporate CIT liability ledger dispatched to your email address.");
                        }}
                        className="px-4 py-2 bg-brand-purple text-white rounded-lg font-bold"
                      >
                        File Estimate with FIRS
                      </button>
                    </div>
                  </div>
                )}

                {/* Financial Statements Content */}
                {activeActionModal === 'statements' && (
                  <div className="space-y-4">
                    <p>
                      Compiles complete <strong>IAS-8 compliant general ledger states</strong>, accounting for inventory methods (Current model: <strong>{formData.inventoryMethod || 'FIFO'}</strong>) and tax relief filters.
                    </p>

                    <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                        <span className="block text-[#7C3AED] font-extrabold text-sm font-sans">P &amp; L</span>
                        <span className="text-[10px] text-zinc-500 block mt-1">Generated</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                        <span className="block text-[#7C3AED] font-extrabold text-sm font-sans">Revenue Sheets</span>
                        <span className="text-[10px] text-zinc-500 block mt-1">FIRS Standard</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                        <span className="block text-[#7C3AED] font-extrabold text-sm font-sans">Audits Log</span>
                        <span className="text-[10px] text-zinc-500 block mt-1">IAS-8 compliant</span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                      <button 
                        onClick={() => {
                          setActiveActionModal(null);
                          triggerNotification("Full Financial Statements exported safely.");
                        }}
                        className="px-4 py-2 bg-brand-purple hover:bg-opacity-95 text-white rounded-lg font-bold"
                      >
                        Download Statements (PDF/Excel)
                      </button>
                    </div>
                  </div>
                )}

                {/* KYC Registration */}
                {activeActionModal === 'kyc' && (
                  <div className="space-y-4">
                    <p>
                      Nigerian statutory parameters require auditing supplier and vendor Tax Identification Numbers (TIN) before initiating payouts.
                    </p>

                    <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200">
                      {kycVendors.map((v) => (
                        <div key={v.id} className="p-3 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-900 block">{v.name}</span>
                            <span className="text-[10px] text-slate-500 block font-mono">{v.taxID === 'Pending' ? 'TIN Pending' : `TIN: ${v.taxID}`}</span>
                          </div>
                          
                          {v.taxID === 'Pending' ? (
                            <button
                              onClick={() => {
                                const updated = kycVendors.map(vendor => {
                                  if (vendor.id === v.id) {
                                    return { ...vendor, taxID: `TIN-${Math.floor(100000 + Math.random() * 900000)}-Z`, status: 'Completed' };
                                  }
                                  return vendor;
                                });
                                setKycVendors(updated);
                                triggerNotification(`Verified KYC for vendor ${v.name}`);
                              }}
                              className="px-2 py-1 bg-brand-purple hover:bg-purple-100/30 text-[10px] text-[#7C3AED] font-bold rounded border border-purple-200 cursor-pointer"
                            >
                              Resolve KYC
                            </button>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                              <Check size={11} /> Verified
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instant Invoice Registration */}
                {activeActionModal === 'new_invoice' && (
                  <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-900">Transaction Type</label>
                      <select 
                        required
                        value={newInvoiceType}
                        onChange={(e) => setNewInvoiceType(e.target.value as any)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-800"
                      >
                        <option value="Sale">Sale (Compiles dynamic 7.5% VAT)</option>
                        <option value="Payment">Payment (Remittance Outflow)</option>
                        <option value="Receipt">Receipt (FIRS Direct Ack)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-900">Description / Customer Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Acme Corporation Advisory Invoice"
                        value={newInvoiceDesc}
                        onChange={(e) => setNewInvoiceDesc(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-900">Amount (₦)</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. 1,500,000"
                        value={newInvoiceAmount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setNewInvoiceAmount(val ? Number(val).toLocaleString() : '');
                        }}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-800 text-right font-mono font-bold"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button 
                        type="button"
                        onClick={() => setActiveActionModal(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-brand-purple hover:bg-opacity-95 text-white rounded-lg font-bold"
                      >
                        Add Transaction &amp; Compute Tax
                      </button>
                    </div>
                  </form>
                )}

                {/* Profile detail */}
                {activeActionModal === 'profile' && (
                  <div className="space-y-4">
                    <p className="font-bold text-slate-900">Company Information Credentials</p>
                    <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] p-3 text-slate-600 space-y-1.5">
                      <div className="flex justify-between">
                        <span>Full Registered Name:</span>
                        <span className="font-bold text-slate-900">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email Contact:</span>
                        <span className="font-bold text-slate-900">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sovereign Registry Sector:</span>
                        <span className="font-bold text-slate-900">{formData.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Corporate Valuation Scheme:</span>
                        <span className="font-bold text-slate-900">{formData.inventoryMethod} Method</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/50 pt-2 text-xs">
                        <span>FIRS Filing TIN:</span>
                        <span className="font-bold text-brand-purple">{formData.vatNumber || 'Manual'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Audit Trail list */}
                {activeActionModal === 'audit_trail' && (
                  <div className="space-y-4">
                    <p>
                      Each action inside this Tributa workspace generates a unique cryptographic hash index adhering to IAS-8 guidelines.
                    </p>

                    <div className="bg-slate-950 text-slate-100 font-mono p-4 rounded-xl text-[10px] space-y-1.5 leading-normal max-h-60 overflow-y-auto">
                      <p className="text-emerald-400">// INTEGRATED SECURE LEDGER ENVELOPE</p>
                      <p className="text-slate-400">[2026-05-29 04:48:01] INFO  INIT - Loaded corporate parameter workspace with FIFO inventory valuation model.</p>
                      <p className="text-slate-400">[2026-05-29 04:48:04] ALERT COMP - Computed corporate tax liability discount threshold at 15% rate assigned.</p>
                      <p className="text-slate-400">[2026-05-29 04:48:11] REGISTER - Registered transaction TX-10512 for amount ₦3,100,000.00</p>
                      <p className="text-slate-400">[2026-05-29 04:48:15] AUDIT  - Compiled compliance indicators status RAG: Outward VAT filed.</p>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button 
                        onClick={() => {
                          setActiveActionModal(null);
                          triggerNotification("Full auditor-level compliance spreadsheet exported.");
                        }}
                        className="px-4 py-2 bg-brand-purple text-white rounded-lg font-bold"
                      >
                        Download Cryptographic Audit Trail
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dimmed Tour Overlay Backdrop covering the rest of the application */}
      <AnimatePresence>
        {tourActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1.5px] z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* FLOATING TOUR POP-UP IN THE CORNER: Stays persistent, doesn't block viewport */}
      <AnimatePresence>
        {tourActive && (
          <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 z-50 p-4 md:p-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-xl shadow-[0_10px_45px_rgba(0,0,0,0.18)] border border-slate-200/95 overflow-hidden font-sans pointer-events-auto w-full md:w-[380px]"
            >
              
              <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
                <button
                  onClick={handleSkipTour}
                  className="text-xs text-slate-400 hover:text-brand-purple font-semibold hover:underline cursor-pointer"
                >
                  Skip Tour
                </button>
              </div>

              {/* Progress Bar indicator */}
              <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                <div
                  className="bg-brand-purple h-full transition-all duration-350"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>

              {/* Core Body */}
              <div className="p-5 pt-7 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#7C3AED]/15 text-brand-purple rounded-full font-bold text-[10px] tracking-wider uppercase">
                    Tributa Tour: {currentStep + 1} of {tourSteps.length}
                  </span>
                  <span className="text-[11px] text-slate-400">• Dynamic Highlight</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple text-white text-[10px] font-bold">
                      {currentStep + 1}
                    </span>
                    {tourSteps[currentStep].title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {tourSteps[currentStep].description}
                  </p>
                </div>

                {/* Highlight helper notification */}
                <div className="bg-purple-50/70 border border-purple-100/50 p-2 text-xs text-brand-purple flex items-center gap-2">
                  <Info size={13} className="shrink-0 text-brand-purple" />
                  <span className="font-semibold font-sans text-[11px]">
                    See highlighted section on the screen.
                  </span>
                </div>
              </div>

              {/* Step dots and navigation triggers */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/50 flex items-center justify-between">
                
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {tourSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`h-1.5 rounded-full transition-all duration-350 ${
                        idx === currentStep ? 'w-4 bg-brand-purple' : 'w-1.5 bg-slate-200 hover:bg-slate-350'
                      }`}
                    />
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevTour}
                    disabled={currentStep === 0}
                    className={`p-1.5 rounded-md border border-slate-200 shrink-0 transition-colors ${
                      currentStep === 0
                        ? 'text-slate-300 cursor-not-allowed bg-transparent'
                        : 'text-slate-700 hover:bg-slate-200 cursor-pointer'
                    }`}
                  >
                    <ArrowLeft size={13} />
                  </button>

                  <button
                    onClick={handleNextTour}
                    className="px-3.5 py-1.5 bg-brand-purple hover:bg-opacity-95 text-white font-sans font-semibold text-xs rounded-md transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <span>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span>
                    <ArrowRight size={11} />
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
