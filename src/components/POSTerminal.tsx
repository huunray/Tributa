import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Package, 
  Plus, 
  Minus, 
  X, 
  User, 
  UserPlus, 
  CreditCard, 
  Coins, 
  Building2, 
  CheckCircle, 
  Printer, 
  Mail, 
  Phone, 
  Smartphone,
  Barcode, 
  Percent, 
  Receipt, 
  ChevronRight, 
  AlertTriangle, 
  QrCode, 
  Trash2, 
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SignupState } from '../types';

interface Transaction {
  id: string;
  date: string;
  type: 'Sale' | 'Payment' | 'Receipt';
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface POSTerminalProps {
  inventoryItems: Array<{ id: string; name: string; qty: number; cost: number; threshold: number }>;
  setInventoryItems: React.Dispatch<React.SetStateAction<any[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  formData: SignupState;
  onAction: (msg: string) => void;
}

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
  variant?: string;
  origId: string; // SKU of raw item
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tin?: string;
  creditLimit: number;
}

interface SavedCart {
  id: string;
  name: string;
  items: CartItem[];
  customer: Customer | null;
  timestamp: string;
}

// Fixed compound variants
const ITEM_VARIANTS: Record<string, string[]> = {
  'SKU-801': ['Premium Pure', 'Standard Raw'],
  'SKU-802': ['High Viscosity', 'Medium Fluid'],
  'SKU-803': ['5L Concentrate', '10L Standard'],
  'SKU-804': ['50m Structural', '100m Compact'],
  'SKU-805': ['Fast Cure', 'Slow Cure'],
  'SKU-806': ['Ultra Active', 'Regular Grade'],
  'SKU-807': ['20 Micron', '25 Micron'],
  'SKU-808': ['Purity 99%', 'Purity 95%'],
  'SKU-809': ['Rutile Grade', 'Anatase Grade'],
  'SKU-810': ['Anhydrous Dry', 'Technical Grade'],
  'SKU-811': ['Aerosol Can', 'Bulk Liquid']
};

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
  if (item.image) return item.image;
  return DEFAULT_PRODUCT_IMAGES[item.id] || null;
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

