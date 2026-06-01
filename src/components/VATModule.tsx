import React, { useState, useMemo } from 'react';
import { SignupState } from '../types';
import Logo from './Logo';
import {
  TrendingUp,
  Percent,
  Search,
  Plus,
  Download,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
  Filter,
  Check,
  FileSpreadsheet,
  Building2,
  CheckCircle,
  QrCode,
  Receipt,
  FileText,
  AlertCircle,
  Info,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';

interface VATModuleProps {
  formData: SignupState;
  onAction: (msg: string) => void;
}

interface PurchaseVATItem {
  id: string; // Document Number
  date: string;
  supplier: string;
  grossAmount: number;
  vatAmount: number;
  classification: 'Standard' | 'Zero-Rated' | 'Exempt';
  docType: 'Invoice' | 'GRN' | 'Expense Receipt';
  status: 'Claimed' | 'Not Claimable (Exempt)' | 'Not Claimed' | 'Disputed';
  recoverable: boolean;
  notes?: string;
}

interface SaleVATItem {
  id: string; // Invoice Number
  date: string;
  customer: string;
  grossAmount: number;
  vatAmount: number;
  classification: 'Standard' | 'Zero-Rated' | 'Exempt';
  status: 'Issued' | 'Draft' | 'Voided';
  nrsReference?: string;
  nrsStatus?: 'Transmitted' | 'Pending' | 'Failed';
  qrCodeEnabled?: boolean;
}

interface VATReturnRecord {
  period: string; // Month Year e.g. "May 2026"
  filingDeadline: string; // e.g. "2026-06-21"
  filingDate?: string;
  outputVat: number;
  inputVat: number;
  netVatDue: number;
  carryforward: number;
  finalDue: number;
  status: 'DUE' | 'PENDING' | 'FILED' | 'FAILED' | 'DRAFT';
  referenceNumber?: string;
  auditTrail?: { user: string; timestamp: string };
  lineItemsCount?: number;
}

interface CreditNoteRecord {
  id: string;
  originalInvoiceId: string;
  customer: string;
  reason: 'Return' | 'Refund' | 'Price Adjustment' | 'Error';
  grossAmount: number;
  vatAmount: number;
  notes: string;
  date: string;
}

export default function VATModule({ formData, onAction }: VATModuleProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'returns' | 'input' | 'output' | 'einvoices' | 'reports'>('overview');

  // Interactive local states seeded with compliant mock data
  const [purchases, setPurchases] = useState<PurchaseVATItem[]>([
    { id: 'PUR-901', date: '2026-05-24', supplier: 'West Bulk Depot Ltd', grossAmount: 1343750, vatAmount: 93750, classification: 'Standard', docType: 'Invoice', status: 'Claimed', recoverable: true, notes: 'Silica compound materials' },
    { id: 'PUR-902', date: '2026-05-20', supplier: 'Alpha Logistics Tech', grossAmount: 430000, vatAmount: 30000, classification: 'Standard', docType: 'Invoice', status: 'Claimed', recoverable: true, notes: 'Supply chain freight' },
    { id: 'PUR-903', date: '2026-05-15', supplier: 'Sovereign Chemicals', grossAmount: 620000, vatAmount: 0, classification: 'Exempt', docType: 'Expense Receipt', status: 'Not Claimable (Exempt)', recoverable: false, notes: 'Industrial solvent buffer' },
    { id: 'PUR-904', date: '2026-05-10', supplier: 'Lagos Energy Grid', grossAmount: 376250, vatAmount: 26250, classification: 'Standard', docType: 'Invoice', status: 'Not Claimed', recoverable: true, notes: 'Power utilities distribution' },
    { id: 'PUR-952', date: '2026-05-02', supplier: 'Hale Health Systems', grossAmount: 220000, vatAmount: 0, classification: 'Exempt', docType: 'Expense Receipt', status: 'Not Claimable (Exempt)', recoverable: false, notes: 'First aid unit kits' }
  ]);

  const [sales, setSales] = useState<SaleVATItem[]>([
    { id: 'NFT-905', date: '2026-05-29', customer: 'Acme Advisory', grossAmount: 3332500, vatAmount: 232500, classification: 'Standard', status: 'Issued', nrsReference: 'NTA-EINV-0294821', nrsStatus: 'Transmitted' },
    { id: 'NFT-904', date: '2026-05-27', customer: 'Zest Retailers', grossAmount: 1666250, vatAmount: 116250, classification: 'Standard', status: 'Issued', nrsReference: 'NTA-EINV-0294810', nrsStatus: 'Transmitted' },
    { id: 'NFT-903', date: '2026-05-24', customer: 'Crestline Partners', grossAmount: 5160000, vatAmount: 360000, classification: 'Standard', status: 'Issued', nrsReference: 'NTA-EINV-0294799', nrsStatus: 'Transmitted' },
    { id: 'NFT-902', date: '2026-05-20', customer: 'Delta Aviation Ltd', grossAmount: 2200000, vatAmount: 0, classification: 'Zero-Rated', status: 'Issued', nrsReference: 'NTA-EINV-0294721', nrsStatus: 'Transmitted' },
    { id: 'NFT-901', date: '2026-05-15', customer: 'Sterling Bankers', grossAmount: 6880000, vatAmount: 480000, classification: 'Standard', status: 'Issued', nrsReference: 'NTA-EINV-0294692', nrsStatus: 'Transmitted' },
    { id: 'NFT-899', date: '2026-04-18', customer: 'Acme Advisory', grossAmount: 2500000, vatAmount: 185000, classification: 'Standard', status: 'Issued', nrsReference: 'NTA-EINV-0281144', nrsStatus: 'Transmitted' }
  ]);

  const [returns, setReturns] = useState<VATReturnRecord[]>([
    { period: 'May 2026', filingDeadline: '2026-06-21', outputVat: 1188750, inputVat: 123750, netVatDue: 1065000, carryforward: 45000, finalDue: 1020000, status: 'DUE', lineItemsCount: 10 },
    { period: 'April 2026', filingDeadline: '2026-05-21', filingDate: '2026-05-18', outputVat: 950000, inputVat: 185000, netVatDue: 765000, carryforward: 0, finalDue: 765000, status: 'FILED', referenceNumber: 'NTA-VAT-2026-04', auditTrail: { user: formData.fullName || 'Authorized Admin', timestamp: '2026-05-18 10:24 AM' }, lineItemsCount: 8 },
    { period: 'March 2026', filingDeadline: '2026-04-21', filingDate: '2026-04-15', outputVat: 810000, inputVat: 200000, netVatDue: 610000, carryforward: 20000, finalDue: 590000, status: 'FILED', referenceNumber: 'NTA-VAT-2026-03', auditTrail: { user: formData.fullName || 'Authorized Admin', timestamp: '2026-04-15 04:12 PM' }, lineItemsCount: 6 },
    { period: 'February 2026', filingDeadline: '2026-03-21', status: 'PENDING', outputVat: 645000, inputVat: 150000, netVatDue: 495000, carryforward: 0, finalDue: 495000, referenceNumber: 'NTA-VAT-2026-02', auditTrail: { user: formData.fullName || 'Authorized Admin', timestamp: '2026-03-20 11:45 AM' }, lineItemsCount: 5 }
  ]);

  const [creditNotes, setCreditNotes] = useState<CreditNoteRecord[]>([
    { id: 'CN-801', originalInvoiceId: 'NFT-905', customer: 'Acme Advisory', reason: 'Error', grossAmount: 107500, vatAmount: 7500, notes: 'Correcting technical line rate double count', date: '2026-05-30' }
  ]);

  // Settings
  const [qrCodeToggle, setQrCodeToggle] = useState(true);
  const [autoSendNrs, setAutoSendNrs] = useState(true);

  // Expanded returns set
  const [expandedReturn, setExpandedReturn] = useState<string | null>(null);

  // Modals / forms state
  const [showPrepareModal, setShowPrepareModal] = useState(false);
  const [showPurchaseVatModal, setShowPurchaseVatModal] = useState(false);
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [showQrOverlay, setShowQrOverlay] = useState<string | null>(null);
  const [selectedReturnDetail, setSelectedReturnDetail] = useState<VATReturnRecord | null>(null);
  const [viewInvoiceOverlay, setViewInvoiceOverlay] = useState<SaleVATItem | null>(null);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  // New purchase Form fields
  const [newPurchSupplier, setNewPurchSupplier] = useState('');
  const [newPurchDocNum, setNewPurchDocNum] = useState('');
  const [newPurchDocDate, setNewPurchDocDate] = useState('2026-05-31');
  const [newPurchDocType, setNewPurchDocType] = useState<'Invoice' | 'GRN' | 'Expense Receipt'>('Invoice');
  const [newPurchGross, setNewPurchGross] = useState('');
  const [newPurchVatMode, setNewPurchVatMode] = useState<'auto' | 'manual'>('auto');
  const [newPurchVatValue, setNewPurchVatValue] = useState('');
  const [newPurchClassification, setNewPurchClassification] = useState<'Standard' | 'Zero-Rated' | 'Exempt'>('Standard');
  const [purchaseError, setPurchaseError] = useState('');

  // New Credit Note Form fields
  const [targetSalesInvoice, setTargetSalesInvoice] = useState<SaleVATItem | null>(null);
  const [creditReason, setCreditReason] = useState<'Return' | 'Refund' | 'Price Adjustment' | 'Error'>('Refund');
  const [creditNotesText, setCreditNotesText] = useState('');
  const [creditAdjustAmount, setCreditAdjustAmount] = useState('');

  // Prepare states
  const [prepPeriod, setPrepPeriod] = useState('May 2026');
  const [prepConfirmed, setPrepConfirmed] = useState(false);
  const [prepRefGenerated, setPrepRefGenerated] = useState<string | null>(null);
  const [isPrepSubmitting, setIsPrepSubmitting] = useState(false);

  // Search & Filters
  const [inputSearch, setInputSearch] = useState('');
  const [inputSupplierFilter, setInputSupplierFilter] = useState('All');
  const [inputDocTypeFilter, setInputDocTypeFilter] = useState('All');
  const [inputStatusFilter, setInputStatusFilter] = useState('All');

  const [outputSearch, setOutputSearch] = useState('');
  const [outputCustomerFilter, setOutputCustomerFilter] = useState('All');
  const [outputStatusFilter, setOutputStatusFilter] = useState('All');
  const [outputClassFilter, setOutputClassFilter] = useState('All');

  // Currency utility formatting
  const formatNaira = (value: number) => {
    return '₦' + value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  };

  // Helper to parse input values
  const cleanNumber = (val: string) => {
    return Number(val.replace(/[^0-9.]/g, '')) || 0;
  };

  // --- Calculations derived from state ---
  const currentPeriodSales = useMemo(() => sales.filter(s => s.date.includes('2026-05')), [sales]);
  const currentPeriodPurchases = useMemo(() => purchases.filter(p => p.date.includes('2026-05')), [purchases]);

  const outputVatOnSales = useMemo(() => {
    return currentPeriodSales
      .filter(s => s.status === 'Issued')
      .reduce((sum, item) => sum + item.vatAmount, 0);
  }, [currentPeriodSales]);

  const inputVatOnPurchases = useMemo(() => {
    return currentPeriodPurchases
      .filter(p => p.status === 'Claimed')
      .reduce((sum, item) => sum + item.vatAmount, 0);
  }, [currentPeriodPurchases]);

  const netVatDueAmount = useMemo(() => {
    return outputVatOnSales - inputVatOnPurchases;
  }, [outputVatOnSales, inputVatOnPurchases]);

  const carryForwardAmount = useMemo(() => {
    return netVatDueAmount < 0 ? Math.abs(netVatDueAmount) : 0;
  }, [netVatDueAmount]);

  // May return tracker
  const finalMayNetDue = useMemo(() => {
    const creditPrior = 45000; // Prior excess input VAT
    const net = netVatDueAmount - creditPrior;
    return net > 0 ? net : 0;
  }, [netVatDueAmount]);

  // YTD tracker metrics
  const totalYtdInputClaimed = useMemo(() => {
    return purchases
      .filter(p => p.status === 'Claimed')
      .reduce((sum, s) => sum + s.vatAmount, 0);
  }, [purchases]);

  const totalNonRecoverableExempt = useMemo(() => {
    return purchases
      .filter(p => p.classification === 'Exempt')
      .reduce((sum, s) => sum + (s.grossAmount * 0.075), 0); // hypothetical standard VAT we did not claim
  }, [purchases]);

  // Submit purchase records handler
  const handleRecordPurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPurchSupplier || !newPurchDocNum || !newPurchGross) {
      setPurchaseError('Please provide all mandatory vendor, reference number and amount parameters.');
      return;
    }

    const gross = cleanNumber(newPurchGross);
    if (gross <= 0) {
      setPurchaseError('Gross purchase amount must be greater than zero naira.');
      return;
    }

    // Determine VAT amount
    let calculatedVat = 0;
    if (newPurchClassification === 'Standard') {
      if (newPurchVatMode === 'auto') {
        // Standard rate of 7.5% embedded in gross or added on top? Let's add standard formula
        calculatedVat = gross * 0.075;
      } else {
        calculatedVat = cleanNumber(newPurchVatValue);
      }
    }

    const isRecoverable = newPurchClassification === 'Standard';

    const newItem: PurchaseVATItem = {
      id: newPurchDocNum.toUpperCase(),
      date: newPurchDocDate,
      supplier: newPurchSupplier,
      grossAmount: gross,
      vatAmount: calculatedVat,
      classification: newPurchClassification,
      docType: newPurchDocType,
      status: isRecoverable ? 'Claimed' : 'Not Claimable (Exempt)',
      recoverable: isRecoverable,
    };

    setPurchases([newItem, ...purchases]);
    setShowPurchaseVatModal(false);
    
    // Clear forms
    setNewPurchSupplier('');
    setNewPurchDocNum('');
    setNewPurchGross('');
    setNewPurchVatValue('');
    setNewPurchClassification('Standard');
    setPurchaseError('');

    onAction(`Purchase record ${newItem.id} recorded successfully. Recovery VAT calculated: ${formatNaira(calculatedVat)}.`);
  };

  // Submit Prepare Return wizard
  const handlePrepareReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prepConfirmed) {
      alert('You must confirm the statutory completion accuracy compliance acknowledgement checkbox.');
      return;
    }

    setIsPrepSubmitting(true);

    setTimeout(() => {
      const generatedRef = 'NTA-VAT-' + Math.floor(100000 + Math.random() * 900000);
      setPrepRefGenerated(generatedRef);
      setIsPrepSubmitting(false);

      // Create new return entry
      const newRet: VATReturnRecord = {
        period: prepPeriod,
        filingDeadline: prepPeriod.includes('May') ? '2026-06-21' : '2026-07-21',
        filingDate: '2026-06-01',
        outputVat: outputVatOnSales,
        inputVat: inputVatOnPurchases,
        netVatDue: netVatDueAmount,
        carryforward: carryForwardAmount,
        finalDue: finalMayNetDue,
        status: 'FILED',
        referenceNumber: generatedRef,
        auditTrail: { user: formData.fullName || 'Tax Professional', timestamp: '2026-06-01 09:15 AM' },
        lineItemsCount: currentPeriodSales.length + currentPeriodPurchases.length
      };

      // Update filing calendar
      setReturns(prev => prev.map(ret => ret.period === prepPeriod ? { ...ret, status: 'FILED', referenceNumber: generatedRef, filingDate: '2026-06-01' } : ret));
      onAction(`VAT return submitted to NRS. Service generated receipt token ID: ${generatedRef}.`);
    }, 1500);
  };

  // Credit Note Issuer submit
  const handleIssueCreditNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSalesInvoice) return;

    const adjustAmt = cleanNumber(creditAdjustAmount);
    if (adjustAmt <= 0 || adjustAmt > targetSalesInvoice.grossAmount) {
      alert(`Invalid adjustment budget amount. Must be between ₦1.0 and maximum of ${formatNaira(targetSalesInvoice.grossAmount)}.`);
      return;
    }

    const adjustVat = targetSalesInvoice.classification === 'Standard' ? adjustAmt * 0.075 : 0;
    const newNote: CreditNoteRecord = {
      id: 'CN-' + Math.floor(802 + Math.random() * 200),
      originalInvoiceId: targetSalesInvoice.id,
      customer: targetSalesInvoice.customer,
      reason: creditReason,
      grossAmount: adjustAmt,
      vatAmount: adjustVat,
      notes: creditNotesText,
      date: '2026-06-01'
    };

    setCreditNotes([newNote, ...creditNotes]);
    
    // Update invoice total to reflect adjustments
    setSales(prev => prev.map(inv => {
      if (inv.id === targetSalesInvoice.id) {
        return {
          ...inv,
          grossAmount: inv.grossAmount - adjustAmt,
          vatAmount: Math.max(0, inv.vatAmount - adjustVat)
        };
      }
      return inv;
    }));

    setShowCreditNoteModal(false);
    setTargetSalesInvoice(null);
    setCreditAdjustAmount('');
    setCreditNotesText('');
    onAction(`Credit Note ${newNote.id} created for invoice ${newNote.originalInvoiceId}. Adjustment applied: ${formatNaira(adjustAmt)}.`);
  };

  // Auto calculate VAT on Gross purchase input
  const handlePurchGrossChange = (amountStr: string) => {
    setNewPurchGross(amountStr);
    const parsed = cleanNumber(amountStr);
    if (!isNaN(parsed) && parsed > 0 && newPurchClassification === 'Standard') {
      setNewPurchVatValue((parsed * 0.075).toFixed(2));
    } else {
      setNewPurchVatValue('0.00');
    }
  };

  const handlePurchClassificationChange = (type: 'Standard' | 'Zero-Rated' | 'Exempt') => {
    setNewPurchClassification(type);
    if (type !== 'Standard') {
      setNewPurchVatValue('0.00');
    } else {
      const parsed = cleanNumber(newPurchGross);
      if (parsed > 0) {
        setNewPurchVatValue((parsed * 0.075).toFixed(2));
      }
    }
  };

  // Generate Reports Mock Interaction
  const handleGenerateReportTrigger = (reportKey: string) => {
    onAction(`Compiling compliance statistics for ${reportKey}...`);
    setTimeout(() => {
      setGeneratedReport(reportKey);
      onAction(`Compiled ${reportKey} report format success. Ready for download.`);
    }, 800);
  };

  // Filters inputs registry
  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      const matchSearch = p.supplier.toLowerCase().includes(inputSearch.toLowerCase()) || p.id.toLowerCase().includes(inputSearch.toLowerCase()) || (p.notes && p.notes.toLowerCase().includes(inputSearch.toLowerCase()));
      const matchSupplier = inputSupplierFilter === 'All' || p.supplier === inputSupplierFilter;
      const matchDocType = inputDocTypeFilter === 'All' || p.docType === inputDocTypeFilter;
      const matchStatus = inputStatusFilter === 'All' || p.status === inputStatusFilter;
      return matchSearch && matchSupplier && matchDocType && matchStatus;
    });
  }, [purchases, inputSearch, inputSupplierFilter, inputDocTypeFilter, inputStatusFilter]);

  // Unique suppliers list for filter dropdown
  const uniqueSuppliers = useMemo(() => {
    return Array.from(new Set(purchases.map(p => p.supplier)));
  }, [purchases]);

  // Filters output registry
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchSearch = s.customer.toLowerCase().includes(outputSearch.toLowerCase()) || s.id.toLowerCase().includes(outputSearch.toLowerCase());
      const matchCust = outputCustomerFilter === 'All' || s.customer === outputCustomerFilter;
      const matchStatus = outputStatusFilter === 'All' || s.status === outputStatusFilter;
      const matchClass = outputClassFilter === 'All' || s.classification === outputClassFilter;
      return matchSearch && matchCust && matchStatus && matchClass;
    });
  }, [sales, outputSearch, outputCustomerFilter, outputStatusFilter, outputClassFilter]);

  const uniqueCustomers = useMemo(() => {
    return Array.from(new Set(sales.map(s => s.customer)));
  }, [sales]);

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* Dynamic Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs gap-1.5 flex-wrap">
        {[
          { key: 'overview', label: 'Overview', icon: Percent },
          { key: 'returns', label: 'Returns', icon: Calendar },
          { key: 'input', label: 'Input VAT', icon: TrendingUp },
          { key: 'output', label: 'Output VAT', icon: Receipt },
          { key: 'einvoices', label: 'E-Invoices', icon: QrCode },
          { key: 'reports', label: 'Reports', icon: FileSpreadsheet },
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setGeneratedReport(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all rounded-lg cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-purple-50 text-brand-purple font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <IconComponent size={14} className={activeTab === tab.key ? 'text-brand-purple' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: OVERVIEW PANEL --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-none">
          
          {/* Section 1: VAT Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Output VAT */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                  <TrendingUp size={14} className="text-purple-500" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Output VAT (on sales)</span>
                </div>
                <h3 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                  {formatNaira(outputVatOnSales)}
                </h3>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>{currentPeriodSales.length} invoices this period</span>
                <span className="font-semibold text-brand-purple cursor-pointer hover:underline" onClick={() => setActiveTab('output')}>
                  View sales
                </span>
              </div>
            </div>

            {/* Card 2: Input VAT */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                  <TrendingUp size={14} className="text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Input VAT (on purchases)</span>
                </div>
                <h3 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                  {formatNaira(inputVatOnPurchases)}
                </h3>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>{currentPeriodPurchases.filter(p => p.status === 'Claimed').length} claimed records</span>
                <span className="font-semibold text-brand-purple cursor-pointer hover:underline" onClick={() => setActiveTab('input')}>
                  View inputs
                </span>
              </div>
            </div>

            {/* Card 3: Net VAT Due */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Percent size={14} className="text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Net VAT Due</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-red-50 text-red-600 border border-red-100 animate-pulse">
                    DUE
                  </span>
                </div>
                <h3 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                  {formatNaira(finalMayNetDue)}
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Net amount payable to NRS</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>Deadline: Jun 21, 2026</span>
                <span className="font-bold text-red-600 cursor-pointer hover:underline" onClick={() => setShowPrepareModal(true)}>
                  Prepare
                </span>
              </div>
            </div>

            {/* Card 4: Carryforward */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between columns-1">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Carryforward Credit</span>
                </div>
                <h3 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                  {formatNaira(carryForwardAmount > 0 ? carryForwardAmount : 45000)}
                </h3>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500 leading-normal">
                <span>Excess input VAT (applied as prior credit for May filing)</span>
              </div>
            </div>

          </div>

          {/* Section 2: VAT Filing Calendar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">VAT Compliance Filing Calendar</h3>
              <p className="text-xs text-slate-500">Chronological statutory tracker for historical monthly returns scheduled under NTA 2025.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3">Filing Deadline</th>
                    <th className="py-2.5 px-3 text-right">Output VAT</th>
                    <th className="py-2.5 px-3 text-right">Input VAT</th>
                    <th className="py-2.5 px-3 text-right">Net VAT Due</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                  {returns.map(row => (
                    <tr 
                      key={row.period} 
                      className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedReturnDetail(row);
                      }}
                    >
                      <td className="py-3 px-3 font-semibold text-slate-800">{row.period}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{row.filingDeadline}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-900">{formatNaira(row.outputVat)}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-900">{formatNaira(row.inputVat)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{formatNaira(row.finalDue)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                          row.status === 'DUE' ? 'bg-red-50 text-red-700 border-red-100' :
                          row.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100 font-bold' :
                          row.status === 'FILED' ? 'bg-emerald-50 text-emerald-800 border-emerald-100 font-bold' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {row.status === 'DUE' ? (
                          <button
                            onClick={() => setShowPrepareModal(true)}
                            className="px-2.5 py-1 bg-brand-purple text-white text-[10px] font-extrabold rounded hover:opacity-95 cursor-pointer"
                          >
                            Prepare Return
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedReturnDetail(row)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-extrabold rounded cursor-pointer"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 p-3.5 bg-purple-50/40 border border-purple-100 rounded-lg text-[11px] leading-relaxed text-brand-purple">
              <Info size={14} className="shrink-0 text-brand-purple" />
              <span>According to <strong>NTA 2025 Regulatory guidelines</strong>, monthly returns are due for electronically filing and remitting within 21 days following the close of each transaction calendar month.</span>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 2: RETURNS PANEL --- */}
      {activeTab === 'returns' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">VAT Returns Directory</h3>
              <p className="text-xs text-slate-500">File digital tax returns, audit details, and download FIRS receipt signatures.</p>
            </div>
            
            <button
              onClick={() => setShowPrepareModal(true)}
              className="px-3.5 py-1.5 bg-brand-purple hover:bg-opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus size={13} />
              <span>Prepare VAT Return</span>
            </button>
          </div>

          <div className="space-y-3.5">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Filing History (Recent Returns)
            </span>
            
            <div className="space-y-3">
              {returns.map((ret, idx) => {
                const isExpanded = expandedReturn === ret.period;
                return (
                  <div key={ret.period} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs hover:border-slate-300 transition-all">
                    
                    {/* Collapsible Header */}
                    <div 
                      onClick={() => setExpandedReturn(isExpanded ? null : ret.period)}
                      className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-slate-50/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                          <Calendar size={15} />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 tracking-tight">{ret.period} Return</h4>
                          <span className="text-[10px] text-slate-400">
                            {ret.filingDate ? `Filed on ${ret.filingDate}` : `Filing Deadline: ${ret.filingDeadline}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right font-mono">
                          <span className="block text-[9px] text-slate-400 font-sans">Net Vat Liability</span>
                          <span className="font-bold text-xs text-slate-900">{formatNaira(ret.finalDue)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border ${
                            ret.status === 'FILED' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                             ret.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                             'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {ret.status === 'FILED' ? 'FILED ✓' : ret.status}
                          </span>
                          {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {isExpanded && (
                      <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4 text-xs leading-relaxed text-slate-600">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 border border-slate-200/50 rounded-lg">
                          <div>
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">Output VAT (Sales)</span>
                            <strong className="text-slate-800 tracking-tight font-mono text-xs">{formatNaira(ret.outputVat)}</strong>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">Input VAT (Credits)</span>
                            <strong className="text-slate-800 tracking-tight font-mono text-xs">{formatNaira(ret.inputVat)}</strong>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">Carryforward credit</span>
                            <strong className="text-slate-800 tracking-tight font-mono text-xs">{formatNaira(ret.carryforward)}</strong>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">NRS Reference</span>
                            <span className="font-mono text-[10px] text-brand-purple font-bold block mt-0.5">{ret.referenceNumber || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Audit Log Trail */}
                        {ret.auditTrail && (
                          <div className="flex items-center gap-2 text-[10px] bg-white border border-slate-200/40 p-2.5 rounded-md text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                            <span>Audit Trail Lock: Electronically signed by <strong>{ret.auditTrail.user}</strong>. Security Signature Audit: <code>{ret.auditTrail.timestamp}</code></span>
                          </div>
                        )}

                        {/* Document Actions */}
                        <div className="flex gap-2 flex-wrap pt-1">
                          <button 
                            onClick={() => onAction(`Starting PDF receipt export for ${ret.period}...`)}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-brand-purple hover:border-brand-purple rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Download size={11} />
                            <span>Download Return Summary (PDF)</span>
                          </button>
                          
                          <button
                            onClick={() => onAction(`Generated JSON compliance payload for NTA audit of ${ret.period}.`)}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileText size={11} />
                            <span>Download JSON Payload</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: INPUT VAT PANEL --- */}
      {activeTab === 'input' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Input VAT Register</h3>
              <p className="text-xs text-slate-500">Claim and audit recoverable VAT recorded on purchases under FIRS frameworks.</p>
            </div>
            
            <button
              onClick={() => setShowPurchaseVatModal(true)}
              className="px-3.5 py-1.5 bg-brand-purple hover:bg-opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus size={13} />
              <span>Record Purchase VAT</span>
            </button>
          </div>

          {/* Core Recovery Metric Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-xl space-y-1">
              <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Claimable (Current)</span>
              <strong className="text-slate-800 text-xs font-mono block">{formatNaira(inputVatOnPurchases)}</strong>
              <span className="block text-[9px] text-slate-400">Claims in May billing window</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-xl space-y-1">
              <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Total Claims (YTD)</span>
              <strong className="text-slate-800 text-xs font-mono block">{formatNaira(totalYtdInputClaimed)}</strong>
              <span className="block text-[9px] text-slate-400">Total recovered purchase taxes</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-xl space-y-1">
              <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Unclaimed Balance</span>
              <strong className="text-slate-800 text-xs font-mono block">{formatNaira(26250)}</strong>
              <span className="block text-[9px] text-slate-400">Postponed to subsequent periods</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-xl space-y-1">
              <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Non-Recoverable</span>
              <strong className="text-slate-800 text-xs font-mono block">{formatNaira(totalNonRecoverableExempt)}</strong>
              <span className="block text-[9px] text-slate-400">Exempt supplier allocations</span>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Query supplier names, invoice numbers..."
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                />
              </div>

              {/* Advanced Controls Dropdowns */}
              <div className="flex gap-2 flex-wrap">
                <select
                  value={inputSupplierFilter}
                  onChange={(e) => setInputSupplierFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand-purple"
                >
                  <option value="All">All Suppliers</option>
                  {uniqueSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={inputDocTypeFilter}
                  onChange={(e) => setInputDocTypeFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand-purple"
                >
                  <option value="All">All Doc Types</option>
                  <option value="Invoice">Invoice Only</option>
                  <option value="GRN">Goods Received (GRN)</option>
                  <option value="Expense Receipt">Expense Receipt</option>
                </select>

                <select
                  value={inputStatusFilter}
                  onChange={(e) => setInputStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand-purple"
                >
                  <option value="All">All Statuses</option>
                  <option value="Claimed">Claimed</option>
                  <option value="Not Claimed">Not Claimed</option>
                  <option value="Not Claimable (Exempt)">Exempt</option>
                </select>
              </div>
            </div>

            {/* Input Registered Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Doc Ref</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">Doc Type</th>
                    <th className="py-2.5 px-3 text-right">Gross Sum</th>
                    <th className="py-2.5 px-3 text-right">Input VAT</th>
                    <th className="py-2.5 px-3 text-center">Claim Rec.</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                  {filteredPurchases.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{p.date}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{p.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{p.supplier}</div>
                        {p.notes && <div className="text-[9px] text-slate-400">{p.notes}</div>}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[10px] font-semibold">{p.docType}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-800">{formatNaira(p.grossAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatNaira(p.vatAmount)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${p.recoverable ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>
                          {p.recoverable ? '✓ Claimable' : '✗ Exempt'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          p.status === 'Claimed' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                          p.status === 'Not Claimed' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPurchases.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 italic">No purchase transactions matching query criteria found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 4: OUTPUT VAT PANEL --- */}
      {activeTab === 'output' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Output VAT Register</h3>
              <p className="text-xs text-slate-500">Audit sales transactions, outward invoice files and standard 7.5% collected liabilities.</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onAction("Filing parameters synced. Active outward invoicing standard verified at 7.5% standard.")}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw size={13} />
                <span>Sync Invoices</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5">
            
            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer names, invoice reference ID..."
                  value={outputSearch}
                  onChange={(e) => setOutputSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <select
                  value={outputCustomerFilter}
                  onChange={(e) => setOutputCustomerFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand-purple"
                >
                  <option value="All">All Customer Profiles</option>
                  {uniqueCustomers.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  value={outputStatusFilter}
                  onChange={(e) => setOutputStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand-purple"
                >
                  <option value="All">All Statuses</option>
                  <option value="Issued">Issued</option>
                  <option value="Draft">Draft</option>
                  <option value="Voided">Voided</option>
                </select>

                <select
                  value={outputClassFilter}
                  onChange={(e) => setOutputClassFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand-purple"
                >
                  <option value="All">All Classifications</option>
                  <option value="Standard">Standard 7.5%</option>
                  <option value="Zero-Rated">Zero-Rated</option>
                  <option value="Exempt">Exempt</option>
                </select>
              </div>
            </div>

            {/* Sales Table Registry */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Invoice Ref</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3 text-center">VAT Classification</th>
                    <th className="py-2.5 px-3 text-right">Gross Sum</th>
                    <th className="py-2.5 px-3 text-right">VAT Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                  {filteredSales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{s.date}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{s.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{s.customer}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.classification === 'Standard' ? 'text-purple-700 bg-purple-50' :
                          s.classification === 'Zero-Rated' ? 'text-blue-700 bg-blue-50' :
                          'text-amber-700 bg-amber-50'
                        }`}>
                          {s.classification === 'Standard' ? 'Standard 7.5%' : s.classification}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-800">{formatNaira(s.grossAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatNaira(s.vatAmount)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          s.status === 'Issued' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                          s.status === 'Draft' ? 'bg-slate-55 text-slate-550 border-slate-100' :
                          'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setViewInvoiceOverlay(s)}
                            className="bg-slate-100 hover:bg-slate-200 p-1 rounded text-slate-600 hover:text-slate-850 cursor-pointer"
                            title="View invoice template review"
                          >
                            <FileText size={11} />
                          </button>
                          
                          <button
                            onClick={() => {
                              setTargetSalesInvoice(s);
                              setShowCreditNoteModal(true);
                            }}
                            className="bg-purple-100 hover:bg-brand-purple hover:text-white p-1 rounded text-brand-purple cursor-pointer"
                            title="Issue adjustment credit note refund"
                          >
                            <AlertCircle size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSales.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 italic">No output sales records matching filters found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 5: E-INVOICES PANEL --- */}
      {activeTab === 'einvoices' && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">NRS E-Invoices Portal</h3>
            <p className="text-xs text-slate-500">Monitor automated billing compliance logs dispatched dynamically to FIRS authorities.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Section 1: Settings Config Cabinet */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4.5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">NRS Api Integration Settings</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Secure automated e-invoice reporting options.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wide">Business Verified TIN</span>
                <strong className="text-slate-800 text-xs font-mono tracking-tight block">{formData.tin || '12345678901'}</strong>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">E-Invoice Scheme</span>
                  <span className="bg-purple-50 text-brand-purple border border-purple-100 font-bold font-mono px-2 py-0.5 rounded text-[10px]">Rev360 Standard</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="font-medium text-slate-600">Connected NRS Port Status</span>
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0" />
                    Connected ✓
                  </span>
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Verify via QR Code</span>
                  <button
                    onClick={() => setQrCodeToggle(!qrCodeToggle)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      qrCodeToggle ? 'bg-brand-purple' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      qrCodeToggle ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Auto-send to NRS Port</span>
                  <button
                    onClick={() => {
                      setAutoSendNrs(!autoSendNrs);
                      onAction(`Auto e-invoice dispatch ${!autoSendNrs ? 'enabled' : 'disabled'}.`);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoSendNrs ? 'bg-brand-purple' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      autoSendNrs ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: NRS Register Log */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 space-y-4 flex flex-col">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Live E-Invoice Compliant Registry</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Transmission log matching sales invoices to FIRS cryptographic NRS reference blocks.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Invoice Ref</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3 text-right">Sum + VAT</th>
                      <th className="py-2.5 px-3 text-center">NRS Ref Token</th>
                      <th className="py-2.5 px-3 text-center">Transmission</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                    {sales.map(s => {
                      const finalVat = s.vatAmount;
                      const hasVat = finalVat > 0;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-400">{s.date}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{s.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{s.customer}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-900">
                            <div>{formatNaira(s.grossAmount)}</div>
                            <div className="text-[9px] text-slate-400 font-bold">VAT: {formatNaira(s.vatAmount)}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-[9px] text-slate-700 select-all">
                            {s.nrsReference || 'N/A'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              s.nrsStatus === 'Transmitted' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                            }`}>
                              {s.nrsStatus || 'Not Dispatched'} ✓
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setShowQrOverlay(s.id)}
                                className="p-1 text-slate-500 hover:text-brand-purple hover:bg-slate-100 rounded cursor-pointer"
                                title="Show Crypto QR audit verification"
                              >
                                <QrCode size={12} />
                              </button>
                              
                              <button
                                onClick={() => onAction(`Initiated NRS transmission reload for ${s.id}. Status: verified.`)}
                                className="p-1 text-slate-500 hover:text-brand-purple hover:bg-slate-100 rounded cursor-pointer"
                                title="Resubmit payload token to FIRS node"
                              >
                                <RefreshCw size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 6: REPORTS PANEL --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">Regulatory Compliance Reports</h3>
            <p className="text-xs text-slate-500">Generate, compile, and download formal FIRS audits and reconciliation models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Report 1 CARD */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2.5 bg-purple-50 text-brand-purple rounded-xl w-10 h-10 flex items-center justify-center">
                  <Percent size={20} />
                </div>
                <h4 className="font-bold text-xs text-slate-900 font-sans tracking-tight uppercase">VAT Reconciliation Report</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Verify variance analysis by comparing book entries against actual tax liabilities remitted dynamically on the NRS portal.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleGenerateReportTrigger('reconciliation')}
                  className="w-full text-center py-1.5 bg-slate-100 hover:bg-brand-purple hover:text-white transition-all text-xs font-bold text-brand-purple rounded-lg cursor-pointer"
                >
                  Generate Report
                </button>
              </div>
            </div>

            {/* Report 2 CARD */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-10 h-10 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <h4 className="font-bold text-xs text-slate-900 font-sans tracking-tight uppercase">VAT Return History (Annual)</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Track full historical files YTD compliance status details, monthly variance models and export data formats cleanly.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleGenerateReportTrigger('history')}
                  className="w-full text-center py-1.5 bg-slate-100 hover:bg-brand-purple hover:text-white transition-all text-xs font-bold text-brand-purple rounded-lg cursor-pointer"
                >
                  Generate Report
                </button>
              </div>
            </div>

            {/* Report 3 CARD */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-10 h-10 flex items-center justify-center">
                  <Sliders size={20} />
                </div>
                <h4 className="font-bold text-xs text-slate-900 font-sans tracking-tight uppercase">VAT Classification Analysis</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Deep analytics detailing sales and purchases breakdown by Standard 7.5%, zero-rated and exempt statutory classes.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleGenerateReportTrigger('classification')}
                  className="w-full text-center py-1.5 bg-slate-100 hover:bg-brand-purple hover:text-white transition-all text-xs font-bold text-brand-purple rounded-lg cursor-pointer"
                >
                  Generate Report
                </button>
              </div>
            </div>

          </div>

          {/* Generated download cabinets */}
          {generatedReport && (
            <div className="p-5 bg-purple-50/20 border border-purple-150/45 rounded-xl space-y-4 animate-none">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-brand-purple uppercase tracking-tight">
                    Compilation Ready: {generatedReport.toUpperCase()} Report
                  </h4>
                  <p className="text-[11px] text-slate-600">The spreadsheet assets and document files have been constructed based on live ledger logs.</p>
                </div>
                <button
                  onClick={() => setGeneratedReport(null)}
                  className="p-1 hover:bg-slate-200/50 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex gap-2 flex-wrap text-xs font-bold">
                <button
                  onClick={() => onAction(`Successfully downloaded ${generatedReport} report as PDF format.`)}
                  className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-opacity-95 text-white flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download PDF Summary</span>
                </button>
                
                <button
                  onClick={() => onAction(`Successfully exported ${generatedReport} spreadsheets spreadsheet.`)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
                >
                  <FileSpreadsheet size={13} className="text-emerald-600" />
                  <span>Download Spreadsheets Excel</span>
                </button>

                <button
                  onClick={() => onAction(`FIRS Audit reconciliation email dispatched to authorized tax consultant list.`)}
                  className="px-3.5 py-1.5 bg-slate-150 border border-slate-200 text-slate-600 hover:text-slate-800 flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
                >
                  <Mail size={13} />
                  <span>Transmit Email to Consultant</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* ======================= OVERLAY DIALOG MODALS ================= */}
      {/* ============================================================== */}

      {/* Overlay 1: Prepare Return Wizard */}
      {showPrepareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl font-sans text-xs">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-brand-purple rounded-md flex items-center justify-center text-white font-extrabold text-[11px]">
                  V
                </div>
                <strong className="font-bold text-slate-900 text-sm">Prepare VAT Return (NTA 2026 Wizard)</strong>
              </div>
              <button 
                onClick={() => {
                  setShowPrepareModal(false);
                  setPrepRefGenerated(null);
                  setPrepConfirmed(false);
                }}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Wizard Body content */}
            <form onSubmit={handlePrepareReturnSubmit} className="p-6 space-y-4">
              {prepRefGenerated ? (
                <div className="py-4 space-y-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900">Return Filed Successfully to NRS</h4>
                    <span className="block text-[11px] text-slate-500">Your return has been locked under security signatures.</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono space-y-1.5 text-left text-[11px] leading-tight">
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase text-[9px] font-sans font-bold">Filing Period</span>
                      <strong className="text-slate-800">{prepPeriod}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455 uppercase text-[9px] font-sans font-bold">Cryptographic Reference ID</span>
                      <strong className="text-brand-purple select-all">{prepRefGenerated}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455 uppercase text-[9px] font-sans font-bold">Net Remittance Obligation</span>
                      <strong className="text-slate-800">{formatNaira(finalMayNetDue)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455 uppercase text-[9px] font-sans font-bold">NRS Node Port Node Code</span>
                      <strong className="text-slate-800">FIRS-PORT-3000</strong>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => onAction(`Downloaded return summary receipt file: ${prepRefGenerated}`)}
                      className="px-3.5 py-1.5 bg-[#7C3AED] text-white font-extrabold rounded-lg shadow-sm cursor-pointer"
                    >
                      Download Return Summary (PDF)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrepareModal(false);
                        setPrepRefGenerated(null);
                        setPrepConfirmed(false);
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
                    >
                      Close Wizard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-start gap-2 text-brand-purple leading-normal">
                    <Info size={14} className="shrink-0 mt-0.5 text-brand-purple" />
                    <span>This workspace operates standard 7.5% outward pricing rates. System automatically retrieves values based on live ledger transactions.</span>
                  </div>

                  {/* Period Selection */}
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Select Filing Target Period</label>
                    <select
                      value={prepPeriod}
                      onChange={(e) => setPrepPeriod(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 focus:outline-none focus:border-brand-purple"
                    >
                      <option value="May 2026">May 2026 (Current Window)</option>
                      <option value="June 2026">June 2026</option>
                    </select>
                  </div>

                  {/* Readonly Review Section */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono text-[11px] leading-tight text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-sans text-slate-500 uppercase tracking-tight text-[9px] font-bold">1. Output VAT (on Sales)</span>
                      <strong className="text-slate-800">{formatNaira(outputVatOnSales)}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/55 pb-1.5">
                      <span className="font-sans text-slate-500 uppercase tracking-tight text-[9px] font-bold">2. Input VAT (Purchases Deductions)</span>
                      <strong className="text-slate-800">-{formatNaira(inputVatOnPurchases)}</strong>
                    </div>
                    <div className="flex justify-between pt-1 font-extrabold text-slate-800">
                      <span>3. Net VAT Liability</span>
                      <span>{formatNaira(netVatDueAmount)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/55 pb-1.5 text-slate-450 text-[10px]">
                      <span className="font-sans">Prior Period Excess Input credit carryforward applied</span>
                      <span className="text-slate-800 font-bold">-₦45,000.0</span>
                    </div>
                    <div className="flex justify-between pt-1.5 font-black text-sm text-brand-purple">
                      <span className="font-sans text-[10px] font-extrabold tracking-tight uppercase">May Net VAT Due</span>
                      <span>{formatNaira(finalMayNetDue)}</span>
                    </div>
                  </div>

                  {/* Confirm Box */}
                  <div className="flex items-start gap-2.5 pt-1.5">
                    <input
                      type="checkbox"
                      id="confirm-nta-compliance"
                      checked={prepConfirmed}
                      onChange={(e) => setPrepConfirmed(e.target.checked)}
                      className="mt-1 border-slate-300 rounded text-brand-purple focus:ring-brand-purple"
                    />
                    <label htmlFor="confirm-nta-compliance" className="text-[10px] sm:text-xs text-slate-500 leading-normal select-none">
                      I hereby confirm that this Return Statement accurately indexes and audits all active corporate entries, in compliance with standard NTA 2025 and FIRS specifications.
                    </label>
                  </div>

                  {/* Cancel / File Controls */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowPrepareModal(false)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => onAction("Saved return draft successfully in workspace.")}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-slate-800 font-bold rounded-lg cursor-pointer"
                    >
                      Save as Draft
                    </button>

                    <button
                      type="submit"
                      disabled={!prepConfirmed || isPrepSubmitting}
                      className={`px-4.5 py-1.5 font-extrabold text-white rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        prepConfirmed && !isPrepSubmitting ? 'bg-brand-purple hover:bg-opacity-95 shadow-sm' : 'bg-slate-200 text-slate-450 cursor-not-allowed'
                      }`}
                    >
                      {isPrepSubmitting ? 'Transmitting...' : 'Submit to NRS'}
                    </button>
                  </div>
                </div>
              )}
            </form>

          </div>
        </div>
      )}

      {/* Overlay 2: Manual Purchase Input VAT Form */}
      {showPurchaseVatModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl font-sans text-xs">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-brand-purple rounded-md flex items-center justify-center text-white font-extrabold text-[11px]">
                  P
                </div>
                <strong className="font-bold text-slate-900 text-sm">Record Manual Purchase VAT</strong>
              </div>
              <button 
                onClick={() => {
                  setShowPurchaseVatModal(false);
                  setPurchaseError('');
                }}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleRecordPurchaseSubmit} className="p-6 space-y-4">
              {purchaseError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg leading-normal flex items-start gap-1.5">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                  <span>{purchaseError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1 COL-SPAN">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sovereign Chemicals"
                    value={newPurchSupplier}
                    onChange={(e) => setNewPurchSupplier(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Document Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PUR-907"
                    value={newPurchDocNum}
                    onChange={(e) => setNewPurchDocNum(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold font-mono focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Document Date</label>
                  <input
                    type="date"
                    required
                    value={newPurchDocDate}
                    onChange={(e) => setNewPurchDocDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Document Type</label>
                  <select
                    value={newPurchDocType}
                    onChange={(e) => setNewPurchDocType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Invoice">Invoice</option>
                    <option value="GRN">Goods Received (GRN)</option>
                    <option value="Expense Receipt">Expense Receipt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">VAT Classification</label>
                  <select
                    value={newPurchClassification}
                    onChange={(e) => handlePurchClassificationChange(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Standard">Standard (reclaimable 7.5%)</option>
                    <option value="Zero-Rated">Zero-Rated (reclaimable 0%)</option>
                    <option value="Exempt">Exempt supply (no claim)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Gross Transaction Sum *</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 h-full text-slate-400 font-bold font-mono">₦</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500,000"
                      value={newPurchGross}
                      onChange={(e) => handlePurchGrossChange(e.target.value)}
                      className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>
              </div>

              {newPurchClassification === 'Standard' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[8px]">Deduction VAT Input Budget</span>
                    <div className="flex gap-2 text-[9px] font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setNewPurchVatMode('auto');
                          const parser = cleanNumber(newPurchGross);
                          if (parser > 0) setNewPurchVatValue((parser * 0.075).toFixed(2));
                        }}
                        className={`px-2 py-0.5 rounded border ${newPurchVatMode === 'auto' ? 'bg-purple-100 text-brand-purple border-purple-200' : 'bg-white border-slate-200 text-slate-550'}`}
                      >
                        Auto (7.5%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPurchVatMode('manual')}
                        className={`px-2 py-0.5 rounded border ${newPurchVatMode === 'manual' ? 'bg-purple-100 text-brand-purple border-purple-200' : 'bg-white border-slate-200 text-slate-550'}`}
                      >
                        Override Manual
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-2.5 top-2.5 text-slate-400 font-bold font-mono">₦</span>
                    <input
                      type="text"
                      disabled={newPurchVatMode === 'auto'}
                      value={newPurchVatValue}
                      onChange={(e) => setNewPurchVatValue(e.target.value)}
                      className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-slate-100 rounded-lg text-xs font-semibold font-mono text-brand-purple font-extrabold focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Upload document */}
              <div className="space-y-1 pt-1">
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Supporting Invoice Document Upload (Optional)</label>
                <div className="border border-dashed border-slate-200 bg-slate-50 rounded-lg p-4 text-center text-slate-400 font-semibold cursor-pointer py-5.5 hover:border-brand-purple transition-colors">
                  Drag and drop raw PDF/Invoice receipt or click to browse
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPurchaseVatModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-250 text-slate-600 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-1.5 bg-brand-purple hover:bg-opacity-95 text-white font-extrabold rounded-lg shadow-sm cursor-pointer"
                >
                  Save Record
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Overlay 3: Credit Note Form */}
      {showCreditNoteModal && targetSalesInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl font-sans text-xs">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-purple-100 text-brand-purple rounded-md flex items-center justify-center text-brand-purple font-bold">
                  CN
                </div>
                <strong className="font-bold text-slate-900 text-sm">Issue Credit Note Refund</strong>
              </div>
              <button 
                onClick={() => {
                  setShowCreditNoteModal(false);
                  setTargetSalesInvoice(null);
                }}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleIssueCreditNoteSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-lg">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Original Invoice</span>
                  <strong className="text-slate-800 text-xs font-mono uppercase font-black block mt-0.5">{targetSalesInvoice.id}</strong>
                </div>

                <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-lg">
                  <span className="block text-[8px] text-slate-400 font-semibold uppercase tracking-wider">Customer Profile</span>
                  <strong className="text-slate-800 text-xs font-bold block truncate mt-0.5">{targetSalesInvoice.customer}</strong>
                </div>

                <div className="space-y-1 col-span-2">
                  <span className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Select Credit Note Adjust Reason</span>
                  <select
                    value={creditReason}
                    onChange={(e) => setCreditReason(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Refund">Refund / Returned Stock</option>
                    <option value="Return">Contract Cancellation / Return Goods</option>
                    <option value="Price Adjustment">Adjustment overcharge / discount relief</option>
                    <option value="Error">Clerical accounting error correction</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <span className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Adjustment Credit Amount *</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2.5 text-slate-400 font-bold font-mono">₦</span>
                    <input
                      type="text"
                      required
                      placeholder={`Max: ${targetSalesInvoice.grossAmount.toLocaleString()}`}
                      value={creditAdjustAmount}
                      onChange={(e) => setCreditAdjustAmount(e.target.value)}
                      className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-xs focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

                <div className="space-y-1 col-span-2">
                  <span className="block text-slate-500 font-bold uppercase tracking-wide text-[9px]">Reason Details &amp; Notes</span>
                  <textarea
                    rows={3}
                    placeholder="Provide professional auditing justification notes..."
                    value={creditNotesText}
                    onChange={(e) => setCreditNotesText(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreditNoteModal(false);
                    setTargetSalesInvoice(null);
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-1.5 bg-brand-purple hover:bg-opacity-95 text-white font-extrabold rounded-lg shadow-sm cursor-pointer"
                >
                  Issue Credit Note
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Overlay 4: Large Scannable QR Code */}
      {showQrOverlay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-2xl font-sans text-xs p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 text-xs">Verify Cryptographic NTA E-Invoice</span>
              <button onClick={() => setShowQrOverlay(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-1.5 text-center py-2">
              <p className="text-[11px] text-slate-500">Scan this code to dynamically fetch compliance proof from FIRS Node endpoints.</p>
              
              <div className="w-48 h-48 border border-slate-250 bg-slate-50 mx-auto rounded-xl flex flex-col justify-center items-center shadow-xs select-none">
                <div className="text-3xl font-extrabold text-[#7C3AED]">T</div>
                <div className="h-28 w-28 border border-[#7C3AED]/30 rounded-lg flex items-center justify-center text-slate-400 shadow-3xs bg-white text-center text-[10px] uppercase font-mono p-1 mt-1 leading-snug">
                  [QR ENCODED]
                  <br />
                  FIRS-EINV
                  <br />
                  {showQrOverlay}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg leading-snug text-slate-550 flex items-start gap-1.5">
              <Info size={13} className="shrink-0 mt-0.5 text-[#7C3AED]" />
              <span>Complies with standard Rev360 security signing protocol rules under Nigerian tax frameworks.</span>
            </div>
            
            <button
              onClick={() => setShowQrOverlay(null)}
              className="w-full text-center py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-lg cursor-pointer"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      )}

      {/* Overlay 5: Return Details Drawer modal */}
      {selectedReturnDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl font-sans text-xs">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Percent size={15} className="text-brand-purple" />
                <strong className="font-bold text-slate-900 text-sm">VAT Monthly return file detail</strong>
              </div>
              <button 
                onClick={() => setSelectedReturnDetail(null)}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-slate-55/40 p-3 rounded-lg">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 tracking-tight">Filing Period: {selectedReturnDetail.period}</h4>
                  <p className="text-[10px] text-slate-500">Security signature locked audit payload receipt</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[9px] font-black uppercase tracking-wider">
                  {selectedReturnDetail.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[11px] leading-tight text-slate-600">
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wide">1. Total Inward Sales VAT</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{formatNaira(selectedReturnDetail.outputVat)}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wide">2. Total Recoverable Inputs</span>
                  <span className="font-bold text-slate-900 block mt-0.5">-{formatNaira(selectedReturnDetail.inputVat)}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wide">3. Excess Carryforward Credit</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{formatNaira(selectedReturnDetail.carryforward)}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg col-span-2">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wide">4. Final Remitted Tax Liability Paid to NRS</span>
                  <span className="font-extrabold text-brand-purple text-sm block mt-0.5">{formatNaira(selectedReturnDetail.finalDue)}</span>
                </div>
              </div>

              {/* Audit trail summary */}
              <div className="space-y-1 text-slate-500">
                <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wide">Compliance Audit Log</span>
                <div className="bg-slate-50 p-3.5 border border-slate-200/60 rounded-lg space-y-1 text-[11px] leading-relaxed">
                  <div className="flex justify-between">
                    <span>Authorized Filer ID Name:</span>
                    <strong className="text-slate-800">{formData.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>System Transmission ID Token Code:</span>
                    <strong className="text-slate-800 font-mono text-[10px]">{selectedReturnDetail.referenceNumber || 'N/A-PENDING-FIRS-LOCK'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Transmission Node Hash:</span>
                    <strong className="text-slate-800 font-mono text-[9px]">AES-256:0294-8841-NTA-2025</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedReturnDetail(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-lg cursor-pointer"
                >
                  Close Detail
                </button>
                <button
                  onClick={() => onAction(`Dispatched PDF return report for ${selectedReturnDetail.period}`)}
                  className="px-3.5 py-1.5 bg-[#7C3AED] text-white font-extrabold rounded-lg shadow-sm cursor-pointer"
                >
                  Download Summary PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Overlay 6: View Full Invoice template */}
      {viewInvoiceOverlay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl font-sans text-xs">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">Review Registered Sales Invoice Preview</span>
              <button onClick={() => setViewInvoiceOverlay(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-[11px] leading-normal text-slate-700">
              <div className="text-center space-y-1 relative">
                <Logo size={24} className="mx-auto" showText={false} />
                <h4 className="font-bold text-xs text-slate-900 uppercase">TRIBUTA INTEGRATED LEDGER</h4>
                <p className="text-[9px] text-slate-400">LAGOS INDUSTRIAL PARK • NIGERIA • NTA 2025</p>
              </div>

              <div className="border-t border-dashed border-slate-250 my-3 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span>Invoice ID:</span>
                  <strong className="text-slate-900">{viewInvoiceOverlay.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Issued Date:</span>
                  <strong className="text-slate-900">{viewInvoiceOverlay.date}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Customer Name:</span>
                  <strong className="text-slate-900">{viewInvoiceOverlay.customer}</strong>
                </div>
                <div className="flex justify-between">
                  <span>VAT Classification Status:</span>
                  <strong className="text-[#7C3AED] uppercase">{viewInvoiceOverlay.classification}</strong>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-250 my-3 pt-3 space-y-1.5 bg-slate-50 p-2.5 rounded">
                <div className="flex justify-between text-[11px]">
                  <span>Item Subtotal Sum:</span>
                  <span>{formatNaira(viewInvoiceOverlay.grossAmount - viewInvoiceOverlay.vatAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Applied VAT standard:</span>
                  <span>{formatNaira(viewInvoiceOverlay.vatAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 text-slate-900 font-extrabold">
                  <span>TOTAL TRANSACTION AMOUNT:</span>
                  <span>{formatNaira(viewInvoiceOverlay.grossAmount)}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-450 text-center leading-relaxed font-sans pt-1">
                This transaction payload is securely verified by the <strong>NRS Api Connection Node</strong> under TIN standard {formData.tin || '12345678901'}.
              </div>

              <div className="flex gap-2 justify-center pt-3 border-t border-slate-100 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    onAction(`PDF dispatch saved: ${viewInvoiceOverlay.id}.`);
                    setViewInvoiceOverlay(null);
                  }}
                  className="px-4 py-1.5 bg-brand-purple text-white font-extrabold rounded cursor-pointer"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewInvoiceOverlay(null)}
                  className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
