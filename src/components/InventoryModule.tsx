import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRightLeft, 
  Plus, 
  Upload, 
  Search, 
  Sliders, 
  LayoutGrid, 
  List, 
  Edit3, 
  Copy, 
  History, 
  Trash2, 
  MoreVertical, 
  Check, 
  X, 
  Building2, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  PieChart, 
  FileSpreadsheet, 
  Calendar,
  AlertCircle,
  Image,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SignupState } from '../types';

interface InventoryModuleProps {
  inventoryItems: Array<{ id: string; name: string; qty: number; cost: number; threshold: number }>;
  setInventoryItems: React.Dispatch<React.SetStateAction<any[]>>;
  onAction: (msg: string) => void;
  formData: SignupState;
}

// Fixed categories for materials
const CATEGORIES = ['Compounds', 'Resins', 'Catalysts', 'Packaging'];

const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
  'SKU-801': 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80', // Speckled, terracotta & green ceramic canister jars (URONI) - industrial silica
  'SKU-802': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', // Loona/Tanker sage green and light lavendar/blue duo - polymer resin
  'SKU-803': 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80', // TESU twisted white flask with dark green cover and metal straw - organic catalyst
  'SKU-804': 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80', // Matte beige detergent bottle with loop handle and brown cap - packaging roll
  'SKU-805': 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80', // Tanker sage green and grey duo containers - epoxy hardener
  'SKU-806': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80', // Matte clay storage containers - carbon powder
  'SKU-807': 'https://images.unsplash.com/photo-1590156546946-ce55a12a63ee?auto=format&fit=crop&w=600&q=80', // Grey loona bottle container held in hand - stretch wrap
  'SKU-808': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80', // Modern olive green container bottle - monomer
  'SKU-809': 'https://images.unsplash.com/photo-1505944275645-e161a0f5168b?auto=format&fit=crop&w=600&q=80', // Elegant aesthetic earthen natural jars - pigment
  'SKU-810': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80', // Violet purple loona style minimal bottle - acetone solvent
  'SKU-811': 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80', // Modern gray sleek container - silicone release agent
};

const getProductImage = (item: any) => {
  return item.image || DEFAULT_PRODUCT_IMAGES[item.id] || null;
};

