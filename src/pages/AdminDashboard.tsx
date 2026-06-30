import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, ShoppingCart, Package, Printer, CreditCard,
  BarChart3, Settings, LogOut, Eye, EyeOff, Lock, CheckCircle, XCircle,
  Clock, ChevronRight, TrendingUp, TrendingDown, DollarSign, Download,
  Store, AlertCircle, Search, Filter, ArrowUpDown, Plus, Trash2, Edit,
  FileText, Image, Phone, Mail, MapPin, Shield, Bell, BadgeCheck, UserCircle
} from 'lucide-react';

/* ─── Types ─── */
interface Farmer {
  id: number;
  name: string;
  phone: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  products: number;
  joined: string;
}

interface VerificationFarmer {
  id: number;
  name: string;
  phone: string;
  location: string;
  profilePhoto: string;
  idDocument?: string;
  status: 'pending' | 'verified' | 'rejected';
  submitted: string;
}

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  commission: number;
}

interface Product {
  id: number;
  name: string;
  farmer: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  category: string;
}

interface PrintOrder {
  id: string;
  customer: string;
  files: number;
  pages: number;
  type: string;
  amount: number;
  status: 'received' | 'printing' | 'ready' | 'delivered';
  date: string;
}

interface Transaction {
  id: string;
  type: 'order' | 'commission' | 'withdrawal' | 'print';
  description: string;
  amount: number;
  date: string;
}

interface Withdrawal {
  id: string;
  farmer: string;
  amount: number;
  status: 'pending' | 'processed';
  requested: string;
}

/* ─── Mock Data ─── */
/* Load real farmers from localStorage + mock data */
const storedFarmers = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('shambani_farmers') || '[]') : [];
const storedVerifications: VerificationFarmer[] = typeof window !== 'undefined' ? storedFarmers.map((f: any) => ({
  id: f.id,
  name: f.name,
  phone: f.phone,
  location: f.district || f.village || 'Uganda',
  profilePhoto: f.profilePhoto || '',
  status: f.status === 'approved' ? 'verified' : 'pending',
  submitted: f.joined,
})) : [];

const initialFarmers: Farmer[] = [
  { id: 1, name: 'John Okello', phone: '+256 701 234 567', location: 'Gulu', status: 'approved', products: 12, joined: '2024-01-15' },
  { id: 2, name: 'Mary Auma', phone: '+256 702 345 678', location: 'Lira', status: 'pending', products: 0, joined: '2024-03-20' },
  { id: 3, name: 'Peter Ochien', phone: '+256 703 456 789', location: 'Mbale', status: 'approved', products: 8, joined: '2024-02-10' },
  { id: 4, name: 'Grace Nakato', phone: '+256 704 567 890', location: 'Jinja', status: 'pending', products: 0, joined: '2024-04-05' },
  { id: 5, name: 'David Ouma', phone: '+256 705 678 901', location: 'Arua', status: 'approved', products: 15, joined: '2024-01-28' },
  ...storedFarmers.map((f: any, i: number) => ({
    id: f.id || 100 + i,
    name: f.name,
    phone: f.phone,
    location: f.district || f.village || 'Uganda',
    status: f.status as 'pending' | 'approved' | 'rejected',
    products: 0,
    joined: f.joined,
  })),
];