  return (
    <div className={`w-full ${heightClass} rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-xs flex flex-col items-center justify-center p-3 select-none text-center relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      <div className={`p-2 rounded-lg mb-1 z-10 ${
        categoryOfItem === 'Compounds' ? 'bg-purple-50 text-brand-purple' :
        categoryOfItem === 'Resins' ? 'bg-blue-50 text-blue-600' :
        categoryOfItem === 'Catalysts' ? 'bg-amber-50 text-amber-600' :
        'bg-slate-100 text-slate-600'
      }`}>
        <Package size={16} />
      </div>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none z-10">{categoryOfItem}</span>
    </div>
  );
};

export default function POSTerminal({
  inventoryItems,
  setInventoryItems,
  transactions,
  setTransactions,
  formData,
  onAction
}: POSTerminalProps) {
  // Navigation Tabs at POS level
  const [posTab, setPosTab] = useState<'checkout' | 'summary'>('checkout');
  
  // Product list view switcher state
  const [productViewMode, setProductViewMode] = useState<'grid' | 'list'>('grid');

  // Custom states for full checkout screen and search-on-click dropdown focus
  const [isInvoiceCheckoutActive, setIsInvoiceCheckoutActive] = useState<boolean>(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState<boolean>(false);

  // Interactive local DB for customers - fully populated with default profiles
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'CST-001', name: 'Aliko Dangote Ind. Ltd', phone: '+234 803 112 2334', email: 'accounts@dangote-group.com', tin: '01489201-0001', creditLimit: 2500000 },
    { id: 'CST-002', name: 'Mikano International', phone: '+234 802 223 3445', email: 'finance@mikano-intl.com', tin: '10492817-0001', creditLimit: 1500000 },
    { id: 'CST-003', name: 'Innoson Vehicle Mfg', phone: '+234 805 556 6778', email: 'billing@innosonvehicles.com', tin: '29104812-0001', creditLimit: 5000000 },
    { id: 'CST-004', name: 'Walk-in Cash Customer', phone: '+234 800 000 0000', email: 'cash@tributa.gov.ng', creditLimit: 0 },
    { id: 'CST-005', name: 'Oando Plc Energy', phone: '+234 809 111 2222', email: 'payments@oandoplc.com', tin: '05928104-0002', creditLimit: 4000000 },
    { id: 'CST-006', name: 'BUA Cement Group', phone: '+234 811 333 4444', email: 'procurement@buagroup.com', tin: '11920485-0001', creditLimit: 6000000 },
    { id: 'CST-007', name: 'Lafarge Africa Plc', phone: '+234 815 444 5555', email: 'tax@lafarge.corp', tin: '09284104-0001', creditLimit: 3500000 },
    { id: 'CST-008', name: 'Nigerian Breweries Plc', phone: '+234 812 555 6666', email: 'billing@nbplc.com', tin: '04820194-0003', creditLimit: 3000000 },
    { id: 'CST-009', name: 'Flour Mills of Nigeria', phone: '+234 813 666 7777', email: 'finance@fmnplc.com', tin: '12849201-0001', creditLimit: 4500000 },
    { id: 'CST-010', name: 'Leadway Assurance Corp', phone: '+234 802 777 8888', email: 'premiums@leadway.com', tin: '02819481-0012', creditLimit: 2000000 }
  ]);

  // Cart / Order details state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isB2B, setIsB2B] = useState<boolean>(false);
  
  // Modals / Dropdowns
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showSavedCarts, setShowSavedCarts] = useState(false);
  const [variantModalItem, setVariantModalItem] = useState<{ id: string; name: string; cost: number; qty: number } | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerSku, setScannerSku] = useState('');
  
  // Customer Add Form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustTin, setNewCustTin] = useState('');
  
  // Filter & search of items
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Draft persistence state
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>(() => {
    const local = localStorage.getItem('tributa_pos_drafts');
    return local ? JSON.parse(local) : [];
  });

  // Flow State
  const [paymentFlow, setPaymentFlow] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'momo' | 'bank' | 'credit' | null>(null);
  const [cashTendered, setCashTendered] = useState<string>('');
  const [momoProvider, setMomoProvider] = useState('MTN');
  const [momoPhone, setMomoPhone] = useState('');
  const [momoAwaitingSeconds, setMomoAwaitingSeconds] = useState(0);
  const [completedOrderReceipt, setCompletedOrderReceipt] = useState<{
    invoiceNo: string;
    items: CartItem[];
    subtotal: number;
    vat: number;
    total: number;
    customer: Customer | null;
    paymentMethod: string;
    timestamp: string;
    cashTendered?: number;
    changeGiven?: number;
  } | null>(null);

  // Mobile View Toggles
  const [mobileActivePanel, setMobileActivePanel] = useState<'products' | 'invoice_checkout'>('products');

  useEffect(() => {
    localStorage.setItem('tributa_pos_drafts', JSON.stringify(savedCarts));
  }, [savedCarts]);

  // Momo countdown simulator
  useEffect(() => {
    let interval: any;
    if (momoAwaitingSeconds > 0) {
      interval = setInterval(() => {
        setMomoAwaitingSeconds(prev => {
          if (prev <= 1) {
            setPaymentFlow('success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [momoAwaitingSeconds]);

  // General calculated elements
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [cart]);

  const vatAmount = useMemo(() => {
    return subtotal * 0.075;
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    return subtotal + vatAmount;
  }, [subtotal, vatAmount]);

  const formatNairaValue = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  };

  // Filter categorized products based on state
  const filteredProducts = useMemo(() => {
    return inventoryItems.filter(item => {
      // Category categorization based on name properties
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedCategory === 'All') return matchesSearch;
      if (selectedCategory === 'Compounds' && (item.name.toLowerCase().includes('compound') || item.name.toLowerCase().includes('hardener') || item.name.toLowerCase().includes('powder'))) return matchesSearch;
      if (selectedCategory === 'Resins' && (item.name.toLowerCase().includes('resin') || item.name.toLowerCase().includes('monomer') || item.name.toLowerCase().includes('pigment'))) return matchesSearch;
      if (selectedCategory === 'Catalysts' && (item.name.toLowerCase().includes('catalyst') || item.name.toLowerCase().includes('solvent') || item.name.toLowerCase().includes('agent'))) return matchesSearch;
      if (selectedCategory === 'Packaging' && (item.name.toLowerCase().includes('packaging') || item.name.toLowerCase().includes('wrap'))) return matchesSearch;
      return matchesSearch;
    });
  }, [inventoryItems, searchQuery, selectedCategory]);

  // Filter customers for dropdown lookups
  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery) return customers;
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || 
      c.phone.includes(customerSearchQuery) ||
      (c.tin && c.tin.includes(customerSearchQuery))
    );
  }, [customers, customerSearchQuery]);

  // Function to add item to cart
  const handleAddProduct = (item: { id: string; name: string; cost: number; qty: number }, variant?: string) => {
    if (item.qty <= 0) {
      onAction(`Error: SKU ${item.id} is out of stock.`);
      return;
    }

    const price = item.cost * 1.5; // Retail price with 50% markup
    const displayVariant = variant || (ITEM_VARIANTS[item.id] ? ITEM_VARIANTS[item.id][0] : undefined);
    const cartItemId = displayVariant ? `${item.id}-${displayVariant.replace(/\s+/g, '')}` : item.id;
    const nameWithVariant = displayVariant ? `${item.name} (${displayVariant})` : item.name;

    const existing = cart.find(c => c.id === cartItemId);
    if (existing) {
      // Check stock limit
      if (existing.qty >= item.qty) {
        onAction(`Cannot exceed limited physical store quantity of ${item.qty} units.`);
        return;
      }
      setCart(cart.map(c => c.id === cartItemId ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { 
        id: cartItemId, 
        name: nameWithVariant, 
        sku: item.id, 
        price: price, 
        qty: 1, 
        variant: displayVariant,
        origId: item.id
      }]);
    }
    
    onAction(`Added ${nameWithVariant} to cart.`);
  };

  const handleSelectItem = (item: { id: string; name: string; cost: number; qty: number }) => {
    if (ITEM_VARIANTS[item.id]) {
      setVariantModalItem(item);
    } else {
      handleAddProduct(item);
    }
  };

  const updateCartQty = (itemId: string, newQty: number, origSku: string) => {
    const rawItem = inventoryItems.find(i => i.id === origSku);
    if (!rawItem) return;

    if (newQty > rawItem.qty) {
      onAction(`Cannot exceed maximum physical stock constraints (${rawItem.qty} units available).`);
      return;
    }

    if (newQty <= 0) {
      setCart(cart.filter(c => c.id !== itemId));
    } else {
      setCart(cart.map(c => c.id === itemId ? { ...c, qty: newQty } : c));
    }
  };

  // Draft Saving and Loading
  const handleSaveDraft = () => {
    if (cart.length === 0) {
      onAction("Cannot save empty cart as draft.");
      return;
    }
    const cartName = prompt("Enter a descriptor tag for this draft:", `Cart Draft #${savedCarts.length + 1}`);
    if (!cartName) return;

    const newDraft: SavedCart = {
      id: `DRF-${Date.now()}`,
      name: cartName,
      items: [...cart],
      customer: selectedCustomer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSavedCarts([newDraft, ...savedCarts]);
    onAction("Cart saved successfully as offline draft.");
  };

  const handleLoadDraft = (draft: SavedCart) => {
    setCart(draft.items);
    setSelectedCustomer(draft.customer);
    setIsB2B(!!draft.customer?.tin);
    setShowSavedCarts(false);
    onAction(`Restored saved draft layout "${draft.name}".`);
  };

  // Add customer callback
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustEmail) {
      alert("Please fill in Name, Phone, and Email.");
      return;
    }

    const nCust: Customer = {
      id: `CST-00${customers.length + 1}`,
      name: newCustName,
      phone: newCustPhone,
      email: newCustEmail,
      tin: newCustTin || undefined,
      creditLimit: newCustTin ? 1000000 : 0
    };

    setCustomers([...customers, nCust]);
    setSelectedCustomer(nCust);
    setIsB2B(!!newCustTin);
    setShowAddCustomer(false);
    
    // Clear form states
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustTin('');

    onAction(`Registered new customer client: ${nCust.name}`);
  };