const renderProductImageOrPlaceholder = (item: any, heightClass: string = "h-24") => {
  const imgSrc = getProductImage(item);
  const categoryOfItem = item.name?.toLowerCase().includes('compound') || item.name?.toLowerCase().includes('hardener') || item.name?.toLowerCase().includes('powder') ? 'Compounds' :
                         item.name?.toLowerCase().includes('resin') || item.name?.toLowerCase().includes('monomer') || item.name?.toLowerCase().includes('pigment') ? 'Resins' :
                         item.name?.toLowerCase().includes('catalyst') || item.name?.toLowerCase().includes('solvent') || item.name?.toLowerCase().includes('agent') ? 'Catalysts' : 'Packaging';

  if (imgSrc) {
    return (
      <div className={`w-full ${heightClass} rounded-xl bg-slate-50 border border-slate-200 shadow-xs overflow-hidden select-none relative group`}>
        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
      </div>
    );
  }

  // Beautiful placeholder styling
  return (
    <div className={`w-full ${heightClass} rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-xs flex flex-col items-center justify-center p-3 select-none text-center relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      <div className={`p-2.5 rounded-xl mb-1.5 z-10 ${
        categoryOfItem === 'Compounds' ? 'bg-purple-50 text-brand-purple' :
        categoryOfItem === 'Resins' ? 'bg-blue-50 text-blue-600' :
        categoryOfItem === 'Catalysts' ? 'bg-amber-50 text-amber-600' :
        'bg-slate-100 text-slate-500'
      }`}>
        <Package size={20} />
      </div>
      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider z-10">{categoryOfItem} Placeholder</span>
    </div>
  );
};

// Multi-location definitions
const LOCATIONS = [
  { id: 'loc-1', name: 'Main Depot (Lagos)' },
  { id: 'loc-2', name: 'West Warehouse' },
  { id: 'loc-3', name: 'Port Hub Terminal' }
];

export function CustomSelect({
  options,
  value,
  onChange,
  className = '',
  placeholder = 'Select option...',
  disabled = false,
  fullWidth = true
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div ref={containerRef} className={`relative select-none ${fullWidth ? 'w-full' : ''} ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border ${
          isOpen ? 'border-brand-purple ring-1 ring-brand-purple' : 'border-slate-200'
        } px-3 py-2 rounded-lg text-slate-800 text-xs font-semibold cursor-pointer outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform duration-250 shrink-0 ml-1.5 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-slate-200"
          >
            <div className="p-1 space-y-0.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-50 text-brand-purple' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check size={11} className="text-brand-purple shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Movement {
  id: string;
  date: string;
  type: 'Purchase' | 'Sale' | 'Adjustment' | 'Transfer' | 'Return';
  productName: string;
  productId: string;
  qty: number;
  reference: string;
  reason: string;
  user: string;
  status: 'Completed' | 'Reversed';
}

export default function InventoryModule({ 
  inventoryItems, 
  setInventoryItems, 
  onAction, 
  formData 
}: InventoryModuleProps) {
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'stock' | 'reconciliation' | 'reports'>('overview');

  // Common Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVatClass, setSelectedVatClass] = useState('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState('All');
  const [productViewMode, setProductViewMode] = useState<'grid' | 'list'>('grid');

  // List of mock movements
  const [movements, setMovements] = useState<Movement[]>([
    { id: 'MOV-01', date: '2026-05-28', type: 'Purchase', productName: 'Synthetic Polymer Resin', productId: 'SKU-802', qty: 20, reference: 'PO-2026-05A', reason: 'Supplier Replenishment', user: 'John Doe', status: 'Completed' },
    { id: 'MOV-02', date: '2026-05-27', type: 'Sale', productName: 'Industrial Silica Compound', productId: 'SKU-801', qty: -5, reference: 'INV-2026-441', reason: 'Retail POS Sale', user: 'POS terminal', status: 'Completed' },
    { id: 'MOV-03', date: '2026-05-26', type: 'Adjustment', productName: 'Standard Epoxy Hardener', productId: 'SKU-805', qty: -2, reference: 'ADJ-842', reason: 'Damaged packaging write-off', user: 'John Doe', status: 'Completed' },
    { id: 'MOV-04', date: '2026-05-25', type: 'Transfer', productName: 'Organic Catalyst Solutions', productId: 'SKU-803', qty: 10, reference: 'TRF-102', reason: 'Stock balance transfer to West Depot', user: 'John Doe', status: 'Completed' }
  ]);

  // Product Selection/Detail Modal state
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Active form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  // Form tab focus
  const [formActiveTab, setFormActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'settings'>('basic');

  // Form Fields State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Compounds');
  const [formUnit, setFormUnit] = useState('Pieces');
  const [formBarcode, setFormBarcode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCostPrice, setFormCostPrice] = useState('10000');
  const [formSellingPrice, setFormSellingPrice] = useState('15000');
  const [formHasVariants, setFormHasVariants] = useState(false);
  const [formReorderLevel, setFormReorderLevel] = useState('10');
  const [formReorderQty, setFormReorderQty] = useState('50');
  const [formVatClass, setFormVatClass] = useState('Standard 7.5%');
  const [formTrackSerial, setFormTrackSerial] = useState(false);
  const [formDiscontinued, setFormDiscontinued] = useState(false);
  const [formImage, setFormImage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Location Transfer states
  const [trfFrom, setTrfFrom] = useState('loc-1');
  const [trfTo, setTrfTo] = useState('loc-2');
  const [trfProduct, setTrfProduct] = useState('');
  const [trfQty, setTrfQty] = useState('5');
  const [trfNotes, setTrfNotes] = useState('');

  // Manual Adjustment states
  const [adjProduct, setAdjProduct] = useState('');
  const [adjType, setAdjType] = useState('Increase');
  const [adjQty, setAdjQty] = useState('5');
  const [adjReason, setAdjReason] = useState('Found Stock');
  const [adjNotes, setAdjNotes] = useState('');

  // Stock-take reconciliation states (3-step wizard)
  const [stockTakeStep, setStockTakeStep] = useState<1 | 2 | 3>(1);
  const [stockTakeDate, setStockTakeDate] = useState('2026-05-30');
  const [stockTakeLocation, setStockTakeLocation] = useState('loc-1');
  const [stockTakeSupervisor, setStockTakeSupervisor] = useState('John Doe');
  const [stockTakeCounts, setStockTakeCounts] = useState<Record<string, number>>({});
  const [stockTakeReasons, setStockTakeReasons] = useState<Record<string, string>>({});
  const [stockTakeApproved, setStockTakeApproved] = useState<Record<string, boolean>>({});

  // Active generated report visualization
  const [activeReportType, setActiveReportType] = useState<string | null>(null);

  // Performance and Restock States
  const [performanceTimeframe, setPerformanceTimeframe] = useState<'week' | 'month' | 'all'>('month');
  const [restockProduct, setRestockProduct] = useState<any | null>(null);
  const [restockQtyToAdd, setRestockQtyToAdd] = useState<string>('50');
  const [editingProductName, setEditingProductName] = useState<string>('');
  const [editingProductCost, setEditingProductCost] = useState<string>('');
  const [editingProductThreshold, setEditingProductThreshold] = useState<string>('');

  // Computed general statistics
  const totalStockCost = useMemo(() => {
    return inventoryItems.reduce((sum, item) => sum + (item.qty * item.cost), 0);
  }, [inventoryItems]);

  const lowStockCount = useMemo(() => {
    return inventoryItems.filter(item => item.qty <= item.threshold).length;
  }, [inventoryItems]);

  const turnoverRatio = useMemo(() => {
    return 4.2; // Annual Turnover Standard representation
  }, []);

  // Format currency
  const formatNairaVal = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  };

  // Filter items
  const filteredProducts = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const categoryOfItem = item.name.toLowerCase().includes('compound') || item.name.toLowerCase().includes('hardener') || item.name.toLowerCase().includes('powder') ? 'Compounds' :
                             item.name.toLowerCase().includes('resin') || item.name.toLowerCase().includes('monomer') || item.name.toLowerCase().includes('pigment') ? 'Resins' :
                             item.name.toLowerCase().includes('catalyst') || item.name.toLowerCase().includes('solvent') || item.name.toLowerCase().includes('agent') ? 'Catalysts' : 'Packaging';
      
      const matchesCategory = selectedCategory === 'All' || categoryOfItem === selectedCategory;
      const matchesVat = selectedVatClass === 'All' || (selectedVatClass === 'Standard' && item.id !== 'SKU-810') || (selectedVatClass === 'Zero-Rated' && item.id === 'SKU-810');
      
      const status = item.qty === 0 ? 'Out' : item.qty <= item.threshold ? 'Low' : 'In';
      const matchesStatus = selectedStockStatus === 'All' || selectedStockStatus === status;

      return matchesSearch && matchesCategory && matchesVat && matchesStatus;
    });
  }, [inventoryItems, searchQuery, selectedCategory, selectedVatClass, selectedStockStatus]);

  // Memoized detailed holding values by category and status
  const categoryHoldingValues = useMemo(() => {
    const values: Record<string, number> = { Compounds: 0, Resins: 0, Catalysts: 0, Packaging: 0 };
    inventoryItems.forEach(item => {
      const categoryOfItem = item.name.toLowerCase().includes('compound') || item.name.toLowerCase().includes('hardener') || item.name.toLowerCase().includes('powder') ? 'Compounds' :
                             item.name.toLowerCase().includes('resin') || item.name.toLowerCase().includes('monomer') || item.name.toLowerCase().includes('pigment') ? 'Resins' :
                             item.name.toLowerCase().includes('catalyst') || item.name.toLowerCase().includes('solvent') || item.name.toLowerCase().includes('agent') ? 'Catalysts' : 'Packaging';
      values[categoryOfItem] = (values[categoryOfItem] || 0) + (item.qty * item.cost);
    });
    return values;
  }, [inventoryItems]);

  const stockHealthMetrics = useMemo(() => {
    const outOfStock = inventoryItems.filter(item => item.qty === 0).length;
    const lowStock = inventoryItems.filter(item => item.qty > 0 && item.qty <= item.threshold).length;
    const adequateStock = inventoryItems.filter(item => item.qty > item.threshold).length;
    return { outOfStock, lowStock, adequateStock };
  }, [inventoryItems]);

  // Handle Autogenerate SKU Code
  const autogenerateSKU = () => {
    const num = Math.floor(100 + Math.random() * 900);
    setFormBarcode(`BAR-800-${num}`);
    setFormId(`SKU-8${num}`);
  };

  // Restock Low stock trigger - triggers custom modal allowing edits & increasing quantity
  const triggerRestock = (item: any) => {
    setRestockProduct(item);
    setRestockQtyToAdd((item.threshold * 3).toString());
    setEditingProductName(item.name || '');
    setEditingProductCost((item.cost || 0).toString());
    setEditingProductThreshold((item.threshold || 10).toString());
  };

  const handleConfirmRestock = () => {
    if (!restockProduct) return;
    const addedQty = parseInt(restockQtyToAdd) || 0;
    const parsedCost = parseFloat(editingProductCost) || 0;
    const parsedThreshold = parseInt(editingProductThreshold) || 10;

    setInventoryItems(prev => prev.map(inv => {
      if (inv.id === restockProduct.id) {
        return {
          ...inv,
          name: editingProductName,
          cost: parsedCost,
          threshold: parsedThreshold,
          qty: inv.qty + addedQty
        };
      }
      return inv;
    }));

    if (addedQty > 0) {
      const newMovement: Movement = {
        id: `MOV-${Math.floor(10 + Math.random() * 90)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Purchase',
        productName: editingProductName,
        productId: restockProduct.id,
        qty: addedQty,
        reference: `PO-REF-${Math.floor(1000 + Math.random() * 9000)}`,
        reason: 'Restock replenishment',
        user: 'John Doe',
        status: 'Completed'
      };
      setMovements(prev => [newMovement, ...prev]);
    }

    onAction(`Successfully restocked ${editingProductName}: added ${addedQty} units, updated price & threshold`);
    setRestockProduct(null);
  };

  // Memoized dynamic product performance metrics matching selected timeframe filter
  const performanceData = useMemo(() => {
    return inventoryItems.map((item, idx) => {
      // Deterministic but realistic pseudo-random sales volume per item based on timeframe
      const itemHash = item.id.split('-')[1] ? parseInt(item.id.split('-')[1]) : idx + 5;
      const baseSales = (itemHash % 25) + 8; // e.g. 8 to 32
      
      let unitsSold = 0;
      if (performanceTimeframe === 'week') {
        unitsSold = Math.round(baseSales * 0.8) + 3;
      } else if (performanceTimeframe === 'month') {
        unitsSold = Math.round(baseSales * 3.5) + 12;
      } else { // 'all'
        unitsSold = Math.round(baseSales * 18.2) + 65;
      }

      const totalRevenue = unitsSold * item.cost * 1.5;
      const marginPercent = 33.3;

      return {
        ...item,
        unitsSold,
        totalRevenue,
        marginPercent
      };
    }).sort((a, b) => b.unitsSold - a.unitsSold);
  }, [inventoryItems, performanceTimeframe]);

  // Handle Form Submission (Add or Edit)
  const handleSubmitProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName || !formCostPrice) return;

    const parsedCost = parseFloat(formCostPrice) || 0;
    const parsedQty = 0; // Starts with 0 until stock-take or adjustment

    if (isEditing) {
      setInventoryItems(prev => prev.map(inv => inv.id === formId ? { 
        ...inv, 
        name: formName, 
        cost: parsedCost, 
        threshold: parseInt(formReorderLevel) || 10,
        image: formImage
      } : inv));

      // Append edit stock movement log
      const log: Movement = {
        id: `MOV-${Math.floor(10 + Math.random() * 90)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Adjustment',
        productName: formName,
        productId: formId,
        qty: 0,
        reference: `SYS-UPD`,
        reason: `Product specification fields update`,
        user: 'John Doe',
        status: 'Completed'
      };
      setMovements(prev => [log, ...prev]);
      onAction(`Product metadata updated: ${formName}`);
    } else {
      // Check duplicate
      if (inventoryItems.some(inv => inv.id === formId)) {
        alert('Product with this SKU already exists');
        return;
      }
      const newItem = {
        id: formId,
        name: formName,
        qty: parsedQty,
        cost: parsedCost,
        threshold: parseInt(formReorderLevel) || 10,
        image: formImage
      };
      setInventoryItems(prev => [newItem, ...prev]);
      onAction(`Product registered successfully: ${formName} (${formId})`);
    }

    setShowAddModal(false);
    resetForm();
  };

  // Open Edit form pre-populated
  const openEditProduct = (item: any) => {
    setFormId(item.id);
    setFormName(item.name);
    setFormCostPrice(item.cost.toString());
    setFormSellingPrice((item.cost * 1.5).toString());
    setFormReorderLevel(item.threshold.toString());
    setFormReorderQty((item.threshold * 3).toString());
    setFormImage(item.image || '');
    setIsEditing(true);
    setFormActiveTab('basic');
    setShowAddModal(true);
  };

  // Reset form helper
  const resetForm = () => {
    setFormId('');
    setFormName('');
    setFormCategory('Compounds');
    setFormUnit('Pieces');
    setFormBarcode('');
    setFormDescription('');
    setFormCostPrice('10000');
    setFormSellingPrice('15000');
    setFormHasVariants(false);
    setFormReorderLevel('10');
    setFormReorderQty('50');
    setFormVatClass('Standard 7.5%');
    setFormTrackSerial(false);
    setFormDiscontinued(false);
    setFormImage('');
    setIsEditing(false);
  };

  // Delete product action helper
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to completely delete ${name}?`)) {
      setInventoryItems(prev => prev.filter(inv => inv.id !== id));
      onAction(`Product removed from system registry: ${name}`);
    }
  };

  // Inter-location Stock Transfer submit
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trfProduct || !trfQty) return;

    const parsedQty = parseInt(trfQty);
    if (isNaN(parsedQty) || parsedQty <= 0) return;

    const item = inventoryItems.find(inv => inv.id === trfProduct);
    if (!item || item.qty < parsedQty) {
      alert(`Transfer failed: Insufficient physical balance for the selected item.`);
      return;
    }

    // Since we track location counts, we simply report and document the transfer log
    const fromLocName = LOCATIONS.find(l => l.id === trfFrom)?.name || 'Depot';
    const toLocName = LOCATIONS.find(l => l.id === trfTo)?.name || 'Depot';

    const newMov: Movement = {
      id: `TRF-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Transfer',
      productName: item.name,
      productId: item.id,
      qty: -parsedQty,
      reference: `TRF-${fromLocName[0]}${toLocName[0]}-26`,
      reason: `Inter-location stock shift: ${fromLocName} → ${toLocName}. ${trfNotes}`,
      user: 'John Doe',
      status: 'Completed'
    };

    setMovements(prev => [newMov, ...prev]);
    setShowTransferModal(false);
    setTrfProduct('');
    setTrfQty('5');
    setTrfNotes('');
    onAction(`Stock Transfer Registered: ${parsedQty} units of ${item.name}`);
  };

  // Manual Stock count Adjustment submit
  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjProduct || !adjQty) return;

    const parsedQty = parseInt(adjQty);
    if (isNaN(parsedQty) || parsedQty <= 0) return;

    const isDecrease = adjType === 'Decrease';
    const delta = isDecrease ? -parsedQty : parsedQty;

    const item = inventoryItems.find(inv => inv.id === adjProduct);
    if (!item) return;

    if (isDecrease && item.qty < parsedQty) {
      alert('Adjustment failed: Cannot adjust below zero balance.');
      return;
    }

    // Apply adjustment changes to global inventory list
    setInventoryItems(prev => prev.map(inv => inv.id === adjProduct ? { ...inv, qty: inv.qty + delta } : inv));

    const newMov: Movement = {
      id: `ADJ-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Adjustment',
      productName: item.name,
      productId: item.id,
      qty: delta,
      reference: `ADJ-REG-${Math.floor(1000 + Math.random() * 9000)}`,
      reason: `${adjReason}: ${adjNotes}`,
      user: 'John Doe',
      status: 'Completed'
    };

    setMovements(prev => [newMov, ...prev]);
    setShowAdjustmentModal(false);
    setAdjProduct('');
    setAdjQty('5');
    setAdjNotes('');
    onAction(`Adjustment verified: Adjusted ${item.name} by ${delta > 0 ? '+' : ''}${delta} units.`);
  };

  // Reverse Movement action helper
  const handleReverseMovement = (mov: Movement) => {
    if (mov.status === 'Reversed') return;
    if (confirm(`Are you sure you want to reverse transaction ${mov.id}? This will restore exact quantities.`)) {
      
      // Rollback count changes
      setInventoryItems(prev => prev.map(inv => {
        if (inv.id === mov.productId) {
          return { ...inv, qty: inv.qty - mov.qty }; // Subtract the posted delta
        }
        return inv;
      }));

      // Update log line status
      setMovements(prev => prev.map(m => m.id === mov.id ? { ...m, status: 'Reversed' } : m));
      onAction(`Reversed transaction reference ${mov.id}: restored ${Math.abs(mov.qty)} units.`);
    }
  };

  // Start Stock-take procedure
  const handleStartStockTake = () => {
    const freshCounts: Record<string, number> = {};
    const freshReasons: Record<string, string> = {};
    const freshApproved: Record<string, boolean> = {};

    inventoryItems.forEach(item => {
      freshCounts[item.id] = item.qty; // snapping book balance as count defaults
      freshReasons[item.id] = 'Error Correction';
      freshApproved[item.id] = true;
    });

    setStockTakeCounts(freshCounts);
    setStockTakeReasons(freshReasons);
    setStockTakeApproved(freshApproved);
    setStockTakeStep(2);
    onAction('Stock-Take Initiated: Book balances locked.');
  };

  // Post Stocktake reconciliations
  const handlePostRecAdjustments = () => {
    let adjustmentsMade = 0;
    
    setInventoryItems(prev => prev.map(item => {
      const isApproved = stockTakeApproved[item.id];
      if (isApproved) {
        const physical = stockTakeCounts[item.id];
        const variance = physical - item.qty;
        
        if (variance !== 0) {
          adjustmentsMade++;
          // Register dynamic movement line
          const newMov: Movement = {
            id: `REC-${Math.floor(100 + Math.random() * 900)}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Adjustment',
            productName: item.name,
            productId: item.id,
            qty: variance,
            reference: `REC-STAKE-${stockTakeDate}`,
            reason: `Physical Count Reconciliation Variance: ${stockTakeReasons[item.id] || 'Shrinkage'}`,
            user: stockTakeSupervisor,
            status: 'Completed'
          };
          // Append in background/deferred
          setTimeout(() => setMovements(prev => [newMov, ...prev]), 50);
        }
        return { ...item, qty: physical };
      }
      return item;
    }));

    setStockTakeStep(1);
    onAction(`Stocktake posted! Adjusted ${adjustmentsMade} variances successfully.`);
  };

  // Simulated reports generator display
  const renderReportPanel = () => {
    if (!activeReportType) return null;

    let content = null;
    let title = '';

    switch (activeReportType) {
      case 'valuation':
        title = "Inventory Valuation Analysis Report";
        content = (
          <div className="space-y-4">
            <p className="text-[11px] text-slate-500">Computes current trading raw blocks utilizing standard IAS-8 {formData.inventoryMethod || 'FIFO'} accounting policies.</p>
            <div className="bg-slate-50 rounded-xl border p-4 space-y-2 border-slate-200 font-mono text-xs">
              <div className="flex justify-between border-b pb-2 font-sans font-bold">
                <span>SKU Item Code</span>
                <span>In Stock Qty</span>
                <span>Unit Cost Price</span>
                <span>Total Asset Balance</span>
              </div>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {inventoryItems.map(item => (
                  <div key={item.id} className="flex justify-between text-slate-600">
                    <span>{item.id}</span>
                    <span className="text-center w-24 ml-12">{item.qty} units</span>
                    <span>{formatNairaVal(item.cost)}</span>
                    <span className="font-bold text-slate-800">{formatNairaVal(item.qty * item.cost)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between font-bold text-brand-purple text-xs">
                <span>TOTAL VALUATION BALANCE AT COST:</span>
                <span>{formatNairaVal(totalStockCost)}</span>
              </div>
            </div>
          </div>
        );
        break;
      case 'ageing':
        title = "Inventory Stock Ageing Ratio Metrics";
        content = (
          <div className="space-y-4 text-xs font-sans">
            <p className="text-[11px] text-slate-500">Detects holding costs and locks alert profiles flags on slow moving items in shelves exceeds 90 days threshold boundary.</p>
            <div className="grid grid-cols-4 gap-2 text-center text-slate-600">
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                <span className="block font-bold text-slate-800">Fresh (0-30 days)</span>
                <span className="block text-emerald-700 font-black tracking-tight text-sm mt-1">72.4%</span>
                <span className="block text-[9px] text-slate-400">Stable assets</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="block font-bold text-slate-800">Mid (31-60 days)</span>
                <span className="block text-slate-700 font-black text-sm mt-1">18.5%</span>
                <span className="block text-[9px] text-slate-400">Regular items</span>
              </div>
              <div className="p-2.5 bg-yellow-50 border border-yellow-100 rounded-lg">
                <span className="block font-bold text-slate-800">Mature (61-90 days)</span>
                <span className="block text-yellow-700 font-black text-sm mt-1">6.8%</span>
                <span className="block text-[9px] text-slate-400">Warn review</span>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg">
                <span className="block font-bold text-slate-800">Stale (&gt;90 days)</span>
                <span className="block text-rose-700 font-black text-sm mt-1 animate-pulse">2.3%</span>
                <span className="block text-[9px] text-slate-400">High holding</span>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-2.5">
              <AlertCircle size={14} className="text-yellow-600 font-bold shrink-0" />
              <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                WARNING: SLA trigger detects SKU-804 has spent 114 days without active sales. Recommend markdown discount or return to suppliers.
              </p>
            </div>
          </div>
        );
        break;
      default:
        title = "Stock Report Module";
        content = <p className="text-xs text-slate-500">Generating standard system spreadsheet export metrics...</p>;
    }

    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 max-w-2xl w-full shadow-2xl space-y-4"
        >
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <PieChart size={16} className="text-brand-purple" />
              <span>{title}</span>
            </h3>
            <button onClick={() => setActiveReportType(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700">
              <X size={16} />
            </button>
          </div>
          
          {content}

          <div className="flex gap-2 justify-end pt-3 border-t">
            <button 
              onClick={() => setActiveReportType(null)}
              className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
            <button 
              onClick={() => {
                setActiveReportType(null);
                onAction(`Report print file successfully exported!`);
              }}
              className="px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Export Spreadsheet CSV
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Helper auto calculated pricing numbers
  const calculatedMarkup = useMemo(() => {
    const cost = parseFloat(formCostPrice) || 0;
    const sell = parseFloat(formSellingPrice) || 0;
    if (cost <= 0) return '0.00';
    return (((sell - cost) / cost) * 100).toFixed(2);
  }, [formCostPrice, formSellingPrice]);

  const calculatedMarginPercentage = useMemo(() => {
    const cost = parseFloat(formCostPrice) || 0;
    const sell = parseFloat(formSellingPrice) || 0;
    if (sell <= 0) return '0.00';
    return (((sell - cost) / sell) * 100).toFixed(2);
  }, [formCostPrice, formSellingPrice]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden text-xs">
      
      {/* Top Section Nav Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 py-1 flex justify-between items-center shrink-0">
        <div className="flex gap-1 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'Products Directory' },
            { id: 'stock', label: 'Stock Levels & Locations' },
            { id: 'reconciliation', label: 'Stock-Take Wizard' },
            { id: 'reports', label: 'Valuation Reports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchQuery('');
              }}
              className={`px-3 py-2 text-xs font-extrabold whitespace-nowrap rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-purple-50 text-brand-purple font-black shadow-xs border border-purple-100' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }} 
            className="px-3 py-1.5 bg-[#7C3AED] hover:bg-opacity-95 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shrink-0 shadow-sm"
          >
            <Plus size={11} /> Add Product
          </button>
        </div>
      </div>

      {/* Main Canvas Context of chosen tab */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
                     {/* Sec 1: 4 Cards Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stock Asset Value</p>
                <div className="text-lg font-black text-slate-900 font-mono tracking-tight">{formatNairaVal(totalStockCost)}</div>
                <p className="text-[9px] text-slate-400">Computed via standard {formData.inventoryMethod || 'FIFO'}</p>
              </div>

              <button 
                onClick={() => {
                  setSelectedStockStatus('Low');
                  setActiveTab('products');
                }}
                className="bg-white p-4.5 rounded-2xl border border-slate-200 hover:border-amber-200 shadow-xs space-y-1.5 text-left transition-all cursor-pointer group"
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-600">Low Stock Alarms</p>
                <div className="text-lg font-black text-amber-600 font-mono flex items-center gap-1.5">
                  <span>{lowStockCount} SKUs</span>
                  {lowStockCount > 0 && <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />}
                </div>
                <p className="text-[9px] text-brand-purple font-medium underline">Filter low-stock directory →</p>
              </button>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Movements (MTD)</p>
                <div className="text-lg font-black text-slate-900 font-mono">{movements.length} logs</div>
                <p className="text-[9px] text-slate-450 text-slate-400">Purchases + sales + adjust.</p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual Turnover Ratio</p>
                <div className="text-lg font-black text-emerald-600 font-mono">{turnoverRatio}x</div>
                <p className="text-[9px] text-slate-400">Total COGS / Average Stock</p>
              </div>

            </div>

            {/* Sec 1.5: Detailed Valuation by Category & Health (Additional Important Information) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <PieChart size={14} className="text-brand-purple" />
                    <span>Asset Capital Tied in Reserves</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Asset distribution across materials classes</p>
                </div>
                <div className="space-y-3">
                  {CATEGORIES.map(cat => {
                    const tiedCost = categoryHoldingValues[cat] || 0;
                    const percent = totalStockCost > 0 ? (tiedCost / totalStockCost) * 100 : 0;
                    return (
                      <div key={cat} className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-750 font-medium my-0.5">
                          <span>{cat}</span>
                          <span className="font-mono text-slate-900 font-bold">{formatNairaVal(tiedCost)} <span className="text-slate-400 text-[10px] font-normal">({percent.toFixed(1)}%)</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#7C3AED] h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Inventory SLA Health Profile</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Physical safety level status across all registry items</p>
                </div>
                <div className="grid grid-cols-3 gap-2.5 text-center my-2">
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl leading-snug">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Optimal</span>
                    <strong className="text-emerald-700 font-mono text-sm font-black block mt-1">{stockHealthMetrics.adequateStock}</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">SKUs safe</span>
                  </div>
                  <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl leading-snug">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Low Stock</span>
                    <strong className="text-amber-600 font-mono text-sm font-black block mt-1">{stockHealthMetrics.lowStock}</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Need restock</span>
                  </div>
                  <div className="p-3 bg-red-50/50 border border-red-100/50 rounded-xl leading-snug">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Out</span>
                    <strong className="text-rose-600 font-mono text-sm font-black block mt-1">{stockHealthMetrics.outOfStock}</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Deficit alert</span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-600 leading-normal">
                    💡 <strong className="text-slate-800">Operational Insight:</strong> Raw materials reserves show high stability. Compounds category holds the majority of active business assets. Ensure to restock low margin catalysts blocks early.
                  </p>
                </div>
              </div>
            </div>

            {/* Sec 2 & 3 Side by side layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Side: Product Performance tracker (with dynamic timeframe filters) */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-705 text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={14} className="text-brand-purple" />
                      <span>Product Sales Performance Report</span>
                    </h3>
                    <p className="text-[9px] text-slate-400 mt-0.5">Estimated volumetric sales velocity and asset turnover rates</p>
                  </div>
                  
                  {/* Dynamic Timeframe Tabs */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                    {(['week', 'month', 'all'] as const).map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setPerformanceTimeframe(tf)}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded capitalize transition-all cursor-pointer ${
                          performanceTimeframe === tf 
                            ? 'bg-white text-brand-purple shadow-xs' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {tf === 'all' ? 'All Time' : tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3 text-center">Units Sold</th>
                        <th className="py-2.5 px-3 text-right">Revenue</th>
                        <th className="py-2.5 px-3 text-center">In Stock</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                      {performanceData.slice(0, 5).map(item => (
                        <tr 
                          key={item.id} 
                          className="hover:bg-slate-50/40 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{item.id}</td>
                          <td 
                            onClick={() => setSelectedProduct(item)}
                            className="py-2.5 px-3 font-semibold text-slate-800 hover:text-brand-purple transition-all cursor-pointer truncate max-w-[180px]"
                            title={item.name}
                          >
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-600 font-bold font-mono text-[11px]">{item.unitsSold} units</td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900 font-mono text-[11px]">{formatNairaVal(item.totalRevenue)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono inline-block ${
                              item.qty <= item.threshold ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50/80 text-emerald-800'
                            }`}>
                              {item.qty} left
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {item.qty <= item.threshold ? (
                              <button
                                type="button"
                                onClick={() => triggerRestock(item)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 hover:text-amber-800 border border-amber-200 text-amber-700 rounded font-bold text-[9px] uppercase transition-colors shrink-0 cursor-pointer"
                              >
                                Restock
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase tracking-wide">Optimal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side: Low Stock Alerts widget list */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-extrabold text-xs text-rose-700 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <span>Low Stock Alerts</span>
                  </h3>
                  <button 
                    onClick={() => {
                      setSelectedStockStatus('Low');
                      setActiveTab('products');
                    }}
                    className="text-[9px] text-brand-purple hover:underline font-extrabold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-100 divide-dashed p-3.5 space-y-3 max-h-[300px] overflow-y-auto">
                  {inventoryItems.filter(i => i.qty <= i.threshold).length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-1">
                      <CheckCircle2 size={32} className="text-emerald-500 mx-auto animate-none" />
                      <p className="font-bold text-[11px] text-slate-700">Perfect Levels!</p>
                      <p className="text-[10px]">No materials currently below safety thresholds.</p>
                    </div>
                  ) : (
                    inventoryItems.filter(i => i.qty <= i.threshold).map(item => (
                      <div key={item.id} className="flex justify-between items-center gap-3 text-[11px] pt-2 first:pt-0">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 truncate" title={item.name}>{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-slate-400">
                            <span>SKU: {item.id}</span>
                            <span>•</span>
                            <span className="text-amber-600 font-bold">{item.qty} on hand (Min: {item.threshold})</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => triggerRestock(item)}
                          className="px-2.5 py-1 bg-[#7C3AED]/10 hover:bg-[#7C3AED] hover:text-white border border-brand-purple/20 text-[#7C3AED] rounded-md font-bold text-[10px] uppercase transition-colors shrink-0 cursor-pointer"
                        >
                          Restock
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Recent Product Registry Section (with quick actions & metrics) */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <History size={14} className="text-indigo-600 font-black" />
                    <span>Recent Product Registry Additions</span>
                  </h3>
                  <p className="text-[10px] text-slate-450 text-slate-400">Recently registered materials blocks and chemical components catalogued in core ledger</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStockStatus('All');
                    setActiveTab('products');
                  }}
                  className="bg-indigo-50/60 hover:bg-indigo-50 text-indigo-700 border border-indigo-100 hover:border-indigo-200 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer"
                >
                  View Active Catalog
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventoryItems.slice(0, 4).map(item => {
                  const categoryOfItem = item.name.toLowerCase().includes('compound') || item.name.toLowerCase().includes('hardener') || item.name.toLowerCase().includes('powder') ? 'Compounds' :
                                         item.name.toLowerCase().includes('resin') || item.name.toLowerCase().includes('monomer') || item.name.toLowerCase().includes('pigment') ? 'Resins' :
                                         item.name.toLowerCase().includes('catalyst') || item.name.toLowerCase().includes('solvent') || item.name.toLowerCase().includes('agent') ? 'Catalysts' : 'Packaging';

                  return (
                    <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs hover:border-slate-300 transition-all">
                      <div className="space-y-2.5">
                        {renderProductImageOrPlaceholder(item, "h-20")}
                        
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold font-mono text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                            {item.id}
                          </span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                            categoryOfItem === 'Compounds' ? 'bg-purple-50 text-[#7C3AED] border-purple-100' :
                            categoryOfItem === 'Resins' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            categoryOfItem === 'Catalysts' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {categoryOfItem}
                          </span>
                        </div>

                        <div>
                          <h4 
                            onClick={() => setSelectedProduct(item)}
                            className="font-bold text-slate-800 text-xs truncate hover:text-brand-purple cursor-pointer transition-colors" 
                            title={item.name}
                          >
                            {item.name}
                          </h4>
                          <div className="flex justify-between items-center mt-1 text-[10px] bg-slate-100/60 p-1 px-1.5 rounded-md border border-slate-150">
                            <span className="text-slate-400 font-bold uppercase text-[7.5px]">Selling:</span>
                            <span className="font-mono font-black text-brand-purple">{formatNairaVal(item.cost * 1.5)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                        <div className="text-[10px] font-semibold text-slate-500">
                          Qty: <span className={`font-mono font-bold ${item.qty <= item.threshold ? 'text-amber-600' : 'text-slate-800'}`}>{item.qty} units</span>
                        </div>
                        {item.qty <= item.threshold ? (
                          <button
                            type="button"
                            onClick={() => triggerRestock(item)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-500 hover:text-white border border-amber-200 text-amber-700 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer"
                          >
                            Restock
                          </button>
                        ) : (
                          <span className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg font-black uppercase tracking-wide">Optimal</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}


        {/* ==================== TAB 2: PRODUCTS ==================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Products Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
              
              <div className="flex-1 w-full relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search products by tag ID, Product Name, SKU, material properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple pl-9 pr-4 py-2 rounded-lg text-xs outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto">
                <CustomSelect
                  fullWidth={false}
                  className="w-full md:w-40 text-xs"
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                  options={[{ value: 'All', label: 'All Categories' }, ...CATEGORIES.map(cat => ({ value: cat, label: cat }))]}
                />

                <CustomSelect
                  fullWidth={false}
                  className="w-full md:w-44 text-xs"
                  value={selectedVatClass}
                  onChange={(val) => setSelectedVatClass(val)}
                  options={[
                    { value: 'All', label: 'All TAX / VAT Class' },
                    { value: 'Standard', label: 'Standard 7.5%' },
                    { value: 'Zero-Rated', label: 'Zero-Rated (0%)' }
                  ]}
                />

                <CustomSelect
                  fullWidth={false}
                  className="w-full md:w-40 text-xs"
                  value={selectedStockStatus}
                  onChange={(val) => setSelectedStockStatus(val)}
                  options={[
                    { value: 'All', label: 'All Stock Status' },
                    { value: 'In', label: 'In Stock' },
                    { value: 'Low', label: 'Low Stock' },
                    { value: 'Out', label: 'Out of Stock' }
                  ]}
                />

                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button 
                    onClick={() => setProductViewMode('grid')}
                    className={`p-1 rounded ${productViewMode === 'grid' ? 'bg-white shadow-xs text-brand-purple' : 'text-slate-400'}`}
                  >
                    <LayoutGrid size={13} />
                  </button>
                  <button 
                    onClick={() => setProductViewMode('list')}
                    className={`p-1 rounded ${productViewMode === 'list' ? 'bg-white shadow-xs text-brand-purple' : 'text-slate-400'}`}
                  >
                    <List size={13} />
                  </button>
                </div>

                <button 
                  onClick={() => setShowBulkUpload(true)}
                  className="p-2 border text-slate-500 hover:text-brand-purple hover:bg-purple-50 rounded-lg shrink-0"
                  title="Bulk Upload CSV"
                >
                  <Upload size={13} />
                </button>
              </div>

            </div>

            {/* Products display context rendering */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 max-w-md mx-auto space-y-2">
                <Package size={40} className="mx-auto opacity-40 text-slate-500" />
                <p className="font-bold text-xs text-slate-700">No matching items registered</p>
                <p className="text-[10px]">Try resetting search filters or register a new material catalog above.</p>
              </div>
            ) : productViewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(item => {
                  const salePrice = item.cost * 1.5;
                  const isZeroRated = item.id === 'SKU-810';
                  
                  return (
                    <div 
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-brand-purple/20 transition-all flex flex-col justify-between cursor-pointer"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <div className="space-y-3">
                        {renderProductImageOrPlaceholder(item, "h-28")}
                        
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] bg-slate-100 font-bold text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
                            {item.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                            item.qty === 0 
                              ? 'bg-rose-50 text-rose-600 border-rose-100' 
                              : item.qty <= item.threshold 
                                ? 'bg-amber-50 text-amber-750 border-amber-200 animate-pulse' 
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {item.qty === 0 ? 'Out of stock' : item.qty <= item.threshold ? 'Low stock' : 'In stock'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs tracking-tight line-clamp-2 h-8 leading-snug hover:text-brand-purple transition-all">{item.name}</h4>
                          <span className="block text-[8px] text-slate-400 uppercase font-black mt-1">VAT: {isZeroRated ? 'Zero-Rated' : 'Standard 7.5%'}</span>
                        </div>
                      </div>

                      {/* Extremely Prominent retail & cost prices section */}
                      <div className="bg-[#7C3AED]/5 border border-brand-purple/15 rounded-xl p-2.5 mt-4 flex justify-between items-center px-3 shadow-3xs">
                        <div className="flex flex-col">
                          <span className="text-[7.5px] uppercase font-bold text-slate-400 tracking-wider">Retail Price</span>
                          <span className="font-mono text-xs md:text-[13px] font-black text-brand-purple leading-tight">{formatNairaVal(salePrice)}</span>
                        </div>
                        <div className="flex flex-col items-end border-l border-slate-200/60 pl-2.5">
                          <span className="text-[7.5px] uppercase font-bold text-slate-400 tracking-wider">Cost Price</span>
                          <span className="font-mono text-[10px] font-semibold text-slate-500 leading-tight">{formatNairaVal(item.cost)}</span>
                        </div>
                      </div>

                      <div className="pt-2.5 mt-3 border-t border-slate-100 flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Available count:</span>
                        <strong className="font-black text-slate-700 font-mono">{item.qty} left</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-slate-705">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                      <th className="py-3 px-3">SKU ID</th>
                      <th className="py-3 px-3">Material Name</th>
                      <th className="py-3 px-3">VAT CLass</th>
                      <th className="py-3 px-3">Cost price</th>
                      <th className="py-3 px-3">Retail price</th>
                      <th className="py-3 px-3 text-center">Margin</th>
                      <th className="py-3 px-3 text-center">Available count</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                    {filteredProducts.map(item => {
                      const salePrice = item.cost * 1.5;
                      const isZeroRated = item.id === 'SKU-810';
                      const imgSrc = getProductImage(item);
                      
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-slate-400">{item.id}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              {imgSrc ? (
                                <img src={imgSrc} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-3xs shrink-0 select-none" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 select-none">
                                  <Package size={16} />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span 
                                  onClick={() => setSelectedProduct(item)} 
                                  className="font-bold text-slate-800 hover:text-brand-purple cursor-pointer transition-colors leading-tight"
                                >
                                  {item.name}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[10px] text-slate-500">{isZeroRated ? 'Zero-Rated' : 'Standard 7.5%'}</td>
                          
                          {/* Prominent Prices in List Table using badges */}
                          <td className="py-3 px-3">
                            <span className="font-bold font-mono text-[11px] text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded inline-block">
                              {formatNairaVal(item.cost)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-extrabold font-mono text-[11px] text-brand-purple bg-purple-50 border border-brand-purple/15 px-2.5 py-1 rounded inline-block shadow-3xs">
                              {formatNairaVal(salePrice)}
                            </span>
                          </td>
                          
                          <td className="py-3 px-3 text-emerald-600 font-extrabold text-center font-mono">33.3%</td>
                          <td className="py-3 px-3 text-center font-bold font-mono text-slate-800">{item.qty} units</td>
                          <td className="py-3 px-3 text-center border-none">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.qty === 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' : item.qty <= item.threshold ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {item.qty === 0 ? 'Out' : item.qty <= item.threshold ? 'Low stock' : 'Adequate'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right shrink-0">
                            <div className="flex gap-1.5 justify-end">
                              <button 
                                onClick={() => openEditProduct(item)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-brand-purple transition-colors cursor-pointer"
                                title="Edit product parameters"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedProduct(item);
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-brand-purple transition-colors cursor-pointer"
                                title="View History Log"
                              >
                                <History size={12} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(item.id, item.name)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                title="De-register SKU catalog line"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}


        {/* ==================== TAB 3: STOCK LEVELS & MOVEMENTS ==================== */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            
            {/* Top Toolbar panel */}
            <div className="flex flex-wrap gap-2 justify-between items-center bg-white p-4.5 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs">Stock Level Management Panel</h4>
                <p className="text-[10px] text-slate-400">Configure stocks across regional warehouses and log physical journals</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => setShowTransferModal(true)}
                  className="px-3.5 py-1.5 border border-purple-200 hover:border-brand-purple text-[#7C3AED] bg-purple-50/20 hover:bg-purple-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none"
                >
                  <ArrowRightLeft size={12} />
                  <span>New Branch Transfer</span>
                </button>
                <button 
                  onClick={() => setShowAdjustmentModal(true)}
                  className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-opacity-95 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none"
                >
                  <Sliders size={12} />
                  <span>Manual Adjust Stock</span>
                </button>
              </div>
            </div>
            {/* Sec 1: Stock by Location list matrices */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={14} className="text-brand-purple" />
                  <span>Multi-Location Physical Stock Allocation</span>
                </h3>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left text-slate-705">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                      <th className="py-2.5 px-3">Material Block SKU</th>
                      <th className="py-2.5 px-3">Lagos Main Depot</th>
                      <th className="py-2.5 px-3">West regional Terminal</th>
                      <th className="py-2.5 px-3">Port Cargo Terminal</th>
                      <th className="py-2.5 px-3 font-bold text-center">Cumulative stock</th>
                      <th className="py-2.5 px-3 text-center">SLA Security Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                    {inventoryItems.map(item => {
                      const shareLagos = Math.ceil(item.qty * 0.5);
                      const shareWest = Math.ceil(item.qty * 0.3);
                      const sharePort = item.qty - shareLagos - shareWest;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{shareLagos} units</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{shareWest} units</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{Math.max(0, sharePort)} units</td>
                          <td className="py-2.5 px-3 text-center font-bold text-brand-purple font-mono">{item.qty} units</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.qty === 0 
                                ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                : item.qty <= item.threshold 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                                  : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {item.qty === 0 ? 'Out' : item.qty <= item.threshold ? 'Low stock alert' : 'Operational'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sec 2: Stock Movements Central Log Ledger */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw size={14} className="text-brand-purple" />
                  <span>Central Stock Movements Journal (IAS-8 Audit Ledger)</span>
                </h3>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left text-slate-705">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                      <th className="py-2.5 px-3">Journal Ref ID</th>
                      <th className="py-2.5 px-3">Date posted</th>
                      <th className="py-2.5 px-3 text-center">Ledger Type</th>
                      <th className="py-2.5 px-3">Adjusted Material SKU</th>
                      <th className="py-2.5 px-3 text-center">Qty Shift</th>
                      <th className="py-2.5 px-3">Audit Reference code</th>
                      <th className="py-2.5 px-3">Verification Notes</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                    {movements.map(mov => (
                      <tr key={mov.id} className={`hover:bg-slate-50/50 transition-colors ${mov.status === 'Reversed' ? 'opacity-50 line-through' : ''}`}>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-400">{mov.id}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono">{mov.date}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mov.type === 'Purchase' ? 'bg-emerald-50 text-emerald-700' :
                            mov.type === 'Sale' ? 'bg-indigo-50 text-indigo-700' :
                            mov.type === 'Transfer' ? 'bg-purple-50 text-[#7C3AED]' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {mov.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{mov.productName}</td>
                        <td className={`py-2.5 px-3 text-center font-mono font-bold ${mov.qty > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {mov.qty > 0 ? `+${mov.qty}` : mov.qty}
                        </td>
                        <td className="py-2.5 px-3 font-mono select-all text-slate-600">{mov.reference}</td>
                        <td className="py-2.5 px-3 text-slate-500 italic max-w-sm truncate" title={mov.reason}>{mov.reason}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mov.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {mov.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {mov.status === 'Completed' && (
                            <button
                              onClick={() => handleReverseMovement(mov)}
                              className="px-2 py-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded text-[10px] font-extrabold uppercase cursor-pointer transition-colors"
                              title="Reverse & restore exact item count"
                            >
                              Reverse Match
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}


        {/* ==================== TAB 4: STOCK-TAKE RECONCILIATION ==================== */}
        {activeTab === 'reconciliation' && (
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <span className="text-[9px] bg-purple-50 text-brand-purple border border-purple-100 px-2 py-0.5 rounded font-bold uppercase">Compliance audit</span>
                <h3 className="font-extrabold text-slate-850 text-slate-800 text-xs">Standard Stock-Take &amp; Discrepancy Reconciliation</h3>
                <p className="text-[10px] text-slate-400">Snaps the corporate digital ledger book balances, allowing instant physical validation tracking updates.</p>
              </div>

              {stockTakeStep === 1 && (
                <button
                  onClick={handleStartStockTake}
                  className="px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer"
                >
                  + Start New Physical Cost Audit
                </button>
              )}
            </div>

            {/* Stepper Wizard panels */}
            {stockTakeStep === 2 && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4">
                
                <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-purple" />
                    <span>Step 2: Enter Physical Warehouse Counts</span>
                  </h4>
                  <div className="flex gap-2 text-slate-500 text-[10px] font-semibold">
                    <span>Supervisor: <strong>{stockTakeSupervisor}</strong></span>
                    <span>•</span>
                    <span>Location: <strong>Main Depot</strong></span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-705">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                        <th className="py-2.5 px-3">Material Block Name</th>
                        <th className="py-2.5 px-3">SKU Code</th>
                        <th className="py-2.5 px-3 text-center">System Book Balance</th>
                        <th className="py-2.5 px-3 text-center w-40">Actual Counted Qty</th>
                        <th className="py-2.5 px-3 text-center">Variance Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                      {inventoryItems.map(item => {
                        const count = stockTakeCounts[item.id] ?? item.qty;
                        const variance = count - item.qty;

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-800">{item.name}</td>
                            <td className="py-2.5 px-3 font-mono font-medium text-slate-400">{item.id}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-600">{item.qty} units</td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 w-32 mx-auto">
                                <button 
                                  type="button"
                                  onClick={() => setStockTakeCounts(prev => ({ ...prev, [item.id]: Math.max(0, count - 1) }))}
                                  className="w-5 h-5 flex items-center justify-center rounded bg-white border border-slate-200 shadow-xs text-slate-500 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  -
                                </button>
                                <input 
                                  type="number" 
                                  value={count}
                                  onChange={(e) => {
                                    const parsedVal = parseInt(e.target.value) || 0;
                                    setStockTakeCounts(prev => ({ ...prev, [item.id]: Math.max(0, parsedVal) }));
                                  }}
                                  className="w-12 text-center font-bold bg-transparent outline-none focus:text-brand-purple"
                                />
                                <button 
                                  type="button"
                                  onClick={() => setStockTakeCounts(prev => ({ ...prev, [item.id]: count + 1 }))}
                                  className="w-5 h-5 flex items-center justify-center rounded bg-white border border-slate-200 shadow-xs text-slate-500 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className={`py-2.5 px-3 text-center font-mono font-bold ${
                              variance === 0 ? 'text-slate-400' : variance > 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                              {variance === 0 ? 'Match' : `${variance > 0 ? '+' : ''}${variance}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                  <button 
                    onClick={() => {
                      if (confirm('Cancel stock audit progress? This will trash counts.')) {
                        setStockTakeStep(1);
                      }
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-100 text-slate-600"
                  >
                    Trash Stocktake
                  </button>
                  <button
                    onClick={() => setStockTakeStep(3)}
                    className="px-5 py-2 bg-brand-purple text-white font-extrabold rounded-xl hover:bg-opacity-95 text-xs text-center uppercase tracking-wide shadow-sm shrink-0"
                  >
                    Proceed to Reconciliation Review &gt;
                  </button>
                </div>

              </div>
            )}

            {stockTakeStep === 3 && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4">
                
                <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
                    <span>Step 3: Analyze Variances &amp; Post Adjustments</span>
                  </h4>
                  <span className="text-[9px] bg-amber-50 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded">Reconciliation validation matches only</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-705">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight text-[10px] font-bold">
                        <th className="py-2.5 px-3">Material block name</th>
                        <th className="py-2.5 px-3 text-center">Book Bal</th>
                        <th className="py-2.5 px-3 text-center">Physical count</th>
                        <th className="py-2.5 px-3 text-center">Variance Difference</th>
                        <th className="py-2.5 px-3">Discrepancy Reason select</th>
                        <th className="py-2.5 px-3 text-center">Authorize Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 divide-dashed font-sans">
                      {inventoryItems.map(item => {
                        const count = stockTakeCounts[item.id] ?? item.qty;
                        const variance = count - item.qty;
                        
                        // Show all matching for validation
                        const isApproved = stockTakeApproved[item.id] ?? true;

                        return (
                          <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${variance === 0 ? 'opacity-40' : ''}`}>
                            <td className="py-2.5 px-3 font-bold text-slate-800">{item.name}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-600">{item.qty} units</td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-700 font-bold">{count} units</td>
                            <td className={`py-2.5 px-3 text-center font-mono font-bold ${
                              variance === 0 ? 'text-slate-400' : variance > 0 ? 'text-emerald-700' : 'text-rose-700'
                            }`}>
                              {variance === 0 ? 'None' : `${variance > 0 ? '+' : ''}${variance}`}
                            </td>
                            <td className="py-2.5 px-3">
                              <CustomSelect
                                disabled={variance === 0}
                                value={stockTakeReasons[item.id] || 'Shrinkage'}
                                onChange={(val) => setStockTakeReasons(prev => ({ ...prev, [item.id]: val }))}
                                className="min-w-[170px]"
                                options={[
                                  { value: 'Theft / Pilferage', label: 'Theft / Pilferage' },
                                  { value: 'Damaged Packaging', label: 'Damaged Packaging' },
                                  { value: 'Logistics Discrepancy', label: 'Logistics Discrepancy' },
                                  { value: 'Error Correction', label: 'Error Correction' },
                                  { value: 'Cycle Count Adjustment', label: 'Cycle Count Adjustment' }
                                ]}
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input 
                                type="checkbox"
                                disabled={variance === 0}
                                checked={isApproved}
                                onChange={(e) => setStockTakeApproved(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                className="h-3.5 w-3.5 rounded border border-slate-300 text-brand-purple cursor-pointer focus:ring-brand-purple"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                  <button 
                    onClick={() => setStockTakeStep(2)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-100 text-slate-600"
                  >
                    &lt; Back to Entry
                  </button>
                  <button
                    onClick={handlePostRecAdjustments}
                    className="px-5 py-2.5 bg-[#7C3AED] hover:bg-opacity-95 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-sm cursor-pointer shrink-0"
                  >
                    Confirm Adjustments &amp; Commit General Ledger
                  </button>
                </div>

              </div>
            )}

            {/* Inactive physical audits empty visual placeholder */}
            {stockTakeStep === 1 && (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400 space-y-3 shadow-xs max-w-lg mx-auto">
                <FileText size={40} className="mx-auto text-[#7C3AED]/10 font-bold bg-purple-50 p-2.5 rounded-2xl h-14 w-14" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-700 text-xs">No active stock physical count session</h4>
                  <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Physical cost counts are structured validation sessions that snaps counts to discover product shrinkage, theft, or damages logs before sending returns.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}


        {/* ==================== TAB 5: REPORTS ==================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            
            {/* Header section with download button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Executive Inventory Compliance Analytics</h3>
                <p className="text-[11px] text-slate-500 mt-1">Real-time valuation lists and holding metrics generated inline under standard IAS-8 accounting rules.</p>
              </div>
              <button 
                onClick={() => {
                  onAction("Simulated Outbound Movements Summary spreadsheet successfully parsed!");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100/80 text-[#7C3AED] hover:text-[#6D28D9] border border-purple-200 rounded-xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <History size={14} />
                <span>Download Movements CSV</span>
              </button>
            </div>

            {/* Split live reports layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Report 1: Valuation */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center text-brand-purple border border-purple-100">
                    <FileText size={15} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">1. Inventory Asset Valuation Report</h4>
                    <span className="block text-[9px] text-slate-400">Method: IAS-2 / IAS-8 {formData.inventoryMethod || 'FIFO'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500">Computes current trading raw blocks utilizing standard IAS-8 {formData.inventoryMethod || 'FIFO'} accounting policies.</p>
                  
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2 font-mono text-[10px] sm:text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-2 font-sans font-extrabold text-slate-700">
                      <span>SKU Item Code</span>
                      <span>In Stock Qty</span>
                      <span>Unit Cost Price</span>
                      <span>Total Asset Balance</span>
                    </div>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {inventoryItems.map(item => (
                        <div key={item.id} className="flex justify-between text-slate-600 border-b border-slate-100/40 pb-1 last:border-b-0 last:pb-0">
                          <span className="font-bold">{item.id}</span>
                          <span className="text-center w-24">{item.qty} units</span>
                          <span>{formatNairaVal(item.cost)}</span>
                          <span className="font-extrabold text-slate-800">{formatNairaVal(item.qty * item.cost)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-dashed border-slate-200 pt-2.5 flex justify-between font-black text-brand-purple text-xs">
                      <span>TOTAL VALUATION BALANCE AT COST:</span>
                      <span>{formatNairaVal(totalStockCost)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report 2: Ageing */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center text-brand-purple border border-purple-100">
                    <Calendar size={15} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">2. Inventory Ageing Analysis</h4>
                    <span className="block text-[9px] text-slate-400">Holding Costs Check thresholds (&gt;90 Days)</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  <p className="text-[11px] text-slate-500">Detects holding costs and locks alert profiles flags on slow moving items in shelves exceeds 90 days threshold boundary.</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-slate-600">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <span className="block font-bold text-slate-800 text-[10px]">Fresh (0-30d)</span>
                      <span className="block text-emerald-700 font-black tracking-tight text-sm mt-1">72.4%</span>
                      <span className="block text-[8px] text-slate-400 font-semibold">Stable assets</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="block font-bold text-slate-800 text-[10px]">Mid (31-60d)</span>
                      <span className="block text-slate-700 font-black text-sm mt-1">18.5%</span>
                      <span className="block text-[8px] text-slate-400 font-semibold font-medium">Regular items</span>
                    </div>
                    <div className="p-2.5 bg-yellow-50 border border-yellow-100 rounded-xl">
                      <span className="block font-bold text-slate-800 text-[10px]">Mature (61-90d)</span>
                      <span className="block text-yellow-700 font-black text-sm mt-1">6.8%</span>
                      <span className="block text-[8px] text-slate-400 font-semibold">Warn review</span>
                    </div>
                    <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl">
                      <span className="block font-bold text-slate-800 text-[10px]">Stale (&gt;90d)</span>
                      <span className="block text-rose-700 font-black text-sm mt-1 animate-pulse">2.3%</span>
                      <span className="block text-[8px] text-slate-400 font-semibold">High holding</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center gap-3">
                    <AlertCircle size={15} className="text-yellow-600 font-bold shrink-0" />
                    <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                      WARNING: SLA trigger detects SKU-804 has spent 114 days without active sales. Recommend markdown discount or return to suppliers.
                    </p>
                  </div>

                  <div className="p-3.5 bg-indigo-50/25 border border-purple-100 rounded-xl space-y-1">
                    <span className="block font-bold text-brand-purple text-[10px] uppercase tracking-wide">Dynamic Action Alert</span>
                    <p className="text-[10px] text-slate-650 leading-relaxed font-medium">The system leverages dynamic FIFO parameters to suggest stock restock allocations. Active item counts are updated on-the-go with no manual re-querying steps required.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>


      {/* ==================== DYNAMIC FLOATING DIALOGS & SHEET MODALS ==================== */}
      <AnimatePresence>
        
        {/* ADD / EDIT PRODUCT MULTI-TAB SIDE PANEL FORM */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 flex justify-end select-none">
            {/* Direct close, no blocked confirm popup */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => {
              resetForm();
              setShowAddModal(false);
            }} />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border-l border-slate-200 shadow-2xl max-w-md w-full h-full overflow-hidden flex flex-col justify-between"
            >
              
              {/* Form Title Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
                <span className="font-extrabold text-slate-900 uppercase tracking-wide text-xs">
                  {isEditing ? `Edit Product Profile: ${formName}` : 'Add New Material Catalog Line'}
                </span>
                <button 
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Form Tabs Navs Selector */}
              <div className="bg-slate-100 border-b border-slate-200 px-6 py-1.5 flex shrink-0 gap-1 overflow-x-auto">
                {[
                  { id: 'basic', label: '1. Info' },
                  { id: 'pricing', label: '2. Pricing' },
                  { id: 'inventory', label: '3. SLA' },
                  { id: 'settings', label: '4. VAT' }
                ].map(formTab => (
                  <button
                    key={formTab.id}
                    type="button"
                    onClick={() => setFormActiveTab(formTab.id as any)}
                    className={`px-2.5 py-1.5 font-extrabold text-[10px] uppercase transition-all flex items-center rounded-md shrink-0 ${
                      formActiveTab === formTab.id ? 'bg-white text-brand-purple text-xs shadow-xs border border-purple-100' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {formTab.label}
                  </button>
                ))}
              </div>

              {/* Form Scrollable Body Panel */}
              <form onSubmit={handleSubmitProductForm} className="p-6 flex-1 overflow-y-auto space-y-4 text-slate-700">
                
                {/* 1. BASIC INFO TAB PANEL */}
                {formActiveTab === 'basic' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-900">Product Line Name (Required)</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Synthetic Polymer hardener block"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg focus:bg-white focus:border-brand-purple outline-none font-medium text-slate-800 transition-all font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-900">Product SKU ID</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            required
                            placeholder="SKU-812"
                            value={formId}
                            disabled={isEditing}
                            onChange={(e) => setFormId(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg focus:bg-white focus:border-brand-purple outline-none font-mono font-bold text-slate-700 disabled:opacity-60 transition-all font-sans"
                          />
                          {!isEditing && (
                            <button
                              type="button"
                              onClick={autogenerateSKU}
                              className="px-2 bg-indigo-50 hover:bg-indigo-150 text-[#7C3AED] rounded-lg border border-purple-200 text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Generate
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-900">Category Selection</label>
                        <CustomSelect
                          value={formCategory}
                          onChange={(val) => setFormCategory(val)}
                          options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-900">UoM Standard</label>
                        <CustomSelect
                          value={formUnit}
                          onChange={(val) => setFormUnit(val)}
                          options={[
                            { value: 'Pieces', label: 'Pieces / Units' },
                            { value: 'Kg', label: 'Kilograms (Kg)' },
                            { value: 'Liters', label: 'Liters (L)' },
                            { value: 'Packs', label: 'Bulk Packs' }
                          ]}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-900">Barcode ID (GTIN - Optional)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 592038104"
                          value={formBarcode}
                          onChange={(e) => setFormBarcode(e.target.value)}
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg focus:bg-white focus:border-brand-purple outline-none font-mono text-slate-650 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-slate-900">Description / Specifications</label>
                      <textarea
                        rows={2}
                        placeholder="Write chemical properties or supplier package constraints..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg focus:bg-white focus:border-brand-purple outline-none font-sans"
                      />
                    </div>

                    {/* Optional Image Uploader with Soft Border */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block font-bold text-slate-900">Product Image (Optional)</label>
                      <div className="flex gap-4 items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-200">
                        {formImage ? (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0 group">
                            <img src={formImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => setFormImage('')}
                              className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-black uppercase cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg border border-slate-200 flex items-center justify-center text-slate-350 bg-white flex-shrink-0">
                            <Image size={18} />
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100/80 text-brand-purple rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-colors border border-purple-100/50">
                            <span>Browse Image</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageChange} 
                              className="hidden" 
                            />
                          </label>
                          <p className="text-[9px] text-slate-400">Add a picture to visually identify materials in listings.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. COST PRICING TAB PANEL */}
                {formActiveTab === 'pricing' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-900">Cost Price (At Acquisition)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">₦</span>
                          <input 
                            type="number"
                            required
                            placeholder="120000"
                            value={formCostPrice}
                            onChange={(e) => setFormCostPrice(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-white border border-slate-200 pl-7 pr-3 py-2 rounded-lg focus:bg-white focus:border-brand-purple outline-none font-mono text-slate-800 font-bold transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-900">Selling Retail Market Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">₦</span>
                          <input 
                            type="number"
                            required
                            placeholder="180000"
                            value={formSellingPrice}
                            onChange={(e) => setFormSellingPrice(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-white border border-slate-200 pl-7 pr-3 py-2 rounded-lg focus:bg-white focus:border-brand-purple outline-none font-mono text-slate-800 font-bold transition-all"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Pricing margin breakdown boxes indicators */}
                    <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xl rounded-2xl select-none text-center">
                      <div className="space-y-0.5">
                        <span className="block text-slate-400 text-[9px] uppercase font-bold">Gross Gain Margin (₦)</span>
                        <span className="block text-slate-900 text-xs font-black font-mono">
                          {formatNairaVal((parseFloat(formSellingPrice) || 0) - (parseFloat(formCostPrice) || 0))}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-slate-400 text-[9px] uppercase font-bold">Margin Quotient (%)</span>
                        <span className="block text-emerald-600 text-xs font-black font-mono">{calculatedMarginPercentage}%</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-slate-400 text-[9px] uppercase font-bold">Markup Coefficient (%)</span>
                        <span className="block text-brand-purple text-xs font-black font-mono">{calculatedMarkup}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-indigo-50/40 border border-purple-100 rounded-xl">
                      <input 
                        type="checkbox"
                        id="vars_cb"
                        checked={formHasVariants}
                        onChange={(e) => setFormHasVariants(e.target.checked)}
                        className="h-3.5 w-3.5 text-brand-purple font-mono cursor-pointer"
                      />
                      <label htmlFor="vars_cb" className="font-bold text-slate-800 cursor-pointer text-xs">
                        This material product has regional custom specific variants constraints
                      </label>
                    </div>
                  </div>
                )}

                {/* 3. INVENTORY SLA TAB PANEL */}
                {formActiveTab === 'inventory' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-900">Safety Reorder Level (Units)</label>
                        <input 
                          type="number"
                          placeholder="10"
                          value={formReorderLevel}
                          onChange={(e) => setFormReorderLevel(e.target.value)}
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg focus:bg-white focus:border-brand-purple outline-none font-mono font-bold transition-all"
                        />
                        <span className="block text-[8px] text-slate-400">Triggers alert notifications once stock falls below this</span>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-900">Standard Replenish Qty</label>
                        <input 
                          type="number"
                          placeholder="50"
                          value={formReorderQty}
                          onChange={(e) => setFormReorderQty(e.target.value)}
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg focus:bg-white focus:border-brand-purple outline-none font-mono font-bold transition-all"
                        />
                        <span className="block text-[8px] text-slate-400">Default wholesale quantity generated on reorders</span>
                      </div>

                    </div>
                  </div>
                )}

                {/* 4. VAT COMPLIANCE TAB PANEL */}
                {formActiveTab === 'settings' && (
                  <div className="space-y-4">
                    <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      <label className="block font-black text-slate-900 text-[10px] uppercase tracking-wider mb-2">VAT Liability Category (FIRS-Verified)</label>
                      
                      <div className="space-y-2">
                        {[
                          { id: 'std', label: 'Standard Outward VAT (7.5% rate applied)', desc: 'Standard business supplies of compounds and resins.' },
                          { id: 'zero', label: 'Zero-Rated Outward (0% exemption)', desc: 'Specifically earmarked organic catalysts and exports.' }
                        ].map(vatOpt => (
                          <div key={vatOpt.id} className="flex items-start gap-2 text-xs">
                            <input 
                              type="radio" 
                              name="f_v_class" 
                              id={`vat_c_${vatOpt.id}`} 
                              checked={(vatOpt.id === 'std' && formVatClass === 'Standard 7.5%') || (vatOpt.id === 'zero' && formVatClass === 'Zero-Rated 0%')}
                              onChange={() => setFormVatClass(vatOpt.id === 'std' ? 'Standard 7.5%' : 'Zero-Rated 0%')}
                              className="h-3.5 w-3.5 mt-0.5 text-brand-purple cursor-pointer"
                            />
                            <label htmlFor={`vat_c_${vatOpt.id}`} className="cursor-pointer">
                              <span className="block font-extrabold text-slate-800 leading-none">{vatOpt.label}</span>
                              <span className="block text-[10px] text-slate-400 mt-1 leading-snug">{vatOpt.desc}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block font-bold text-slate-800 text-xs">Require Serial Number Tracking</span>
                          <span className="block text-[9px] text-slate-400">Forces itemized scanning on sales and physical reconciliation counts</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={formTrackSerial}
                          onChange={(e) => setFormTrackSerial(e.target.checked)}
                          className="h-3.5 w-3.5 text-brand-purple form-checkbox cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block font-bold text-slate-800 text-xs">Flag SKU as Discontinued</span>
                          <span className="block text-[9px] text-slate-400">locks itemized catalog from showing inside checkout POS catalogs list</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={formDiscontinued}
                          onChange={(e) => setFormDiscontinued(e.target.checked)}
                          className="h-3.5 w-3.5 text-brand-purple cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </form>

              {/* Form Actions Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 border rounded-xl font-bold hover:bg-slate-100/50 text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  {formActiveTab !== 'settings' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: any = ['basic', 'pricing', 'inventory', 'settings'];
                        const idx = tabs.indexOf(formActiveTab);
                        setFormActiveTab(tabs[idx + 1]);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
                    >
                      Next Step &gt;
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitProductForm}
                      className="px-4.5 py-2 bg-[#7C3AED] hover:bg-opacity-95 text-white rounded-xl font-black transition-all cursor-pointer shadow-sm"
                    >
                      {isEditing ? 'Save Product Profile' : 'Save & Register SKU'}
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}

        {/* BULK UPLOAD MODAL IMPORT MOCK */}
        {showBulkUpload && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Upload size={14} className="text-brand-purple" />
                  <span>Bulk SKU CSV Importer Tool</span>
                </h3>
                <button onClick={() => setShowBulkUpload(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={15} />
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 leading-normal">
                Batch register products with our CSV uploader. Download the structural template, add material codes, tax classification columns, and upload.
              </p>

              <button 
                onClick={() => {
                  onAction("CSV import template downloaded.");
                }}
                className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <FileSpreadsheet size={14} className="text-emerald-600" />
                <span>Download Tributa CSV Layout Template</span>
              </button>

              <div 
                onClick={() => {
                  // Simulate upload verify
                  onAction("Uploaded spreadsheet file: tributa_replenishments.csv. Parsed 2 SKU rows.");
                  setShowBulkUpload(false);
                }}
                className="border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-purple-50/10 hover:border-brand-purple text-center p-8 rounded-2xl cursor-pointer space-y-2 transition-all leading-normal text-slate-650"
              >
                <Upload size={28} className="mx-auto text-slate-350" />
                <p className="font-bold text-slate-700 text-xs">Drag and drop spreadsheet files here</p>
                <p className="text-[10px] text-slate-400">Supported format types: XML, CSV, XLSX up to 4MB.</p>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t">
                <button onClick={() => setShowBulkUpload(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                  Close Form
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* INTER-LOCATION TRANSFER MODAL */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-extrabold text-xs text-slate-705 uppercase tracking-widest flex items-center gap-1.5">
                  <ArrowRightLeft size={14} className="text-brand-purple" />
                  <span>Initiate Stocks Cargo Transfer Flight</span>
                </h3>
                <button onClick={() => setShowTransferModal(false)} className="p-1 hover:bg-slate-105 rounded-full text-zinc-400">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-800">From Branch Source</label>
                    <CustomSelect
                      value={trfFrom}
                      onChange={(val) => setTrfFrom(val)}
                      options={LOCATIONS.map(l => ({ value: l.id, label: l.name }))}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-800">To Destination Branch</label>
                    <CustomSelect
                      value={trfTo}
                      onChange={(val) => setTrfTo(val)}
                      options={LOCATIONS.filter(l => l.id !== trfFrom).map(l => ({ value: l.id, label: l.name }))}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-800 font-sans">Select Material Block</label>
                  <CustomSelect
                    value={trfProduct}
                    onChange={(val) => setTrfProduct(val)}
                    placeholder="-- Choose item line --"
                    options={inventoryItems.map(inv => ({ value: inv.id, label: `${inv.name} (${inv.qty} active on hand)` }))}
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="block font-bold text-slate-800 font-sans">Transfer Cargo Qty</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={trfQty}
                    onChange={(e) => setTrfQty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Authorization / Transfer notes</label>
                  <input 
                    type="text"
                    placeholder="e.g. Stock balances for Lagos sales demand"
                    value={trfNotes}
                    onChange={(e) => setTrfNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none text-slate-800"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t">
                  <button 
                    type="button" 
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 text-slate-500"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-brand-purple text-white font-extrabold text-xs uppercase tracking-wide rounded-xl shadow-sm cursor-pointer shrink-0"
                  >
                    Confirm Cargo Transfer
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}

        {/* MANUAL ADJUSTMENT MODAL */}
        {showAdjustmentModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Sliders size={14} className="text-brand-purple" />
                  <span>Manual Adjust stock counts</span>
                </h3>
                <button onClick={() => setShowAdjustmentModal(false)} className="p-1 hover:bg-slate-150 rounded-full text-zinc-400">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleAdjustmentSubmit} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Select material block to shift</label>
                  <CustomSelect
                    value={adjProduct}
                    onChange={(val) => setAdjProduct(val)}
                    placeholder="-- Choose item line --"
                    options={inventoryItems.map(inv => ({ value: inv.id, label: `${inv.name} (${inv.qty} left)` }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-800">Correction Category</label>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button 
                        type="button"
                        onClick={() => setAdjType('Increase')}
                        className={`flex-1 py-1 text-center font-bold text-[10px] uppercase rounded ${adjType === 'Increase' ? 'bg-white shadow-xs text-emerald-600' : 'text-slate-400'}`}
                      >
                        + Increase
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setAdjType('Decrease')}
                        className={`flex-1 py-1 text-center font-bold text-[10px] uppercase rounded ${adjType === 'Decrease' ? 'bg-white shadow-xs text-rose-600' : 'text-slate-400'}`}
                      >
                        - Decrease
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-800">Correction Volume</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      value={adjQty}
                      onChange={(e) => setAdjQty(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Discrepancy Reason select</label>
                  <CustomSelect
                    value={adjReason}
                    onChange={(val) => setAdjReason(val)}
                    options={[
                      { value: 'Damaged Stock Write-off', label: 'Damaged Stock Write-off' },
                      { value: 'Physical Count discrepancy', label: 'Physical Count discrepancy' },
                      { value: 'Theft pilferage report', label: 'Theft pilferage report' },
                      { value: 'Found Stock during count', label: 'Found Stock during count' },
                      { value: 'Supplier packaging return replacement', label: 'Supplier packaging return replacement' }
                    ]}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Verification / Journal Notes</label>
                  <textarea 
                    rows={2}
                    placeholder="Notes to attach to dynamic stock journal logs..."
                    value={adjNotes}
                    onChange={(e) => setAdjNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg outline-none text-slate-850"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t">
                  <button 
                    type="button" 
                    onClick={() => setShowAdjustmentModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 text-slate-505"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-brand-purple text-white font-extrabold text-xs uppercase tracking-wide rounded-xl shadow-xs cursor-pointer shrink-0"
                  >
                    Confirm Adjustments
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}

        {/* DETAILS OVERVIEW SIDE PANEL SHEET */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 flex justify-end select-none">
            {/* Click outside backdrop to close */}
            <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white border-l border-slate-200 p-6 max-w-md w-full h-full shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] bg-slate-100 font-bold text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
                      {selectedProduct.id}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 truncate max-w-[280px]">{selectedProduct.name}</h3>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  {/* Product image or fallback placeholder in detail drawer */}
                  {renderProductImageOrPlaceholder(selectedProduct, "h-40")}

                  {/* Category & Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Category</span>
                      <strong className="text-slate-800 text-[11px] block mt-0.5">{selectedProduct.category || 'Compounds'}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedProduct.qty === 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' : selectedProduct.qty <= selectedProduct.threshold ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      }`}>
                        {selectedProduct.qty === 0 ? 'Out of stock' : selectedProduct.qty <= selectedProduct.threshold ? 'Low Stock' : 'Adequate'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 leading-relaxed">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Pricing specifications</span>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold">Cost (Ex-VAT):</span>
                      <strong className="text-slate-800 font-mono">{formatNairaVal(selectedProduct.cost)}</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold">Suggested Selling:</span>
                      <strong className="text-brand-purple font-mono">{formatNairaVal(selectedProduct.cost * 1.5)}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200 border-dashed">
                      <span className="text-slate-500 font-semibold">Gross Margin Ratio:</span>
                      <strong className="text-emerald-700">33.3%</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 leading-relaxed">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Inventory balance limits</span>
                    <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                      <span>Available on hand:</span>
                      <span className="font-mono">{selectedProduct.qty} units</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Min Threshold Level:</span>
                      <span className="font-mono">{selectedProduct.threshold} units</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">TAX / VAT Class:</span>
                      <strong className="text-slate-800">{selectedProduct.id === 'SKU-810' ? 'Zero-Rated (0%)' : 'Standard 7.5%'}</strong>
                    </div>
                    <div className="flex justify-between text-[10px] pt-1.5 border-t border-slate-200 border-dashed">
                      <span>Recommended restock:</span>
                      <span className="font-semibold text-brand-purple font-mono">{selectedProduct.threshold * 3} units</span>
                    </div>
                  </div>

                  {/* Sub-tabs showing history list log */}
                  <div className="space-y-2">
                    <span className="block font-black text-slate-400 text-[9px] uppercase tracking-wider">SKU Log entries</span>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 divide-dashed border border-slate-200 bg-slate-50/50 rounded-lg p-2.5 text-[10px] space-y-2">
                      {movements.filter(m => m.productId === selectedProduct.id).length === 0 ? (
                        <p className="p-3 text-center text-slate-400 italic">No movements recorded for this item since acquisition snap.</p>
                      ) : (
                        movements.filter(m => m.productId === selectedProduct.id).map(mLog => (
                          <div key={mLog.id} className="pt-2 flex justify-between items-center first:pt-0">
                            <div>
                              <span className="font-extrabold text-slate-800 block capitalize">{mLog.type} ({mLog.reference})</span>
                              <span className="block text-[8px] text-slate-400">{mLog.date} • {mLog.reason}</span>
                            </div>
                            <span className={`font-mono font-bold ${mLog.qty > 0 ? 'text-emerald-700' : 'text-slate-650'}`}>
                              {mLog.qty > 0 ? `+${mLog.qty}` : mLog.qty}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const prodToEdit = selectedProduct;
                      setSelectedProduct(null);
                      setTimeout(() => openEditProduct(prodToEdit), 150);
                    }}
                    className="flex-1 px-4 py-2.5 border border-slate-200 hover:border-brand-purple text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-brand-purple rounded-xl font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Edit Product
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Close Panel
                  </button>
                </div>
                <button 
                  onClick={() => {
                    const idToDelete = selectedProduct.id;
                    const nameToDelete = selectedProduct.name;
                    setSelectedProduct(null);
                    setTimeout(() => handleDeleteProduct(idToDelete, nameToDelete), 150);
                  }} 
                  className="w-full text-center py-2 text-rose-600 hover:text-rose-700 text-xs font-bold rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                >
                  De-register Product
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* CUSTOM DIRECT EDIT & QUANTITY RESTOCK MODAL */}
        {restockProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center select-none p-4">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setRestockProduct(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-250 p-6 shadow-2xl relative max-w-md w-full z-10 space-y-4 text-xs font-sans text-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                    RESTOCK &amp; EDIT: {restockProduct.id}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">Restock &amp; Configure Product</h3>
                </div>
                <button 
                  type="button" 
                  onClick={() => setRestockProduct(null)} 
                  className="p-1.5 hover:bg-slate-150 text-slate-400 hover:text-slate-650 rounded-full transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. Basic properties edit - Name, Cost, Threshold */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Edit Product Name</label>
                  <input
                    type="text"
                    value={editingProductName}
                    onChange={(e) => setEditingProductName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:bg-white focus:border-brand-purple transition-all font-bold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-800 font-sans">Unit Cost Price (₦)</label>
                    <input
                      type="number"
                      value={editingProductCost}
                      onChange={(e) => setEditingProductCost(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:bg-white focus:border-brand-purple transition-all font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-800 font-sans">Reorder Threshold Min</label>
                    <input
                      type="number"
                      value={editingProductThreshold}
                      onChange={(e) => setEditingProductThreshold(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:bg-white focus:border-brand-purple transition-all font-mono font-bold"
                    />
                  </div>
                </div>

                {/* 2. Stock levels indicator box */}
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1.5 leading-snug">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-semibold">Current stock level on hand:</span>
                    <strong className="text-slate-900 font-mono">{restockProduct.qty} units</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-slate-200/50 border-dashed">
                    <span className="text-slate-500 font-semibold">Safety Level Margin Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      restockProduct.qty <= restockProduct.threshold ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {restockProduct.qty <= restockProduct.threshold ? 'Below Threshold level' : 'Safe reserve margin'}
                    </span>
                  </div>
                </div>

                {/* 3. Direct Quantity Restock multiplier input */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800 font-sans">Quantity to Add (Restock Volume)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="E.g. 50"
                    value={restockQtyToAdd}
                    onChange={(e) => setRestockQtyToAdd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:bg-white focus:border-brand-purple transition-all font-mono font-bold text-brand-purple text-sm"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Suggested volumetric reorder: <strong className="font-mono text-purple-650 font-bold">{restockProduct.threshold * 3} units</strong>
                  </p>
                </div>

                {/* Live simulation indicator */}
                {parseInt(restockQtyToAdd) > 0 && (
                  <div className="p-2.5 bg-emerald-50/50 border border-emerald-100/50 rounded-xl flex items-center justify-between text-[11px] text-emerald-850 font-medium animate-none">
                    <span>Computed new stock level will be:</span>
                    <strong className="font-mono text-emerald-800 font-bold">{restockProduct.qty + (parseInt(restockQtyToAdd) || 0)} units total</strong>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 text-slate-550 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirmRestock}
                  className="px-5 py-2.5 bg-brand-purple hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Confirm Restock &amp; Edit
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* VALUATION REPORT PANEL VIEW */}
        {renderReportPanel()}

      </AnimatePresence>

    </div>
  );
}
