import React, { useState, useMemo } from 'react';
import { SignupState } from '../types';
import {
  Percent,
  Calendar,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Plus,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Check,
  X,
  FileText,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface VATModuleProps {
  formData: SignupState;
  onAction: (msg: string) => void;
}

interface PurchaseItem {
  id: string;
  date: string;
  supplier: string;
  amount: number;
  vatPaid: number;
  claimable: 'Yes' | 'No';
  notes?: string;
}

interface SaleItem {
  id: string;
  date: string;
  invoiceNumber: string;
  customer: string;
  vatType: 'Standard' | 'Zero-Rated' | 'Exempt';
  amount: number;
  vatCharged: number;
}

interface VATReturn {
  period: string;
  filingDeadline: string;
  outputVat: number;
  inputVat: number;
  netVatDue: number;
  status: 'Due' | 'Filed' | 'Pending';
  referenceNumber?: string;
  filingDate?: string;
}

export default function VATModule({ formData, onAction }: VATModuleProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'returns' | 'input' | 'output' | 'reports'>('overview');

  // Realistic Purchases (Input VAT) State
  const [purchases, setPurchases] = useState<PurchaseItem[]>([
    { id: '1', date: '2026-05-15', supplier: 'Sovereign Chemicals Ltd', amount: 1200000, vatPaid: 90000, claimable: 'Yes', notes: 'Raw compound materials batch' },
    { id: '2', date: '2026-05-18', supplier: 'Lagos Energy Depot', amount: 450000, vatPaid: 33750, claimable: 'Yes', notes: 'Warehouse utility power supply' },
    { id: '3', date: '2026-05-20', supplier: 'Alpha Logistics & Tech', amount: 600000, vatPaid: 0, claimable: 'No', notes: 'Exempt cross-state freight shipping' },
    { id: '4', date: '2026-05-22', supplier: 'Hale Health Systems', amount: 180000, vatPaid: 0, claimable: 'No', notes: 'Statutory first-aid equipment pack' },
    { id: '5', date: '2026-05-25', supplier: 'West Bulk Depot Ltd', amount: 750000, vatPaid: 56250, claimable: 'Yes', notes: 'Sieving buffer components' },
  ]);

  // Realistic Sales (Output VAT) State
  const [sales, setSales] = useState<SaleItem[]>([
    { id: '1', date: '2026-05-14', invoiceNumber: 'NFT-905', customer: 'Acme Advisory Group', vatType: 'Standard', amount: 3100000, vatCharged: 232500 },
    { id: '2', date: '2026-05-17', invoiceNumber: 'NFT-906', customer: 'Zest Retailers', vatType: 'Standard', amount: 1550000, vatCharged: 116250 },
    { id: '3', date: '2026-05-21', invoiceNumber: 'NFT-907', customer: 'Crestline Partners', vatType: 'Standard', amount: 4800000, vatCharged: 360000 },
    { id: '4', date: '2026-05-24', invoiceNumber: 'NFT-908', customer: 'Delta Aviation Ltd', vatType: 'Zero-Rated', amount: 2200000, vatCharged: 0 },
    { id: '5', date: '2026-05-28', invoiceNumber: 'NFT-909', customer: 'Sterling Bankers', vatType: 'Exempt', amount: 1850000, vatCharged: 0 },
  ]);

  // VAT Returns Directory State
  const [returns, setReturns] = useState<VATReturn[]>([
    { period: 'May 2026', filingDeadline: '2026-06-21', outputVat: 708750, inputVat: 180000, netVatDue: 483750, status: 'Due' },
    { period: 'April 2026', filingDeadline: '2026-05-21', outputVat: 625000, inputVat: 145000, netVatDue: 480000, status: 'Filed', referenceNumber: 'NTA-VAT-2026-04-1049', filingDate: '2026-05-18' },
    { period: 'March 2026', filingDeadline: '2026-04-21', outputVat: 515000, inputVat: 130000, netVatDue: 385000, status: 'Filed', referenceNumber: 'NTA-VAT-2026-03-8271', filingDate: '2026-04-14' },
    { period: 'February 2026', filingDeadline: '2026-03-21', outputVat: 480000, inputVat: 120000, netVatDue: 360000, status: 'Filed', referenceNumber: 'NTA-VAT-2026-02-0194', filingDate: '2026-03-19' },
  ]);

  // Selected row click overlays
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
  const [selectedSale, setSelectedSale] = useState<SaleItem | null>(null);
  const [selectedReturnDetails, setSelectedReturnDetails] = useState<VATReturn | null>(null);

  // Preparation wizard variables
  const [showPrepareWizard, setShowPrepareWizard] = useState(false);
  const [wizardPeriod, setWizardPeriod] = useState('May 2026');
  const [confirmWizardCheckbox, setConfirmWizardCheckbox] = useState(false);
  const [wizardSuccessPayload, setWizardSuccessPayload] = useState<{ reference: string } | null>(null);

  // Formatting helper
  const formatNaira = (value: number) => {
    return '₦' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Computations for May period (the current active filing period)
  const totalOutputVatForMay = useMemo(() => {
    return sales.reduce((sum, item) => sum + item.vatCharged, 0);
  }, [sales]);

  const totalInputVatForMay = useMemo(() => {
    return purchases
      .filter(p => p.claimable === 'Yes')
      .reduce((sum, item) => sum + item.vatPaid, 0);
  }, [purchases]);

  const netVatDueForMay = useMemo(() => {
    return totalOutputVatForMay - totalInputVatForMay;
  }, [totalOutputVatForMay, totalInputVatForMay]);

  const carryforwardCredit = 45000; // Extra VAT credit carried forward

  const netPayableWithCredit = useMemo(() => {
    const finalVal = netVatDueForMay - carryforwardCredit;
    return finalVal > 0 ? finalVal : 0;
  }, [netVatDueForMay]);

  // Handle prepare return submission
  const onSubmitReturnToNRS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmWizardCheckbox) return;

    onAction(`Submitting ${wizardPeriod} statutory tax return to NRS...`);
    const generatedRef = `NTA-VAT-2026-05-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Simulate API Response delay slightly
    setWizardSuccessPayload({ reference: generatedRef });

    // Update status in local table
    setReturns(prev =>
      prev.map(r =>
        r.period === wizardPeriod
          ? {
              ...r,
              status: 'Filed',
              referenceNumber: generatedRef,
              filingDate: new Date().toISOString().split('T')[0]
            }
          : r
      )
    );

    onAction(`Successfully submitted VAT return for ${wizardPeriod}. Receipt Token: ${generatedRef}`);
  };

  const onSaveReturnDraft = () => {
    setReturns(prev =>
      prev.map(r => (r.period === wizardPeriod ? { ...r, status: 'Pending' } : r))
    );
    setShowPrepareWizard(false);
    onAction(`VAT return draft saved successfully for ${wizardPeriod}.`);
  };

  // Static Data for Visual Reports
  const report1TrendData = [
    { name: 'Jan', Collected: 420000, Paid: 110000, Net: 310000 },
    { name: 'Feb', Collected: 480000, Paid: 120000, Net: 360000 },
    { name: 'Mar', Collected: 515000, Paid: 130000, Net: 385000 },
    { name: 'Apr', Collected: 625000, Paid: 145000, Net: 480000 },
    { name: 'May', Collected: 708750, Paid: 180000, Net: 528750 },
  ];

  const report3BreakdownData = [
    { name: 'Standard-Rated (7.5%)', value: 9450000, color: '#6366F1' },
    { name: 'Zero-Rated (0%)', value: 2200000, color: '#10B981' },
    { name: 'Exempt', value: 1850000, color: '#F59E0B' },
  ];

  // Dynamic calculations for Report 2 totals
  const report2Totals = useMemo(() => {
    return report1TrendData.reduce(
      (totals, month) => {
        totals.Collected += month.Collected;
        totals.Paid += month.Paid;
        totals.Net += month.Net;
        return totals;
      },
      { Collected: 0, Paid: 0, Net: 0 }
    );
  }, []);

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* Tab Selector Navigation */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs gap-1.5 flex-wrap">
        {[
          { key: 'overview', label: 'Overview', icon: Percent },
          { key: 'returns', label: 'Returns', icon: Calendar },
          { key: 'input', label: 'Input VAT', icon: TrendingUp },
          { key: 'output', label: 'Output VAT', icon: Receipt },
          { key: 'reports', label: 'Reports', icon: FileSpreadsheet },
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setWizardSuccessPayload(null);
                setConfirmWizardCheckbox(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all rounded-lg cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-purple-50 text-brand-purple font-extrabold shadow-sm'
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
        <div className="space-y-6">
          
          {/* Summary Cards: Merged, Connected Grid layout with subtle separating lines */}
          <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
              
              {/* Card 1: Output VAT */}
              <div className="p-5 flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                    Output VAT (on Sales)
                  </span>
                  <h3 className="text-xl font-extrabold font-mono text-slate-900 tracking-tight mt-1.5">
                    {formatNaira(totalOutputVatForMay)}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {sales.length} invoices this period
                  </span>
                  <button
                    onClick={() => setActiveTab('output')}
                    className="text-[10px] text-brand-purple hover:underline font-bold"
                  >
                    View sales &rarr;
                  </button>
                </div>
              </div>

              {/* Card 2: Input VAT */}
              <div className="p-5 flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                    Input VAT (on Purchases)
                  </span>
                  <h3 className="text-xl font-extrabold font-mono text-slate-900 tracking-tight mt-1.5">
                    {formatNaira(totalInputVatForMay)}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {purchases.filter(p => p.claimable === 'Yes').length} claimed records
                  </span>
                  <button
                    onClick={() => setActiveTab('input')}
                    className="text-[10px] text-brand-purple hover:underline font-bold"
                  >
                    View inputs &rarr;
                  </button>
                </div>
              </div>

              {/* Card 3: Net VAT Due */}
              <div className="p-5 flex flex-col justify-between min-h-[140px] bg-slate-50/50">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                      Net VAT Due
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-100 text-rose-800 border border-red-200">
                      DUE
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold font-mono text-slate-900 tracking-tight mt-1.5">
                    {formatNaira(netPayableWithCredit)}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">Net payable (after credit)</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[9px] text-slate-500 font-mono">
                    Deadline: June 21, 2026
                  </span>
                  <button
                    onClick={() => {
                      setWizardPeriod('May 2026');
                      setWizardSuccessPayload(null);
                      setConfirmWizardCheckbox(false);
                      setShowPrepareWizard(true);
                    }}
                    className="text-[10px] text-red-600 hover:rose-800 font-bold underline cursor-pointer"
                  >
                    Prepare
                  </button>
                </div>
              </div>

              {/* Card 4: Carryforward Credit */}
              <div className="p-5 flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                    Carryforward Credit
                  </span>
                  <h3 className="text-xl font-extrabold font-mono text-slate-900 tracking-tight mt-1.5">
                    {formatNaira(carryforwardCredit)}
                  </h3>
                </div>
                <span className="text-[9.5px] leading-relaxed text-slate-500 block mt-4 bg-slate-50 p-2 rounded border border-slate-100 font-normal">
                  Applied credit (claims larger than collected previous period)
                </span>
              </div>

            </div>
          </div>

          {/* Section 2: VAT Filing Calendar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">VAT Compliance Filing Calendar</h3>
              <p className="text-xs text-slate-500">Track and file standard legal periodic returns to ensure exemption compliance.</p>
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
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                  {returns.map(row => (
                    <tr 
                      key={row.period} 
                      className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedReturnDetails(row);
                      }}
                    >
                      <td className="py-3 px-3 font-semibold text-slate-800">{row.period}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{row.filingDeadline}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">{formatNaira(row.outputVat)}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">{formatNaira(row.inputVat)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-950">{formatNaira(row.netVatDue)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                          row.status === 'Due' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          row.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-emerald-50 text-emerald-800 border-emerald-100'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {row.status !== 'Filed' ? (
                          <button
                            onClick={() => {
                              setWizardPeriod(row.period);
                              setConfirmWizardCheckbox(false);
                              setWizardSuccessPayload(null);
                              setShowPrepareWizard(true);
                            }}
                            className="px-2.5 py-1 bg-brand-purple text-white text-[10px] font-extrabold rounded hover:opacity-90 cursor-pointer shadow-3xs"
                          >
                            Prepare Return
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedReturnDetails(row)}
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

            <div className="flex items-center gap-2 p-3 bg-purple-50/40 border border-purple-100 rounded-lg text-[11px] text-brand-purple leading-relaxed">
              <Info size={14} className="shrink-0 text-brand-purple" />
              <span><strong>Compliance Reminder:</strong> Standard SME monthly returns must be filed and paid within <strong>21 days after the end of each month</strong> to avoid penalty schedules.</span>
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
              <p className="text-xs text-slate-500">Configure corporate returns, double check NRS audit logs, and download official receipts.</p>
            </div>
            
            <button
              onClick={() => {
                setWizardPeriod('May 2026');
                setConfirmWizardCheckbox(false);
                setWizardSuccessPayload(null);
                setShowPrepareWizard(true);
              }}
              className="px-3.5 py-1.5 bg-brand-purple hover:bg-opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus size={13} />
              <span>Prepare VAT Return</span>
            </button>
          </div>

          <div className="space-y-3">
            {returns.map(ret => (
              <div key={ret.period} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-all shadow-3xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400 shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{ret.period} Period VAT</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Deadline: {ret.filingDeadline}</p>
                    {ret.referenceNumber && (
                      <span className="font-mono text-[9px] text-purple-600 font-bold block mt-1.5">
                        Ref Code: {ret.referenceNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end">
                  <div className="text-right font-mono">
                    <span className="block text-[8px] text-slate-400 font-sans font-semibold uppercase">Net VAT</span>
                    <strong className="text-slate-900 text-xs">{formatNaira(ret.netVatDue)}</strong>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase border rounded-md ${
                    ret.status === 'Filed' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                    ret.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {ret.status}
                  </span>

                  <button
                    onClick={() => {
                      if (ret.status === 'Filed') {
                        setSelectedReturnDetails(ret);
                      } else {
                        setWizardPeriod(ret.period);
                        setConfirmWizardCheckbox(false);
                        setWizardSuccessPayload(null);
                        setShowPrepareWizard(true);
                      }
                    }}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-brand-purple hover:border-brand-purple rounded-lg text-[10px] font-extrabold cursor-pointer"
                  >
                    {ret.status === 'Filed' ? 'View' : 'Prepare'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* --- TAB 3: INPUT VAT PANEL --- */}
      {activeTab === 'input' && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">Input VAT Register</h3>
            <p className="text-xs text-slate-400 mt-0.5">VAT you paid on purchases that you can claim back from the Revenue Service.</p>
          </div>

          <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Input VAT this period</span>
              <h2 className="text-2xl font-black font-mono text-slate-950 mt-1">{formatNaira(totalInputVatForMay)}</h2>
            </div>
            <span className="text-[11px] text-slate-500 bg-white border border-slate-200/60 p-2.5 rounded-lg max-w-[280px] leading-relaxed">
              Ensure all input claims contain authentic physical supplier tax invoicing documents.
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right text-brand-purple font-bold">VAT Paid</th>
                  <th className="py-2.5 px-3 text-center">Claimable?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                {purchases.map(row => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-slate-50/40 transition-all cursor-pointer"
                    onClick={() => setSelectedPurchase(row)}
                  >
                    <td className="py-3 px-3 text-slate-400 font-mono">{row.date}</td>
                    <td className="py-3 px-3 text-slate-900 font-bold">{row.supplier}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">{formatNaira(row.amount)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-950">{formatNaira(row.vatPaid)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.claimable === 'Yes' 
                          ? 'bg-emerald-50 text-emerald-700 font-black' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {row.claimable}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* --- TAB 4: OUTPUT VAT PANEL --- */}
      {activeTab === 'output' && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">Output VAT Register</h3>
            <p className="text-xs text-slate-400 mt-0.5">VAT you charged customers on sales.</p>
          </div>

          <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Output VAT this period</span>
              <h2 className="text-2xl font-black font-mono text-slate-950 mt-1">{formatNaira(totalOutputVatForMay)}</h2>
            </div>
            <span className="text-[11px] text-slate-500 bg-white border border-slate-200/60 p-2.5 rounded-lg max-w-[280px] leading-relaxed">
              Standard FIRS compliance mandates automated 7.5% outward pricing rates on standard products.
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Invoice Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">VAT Type</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right text-purple-600 font-bold">VAT Charged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                {sales.map(row => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-slate-50/40 transition-all cursor-pointer"
                    onClick={() => setSelectedSale(row)}
                  >
                    <td className="py-3 px-3 text-slate-400 font-mono">{row.date}</td>
                    <td className="py-3 px-3 text-slate-800 font-bold font-mono">{row.invoiceNumber}</td>
                    <td className="py-3 px-3 text-slate-900 font-bold">{row.customer}</td>
                    <td className="py-3 px-3 text-slate-500 text-[10px] font-bold">{row.vatType}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">{formatNaira(row.amount)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-950">{formatNaira(row.vatCharged)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* --- TAB 5: REPORTS PANEL --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">VAT Analytical Reports</h3>
              <p className="text-xs text-slate-500">Live, on-screen dynamic visual aggregates tracking tax trends and ratings.</p>
            </div>

            <button
              onClick={() => {
                onAction('Initiating XLS/CSV cross-audit report extraction sequence...');
                alert('Success: Complete VAT report exported successfully in Microsoft Excel format.');
              }}
              className="px-3.5 py-1.5 border border-slate-200 hover:border-brand-purple text-slate-700 hover:text-brand-purple text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer shadow-3xs"
            >
              <Download size={13} />
              <span>Export Reports</span>
            </button>
          </div>

          {/* Visual Row 1: Bar Chart (VAT Collected/Paid) & Pie Chart (Breakdown) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visual 1: Trend Bar Chart */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3.5">
              <div>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-tight">Report 1: VAT Monthly Trend</h4>
                <p className="text-[11px] text-slate-400 font-medium">Outward Collected vs Recovered Input margins over time.</p>
              </div>

              {/* Chart container */}
              <div className="h-[230px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report1TrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontStyle="mono" />
                    <YAxis stroke="#94A3B8" fontSize={10} fontStyle="mono" />
                    <Tooltip cursor={{ fill: 'rgba(124, 58, 237, 0.04)' }} />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                    <Bar dataKey="Collected" fill="#8B5CF6" radius={[2, 2, 0, 0]} name="VAT Collected (Sales)" />
                    <Bar dataKey="Paid" fill="#14B8A6" radius={[2, 2, 0, 0]} name="VAT Paid (Purchases)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Visual 2: Pie Chart Breakdown */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3.5">
              <div>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-tight">Report 3: Sales VAT Class Breakdown</h4>
                <p className="text-[11px] text-slate-400 font-medium">Breakdown of gross sales divided under statutory rating codes.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 h-[230px] font-sans">
                <div className="h-full w-full sm:w-1/2 text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={report3BreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {report3BreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatNaira(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full sm:w-1/2 space-y-2">
                  {report3BreakdownData.map(item => (
                    <div key={item.name} className="flex items-start gap-2.5 p-1 rounded hover:bg-slate-50">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: item.color }} />
                      <div className="font-sans">
                        <span className="block text-[10px] text-slate-600 font-bold">{item.name}</span>
                        <strong className="block text-slate-900 text-[11px] font-mono">{formatNaira(item.value)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* On-Screen Table: Report 2: VAT Annual Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-tight">Report 2: VAT Annual Summary (2026)</h4>
              <p className="text-xs text-slate-500">Consolidated on-screen statutory breakdown matching annual filings.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3 text-right">VAT Collected</th>
                    <th className="py-2.5 px-3 text-right">VAT Paid</th>
                    <th className="py-2.5 px-3 text-right">Net Liability</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {report1TrendData.map(row => (
                    <tr key={row.name} className="hover:bg-slate-50/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{row.name} 2026</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatNaira(row.Collected)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatNaira(row.Paid)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-950">{formatNaira(row.Net)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          row.name === 'May' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                        }`}>
                          {row.name === 'May' ? 'Due' : 'Filed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Totals Row */}
                  <tr className="bg-slate-50/60 font-bold border-t border-slate-200">
                    <td className="py-3 px-3 uppercase text-slate-500 text-[10px]">Total (YTD)</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-950">{formatNaira(report2Totals.Collected)}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-950">{formatNaira(report2Totals.Paid)}</td>
                    <td className="py-3 px-3 text-right font-mono text-brand-purple text-sm font-black">{formatNaira(report2Totals.Net)}</td>
                    <td className="py-3 px-3 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* --- PREPARE RETURN MODAL / WIZARD --- */}
      {showPrepareWizard && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in font-sans">
            
            {/* Header */}
            <div className="px-5 py-4 bg-slate-50 border-b border-subtle flex justify-between items-center">
              <span className="font-extrabold text-slate-950 text-sm capitalize">
                Statutory Return Wizard ({wizardPeriod})
              </span>
              <button 
                onClick={() => setShowPrepareWizard(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X size={15} />
              </button>
            </div>

            {/* Inner Wizard Body */}
            {wizardSuccessPayload ? (
              <div className="p-6 text-center space-y-4">
                <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">VAT Return Submitted Successfully</h4>
                  <p className="text-xs text-slate-400 mt-1">Your compliance report has been registered by the NRS network.</p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-lg text-left font-mono space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Reference:</span>
                    <strong className="text-slate-800">{wizardSuccessPayload.reference}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Net Settled:</span>
                    <strong className="text-slate-800">{formatNaira(netPayableWithCredit)}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Filer TIN:</span>
                    <strong className="text-slate-800">{formData.tin || 'Unverified'}</strong>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 justify-center">
                  <button
                    onClick={() => {
                      onAction('Simulating PDF certification load...');
                      alert('FIRS Audit Certification downloaded successfully.');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Download Receipt (PDF)
                  </button>
                  <button
                    onClick={() => setShowPrepareWizard(false)}
                    className="px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmitReturnToNRS} className="p-5 space-y-4 text-xs font-medium">
                
                {/* Period selector dropdown */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[9px]">Filing Period</label>
                  <select
                    value={wizardPeriod}
                    onChange={(e) => setWizardPeriod(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-700 focus:outline-none focus:border-brand-purple text-xs font-semibold"
                  >
                    <option value="May 2026">May 2026 (Active Window)</option>
                    <option value="April 2026">April 2026</option>
                  </select>
                </div>

                {/* Auto Calculated Summary */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-2 font-sans font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Output VAT (collected)</span>
                    <span className="font-mono text-slate-900">{formatNaira(totalOutputVatForMay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input VAT (paid claims)</span>
                    <span className="font-mono text-slate-900">- {formatNaira(totalInputVatForMay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Previous Carryforward Credit</span>
                    <span className="font-mono text-slate-900">- {formatNaira(carryforwardCredit)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-950">
                    <span>Net VAT to Pay</span>
                    <span className="font-mono text-brand-purple">{formatNaira(netPayableWithCredit)}</span>
                  </div>
                </div>

                {/* Confirm Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="checkbox-confirm"
                    required
                    checked={confirmWizardCheckbox}
                    onChange={(e) => setConfirmWizardCheckbox(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 accent-[#7C3AED]"
                  />
                  <label htmlFor="checkbox-confirm" className="text-slate-400 leading-relaxed font-semibold">
                    I confirm that the output sales totals and eligible claimed inputs are fully reconciled and aligned with lawful declarations.
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onSaveReturnDraft}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold cursor-pointer"
                  >
                    Save for Later
                  </button>
                  <button
                    type="submit"
                    disabled={!confirmWizardCheckbox}
                    className="px-4 py-2 bg-brand-purple text-white rounded-lg font-bold hover:bg-opacity-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Submit to NRS
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* --- DETAIL MODAL: CHOSEN PURCHASE ROW (TAB 3) --- */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-slate-950 uppercase tracking-widest">Purchase Claims Audit</span>
              <button onClick={() => setSelectedPurchase(null)} className="text-slate-400 hover:text-slate-600"><X size={15} /></button>
            </div>
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">Claims supplier:</span>
                <strong className="text-slate-900">{selectedPurchase.supplier}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Logged on date:</span>
                <span className="text-slate-600 font-mono">{selectedPurchase.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Purchase:</span>
                <strong className="text-slate-900 font-mono">{formatNaira(selectedPurchase.amount)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Input VAT margin:</span>
                <strong className="text-brand-purple font-mono">{formatNaira(selectedPurchase.vatPaid)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Allowed exemption claim:</span>
                <span className="font-bold text-slate-700">{selectedPurchase.claimable === 'Yes' ? 'Yes ✓' : 'No'}</span>
              </div>
              {selectedPurchase.notes && (
                <div className="p-2.5 bg-slate-50 rounded text-slate-500 leading-relaxed font-medium">
                  <strong>Notes:</strong> {selectedPurchase.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- DETAIL MODAL: CHOSEN SALE ROW (TAB 4) --- */}
      {selectedSale && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-slate-950 uppercase tracking-widest">Outward Invoice Details</span>
              <button onClick={() => setSelectedSale(null)} className="text-slate-400 hover:text-slate-600"><X size={15} /></button>
            </div>
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice Ref:</span>
                <strong className="text-slate-900 font-mono">{selectedSale.invoiceNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <strong className="text-slate-900">{selectedSale.customer}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date Issued:</span>
                <span className="text-slate-600 font-mono">{selectedSale.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">VAT Rating Type:</span>
                <strong className="text-slate-800 font-semibold">{selectedSale.vatType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pre-Tax sales total:</span>
                <strong className="text-slate-900 font-mono">{formatNaira(selectedSale.amount)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">VAT charged (7.5%):</span>
                <strong className="text-brand-purple font-mono">{formatNaira(selectedSale.vatCharged)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAIL MODAL: RETURN DETAILS VIEW (CALENDAR/TAB 2) --- */}
      {selectedReturnDetails && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-2xl p-5 space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-slate-950 uppercase tracking-widest">Filing Compliance Log</span>
              <button onClick={() => setSelectedReturnDetails(null)} className="text-slate-400 hover:text-slate-600"><X size={15} /></button>
            </div>
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">Declaration Period:</span>
                <strong className="text-slate-950">{selectedReturnDetails.period}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Submitted status:</span>
                <span className="text-emerald-700 font-black">{selectedReturnDetails.status} ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">VAT Collected:</span>
                <span className="font-mono font-bold text-slate-800">{formatNaira(selectedReturnDetails.outputVat)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Claims Credited:</span>
                <span className="font-mono font-bold text-slate-800">- {formatNaira(selectedReturnDetails.inputVat)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Net Settled:</span>
                <strong className="text-brand-purple font-mono font-black">{formatNaira(selectedReturnDetails.netVatDue)}</strong>
              </div>
              {selectedReturnDetails.referenceNumber && (
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100 font-mono text-[9px] text-center space-y-1">
                  <span className="text-slate-400 block font-semibold uppercase font-sans">NRS Official Digital Token</span>
                  <strong className="text-slate-800 text-[10px]">{selectedReturnDetails.referenceNumber}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