  // Proceed to Payment handler
  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    setPaymentFlow('idle');
    setSelectedPaymentMethod('cash');
    setCashTendered('');
  };

  // Trigger barcode search simulator
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerSku) return;
    const found = inventoryItems.find(i => i.id.toLowerCase() === scannerSku.toLowerCase() || i.id.toLowerCase().replace('-', '') === scannerSku.toLowerCase().replace('-', ''));
    if (found) {
      handleSelectItem(found);
      setScannerSku('');
      setScannerActive(false);
      onAction(`Barcoded: ${found.name} identified.`);
    } else {
      alert(`SKU or Barcode "${scannerSku}" not found in inventory lookup.`);
    }
  };

  // Final confirmation execution
  const executePaymentConfirmation = () => {
    setPaymentFlow('processing');

    const invNo = `INV-2026-${Math.floor(10284 + Math.random() * 89715)}`;
    let cashPaid: number | undefined = undefined;
    let change: number | undefined = undefined;

    if (selectedPaymentMethod === 'cash') {
      const tendered = parseFloat(cashTendered) || totalAmount;
      if (tendered < totalAmount) {
        alert("Amount tendered is less than total price invoice amount.");
        setPaymentFlow('idle');
        return;
      }
      cashPaid = tendered;
      change = tendered - totalAmount;
    }

    setTimeout(() => {
      // Log transaction details
      const newTx: Transaction = {
        id: `TX-${Math.floor(10023 + Math.random() * 89912)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Sale',
        description: `POS Checkout (${cart.length} items) - Invoice ${invNo}`,
        amount: totalAmount,
        status: 'Completed'
      };

      setTransactions([newTx, ...transactions]);

      // Deduct materials raw quantity
      const updatedInventory = inventoryItems.map(rawItem => {
        const cartQty = cart.filter(c => c.origId === rawItem.id).reduce((sum, c) => sum + c.qty, 0);
        return {
          ...rawItem,
          qty: Math.max(0, rawItem.qty - cartQty)
        };
      });
      setInventoryItems(updatedInventory);

      // Save confirmation receipt details
      setCompletedOrderReceipt({
        invoiceNo: invNo,
        items: [...cart],
        subtotal: subtotal,
        vat: vatAmount,
        total: totalAmount,
        customer: selectedCustomer,
        paymentMethod: selectedPaymentMethod?.toUpperCase() || 'CASH',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cashTendered: cashPaid,
        changeGiven: change
      });

      setPaymentFlow('success');
      onAction(`Checkout successful. Transmitted e-invoice ${invNo} directly to NRS registry.`);
    }, 1500);
  };

  // Reset to fresh sale
  const handleResetTerminal = () => {
    setCart([]);
    setSelectedCustomer(null);
    setIsB2B(false);
    setPaymentFlow('idle');
    setSelectedPaymentMethod(null);
    setCompletedOrderReceipt(null);
    setMobileActivePanel('products');
    setIsInvoiceCheckoutActive(false);
  };

  // Helper values for sales summary computed data
  const todaysSalesTable = useMemo(() => {
    return transactions.filter(t => t.date === '2026-05-29' && t.type === 'Sale');
  }, [transactions]);

  const salesSummaryKPIs = useMemo(() => {
    const totalSales = todaysSalesTable.reduce((sum, t) => sum + t.amount, 0);
    const count = todaysSalesTable.length;
    const vat = totalSales * (7.5 / 107.5); // Derived VAT paid
    const exVat = totalSales - vat;
    const avg = count > 0 ? totalSales / count : 0;

    return { totalSales, vat, exVat, count, avg };
  }, [todaysSalesTable]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 font-sans md:relative" id="pos-terminal-widget">
      
      {/* Sub-header navigation with tabs and controls */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-2.5 flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <button 
            onClick={() => setPosTab('checkout')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              posTab === 'checkout' 
                ? 'bg-purple-50 text-brand-purple' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Terminal checkout
          </button>
          <button 
            onClick={() => setPosTab('summary')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              posTab === 'summary' 
                ? 'bg-purple-50 text-brand-purple' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Daily report register
          </button>
        </div>

        {/* Saved Cart Trigger */}
        {posTab === 'checkout' && (
          <div className="relative">
            <button 
              onClick={() => setShowSavedCarts(!showSavedCarts)}
              className="px-3 py-1.5 border border-slate-200 hover:border-brand-purple hover:bg-purple-50/30 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileText size={13} className="text-brand-purple" />
              <span>Draft Carts ({savedCarts.length})</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {/* Micro Carts Drops */}
            {showSavedCarts && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-2xl z-40 p-3 max-h-72 overflow-y-auto">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Saved Cart drafts</h4>
                {savedCarts.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-4 font-medium">No saved drafts found</p>
                ) : (
                  <div className="space-y-2">
                    {savedCarts.map(draft => (
                      <div key={draft.id} className="p-2 border border-slate-100 rounded-lg hover:border-brand-purple/40 hover:bg-purple-50/10 flex justify-between items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate leading-snug">{draft.name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>{draft.items.length} items</span>
                            <span>•</span>
                            <span>{draft.timestamp}</span>
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button 
                            onClick={() => handleLoadDraft(draft)}
                            className="p-1 px-1.5 rounded bg-brand-purple/10 text-brand-purple text-[10px] font-bold hover:bg-brand-purple text-white transition-colors"
                          >
                            Load
                          </button>
                          <button 
                            onClick={() => setSavedCarts(savedCarts.filter(s => s.id !== draft.id))}
                            className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-slate-50 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {posTab === 'checkout' ? (
        isInvoiceCheckoutActive ? (
          /* THE NEW E-INVOICE & PAYMENT CHECKOUT VIEW (Takes full space) */
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden select-none">
            {/* Top Bar controls */}
            <div className="bg-white border-b border-slate-200 p-4 shrink-0 flex justify-between items-center">
              <button 
                onClick={() => setIsInvoiceCheckoutActive(false)}
                className="flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-brand-purple transition-all cursor-pointer"
              >
                <ArrowRight size={14} className="rotate-180 text-brand-purple" />
                <span>Back to Order Builder</span>
              </button>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200/55">
                  Transaction step 2 of 2
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-brand-purple animate-pulse" />
              </div>
            </div>

            {/* Layout Columns */}
            <div className="flex-1 flex lg:flex-row flex-col overflow-hidden max-w-7xl mx-auto w-full p-6 gap-6">
              
              {/* Col 1: Live Compliant E-Invoice Preview */}
              <div className="flex-1 flex flex-col min-h-[350px] overflow-hidden">
                <div className="flex justify-between items-center mb-3 shrink-0">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={13} className="text-brand-purple" />
                    <span>NRS E-Invoice Draft Preview</span>
                  </h3>
                  <span className="text-[9px] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded text-brand-purple font-bold">Nigeria Revenue Service Verified</span>
                </div>
                
                {/* INVOICE PREVIEW CONTAINER */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex-1 flex flex-col justify-between font-mono text-xs leading-relaxed text-slate-600 relative overflow-hidden">
                  {/* Decorative stamp/border */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-purple" />
                  
                  <div className="space-y-5">
                    {/* Invoice Brand header */}
                    <div className="text-center pb-3.5 border-b border-dashed border-slate-200">
                      <h4 className="text-slate-900 font-extrabold text-sm tracking-widest uppercase font-sans">
                        {formData.fullName || "Tributa Manufacturing Ltd"}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-sans font-semibold uppercase tracking-wider">
                        Nigeria Revenue Service - Verified E-Invoice
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        TIN: {formData.tin || "TIN-8492019-X"} | VAT: {formData.vatNumber || "VAT-28490"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {formData.email || "accounts@business.gov.ng"}
                      </p>
                    </div>

                    {/* Metadata block */}
                    <div className="grid grid-cols-2 gap-4 text-[10px] bg-slate-50/50 p-3 rounded-xl border border-slate-200/55">
                      <div className="space-y-1">
                        <span className="text-slate-400 block font-sans font-bold uppercase tracking-wider text-[8px]">Invoice Details</span>
                        <div className="flex justify-between">
                          <span className="text-slate-400">NUMBER:</span>
                          <span className="font-extrabold text-slate-800 font-mono select-all">INV-2026-{completedOrderReceipt ? completedOrderReceipt.invoiceNo.split('-')[2] : 'DRAFT'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">STAMP DATE:</span>
                          <span className="font-extrabold text-slate-800 font-mono">2026-05-30 {completedOrderReceipt?.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">NRS LEDGER:</span>
                          <span className="font-extrabold text-emerald-600 font-mono">STAGED</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 block font-sans font-bold uppercase tracking-wider text-[8px]">Billed Client</span>
                        <div className="flex justify-between">
                          <span className="text-slate-400">CLIENT:</span>
                          <span className="font-extrabold text-slate-800 truncate max-w-[120px]" title={selectedCustomer?.name || 'GUEST CUSTOMER'}>{(selectedCustomer?.name || 'GUEST CUSTOMER').toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">PHONE:</span>
                          <span className="font-extrabold text-slate-800 font-mono">{selectedCustomer?.phone || 'N/A'}</span>
                        </div>
                        {selectedCustomer?.tin && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">TIN:</span>
                            <span className="font-extrabold text-brand-purple font-mono select-all">{selectedCustomer.tin}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Particulars Table */}
                    <div className="border-t border-b border-slate-200 py-2.5">
                      <div className="grid grid-cols-12 font-bold text-slate-900 border-b border-slate-100 pb-1.5 mb-2 font-sans tracking-wider text-[10px]">
                        <span className="col-span-6">RAW MATERIAL / PROD</span>
                        <span className="col-span-2 text-center">QTY</span>
                        <span className="col-span-4 text-right">TOTAL</span>
                      </div>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                        {cart.map(i => (
                          <div key={i.id} className="grid grid-cols-12 text-[10px] leading-tight text-slate-700">
                            <span className="col-span-6 truncate pr-2 font-bold text-slate-800" title={i.name}>{i.name.toUpperCase()}</span>
                            <span className="col-span-2 text-center font-bold text-slate-800">{i.qty}</span>
                            <span className="col-span-4 text-right font-black text-slate-800">{formatNairaValue(i.price * i.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals Summary */}
                    <div className="space-y-1 text-right ml-auto w-64 text-[10px]">
                      <div className="flex justify-between text-slate-500">
                        <span>SUBTOTAL (EXC-VAT):</span>
                        <span className="font-bold text-slate-800 font-mono">{formatNairaValue(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>VAT LIABILITY (7.5%):</span>
                        <span className="font-bold text-slate-800 font-mono">{formatNairaValue(vatAmount)}</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-slate-250 pt-2 text-xs font-sans font-black text-brand-purple">
                        <span>TOTAL AMOUNT DUE:</span>
                        <span>{formatNairaValue(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Anti-counterfeit stamp info */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/75 -mx-6 -mb-6 p-4 shrink-0 rounded-b-2xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-white border border-slate-200 p-1.5 shrink-0 rounded-lg shadow-sm">
                        <QrCode size={40} className="text-slate-800" />
                      </div>
                      <div>
                        <span className="text-[9px] bg-purple-50 text-brand-purple px-1.5 py-0.5 rounded border border-purple-100 font-mono font-bold uppercase tracking-wider">
                          NRS STATE: PENDING PAYMENT
                        </span>
                        <p className="text-[8px] text-slate-400 leading-snug mt-1.5 max-w-[200px]">
                          Once paid, transaction ledger is signed and uploaded digitally to Federal Inland Revenue Service gateway database.
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-[9px] border border-dashed border-slate-300 py-1.5 px-2.5 rounded-lg font-black text-slate-400 rotate-2 text-center tracking-widest leading-none font-sans select-none">
                      TRIBUTA FIRS<br />NRS DIRECT
                    </span>
                  </div>
                </div>
              </div>

              {/* Col 2: Payment options Selection */}
              <div className="w-full lg:w-[420px] xl:w-[460px] bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col overflow-hidden shrink-0 mt-auto lg:mt-0">
                <div className="p-5 border-b border-slate-100 bg-slate-50 shrink-0">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <CreditCard size={13} className="text-brand-purple" />
                    <span>Select Payment Gateway</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Choose payment channel to post tax stamp on NRS ledger</p>
                </div>

                <div className="flex-1 overflow-y-auto p-5 pb-6">
                  <div className="grid grid-cols-5 gap-1.5 mb-5 select-none">
                    {[
                      { id: 'cash', icon: Coins, title: 'Cash' },
                      { id: 'card', icon: CreditCard, title: 'Card' },
                      { id: 'momo', icon: Smartphone, title: 'Momo' },
                      { id: 'bank', icon: Building2, title: 'Bank' },
                      { id: 'credit', icon: FileText, title: 'Credit', disabled: !selectedCustomer || selectedCustomer.creditLimit <= 0 }
                    ].map(pay => {
                      const Icon = pay.icon;
                      const isSelected = selectedPaymentMethod === pay.id;
                      const isDisabled = pay.disabled;

                      return (
                        <button
                          key={pay.id}
                          disabled={isDisabled}
                          onClick={() => setSelectedPaymentMethod(pay.id as any)}
                          className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-[9px] font-black transition-all cursor-pointer ${
                            isDisabled 
                              ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : isSelected
                                ? 'bg-purple-50 text-brand-purple border-brand-purple shadow-[0_2px_8px_rgba(124,58,237,0.12)] ring-1 ring-brand-purple'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icon size={14} className={isSelected ? 'text-brand-purple' : 'text-slate-400'} />
                          <span className="mt-1 leading-none">{pay.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Payment Sub-flow input panels */}
                  {selectedPaymentMethod === 'cash' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs space-y-3.5">
                      <div className="flex justify-between items-center text-slate-705">
                        <span className="font-bold text-slate-600">Total payable price:</span>
                        <span className="font-black text-slate-900 text-sm ">{formatNairaValue(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center gap-3">
                        <span className="font-bold text-slate-600 shrink-0">Cash Tendered:</span>
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-[11px]">₦</span>
                          <input 
                            type="number" 
                            placeholder={totalAmount.toFixed(0)}
                            value={cashTendered}
                            onChange={(e) => setCashTendered(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-2 py-1.5 text-slate-800 font-bold outline-none focus:border-brand-purple"
                          />
                        </div>
                      </div>
                      
                      {/* Change calculation */}
                      {cashTendered && parseFloat(cashTendered) >= totalAmount && (
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 border-dashed text-brand-purple font-black text-xs">
                          <span>Return Change:</span>
                          <span>{formatNairaValue(parseFloat(cashTendered) - totalAmount)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedPaymentMethod === 'momo' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs space-y-2.5">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <p className="text-[10px] text-slate-400 font-extrabold mb-1 uppercase tracking-wider">Provider</p>
                          <select 
                            value={momoProvider}
                            onChange={(e) => setMomoProvider(e.target.value)}
                            className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-xs font-semibold"
                          >
                            <option>MTN MoMo</option>
                            <option>Airtel Money</option>
                            <option>OPay Cash</option>
                            <option>Palmpay POS</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-slate-400 font-extrabold mb-1 uppercase tracking-wider">Phone Number</p>
                          <input 
                            type="tel" 
                            placeholder="0803..."
                            value={momoPhone}
                            onChange={(e) => setMomoPhone(e.target.value)}
                            className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'bank' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs font-mono space-y-2 text-slate-600">
                      <p className="font-bold text-slate-800 font-sans mb-1 text-[11px]">Corporate Transfer Account:</p>
                      <div className="flex justify-between">
                        <span>BANK:</span>
                        <span className="font-bold text-slate-800 font-sans text-[10px]">GUARANTY TRUST BANK (GTB)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ACC NO:</span>
                        <span className="font-bold text-slate-800 text-xs select-all">0129-4820-19</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ACC NAME:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[170px] uppercase font-sans">{(formData.fullName || 'TRIBUTA MFG').toUpperCase()}</span>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'credit' && selectedCustomer && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs space-y-2 text-slate-600">
                      <div className="flex justify-between text-slate-800 font-bold">
                        <span>Remaining Credit limit:</span>
                        <span className="font-black text-brand-purple">{formatNairaValue(selectedCustomer.creditLimit - totalAmount)}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-0.5">
                        Approved terms: Net-30 interest-free corporate raw materials invoicing. Balance automatically tracks inside Withholding Tax records.
                      </p>
                    </div>
                  )}

                  <button 
                    disabled={cart.length === 0 || !selectedPaymentMethod || (selectedPaymentMethod === 'cash' && cashTendered !== '' && parseFloat(cashTendered) < totalAmount)}
                    onClick={executePaymentConfirmation}
                    className="w-full bg-slate-900 hover:bg-slate-850 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_22px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 pointer-events-auto cursor-pointer disabled:opacity-45"
                  >
                    <CreditCard size={15} />
                    <span>Confirm payment & sign NRS stamp</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* MAIN TWO-COLUMN TERMINAL SCREEN */
          <div className="flex-1 flex overflow-hidden lg:flex-row flex-col select-none">
            
            {/* Mobile responsive panel selector buttons */}
            <div className="lg:hidden flex border-b border-slate-200 shrink-0 bg-white text-slate-600">
              <button 
                onClick={() => setMobileActivePanel('products')}
                className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all ${
                  mobileActivePanel === 'products' 
                    ? 'border-brand-purple text-brand-purple bg-purple-50/20 font-extrabold' 
                    : 'border-transparent text-slate-500'
                }`}
              >
                1. Products Catalog
              </button>
              <button 
                onClick={() => setMobileActivePanel('invoice_checkout')}
                className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all ${
                  mobileActivePanel === 'invoice_checkout' 
                    ? 'border-brand-purple text-brand-purple bg-purple-50/20 font-extrabold' 
                    : 'border-transparent text-slate-500'
                }`}
              >
                2. Active Cart & Client ({cart.length})
              </button>
            </div>

            {/* LEFT PANEL: PRODUCT SEARCH & GRID (Full height products with no cart underneath) */}
            <div className={`flex-1 flex flex-col overflow-hidden min-w-0 bg-white ${
              mobileActivePanel === 'products' ? 'flex' : 'hidden lg:flex'
            }`}>
              
              {/* SEARCH & FILTERS */}
              <div className="p-4 bg-white border-b border-slate-200/60 shrink-0 flex flex-col md:flex-row gap-3">
                {/* Product search input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input 
                    type="text" 
                    placeholder="Search products by tag ID, Name, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-14 py-2 border border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple rounded-lg text-xs outline-none transition-all"
                  />
                  <button 
                    onClick={() => setScannerActive(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-purple transition-colors p-1 rounded"
                    title="Scan digital SKU"
                  >
                    <Barcode size={15} />
                  </button>
                </div>

                {/* Filtering Category Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0 self-center">
                  {['All', 'Compounds', 'Resins', 'Catalysts', 'Packaging'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-slate-900 text-white font-extrabold shadow-sm' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* View Switcher Controls */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 shrink-0 self-center">
                  <button
                    onClick={() => setProductViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${
                      productViewMode === 'grid'
                        ? 'bg-white text-brand-purple shadow-xs ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    onClick={() => setProductViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${
                      productViewMode === 'list'
                        ? 'bg-white text-brand-purple shadow-xs ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                    }`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>

              {/* PRODUCT GRID CONTAINER - Full Height */}
              <div className="flex-1 p-4 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                    <Package size={48} className="text-slate-300 mb-2 opacity-60" />
                    <p className="text-xs font-semibold">No products found</p>
                    <p className="text-[10px] mt-0.5">Try widening search criteria or filters</p>
                  </div>
                ) : productViewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(item => {
                      const price = item.cost * 1.5;
                      const isLowStock = item.qty <= item.threshold && item.qty > 0;
                      const isOutOfStock = item.qty === 0;

                      return (
                        <div 
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          className={`bg-white p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between group hover:shadow-md hover:border-brand-purple-dark/30 ${
                            isOutOfStock ? 'opacity-65 border-slate-200 bg-slate-50/50' : 'border-slate-200/80 shadow-sm'
                          }`}
                        >
                          <div>
                            {/* Stock Pill Badge */}
                            <div className="flex justify-between items-start mb-3">
                              <span className="font-mono text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                {item.id}
                              </span>
                              {isOutOfStock ? (
                                <span className="text-[9px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">
                                  Out of stock
                                </span>
                              ) : isLowStock ? (
                                <span className="text-[9px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full animate-pulse">
                                  Low stock
                                </span>
                              ) : (
                                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-150/40 px-1.5 py-0.5 rounded-full">
                                  In stock
                                </span>
                              )}
                            </div>

                            {/* Product Image Thumbnail in Grid View */}
                            <div className="mb-2.5">
                              {renderProductImageOrPlaceholder(item, "h-24")}
                            </div>

                            <h3 className="font-bold text-xs text-slate-800 leading-snug line-clamp-2 md:h-8 group-hover:text-brand-purple transition-colors">
                              {item.name}
                            </h3>
                          </div>

                          <div className="mt-4 pt-2.5 border-t border-slate-100 flex justify-between items-end">
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Selling price</p>
                              <span className="text-xs font-black text-slate-900 tracking-tight leading-none mt-1 inline-block">
                                {formatNairaValue(price)}
                              </span>
                            </div>
                            
                            <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-md font-mono">
                              {item.qty} left
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredProducts.map(item => {
                      const price = item.cost * 1.5;
                      const isLowStock = item.qty <= item.threshold && item.qty > 0;
                      const isOutOfStock = item.qty === 0;

                      return (
                        <div 
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          className={`bg-white px-4 py-3 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-4 group hover:shadow-xs hover:border-brand-purple-dark/35 ${
                            isOutOfStock ? 'opacity-65 border-slate-200 bg-slate-50/50' : 'border-slate-200/80 shadow-xs'
                          }`}
                        >
                          {/* Left contents: SKU, Name */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="font-mono text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded shrink-0">
                              {item.id}
                            </span>
                            
                            {/* Product Image Thumbnail in List View */}
                            {(() => {
                              const imgSrc = getProductImage(item);
                              return imgSrc ? (
                                <img src={imgSrc} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-3xs shrink-0 select-none" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 select-none">
                                  <Package size={14} />
                                </div>
                              );
                            })()}

                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-xs text-slate-800 truncate group-hover:text-brand-purple transition-colors">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                {isOutOfStock ? (
                                  <span className="text-[9px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded-full">
                                    Out of stock
                                  </span>
                                ) : isLowStock ? (
                                  <span className="text-[9px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-1.5 py-0.2 rounded-full animate-pulse">
                                    Low stock
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-150/40 px-1.5 py-0.2 rounded-full">
                                    In stock
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 font-medium font-mono">
                                  {item.qty} units left
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right contents: Price and plus action */}
                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest leading-none mb-1">Selling price</p>
                              <span className="text-xs font-black text-slate-900 tracking-tight leading-none">
                                {formatNairaValue(price)}
                              </span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-brand-purple/10 group-hover:text-brand-purple group-hover:border-brand-purple/20 transition-all">
                              <Plus size={14} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: CUSTOMER ASSIGNMENT & SHOPPING CART */}
            <div className={`w-full lg:w-[420px] xl:w-[460px] bg-white border-l border-slate-200 shadow-xl flex flex-col overflow-hidden shrink-0 ${
              mobileActivePanel === 'invoice_checkout' ? 'flex' : 'hidden lg:flex'
            }`}>
              
              {/* PANEL SECTION 1: CUSTOMER REGISTRY ASSIGNMENT */}
              <div className="p-4 border-b border-slate-200/60 shrink-0 bg-slate-50 select-none">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <User size={13} className="text-brand-purple" />
                    <span>Customer Profile Assignment</span>
                  </h3>
                  <button 
                    onClick={() => setShowAddCustomer(true)}
                    className="text-[10px] text-brand-purple hover:text-brand-purple-dark hover:underline font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <UserPlus size={12} />
                    <span>Add New</span>
                  </button>
                </div>

                {/* Customer quick select search bar */}
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={selectedCustomer ? `${selectedCustomer.name} assigned ✓` : "Search customer by name, phone number..."}
                    value={customerSearchQuery}
                    onFocus={() => setShowCustomerDropdown(true)}
                    onClick={() => setShowCustomerDropdown(true)}
                    onChange={(e) => {
                      setCustomerSearchQuery(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    className={`w-full pl-8 pr-12 py-1.5 border rounded-lg text-xs outline-none transition-all ${
                      selectedCustomer 
                        ? 'bg-purple-50/40 border-purple-200 text-brand-purple font-bold placeholder:text-brand-purple/70' 
                        : 'border-slate-200 bg-white focus:border-brand-purple'
                    }`}
                  />
                  
                  {selectedCustomer ? (
                    <button 
                      onClick={() => {
                        setSelectedCustomer(null);
                        setIsB2B(false);
                        setCustomerSearchQuery('');
                        onAction("Customer profile detached.");
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 font-bold text-[10px] hover:bg-slate-100 p-1 rounded transition-colors"
                    >
                      Detach
                    </button>
                  ) : customerSearchQuery && (
                    <button 
                      onClick={() => setCustomerSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-450 text-slate-500 hover:bg-slate-100 p-1 rounded"
                    >
                      Clear
                    </button>
                  )}

                  {/* Dropdown Customer query outputs on Focus / Click */}
                  {showCustomerDropdown && (
                    <>
                      {/* Fixed click-shield overlay background for outside click */}
                      <div className="fixed inset-0 z-10 bg-transparent" onClick={() => setShowCustomerDropdown(false)} />
                      <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 shadow-2xl rounded-xl z-20 p-2 max-h-56 overflow-y-auto">
                        {filteredCustomers.length === 0 ? (
                          <p className="text-center text-xs text-slate-400 py-3">No profiles matched. Click "Add New" to register.</p>
                        ) : (
                          <div className="space-y-1">
                            {filteredCustomers.map(cust => (
                              <div 
                                key={cust.id} 
                                onClick={() => {
                                  setSelectedCustomer(cust);
                                  setIsB2B(!!cust.tin);
                                  setCustomerSearchQuery('');
                                  setShowCustomerDropdown(false);
                                  onAction(`Customer assigned: ${cust.name}`);
                                }}
                                className={`p-2 border rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                                  selectedCustomer?.id === cust.id 
                                    ? 'border-brand-purple bg-purple-50/35'
                                    : 'border-slate-50 hover:border-brand-purple/20 hover:bg-purple-50/10'
                                }`}
                              >
                                <div className="min-w-0 flex-1 pr-2">
                                  <p className="text-xs font-bold text-slate-800 leading-tight truncate">{cust.name}</p>
                                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <span className="shrink-0">{cust.phone}</span>
                                    <span className="text-slate-200 shrink-0">|</span>
                                    <span className="truncate">{cust.email}</span>
                                  </p>
                                </div>
                                {cust.tin ? (
                                  <span className="shrink-0 font-mono text-brand-purple text-[8px] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 font-black">B2B</span>
                                ) : (
                                  <span className="shrink-0 text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">B2C</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* B2B TIN Warn banner alert checker */}
                {selectedCustomer && isB2B && (
                  <div className="mt-2.5 bg-purple-100/30 border border-purple-200/50 rounded-xl p-2 flex items-center gap-2 text-[10px] text-brand-purple font-medium">
                    <Building2 size={13} className="shrink-0" />
                    <p className="leading-snug">
                      B2B Mode Enabled. E-Invoice will capture client TIN <span className="font-mono font-bold bg-white px-1 py-0.5 border border-purple-100 rounded">{selectedCustomer.tin}</span> for automated input tax compliance credit.
                    </p>
                  </div>
                )}
              </div>

              {/* PANEL SECTION 2: PHYSICAL SHOPPING CART LISTING - VERTICALLY SPACIOUS */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col min-h-[150px] select-none text-slate-600">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-slate-750 uppercase tracking-widest flex items-center gap-1.5">
                    <ShoppingCart size={13} className="text-brand-purple" />
                    <span>Active Shopping Cart ({cart.reduce((sum,i)=>sum+i.qty,0)})</span>
                  </h3>
                  {cart.length > 0 && (
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to flush the current cart?")) {
                          setCart([]);
                          onAction("Cart purged.");
                        }
                      }}
                      className="text-[10px] text-slate-400 hover:text-red-500 uppercase tracking-widest font-black transition-colors cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>

                {/* Cart list scroll area */}
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-10 opacity-60">
                      <ShoppingCart size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-bold">Shopping cart empty</p>
                      <p className="text-[10px] mt-0.5 max-w-[200px] mx-auto text-slate-400 leading-normal">Select products from the catalog on the left to populate the active cart.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div 
                        key={item.id}
                        className="bg-white p-2.5 border border-slate-200 rounded-xl flex justify-between items-center gap-3 hover:border-brand-purple/20 shadow-xs"
                      >
                        {(() => {
                          const imgSrc = DEFAULT_PRODUCT_IMAGES[item.sku] || null;
                          return imgSrc ? (
                            <img src={imgSrc} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-3xs shrink-0 select-none" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 select-none">
                              <Package size={12} />
                            </div>
                          );
                        })()}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 font-sans">
                            <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                              {item.name}
                            </h4>
                            {item.variant && (
                              <span className="bg-purple-50 text-brand-purple font-bold text-[9px] px-1 py-0.5 rounded border border-purple-100 uppercase tracking-wide shrink-0 font-mono">
                                {item.variant.split(' ')[0]}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-extrabold text-brand-purple mt-1.5 leading-none font-mono">
                            {formatNairaValue(item.price * item.qty)} <span className="text-slate-400 font-medium text-[9px]">({formatNairaValue(item.price)} each)</span>
                          </p>
                        </div>

                        {/* Math control quantities */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                            <button 
                              onClick={() => updateCartQty(item.id, item.qty - 1, item.origId)}
                              className="w-5 h-5 flex items-center justify-center rounded bg-white text-slate-600 shadow-xs border border-slate-100 hover:text-brand-purple hover:border-brand-purple transition-all cursor-pointer"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-bold w-6 text-center select-all font-mono">{item.qty}</span>
                            <button 
                              onClick={() => updateCartQty(item.id, item.qty + 1, item.origId)}
                              className="w-5 h-5 flex items-center justify-center rounded bg-white text-slate-600 shadow-xs border border-slate-100 hover:text-brand-purple hover:border-brand-purple transition-all cursor-pointer"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <button 
                            onClick={() => {
                              setCart(cart.filter(c => c.id !== item.id));
                              onAction(`Removed ${item.name} from checkout cart.`);
                            }}
                            className="p-1 rounded text-slate-350 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PANEL SECTION 3: CHECKOUT TOTALS SUMMARY & BUTTON */}
              <div className="p-4 border-t border-slate-200 bg-white shrink-0 select-none">
                <div className="space-y-1.5 mb-4 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal (Ex-VAT):</span>
                    <span className="font-bold text-slate-800 font-mono">{formatNairaValue(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT Collected (7.5%):</span>
                    <span className="font-bold text-slate-800 font-mono">{formatNairaValue(vatAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-dashed border-slate-200 items-end">
                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">Total Amount:</span>
                    <span className="text-lg font-black text-brand-purple tracking-tight font-mono">{formatNairaValue(totalAmount)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    disabled={cart.length === 0}
                    onClick={handleSaveDraft}
                    className="px-3 py-3 border border-slate-200 hover:border-brand-purple rounded-xl text-xs font-bold text-slate-600 hover:text-brand-purple transition-colors bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase font-extrabold tracking-wide"
                  >
                    Save Draft
                  </button>
                  <button 
                    disabled={cart.length === 0}
                    onClick={() => {
                      setIsInvoiceCheckoutActive(true);
                      setSelectedPaymentMethod('cash');
                      setCashTendered('');
                    }}
                    className="flex-1 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(124,58,237,0.25)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 cursor-pointer font-sans"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )
      ) : (
        /* DAILY POS SUMMARY REGISTER VIEW */
        <div className="flex-1 p-6 overflow-y-auto space-y-6 select-none bg-slate-50">
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Receipt size={18} className="text-brand-purple" />
                <span>Today's Sales Register Ledger</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">Compiled summary for today's physical terminal checkout transactions (May 29, 2026)</p>
            </div>
          </div>

          {/* KPI grid blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {[
              { title: 'Total revenue (Inc-VAT)', val: formatNairaValue(salesSummaryKPIs.totalSales), icon: TrendingUp, color: 'text-brand-purple border-brand-purple/20 bg-purple-50/10' },
              { title: 'Exc-VAT Net Turnover', val: formatNairaValue(salesSummaryKPIs.exVat), icon: FileText, color: 'text-slate-700 border-slate-200 bg-white' },
              { title: 'Total VAT Collected', val: formatNairaValue(salesSummaryKPIs.vat), icon: Percent, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/10' },
              { title: 'Transactions Completed', val: salesSummaryKPIs.count, icon: CheckCircle, color: 'text-emerald-600 border-emerald-150/40 bg-emerald-50/10' }
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className={`p-4 rounded-xl border flex justify-between items-center shadow-sm ${kpi.color}`}>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">{kpi.title}</span>
                    <span className="text-base font-black tracking-tight mt-1 inline-block">{kpi.val}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
                    <Icon size={16} />
                  </div>
                </div>
              );
            })}

          </div>

          {/* Sales listing logs table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Today's transactions</h3>
              <span className="bg-purple-100 text-brand-purple text-[10px] font-mono px-2 py-0.5 rounded font-black border border-purple-200/50">
                LATEST LEDGERS LIVE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead>
                  <tr className="bg-slate-100/50 text-[10px] uppercase tracking-wider font-extrabold text-slate-450 text-slate-500 border-b border-slate-200">
                    <th className="py-3 px-4">Transaction stamp</th>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Description of raw material</th>
                    <th className="py-3 px-4 text-center">NRS Stamp</th>
                    <th className="py-3 px-4 text-right">Invoice value</th>
                    <th className="py-3 px-4">Payment method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todaysSalesTable.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-xs text-slate-405 text-slate-400 italic font-medium">
                        No POS register receipts completed yet today
                      </td>
                    </tr>
                  ) : (
                    todaysSalesTable.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock size={11} className="text-slate-400" />
                          <span>04:12 PM</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 select-all font-mono text-[10px]">
                          {tx.description.includes('INV-') ? tx.description.split('Invoice ')[1] : tx.id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {tx.description}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-mono font-bold uppercase">
                            Transmitted
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900 tracking-tight">
                          {formatNairaValue(tx.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold tracking-wider uppercase font-mono">
                            CASH DIRECT
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* COMPACT FLOATING BARCODE SCANNER MOCK ELEMENT */}
      <AnimatePresence>
        {scannerActive && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xl max-w-sm w-full font-sans select-none"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-extrabold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Barcode className="text-brand-purple" size={16} />
                  <span>Interactive barcode scanner</span>
                </span>
                <button 
                  onClick={() => setScannerActive(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleBarcodeSubmit} className="space-y-4">
                <div className="h-28 bg-slate-100 border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                  {/* Laser effect lines */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 animate-bounce shadow-[0_0_8px_red]" />
                  <div className="text-center">
                    <p className="text-[10px] text-slate-405 text-slate-550 mb-1 leading-none font-bold">SIMULATED LASER ACTIVE</p>
                    <p className="text-[8px] text-slate-400 mt-2">Hold barcodes flat against laser scanner</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Select barcode raw SKU directly:</label>
                  <select 
                    value={scannerSku}
                    onChange={(e) => setScannerSku(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl font-bold text-slate-800"
                  >
                    <option value="">-- CHOOSE PHYSICAL SKU TO SCAN --</option>
                    {inventoryItems.map(i => (
                      <option key={i.id} value={i.id}>{i.id} - {i.name} ({i.qty} left)</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setScannerActive(false);
                      setScannerSku('');
                    }}
                    className="flex-1 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!scannerSku}
                    className="flex-1 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-extrabold rounded-xl uppercase tracking-wider disabled:opacity-55"
                  >
                    Scan SKU
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REUSABLE PRODUCT VARIANT SELECTOR */}
      <AnimatePresence>
        {variantModalItem && (
          <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-[1.5px] z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 border border-slate-250 shadow-2xl max-w-sm w-full font-sans"
            >
              <h3 className="font-sans font-black text-slate-905 text-sm text-slate-900 border-b border-slate-100 pb-2 mb-3">
                Select compound Grade Variant
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-wider">
                Product: <span className="text-slate-800 font-extrabold">{variantModalItem.name}</span>
              </p>

              <div className="space-y-3 mb-5">
                <p className="text-[9px] text-slate-450 uppercase font-bold tracking-widest leading-none">Choose grade attributes:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(ITEM_VARIANTS[variantModalItem.id] || ['Standard Grade']).map(variant => (
                    <button
                      key={variant}
                      onClick={() => {
                        handleAddProduct(variantModalItem, variant);
                        setVariantModalItem(null);
                      }}
                      className="px-3 py-2.5 border border-slate-200 hover:border-brand-purple hover:bg-purple-50/40 hover:text-brand-purple text-left rounded-xl transition-all cursor-pointer font-bold text-xs"
                    >
                      <span className="block text-slate-755 text-slate-800">{variant}</span>
                      <span className="text-[10px] text-brand-purple font-extrabold mt-1 inline-block">
                        {formatNairaValue(variantModalItem.cost * 1.5)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setVariantModalItem(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs"
              >
                Cancel selection
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLEX CUSTOMER REGISTRY MODAL INSERT */}
      <AnimatePresence>
        {showAddCustomer && (
          <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-[1.5px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-2xl font-sans"
            >
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center select-none">
                <span className="font-extrabold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <UserPlus size={14} className="text-brand-purple" />
                  <span>Add Customer Client</span>
                </span>
                <button onClick={() => setShowAddCustomer(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full shadow-sm border border-slate-200">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="p-4 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Full Client Company Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Obajana Manufacturing Ltd"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-purple"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Billing Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. accounts@obajana.com"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-purple"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Corporate Phone Line</label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    <input 
                      type="tel" 
                      placeholder="+234 803 000 0000"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-purple"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center select-none">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Nigeria Corporate TIN (Optional)</label>
                    <span className="text-[8px] bg-slate-150 border border-slate-200 rounded text-slate-450 text-[9px] px-1 font-mono">B2B INVOICE CAPABLE</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. FIRS-8492023-Y"
                    value={newCustTin}
                    onChange={(e) => setNewCustTin(e.target.value)}
                    className="w-full p-2 border border-slate-200 focus:border-brand-purple rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-2 select-none">
                  <button 
                    type="button" 
                    onClick={() => setShowAddCustomer(false)}
                    className="flex-1 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-extrabold uppercase tracking-widest rounded-xl"
                  >
                    Register client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLEX PAYMENT GATEWAY / PROCESSING AND RECEIPT OVERLAYS */}
      <AnimatePresence>
        {paymentFlow !== 'idle' && (
          <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl font-sans"
            >
              
              {paymentFlow === 'processing' && (
                <div className="p-8 text-center space-y-4">
                  {/* Real simulated processing loops */}
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-150 border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-brand-purple border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 tracking-wide uppercase">NRS ledger transmitting processing...</h3>
                  <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto leading-normal">
                    Establishing highly encrypted live connection to Nigeria Revenue Service (NRS) API gateway to securely post VAT tax stamps and authorize POS debit clearing loops.
                  </p>
                </div>
              )}

              {paymentFlow === 'success' && completedOrderReceipt && (
                <div className="p-5 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
                  
                  {/* Top Success Tick */}
                  <div className="text-center space-y-2 mb-4 shrink-0">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full border border-emerald-150/40 flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle size={28} />
                    </div>
                    <h3 className="text-xs font-black tracking-widest uppercase text-slate-800">
                      Payment Received Successfully ✓
                    </h3>
                    <p className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full inline-block">
                      Transmitted & Timestamped in NRS Registry
                    </p>
                  </div>

                  {/* Complete e-Receipt Display */}
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-[9px] leading-tight text-slate-600 mb-5 max-h-[250px] overflow-y-auto">
                    <div className="text-center pb-2 border-b border-dashed border-slate-250 mb-3 font-sans">
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase">{(formData.fullName || 'Tributa Store').toUpperCase()}</h4>
                      <p className="text-[8px] text-slate-400">INVOICE STAMP APPROVED</p>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between">
                        <span>INVOICE NO:</span>
                        <span className="font-bold text-slate-800 select-all">{completedOrderReceipt.invoiceNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PAY METHOD:</span>
                        <span className="font-bold text-brand-purple">{completedOrderReceipt.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TIME STAMP:</span>
                        <span className="font-bold text-slate-850 text-slate-800">2026-05-29 {completedOrderReceipt.timestamp}</span>
                      </div>
                      {completedOrderReceipt.customer && (
                        <div className="flex justify-between border-t border-slate-100 pt-1.5">
                          <span>CLIENT BILLED:</span>
                          <span className="font-bold text-slate-805 truncate max-w-[140px] text-slate-800">
                            {completedOrderReceipt.customer.name.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-b border-slate-200 py-1.5 mb-3">
                      {completedOrderReceipt.items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span className="truncate max-w-[160px]">{item.name.toUpperCase()}</span>
                          <span>{item.qty} x {formatNairaValue(item.price)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 text-right max-w-sm ml-auto">
                      <div className="flex justify-between">
                        <span>SUB-TOTAL:</span>
                        <span className="font-bold text-slate-800">{formatNairaValue(completedOrderReceipt.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (7.5%):</span>
                        <span className="font-bold text-slate-800">{formatNairaValue(completedOrderReceipt.vat)}</span>
                      </div>
                      <div className="flex justify-between font-sans font-black text-brand-purple border-t border-dashed border-slate-300 pt-1 text-[10px]">
                        <span>TOTAL AMOUNT PAID:</span>
                        <span>{formatNairaValue(completedOrderReceipt.total)}</span>
                      </div>
                      {completedOrderReceipt.cashTendered !== undefined && (
                        <>
                          <div className="flex justify-between text-slate-400 mt-1">
                            <span>CASH TENDERED:</span>
                            <span>{formatNairaValue(completedOrderReceipt.cashTendered)}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>CHANGE GIVEN:</span>
                            <span>{formatNairaValue(completedOrderReceipt.changeGiven || 0)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-3">
                      <QrCode size={55} className="text-slate-800 bg-white border border-slate-200 p-1 rounded" />
                      <div className="font-sans leading-normal">
                        <span className="text-[8px] bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-widest inline-block select-all">NRS-HASH-Y49X29</span>
                        <p className="text-[8px] text-slate-400 mt-1 leading-snug">
                          Invoice verification ledger uploaded securely to FIRS tax record storage registries. Refer to NRS code or scan details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Receipt Triggers */}
                  <div className="space-y-2 shrink-0">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          window.print();
                          onAction("Receipt print queue requested.");
                        }}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer size={13} />
                        <span>Print Receipt</span>
                      </button>
                      <button 
                        onClick={() => {
                          alert(`Receipt successfully dispatched directly to customer: ${completedOrderReceipt.customer?.email || 'accounts@walkin.gov.ng'}`);
                          onAction("Invoice dispatch success.");
                        }}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Mail size={13} />
                        <span>Email Invoice</span>
                      </button>
                    </div>

                    <button 
                      onClick={handleResetTerminal}
                      className="w-full py-3.5 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-lg shadow-purple-100 flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all outline-none cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Start New Sale checkout</span>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
