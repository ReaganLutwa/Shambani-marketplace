import { useState, useCallback } from 'react';
import {
  LayoutDashboard, Users, ShoppingCart, Package,
  Printer, CreditCard, BarChart3, Settings,
  Menu, X, LogOut, Leaf, TrendingUp, Clock, CheckCircle, DollarSign,
  AlertTriangle, Search, ChevronDown, Play, Truck, CheckCheck,
  ArrowUpRight, ArrowDownRight, Filter,
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */
type OrderStatus = 'pending' | 'confirmed' | 'in_transit' | 'delivered';
type PrintStatus = 'pending' | 'printing' | 'ready' | 'delivered';
type ProductStatus = 'active' | 'flagged' | 'out_of_stock';
type FarmerStatus = 'approved' | 'pending' | 'rejected';
type PaymentStatus = 'released' | 'held';
type WithdrawalStatus = 'pending' | 'released';

type ViewKey = 'dashboard' | 'farmers' | 'orders' | 'products' | 'printdrop' | 'payments' | 'analytics' | 'settings';

/* ═══════════════════════════════════════════════
   INITIAL DATA
   ═══════════════════════════════════════════════ */
const initialFarmers = [
  { id: 1, name: 'Reagan Lutwama', farm: 'Lutwama Family Farm', location: 'Mpigi, Uganda', phone: '+256 708 813 419', products: 'Eggs, Chicken, Vegetables', status: 'approved' as FarmerStatus, joined: '2024-01-15' },
  { id: 2, name: 'Nakamya Josephine', farm: 'Josie Gardens', location: 'Wakiso, Uganda', phone: '+256 701 234 567', products: 'Cabbage, Tomatoes', status: 'approved' as FarmerStatus, joined: '2024-02-20' },
  { id: 3, name: 'Kato John', farm: 'Kato Farms', location: 'Mukono, Uganda', phone: '+256 702 345 678', products: 'Matooke, Bananas', status: 'pending' as FarmerStatus, joined: '2025-06-20' },
  { id: 4, name: 'Acen Mary', farm: 'Mary\'s Groundnuts', location: 'Gulu, Uganda', phone: '+256 703 456 789', products: 'Groundnuts, Simsim', status: 'approved' as FarmerStatus, joined: '2024-03-10' },
  { id: 5, name: 'Mutebi David', farm: 'Pineapple Paradise', location: 'Masaka, Uganda', phone: '+256 704 567 890', products: 'Pineapples, Mangoes', status: 'approved' as FarmerStatus, joined: '2024-04-05' },
];

const initialOrders = [
  { id: '#4521', buyer: 'Mukasa David', farmer: 'Reagan Lutwama', items: '5 trays eggs', total: 57500, status: 'confirmed' as OrderStatus, date: '2025-06-26 14:30' },
  { id: '#4520', buyer: 'Nantume Grace', farmer: 'Nakamya Josephine', items: '20 heads cabbage', total: 40000, status: 'delivered' as OrderStatus, date: '2025-06-26 11:15' },
  { id: '#4519', buyer: 'Okello James', farmer: 'Acen Mary', items: '10 kg groundnuts', total: 80000, status: 'in_transit' as OrderStatus, date: '2025-06-26 09:00' },
  { id: '#4518', buyer: 'Kwagala Jane', farmer: 'Kato John', items: '3 bunches matooke', total: 45000, status: 'pending' as OrderStatus, date: '2025-06-25 16:45' },
  { id: '#4517', buyer: 'Ssempala Michael', farmer: 'Mutebi David', items: '8 pineapples', total: 40000, status: 'delivered' as OrderStatus, date: '2025-06-25 10:20' },
  { id: '#4516', buyer: 'Namugenyi Sarah', farmer: 'Reagan Lutwama', items: '3 trays eggs, 2 chickens', total: 51600, status: 'confirmed' as OrderStatus, date: '2025-06-25 08:00' },
  { id: '#4515', buyer: 'Otim Robert', farmer: 'Nakamya Josephine', items: '15 heads cabbage, 5 kg tomatoes', total: 52500, status: 'in_transit' as OrderStatus, date: '2025-06-24 15:30' },
];

const initialProducts = [
  { id: 1, name: 'Fresh Eggs (Tray)', category: 'Dairy', farmer: 'Reagan Lutwama', price: 11500, stock: 45, status: 'active' as ProductStatus },
  { id: 2, name: 'Whole Chicken', category: 'Livestock', farmer: 'Reagan Lutwama', price: 18000, stock: 20, status: 'active' as ProductStatus },
  { id: 3, name: 'Green Cabbage', category: 'Vegetables', farmer: 'Nakamya Josephine', price: 2000, stock: 60, status: 'active' as ProductStatus },
  { id: 4, name: 'Red Tomatoes', category: 'Vegetables', farmer: 'Nakamya Josephine', price: 3500, stock: 0, status: 'out_of_stock' as ProductStatus },
  { id: 5, name: 'Matooke (Bunch)', category: 'Vegetables', farmer: 'Kato John', price: 15000, stock: 30, status: 'active' as ProductStatus },
  { id: 6, name: 'Groundnuts (kg)', category: 'Grains', farmer: 'Acen Mary', price: 8000, stock: 100, status: 'flagged' as ProductStatus },
];

const initialPrintOrders = [
  { id: 'PRT-0048', customer: 'Sarah Kimani', type: 'color' as const, pages: 25, cost: 37500, location: 'Kampala, Nakasero', status: 'pending' as PrintStatus },
  { id: 'PRT-0047', customer: 'David Mwangi', type: 'bw' as const, pages: 120, cost: 60000, location: 'Wakiso, Entebbe Rd', status: 'pending' as PrintStatus },
  { id: 'PRT-0046', customer: 'Grace Akello', type: 'bw' as const, pages: 45, cost: 22500, location: 'Mpigi, Town', status: 'printing' as PrintStatus },
  { id: 'PRT-0045', customer: 'Michael Ouma', type: 'color' as const, pages: 12, cost: 18000, location: 'Kampala, Bugolobi', status: 'printing' as PrintStatus },
  { id: 'PRT-0044', customer: 'Jane Akello', type: 'bw' as const, pages: 80, cost: 40000, location: 'Kampala, Ntinda', status: 'ready' as PrintStatus },
  { id: 'PRT-0043', customer: 'John Mukasa', type: 'color' as const, pages: 8, cost: 12000, location: 'Mukono, Seeta', status: 'ready' as PrintStatus },
  { id: 'PRT-0042', customer: 'Patricia N.', type: 'bw' as const, pages: 60, cost: 30000, location: 'Wakiso, Kira', status: 'delivered' as PrintStatus },
  { id: 'PRT-0041', customer: 'Esther Nalubega', type: 'color' as const, pages: 15, cost: 22500, location: 'Wakiso, Namasuba', status: 'delivered' as PrintStatus },
];

const initialTransactions = [
  { id: 'TXN-001', from: 'Mukasa David', method: 'Airtel Money', amount: 57500, fee: 1438, net: 56062, status: 'released' as PaymentStatus },
  { id: 'TXN-002', from: 'Nantume Grace', method: 'MTN Mobile Money', amount: 40000, fee: 1000, net: 39000, status: 'released' as PaymentStatus },
  { id: 'TXN-003', from: 'Okello James', method: 'PayPal', amount: 80000, fee: 2000, net: 78000, status: 'held' as PaymentStatus },
  { id: 'TXN-004', from: 'Kwagala Jane', method: 'Airtel Money', amount: 45000, fee: 1125, net: 43875, status: 'held' as PaymentStatus },
  { id: 'TXN-005', from: 'Ssempala Michael', method: 'Bank Transfer', amount: 40000, fee: 1000, net: 39000, status: 'released' as PaymentStatus },
];

const initialWithdrawals = [
  { id: 'WD-001', farmer: 'Reagan Lutwama', amount: 95000, status: 'pending' as WithdrawalStatus },
  { id: 'WD-002', farmer: 'Nakamya Josephine', amount: 79000, status: 'pending' as WithdrawalStatus },
  { id: 'WD-003', farmer: 'Acen Mary', amount: 117000, status: 'released' as WithdrawalStatus },
];

const navItems: { key: ViewKey; icon: typeof LayoutDashboard; label: string }[] = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'farmers', icon: Users, label: 'Farmers' },
  { key: 'orders', icon: ShoppingCart, label: 'Orders' },
  { key: 'products', icon: Package, label: 'Products' },
  { key: 'printdrop', icon: Printer, label: 'PrintDrop' },
  { key: 'payments', icon: CreditCard, label: 'Payments' },
  { key: 'analytics', icon: BarChart3, label: 'Analytics' },
  { key: 'settings', icon: Settings, label: 'Settings' },
];