const initialOrders: Order[] = [
  { id: 'ORD-001', customer: 'Alice Mugisha', product: 'Organic Maize (5kg)', amount: 25000, status: 'delivered', date: '2024-05-20', commission: 625 },
  { id: 'ORD-002', customer: 'Robert Kato', product: 'Fresh Beans (2kg)', amount: 18000, status: 'shipped', date: '2024-05-21', commission: 450 },
  { id: 'ORD-003', customer: 'Sarah Nambi', product: 'Sweet Potatoes (3kg)', amount: 15000, status: 'pending', date: '2024-05-22', commission: 375 },
  { id: 'ORD-004', customer: 'James Okot', product: 'Groundnuts (1kg)', amount: 12000, status: 'confirmed', date: '2024-05-22', commission: 300 },
  { id: 'ORD-005', customer: 'Patricia Achan', product: 'Sunflower Oil (1L)', amount: 22000, status: 'pending', date: '2024-05-23', commission: 550 },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Organic Maize', farmer: 'John Okello', price: 5000, stock: 50, status: 'active', category: 'Grains' },
  { id: 2, name: 'Fresh Beans', farmer: 'Peter Ochien', price: 9000, stock: 30, status: 'active', category: 'Legumes' },
  { id: 3, name: 'Sweet Potatoes', farmer: 'David Ouma', price: 5000, stock: 40, status: 'active', category: 'Tubers' },
  { id: 4, name: 'Groundnuts', farmer: 'John Okello', price: 12000, stock: 25, status: 'inactive', category: 'Nuts' },
  { id: 5, name: 'Sunflower Oil', farmer: 'David Ouma', price: 22000, stock: 15, status: 'active', category: 'Oils' },
  { id: 6, name: 'Sorghum Flour', farmer: 'Peter Ochien', price: 7000, stock: 20, status: 'active', category: 'Flour' },
];

const initialPrintOrders: PrintOrder[] = [
  { id: 'PRT-001', customer: 'Dr. Ssentamu', files: 3, pages: 45, type: 'B&W', amount: 22500, status: 'ready', date: '2024-05-21' },
  { id: 'PRT-002', customer: 'Kampala Clinic', files: 1, pages: 12, type: 'Color', amount: 18000, status: 'printing', date: '2024-05-22' },
  { id: 'PRT-003', customer: 'Bright School', files: 5, pages: 120, type: 'B&W', amount: 60000, status: 'received', date: '2024-05-23' },
  { id: 'PRT-004', customer: 'Sarah Nakityo', files: 2, pages: 28, type: 'Color', amount: 42000, status: 'delivered', date: '2024-05-20' },
];

const initialTransactions: Transaction[] = [
  { id: 'TXN-001', type: 'order', description: 'Order ORD-001 commission', amount: 625, date: '2024-05-20' },
  { id: 'TXN-002', type: 'order', description: 'Order ORD-002 commission', amount: 450, date: '2024-05-21' },
  { id: 'TXN-003', type: 'print', description: 'Print PRT-001 order', amount: 22500, date: '2024-05-21' },
  { id: 'TXN-004', type: 'commission', description: 'Platform fee collection', amount: 1225, date: '2024-05-22' },
  { id: 'TXN-005', type: 'print', description: 'Print PRT-002 order', amount: 18000, date: '2024-05-22' },
];

const initialWithdrawals: Withdrawal[] = [
  { id: 'WTH-001', farmer: 'John Okello', amount: 150000, status: 'pending', requested: '2024-05-22' },
  { id: 'WTH-002', farmer: 'David Ouma', amount: 230000, status: 'pending', requested: '2024-05-23' },
];