/* ═══════════════════════════════════════════════
   STATUS HELPERS
   ═══════════════════════════════════════════════ */
function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    in_transit: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    printing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    flagged: 'bg-red-500/10 text-red-400 border-red-500/20',
    out_of_stock: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    released: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    held: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || map.pending}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── State ── */
  const [farmers, setFarmers] = useState(initialFarmers);
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [printOrders, setPrintOrders] = useState(initialPrintOrders);
  const [transactions] = useState(initialTransactions);
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [platformFee, setPlatformFee] = useState(2.5);

  /* ── Search states ── */
  const [searchFarmers, setSearchFarmers] = useState('');
  const [searchOrders, setSearchOrders] = useState('');
  const [searchPrint, setSearchPrint] = useState('');
  const [searchProducts, setSearchProducts] = useState('');

  /* ── Filter states ── */
  const [filterFarmerStatus, setFilterFarmerStatus] = useState<FarmerStatus | 'all'>('all');
  const [filterOrderStatus, setFilterOrderStatus] = useState<OrderStatus | 'all'>('all');
  const [filterPrintStatus, setFilterPrintStatus] = useState<PrintStatus | 'all'>('all');

  /* ── Stats ── */
  const totalRevenue = transactions.filter(t => t.status === 'released').reduce((s, t) => s + t.amount, 0)
    + transactions.filter(t => t.status === 'held').reduce((s, t) => s + t.amount, 0);
  const commissionEarned = transactions.reduce((s, t) => s + t.fee, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const pendingFarmersCount = farmers.filter(f => f.status === 'pending').length;

  /* ═══════════════════════════════════════════════
     ACTIONS
     ═══════════════════════════════════════════════ */

  // Approve/Reject farmer
  const updateFarmerStatus = useCallback((id: number, status: FarmerStatus) => {
    setFarmers(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  }, []);

  // Update order status
  const nextOrderStatus: Record<OrderStatus, OrderStatus | null> = {
    pending: 'confirmed',
    confirmed: 'in_transit',
    in_transit: 'delivered',
    delivered: null,
  };
  const advanceOrder = useCallback((id: string) => {
    setOrders(prev => prev.map(o => {
      const next = nextOrderStatus[o.status];
      return o.id === id && next ? { ...o, status: next } : o;
    }));
  }, []);

  // Update print status
  const nextPrintStatus: Record<PrintStatus, PrintStatus | null> = {
    pending: 'printing',
    printing: 'ready',
    ready: 'delivered',
    delivered: null,
  };
  const advancePrint = useCallback((id: string) => {
    setPrintOrders(prev => prev.map(o => {
      const next = nextPrintStatus[o.status];
      return o.id === id && next ? { ...o, status: next } : o;
    }));
  }, []);

  // Toggle product status
  const toggleProduct = useCallback((id: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const next: ProductStatus = p.status === 'active' ? 'flagged' : p.status === 'flagged' ? 'out_of_stock' : 'active';
      return { ...p, status: next };
    }));
  }, []);

  // Approve withdrawal
  const approveWithdrawal = useCallback((id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'released' as WithdrawalStatus } : w));
  }, []);

  /* ═══════════════════════════════════════════════
     FILTERED DATA
     ═══════════════════════════════════════════════ */
  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = !searchFarmers || f.name.toLowerCase().includes(searchFarmers.toLowerCase()) || f.farm.toLowerCase().includes(searchFarmers.toLowerCase());
    const matchesStatus = filterFarmerStatus === 'all' || f.status === filterFarmerStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !searchOrders || o.buyer.toLowerCase().includes(searchOrders.toLowerCase()) || o.id.toLowerCase().includes(searchOrders.toLowerCase());
    const matchesStatus = filterOrderStatus === 'all' || o.status === filterOrderStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPrintOrders = printOrders.filter(o => {
    const matchesSearch = !searchPrint || o.customer.toLowerCase().includes(searchPrint.toLowerCase()) || o.id.toLowerCase().includes(searchPrint.toLowerCase());
    const matchesStatus = filterPrintStatus === 'all' || o.status === filterPrintStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter(p => !searchProducts || p.name.toLowerCase().includes(searchProducts.toLowerCase()) || p.farmer.toLowerCase().includes(searchProducts.toLowerCase()));

  /* ═══════════════════════════════════════════════
     VIEWS
     ═══════════════════════════════════════════════ */

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingCart, color: 'text-emerald-400', sub: `${pendingOrdersCount} pending` },
          { label: 'Total Farmers', value: farmers.length.toString(), icon: Users, color: 'text-emerald-400', sub: `${pendingFarmersCount} pending approval` },
          { label: 'Total Revenue', value: `UGX ${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-amber-400', sub: 'All time' },
          { label: 'Your Commission', value: `UGX ${(commissionEarned / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-emerald-400', sub: `${platformFee}% platform fee` },
        ].map(s => (
          <div key={s.label} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="font-bold text-2xl text-[#E2E8F0]">{s.value}</div>
            <div className="text-[13px] text-[#94A3B8] mt-0.5">{s.label}</div>
            <div className="text-[11px] text-[#64748B] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Orders', value: pendingOrdersCount.toString(), icon: Clock, color: 'text-amber-400' },
          { label: 'Pending Farmers', value: pendingFarmersCount.toString(), icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Print Orders', value: printOrders.length.toString(), icon: Printer, color: 'text-emerald-400' },
          { label: 'Products Listed', value: products.length.toString(), icon: Package, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="font-bold text-2xl text-[#E2E8F0]">{s.value}</div>
            <div className="text-[13px] text-[#94A3B8] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155] flex items-center justify-between">
          <h3 className="font-semibold text-[#E2E8F0]">Recent Orders</h3>
          <button onClick={() => setActiveView('orders')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#334155]">
              {['Order ID', 'Buyer', 'Farmer', 'Items', 'Total', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-[#334155]">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{o.id}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{o.buyer}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{o.farmer}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{o.items}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">UGX {o.total.toLocaleString()}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Summary */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h3 className="font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Commission Summary ({platformFee}% Platform Fee)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Total Sales</p>
            <p className="text-xl font-bold text-[#E2E8F0]">UGX {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 mb-1">Your Commission ({platformFee}%)</p>
            <p className="text-xl font-bold text-emerald-400">UGX {commissionEarned.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Paid to Farmers</p>
            <p className="text-xl font-bold text-[#E2E8F0]">UGX {(totalRevenue - commissionEarned).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const FarmersView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input value={searchFarmers} onChange={e => setSearchFarmers(e.target.value)} placeholder="Search farmers..."
            className="w-full h-10 pl-9 pr-4 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="relative">
          <select value={filterFarmerStatus} onChange={e => setFilterFarmerStatus(e.target.value as FarmerStatus | 'all')}
            className="h-10 px-4 pr-8 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-[#E2E8F0] focus:outline-none focus:border-emerald-500 appearance-none">
            <option value="all">All Status</option><option value="approved">Approved</option><option value="pending">Pending</option><option value="rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        </div>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#334155]">
              {['Name', 'Farm', 'Location', 'Products', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredFarmers.map(f => (
                <tr key={f.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3"><div className="text-sm font-semibold text-[#E2E8F0]">{f.name}</div><div className="text-xs text-[#64748B]">{f.phone}</div></td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{f.farm}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{f.location}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{f.products}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={f.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {f.status === 'pending' && (
                        <>
                          <button onClick={() => updateFarmerStatus(f.id, 'approved')} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors">Approve</button>
                          <button onClick={() => updateFarmerStatus(f.id, 'rejected')} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-colors">Reject</button>
                        </>
                      )}
                      {f.status === 'approved' && (
                        <button onClick={() => updateFarmerStatus(f.id, 'pending')} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs hover:bg-amber-500/20 transition-colors">Suspend</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredFarmers.length === 0 && <div className="text-center py-12 text-[#64748B]">No farmers found</div>}
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input value={searchOrders} onChange={e => setSearchOrders(e.target.value)} placeholder="Search orders..."
            className="w-full h-10 pl-9 pr-4 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="relative">
          <select value={filterOrderStatus} onChange={e => setFilterOrderStatus(e.target.value as OrderStatus | 'all')}
            className="h-10 px-4 pr-8 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-[#E2E8F0] focus:outline-none focus:border-emerald-500 appearance-none">
            <option value="all">All Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="in_transit">In Transit</option><option value="delivered">Delivered</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        </div>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#334155]">
              {['Order ID', 'Buyer', 'Farmer', 'Items', 'Total', 'Status', 'Action'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{o.id}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{o.buyer}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{o.farmer}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{o.items}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">UGX {o.total.toLocaleString()}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    {o.status !== 'delivered' ? (
                      <button onClick={() => advanceOrder(o.id)}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
                        {o.status === 'pending' ? <><Play className="w-3 h-3" /> Confirm</> :
                         o.status === 'confirmed' ? <><Truck className="w-3 h-3" /> Ship</> :
                         <><CheckCheck className="w-3 h-3" /> Deliver</>}
                      </button>
                    ) : <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Done</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ProductsView = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input value={searchProducts} onChange={e => setSearchProducts(e.target.value)} placeholder="Search products..."
          className="w-full max-w-md h-10 pl-9 pr-4 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-emerald-500" />
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#334155]">
              {['Product', 'Category', 'Farmer', 'Price', 'Stock', 'Status', 'Action'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{p.category}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{p.farmer}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">UGX {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{p.stock}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleProduct(p.id)}
                      className="px-3 py-1.5 bg-[#334155] text-[#E2E8F0] rounded-lg text-xs hover:bg-[#475569] transition-colors">
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PrintDropView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: printOrders.filter(o => o.status !== 'delivered').length.toString(), icon: Printer, color: 'text-emerald-400' },
          { label: 'Pending Print', value: printOrders.filter(o => o.status === 'pending').length.toString(), icon: Clock, color: 'text-amber-400' },
          { label: 'Print Revenue', value: `UGX ${(printOrders.reduce((s, o) => s + o.cost, 0) / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Pages Printed', value: printOrders.reduce((s, o) => s + o.pages, 0).toLocaleString(), icon: CheckCircle, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div className="font-bold text-2xl text-[#E2E8F0]">{s.value}</div>
            <div className="text-[13px] text-[#94A3B8] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input value={searchPrint} onChange={e => setSearchPrint(e.target.value)} placeholder="Search print orders..."
            className="w-full h-10 pl-9 pr-4 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="relative">
          <select value={filterPrintStatus} onChange={e => setFilterPrintStatus(e.target.value as PrintStatus | 'all')}
            className="h-10 px-4 pr-8 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-[#E2E8F0] focus:outline-none focus:border-emerald-500 appearance-none">
            <option value="all">All Orders</option><option value="pending">Pending</option><option value="printing">Printing</option><option value="ready">Ready</option><option value="delivered">Delivered</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        </div>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#334155]">
              {['Order ID', 'Customer', 'Type', 'Pages', 'Cost', 'Location', 'Status', 'Action'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredPrintOrders.map(o => (
                <tr key={o.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{o.id}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{o.customer}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8] capitalize">{o.type === 'bw' ? 'B&W' : 'Color'}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{o.pages}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">UGX {o.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{o.location}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    {o.status !== 'delivered' ? (
                      <button onClick={() => advancePrint(o.id)}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
                        {o.status === 'pending' ? <><Play className="w-3 h-3" /> Start</> :
                         o.status === 'printing' ? <><CheckCheck className="w-3 h-3" /> Done</> :
                         <><Truck className="w-3 h-3" /> Deliver</>}
                      </button>
                    ) : <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Complete</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PaymentsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Processed', value: `UGX ${totalRevenue.toLocaleString()}`, color: 'text-emerald-400' },
          { label: 'Held for Delivery', value: `UGX ${transactions.filter(t => t.status === 'held').reduce((s, t) => s + t.amount, 0).toLocaleString()}`, color: 'text-amber-400' },
          { label: 'Platform Fees', value: `UGX ${commissionEarned.toLocaleString()}`, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
            <div className="text-[13px] text-[#94A3B8] mb-1">{s.label}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
      {/* Transactions */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155]"><h3 className="font-semibold text-[#E2E8F0]">Transactions</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#334155]">
              {['ID', 'From', 'Method', 'Amount', 'Fee', 'Net', 'Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#334155]">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{t.id}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{t.from}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{t.method}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">UGX {t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-amber-400">UGX {t.fee.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-emerald-400">UGX {t.net.toLocaleString()}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Withdrawals */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155]"><h3 className="font-semibold text-[#E2E8F0]">Withdrawal Requests</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#334155]">
              {['ID', 'Farmer', 'Amount', 'Status', 'Action'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#334155]">
              {withdrawals.map(w => (
                <tr key={w.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{w.id}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{w.farmer}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">UGX {w.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={w.status} /></td>
                  <td className="px-4 py-3">
                    {w.status === 'pending' ? (
                      <button onClick={() => approveWithdrawal(w.id)}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors">
                        Release
                      </button>
                    ) : <span className="text-xs text-emerald-400">Released</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Orders This Month', value: '342', change: '+12%', up: true },
          { label: 'Revenue This Month', value: 'UGX 1.2M', change: '+18%', up: true },
          { label: 'New Farmers', value: '28', change: '+5%', up: true },
          { label: 'Avg Order Value', value: 'UGX 8,400', change: '-2%', up: false },
        ].map(s => (
          <div key={s.label} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
            <div className="text-[13px] text-[#94A3B8] mb-2">{s.label}</div>
            <div className="text-xl font-bold text-[#E2E8F0]">{s.value}</div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {s.change} from last month
            </div>
          </div>
        ))}
      </div>
      {/* Simple bar chart visualization */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h3 className="font-semibold text-[#E2E8F0] mb-6">Revenue Trend (Last 6 Months)</h3>
        <div className="flex items-end gap-4 h-48">
          {[
            { month: 'Jan', value: 65 },
            { month: 'Feb', value: 78 },
            { month: 'Mar', value: 92 },
            { month: 'Apr', value: 85 },
            { month: 'May', value: 110 },
            { month: 'Jun', value: 128 },
          ].map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[#334155] rounded-t-lg relative overflow-hidden" style={{ height: `${d.value * 1.5}px` }}>
                <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/60 rounded-t-lg transition-all" style={{ height: '100%' }} />
              </div>
              <span className="text-xs text-[#94A3B8]">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Top Farmers */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155]"><h3 className="font-semibold text-[#E2E8F0]">Top Performing Farmers</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#334155]">
              {['Rank', 'Farmer', 'Orders', 'Revenue'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#334155]">
              {[
                { rank: 1, name: 'Reagan Lutwama', orders: 156, revenue: 1842000 },
                { rank: 2, name: 'Nakamya Josephine', orders: 98, revenue: 925000 },
                { rank: 3, name: 'Acen Mary', orders: 87, revenue: 1210000 },
                { rank: 4, name: 'Mutebi David', orders: 72, revenue: 680000 },
                { rank: 5, name: 'Kato John', orders: 45, revenue: 420000 },
              ].map(f => (
                <tr key={f.rank} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3"><span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${f.rank === 1 ? 'bg-amber-500/20 text-amber-400' : f.rank === 2 ? 'bg-gray-400/20 text-gray-300' : f.rank === 3 ? 'bg-orange-600/20 text-orange-400' : 'bg-[#334155] text-[#94A3B8]'}`}>{f.rank}</span></td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{f.name}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{f.orders}</td>
                  <td className="px-4 py-3 text-sm text-emerald-400">UGX {f.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h3 className="font-semibold text-[#E2E8F0] mb-4">Platform Fee</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[#94A3B8]">Current Fee</label>
              <span className="text-sm font-bold text-emerald-400">{platformFee}%</span>
            </div>
            <input type="range" min="0.5" max="10" step="0.5" value={platformFee}
              onChange={e => setPlatformFee(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            <div className="flex justify-between text-xs text-[#64748B] mt-1"><span>0.5%</span><span>5%</span><span>10%</span></div>
          </div>
          <p className="text-xs text-[#94A3B8]">
            This fee is deducted from every transaction. Farmers receive the remaining amount.
            At {platformFee}%, your commission on UGX 2.8M in sales = <span className="text-emerald-400 font-semibold">UGX {Math.round(2847500 * platformFee / 100).toLocaleString()}</span>
          </p>
        </div>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h3 className="font-semibold text-[#E2E8F0] mb-4">Payment Methods</h3>
        <div className="space-y-3">
          {['Airtel Money', 'MTN Mobile Money', 'PayPal (@LutwamaReagan)', 'Bank Transfer'].map(method => (
            <div key={method} className="flex items-center justify-between py-2">
              <span className="text-sm text-[#E2E8F0]">{method}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-5 bg-[#334155] peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:bg-emerald-400 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#64748B] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500/20" />
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h3 className="font-semibold text-[#E2E8F0] mb-4">Notification Settings</h3>
        <div className="space-y-3">
          {['SMS alerts on new orders', 'Email notifications for farmer approvals', 'Weekly revenue summary'].map(setting => (
            <div key={setting} className="flex items-center justify-between py-2">
              <span className="text-sm text-[#E2E8F0]">{setting}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-5 bg-[#334155] peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:bg-emerald-400 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#64748B] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500/20" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */
  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'farmers': return <FarmersView />;
      case 'orders': return <OrdersView />;
      case 'products': return <ProductsView />;
      case 'printdrop': return <PrintDropView />;
      case 'payments': return <PaymentsView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0F172A] flex text-[#E2E8F0]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-[100dvh] w-[260px] bg-[#0F172A] border-r border-[#334155] flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[#334155] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-semibold text-[15px] text-[#E2E8F0]">ShambaNi</span>
            <span className="block text-[10px] text-emerald-400 font-medium tracking-wide uppercase">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-[#94A3B8]"><X className="w-5 h-5" /></button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            return (
              <button key={item.key} onClick={() => { setActiveView(item.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 h-[44px] px-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                }`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-emerald-400 rounded-r-full" />}
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.key === 'printdrop' && <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">NEW</span>}
              </button>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="px-4 py-4 border-t border-[#334155] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#E2E8F0] truncate">Reagan Lutwama</p>
              <p className="text-xs text-[#94A3B8] truncate">ryglutwa0@gmail.com</p>
            </div>
            <button className="text-[#94A3B8] hover:text-red-400 transition-colors" title="Logout"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#0F172A] border-b border-[#334155] flex items-center px-4 md:px-8 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-[#94A3B8] hover:text-[#E2E8F0]">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-[#E2E8F0] capitalize">{activeView === 'printdrop' ? 'PrintDrop' : activeView}</h1>
          <div className="ml-auto text-sm text-[#94A3B8]">
            Fee: <span className="text-emerald-400 font-semibold">{platformFee}%</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{renderView()}</main>
      </div>
    </div>
  );
}