const initialVerifications: VerificationFarmer[] = [
  { id: 101, name: 'Auma Grace', phone: '+256 706 123 456', location: 'Gulu', profilePhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face', status: 'pending', submitted: '2024-06-25' },
  { id: 102, name: 'Ojok Samuel', phone: '+256 702 987 654', location: 'Lira', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', idDocument: 'ID_UPLOADED', status: 'pending', submitted: '2024-06-26' },
  { id: 103, name: 'Akello Christine', phone: '+256 704 456 789', location: 'Kitgum', profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', status: 'pending', submitted: '2024-06-26' },
  ...storedVerifications,
];

const ADMIN_PASSWORD = 'admin123';

/* ─── Login Screen ─── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    if (locked && lockTimer > 0) {
      const t = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(t);
    }
    if (locked && lockTimer === 0) {
      setLocked(false);
      setAttempts(0);
    }
  }, [locked, lockTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    if (password.toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
      sessionStorage.setItem('shambani_admin', 'true');
      setError('');
      onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setLocked(true);
        setLockTimer(60);
        setError('Too many failed attempts. Locked for 60 seconds.');
      } else {
        setError(`Invalid password. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ShambaNi Admin</h1>
          <p className="text-gray-500 mt-1">Sign in to manage your marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={locked}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-600 flex-1">
                <p>{error}</p>
                {locked && (
                  <button
                    type="button"
                    onClick={() => { setLocked(false); setAttempts(0); setLockTimer(0); setError(''); }}
                    className="text-green-600 hover:text-green-700 underline mt-1 text-xs font-medium"
                  >
                    Reset Lock
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={locked || !password}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            {locked ? `Locked (${lockTimer}s)` : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/#/" className="text-sm text-green-600 hover:text-green-700">
            Back to ShambaNi Home
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Admin Dashboard ─── */
export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    sessionStorage.getItem('shambani_admin') === 'true'
  );
  const [activeTab, setActiveTab] = useState('dashboard');

  /* Data State */
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>(initialPrintOrders);
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);
  const [verifications, setVerifications] = useState<VerificationFarmer[]>(initialVerifications);
  const [platformFee, setPlatformFee] = useState(2.5);

  /* Search States */
  const [searchFarmers, setSearchFarmers] = useState('');
  const [searchOrders, setSearchOrders] = useState('');
  const [searchProducts, setSearchProducts] = useState('');

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('shambani_admin');
    setIsLoggedIn(false);
  }, []);

  /* Actions */
  const approveFarmer = (id: number) => {
    setFarmers(fs => fs.map(f => f.id === id ? { ...f, status: 'approved' as const } : f));
  };
  const rejectFarmer = (id: number) => {
    setFarmers(fs => fs.map(f => f.id === id ? { ...f, status: 'rejected' as const } : f));
  };
  const advanceOrder = (id: string) => {
    const flow: Record<string, string> = { pending: 'confirmed', confirmed: 'shipped', shipped: 'delivered' };
    setOrders(os => os.map(o => o.id === id && flow[o.status] ? { ...o, status: flow[o.status] as Order['status'] } : o));
  };
  const toggleProduct = (id: number) => {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' as const : 'active' as const } : p));
  };
  const advancePrint = (id: string) => {
    const flow: Record<string, string> = { received: 'printing', printing: 'ready', ready: 'delivered' };
    setPrintOrders(ps => ps.map(p => p.id === id && flow[p.status] ? { ...p, status: flow[p.status] as PrintOrder['status'] } : p));
  };
  const processWithdrawal = (id: string) => {
    setWithdrawals(ws => ws.map(w => w.id === id ? { ...w, status: 'processed' as const } : w));
  };
  const approveVerification = (id: number) => {
    setVerifications(vs => vs.map(v => v.id === id ? { ...v, status: 'verified' as const } : v));
  };
  const rejectVerification = (id: number) => {
    setVerifications(vs => vs.map(v => v.id === id ? { ...v, status: 'rejected' as const } : v));
  };

  /* Stats */
  const stats = {
    totalFarmers: farmers.length,
    approvedFarmers: farmers.filter(f => f.status === 'approved').length,
    pendingFarmers: farmers.filter(f => f.status === 'pending').length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((s, o) => s + o.amount, 0),
    totalCommission: orders.reduce((s, o) => s + o.commission, 0),
    activeProducts: products.filter(p => p.status === 'active').length,
    printOrders: printOrders.length,
    printRevenue: printOrders.reduce((s, p) => s + p.amount, 0),
    pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
    pendingVerifications: verifications.filter(v => v.status === 'pending').length,
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farmers', label: 'Farmers', icon: Users },
    { id: 'verification', label: 'Verification', icon: BadgeCheck },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'printdrop', label: 'PrintDrop', icon: Printer },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-green-700">ShambaNi Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Marketplace Manager</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.id === 'farmers' && stats.pendingFarmers > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">{stats.pendingFarmers}</span>
              )}
              {tab.id === 'verification' && stats.pendingVerifications > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">{stats.pendingVerifications}</span>
              )}
              {tab.id === 'orders' && stats.pendingOrders > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">{stats.pendingOrders}</span>
              )}
              {tab.id === 'payments' && stats.pendingWithdrawals > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{stats.pendingWithdrawals}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-green-700">ShambaNi Admin</h1>
        <button onClick={handleLogout} className="text-red-600 text-sm font-medium">Sign Out</button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Platform Fee: {platformFee}%</span>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Farmers" value={stats.totalFarmers} icon={Users} trend={`${stats.approvedFarmers} approved`} color="green" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} trend={`${stats.pendingOrders} pending`} color="blue" />
                <StatCard title="Revenue (UGX)" value={stats.totalRevenue.toLocaleString()} icon={DollarSign} trend={`${stats.totalCommission.toLocaleString()} commission`} color="amber" />
                <StatCard title="PrintDrop Orders" value={stats.printOrders} icon={Printer} trend={`UGX ${stats.printRevenue.toLocaleString()}`} color="purple" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" /> Recent Orders
                  </h3>
                  <div className="space-y-3">
                    {orders.slice(0, 4).map(o => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{o.id}</p>
                          <p className="text-xs text-gray-500">{o.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">UGX {o.amount.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            o.status === 'confirmed' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" /> Pending Actions
                  </h3>
                  <div className="space-y-3">
                    {stats.pendingVerifications > 0 && (
                      <ActionCard icon={BadgeCheck} text={`${stats.pendingVerifications} farmer${stats.pendingVerifications > 1 ? 's' : ''} awaiting identity verification`} action="Review" onClick={() => setActiveTab('verification')} color="blue" />
                    )}
                    {stats.pendingFarmers > 0 && (
                      <ActionCard icon={Users} text={`${stats.pendingFarmers} farmer${stats.pendingFarmers > 1 ? 's' : ''} pending approval`} action="Review" onClick={() => setActiveTab('farmers')} color="amber" />
                    )}
                    {stats.pendingOrders > 0 && (
                      <ActionCard icon={ShoppingCart} text={`${stats.pendingOrders} order${stats.pendingOrders > 1 ? 's' : ''} awaiting confirmation`} action="Process" onClick={() => setActiveTab('orders')} color="amber" />
                    )}
                    {stats.pendingWithdrawals > 0 && (
                      <ActionCard icon={CreditCard} text={`${stats.pendingWithdrawals} withdrawal request${stats.pendingWithdrawals > 1 ? 's' : ''}`} action="Release" onClick={() => setActiveTab('payments')} color="red" />
                    )}
                    {printOrders.filter(p => p.status === 'received').length > 0 && (
                      <ActionCard icon={Printer} text={`${printOrders.filter(p => p.status === 'received').length} print job${printOrders.filter(p => p.status === 'received').length > 1 ? 's' : ''} to start`} action="Start" onClick={() => setActiveTab('printdrop')} color="purple" />
                    )}
                    {stats.pendingVerifications === 0 && stats.pendingFarmers === 0 && stats.pendingOrders === 0 && stats.pendingWithdrawals === 0 && printOrders.filter(p => p.status === 'received').length === 0 && (
                      <p className="text-gray-500 text-sm">No pending actions. All caught up!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500 font-medium">ID</th>
                        <th className="text-left py-2 text-gray-500 font-medium">Type</th>
                        <th className="text-left py-2 text-gray-500 font-medium">Description</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(t => (
                        <tr key={t.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 font-mono text-xs">{t.id}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              t.type === 'order' ? 'bg-blue-100 text-blue-700' :
                              t.type === 'commission' ? 'bg-green-100 text-green-700' :
                              t.type === 'print' ? 'bg-purple-100 text-purple-700' :
                              'bg-red-100 text-red-700'
                            }`}>{t.type}</span>
                          </td>
                          <td className="py-3">{t.description}</td>
                          <td className="py-3 text-right font-semibold">UGX {t.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── VERIFICATION QUEUE ── */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Pending Verification</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{stats.pendingVerifications}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Verified Today</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{verifications.filter(v => v.status === 'verified').length}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Total Submissions</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{verifications.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                    Farmers Awaiting Verification
                  </h3>
                </div>
                {verifications.filter(v => v.status === 'pending').length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <BadgeCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm mt-1">No farmers pending verification.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {verifications.filter(v => v.status === 'pending').map(v => (
                      <div key={v.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                        <img
                          src={v.profilePhoto}
                          alt={v.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{v.name}</p>
                            {v.idDocument && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">ID UPLOADED</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{v.phone} · {v.location}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Submitted {v.submitted}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => approveVerification(v.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verify
                          </button>
                          <button
                            onClick={() => rejectVerification(v.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Farmers */}
              {verifications.filter(v => v.status === 'verified').length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Verified Farmers
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {verifications.filter(v => v.status === 'verified').map(v => (
                      <div key={v.id} className="p-4 flex items-center gap-4">
                        <img
                          src={v.profilePhoto}
                          alt={v.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 flex items-center gap-1.5">
                            {v.name}
                            <BadgeCheck className="w-4 h-4 text-green-500" />
                          </p>
                          <p className="text-xs text-gray-500">{v.phone} · {v.location}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Verified</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── FARMERS ── */}
          {activeTab === 'farmers' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search farmers by name, phone, or location..."
                  value={searchFarmers}
                  onChange={(e) => setSearchFarmers(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Products</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {farmers
                        .filter(f => !searchFarmers || f.name.toLowerCase().includes(searchFarmers.toLowerCase()) || f.phone.includes(searchFarmers) || f.location.toLowerCase().includes(searchFarmers.toLowerCase()))
                        .map(f => (
                        <tr key={f.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{f.name}</td>
                          <td className="py-3 px-4 text-gray-600">{f.phone}</td>
                          <td className="py-3 px-4 text-gray-600">{f.location}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              f.status === 'approved' ? 'bg-green-100 text-green-700' :
                              f.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>{f.status}</span>
                          </td>
                          <td className="py-3 px-4 text-right">{f.products}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              {f.status === 'pending' && (
                                <>
                                  <button onClick={() => approveFarmer(f.id)} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Approve">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => rejectFarmer(f.id)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {f.status === 'approved' && (
                                <button onClick={() => rejectFarmer(f.id)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Suspend">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              {f.status === 'rejected' && (
                                <button onClick={() => approveFarmer(f.id)} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Re-approve">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer, or product..."
                  value={searchOrders}
                  onChange={(e) => setSearchOrders(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Commission</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(o => !searchOrders || o.id.toLowerCase().includes(searchOrders.toLowerCase()) || o.customer.toLowerCase().includes(searchOrders.toLowerCase()) || o.product.toLowerCase().includes(searchOrders.toLowerCase()))
                        .map(o => (
                        <tr key={o.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-xs">{o.id}</td>
                          <td className="py-3 px-4">{o.customer}</td>
                          <td className="py-3 px-4 text-gray-600">{o.product}</td>
                          <td className="py-3 px-4 text-right font-semibold">UGX {o.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-green-600">UGX {o.commission.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              o.status === 'confirmed' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>{o.status}</span>
                          </td>
                          <td className="py-3 px-4">
                            {o.status !== 'delivered' && (
                              <button
                                onClick={() => advanceOrder(o.id)}
                                className="flex items-center gap-1 mx-auto px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Advance <ChevronRight className="w-3 h-3" />
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

          {/* ── PRODUCTS ── */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, farmer, or category..."
                  value={searchProducts}
                  onChange={(e) => setSearchProducts(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Farmer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Stock</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(p => !searchProducts || p.name.toLowerCase().includes(searchProducts.toLowerCase()) || p.farmer.toLowerCase().includes(searchProducts.toLowerCase()) || p.category.toLowerCase().includes(searchProducts.toLowerCase()))
                        .map(p => (
                        <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{p.name}</td>
                          <td className="py-3 px-4 text-gray-600">{p.farmer}</td>
                          <td className="py-3 px-4 text-gray-600">{p.category}</td>
                          <td className="py-3 px-4 text-right">UGX {p.price.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">{p.stock}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>{p.status}</span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleProduct(p.id)}
                              className={`flex items-center gap-1 mx-auto px-3 py-1 text-xs rounded ${
                                p.status === 'active'
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {p.status === 'active' ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                              {p.status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PRINTDROP ── */}
          {activeTab === 'printdrop' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Total Print Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.printOrders}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Print Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">UGX {stats.printRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{printOrders.filter(p => p.status !== 'delivered').length}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Print ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Files</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Pages</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printOrders.map(p => (
                        <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-xs">{p.id}</td>
                          <td className="py-3 px-4">{p.customer}</td>
                          <td className="py-3 px-4 text-right">{p.files}</td>
                          <td className="py-3 px-4 text-right">{p.pages}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              p.type === 'Color' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                            }`}>{p.type}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold">UGX {p.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              p.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              p.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                              p.status === 'printing' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>{p.status}</span>
                          </td>
                          <td className="py-3 px-4">
                            {p.status !== 'delivered' && (
                              <button
                                onClick={() => advancePrint(p.id)}
                                className="flex items-center gap-1 mx-auto px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                              >
                                Advance <ChevronRight className="w-3 h-3" />
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

          {/* ── PAYMENTS ── */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Total Commission</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">UGX {stats.totalCommission.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Pending Withdrawals</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pendingWithdrawals}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500">Platform Fee Rate</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{platformFee}%</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Withdrawal Requests</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500 font-medium">ID</th>
                        <th className="text-left py-2 text-gray-500 font-medium">Farmer</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Amount</th>
                        <th className="text-left py-2 text-gray-500 font-medium">Requested</th>
                        <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                        <th className="text-center py-2 text-gray-500 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map(w => (
                        <tr key={w.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 font-mono text-xs">{w.id}</td>
                          <td className="py-3">{w.farmer}</td>
                          <td className="py-3 text-right font-semibold">UGX {w.amount.toLocaleString()}</td>
                          <td className="py-3 text-gray-600">{w.requested}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              w.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>{w.status}</span>
                          </td>
                          <td className="py-3">
                            {w.status === 'pending' && (
                              <button
                                onClick={() => processWithdrawal(w.id)}
                                className="flex items-center gap-1 mx-auto px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                <CheckCircle className="w-3 h-3" /> Release
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {withdrawals.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-gray-500">No withdrawal requests</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Marketplace Orders</span>
                        <span className="font-semibold">UGX {stats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.totalRevenue / (stats.totalRevenue + stats.printRevenue)) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">PrintDrop Orders</span>
                        <span className="font-semibold">UGX {stats.printRevenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(stats.printRevenue / (stats.totalRevenue + stats.printRevenue)) * 100}%` }} />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Revenue</span>
                        <span className="font-bold text-green-600">UGX {(stats.totalRevenue + stats.printRevenue).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Commission Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">Platform Commission Earned</span>
                      <span className="font-bold text-green-700">UGX {stats.totalCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-700">Commission Rate</span>
                      <span className="font-bold text-blue-700">{platformFee}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm text-gray-700">Pending Release</span>
                      <span className="font-bold text-amber-700">UGX {(stats.totalCommission * 0.3).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard label="Conversion Rate" value="68%" trend="up" />
                  <MetricCard label="Avg Order Value" value="UGX 18,400" trend="up" />
                  <MetricCard label="Farmer Retention" value="92%" trend="up" />
                  <MetricCard label="Delivery Success" value="97%" trend="up" />
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" /> Platform Fee
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Percentage: <span className="text-green-600 font-bold">{platformFee}%</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                      className="w-full accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1%</span>
                      <span>10%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    You earn <strong className="text-green-600">{platformFee}%</strong> on every order placed through the platform.
                    Current estimated monthly commission: <strong>UGX {Math.round(stats.totalCommission * 4).toLocaleString()}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-blue-500" /> Business Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">+256 708 813 419</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">ryglutwa0@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Kampala, Uganda</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" /> Security
                </h3>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out of Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ─── Sub-components ─── */
function StatCard({ title, value, icon: Icon, trend, color }: { title: string; value: string | number; icon: any; trend: string; color: string }) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.green}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{trend}</p>
    </div>
  );
}

function ActionCard({ icon: Icon, text, action, onClick, color }: { icon: any; text: string; action: string; onClick: () => void; color: string }) {
  const btnColors: Record<string, string> = {
    amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    red: 'bg-red-100 text-red-700 hover:bg-red-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  };
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-700">{text}</span>
      </div>
      <button onClick={onClick} className={`px-3 py-1 rounded text-xs font-medium ${btnColors[color] || btnColors.blue}`}>
        {action}
      </button>
    </div>
  );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: 'up' | 'down' }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {trend === 'up' ? (
        <TrendingUp className="w-4 h-4 text-green-500 mx-auto mt-2" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500 mx-auto mt-2" />
      )}
    </div>
  );
}
