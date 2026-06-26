import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingCart, Package,
  Printer, CreditCard, BarChart3, Settings,
  Menu, X, LogOut, Leaf, TrendingUp, Clock, CheckCircle, DollarSign, AlertTriangle,
} from 'lucide-react';

/* ──────── Demo Data ──────── */
const demoStats = {
  totalOrders: 1248,
  totalProducts: 156,
  totalFarmers: 89,
  totalRevenue: 2847500,
  commissionEarned: 71188,
  pendingOrders: 12,
  pendingFarmers: 5,
};

const demoOrders = [
  { id: '#4521', buyer: 'Mukasa David', farmer: 'Reagan Lutwama', items: '5 trays eggs', total: 57500, status: 'confirmed' },
  { id: '#4520', buyer: 'Nantume Grace', farmer: 'Nakamya Josephine', items: '20 heads cabbage', total: 40000, status: 'delivered' },
  { id: '#4519', buyer: 'Okello James', farmer: 'Acen Mary', items: '10 kg groundnuts', total: 80000, status: 'in_transit' },
  { id: '#4518', buyer: 'Kwagala Jane', farmer: 'Kato John', items: '3 bunches matooke', total: 45000, status: 'pending' },
  { id: '#4517', buyer: 'Ssempala Michael', farmer: 'Mutebi David', items: '8 pineapples', total: 40000, status: 'delivered' },
];

const demoPrintOrders = [
  { id: 'PRT-0048', customer: 'Sarah Kimani', type: 'color', pages: 25, cost: 37500, location: 'Kampala, Nakasero', status: 'pending' },
  { id: 'PRT-0047', customer: 'David Mwangi', type: 'bw', pages: 120, cost: 60000, location: 'Wakiso, Entebbe Rd', status: 'pending' },
  { id: 'PRT-0046', customer: 'Grace Akello', type: 'bw', pages: 45, cost: 22500, location: 'Mpigi, Town', status: 'printing' },
  { id: 'PRT-0045', customer: 'Michael Ouma', type: 'color', pages: 12, cost: 18000, location: 'Kampala, Bugolobi', status: 'printing' },
  { id: 'PRT-0044', customer: 'Jane Akello', type: 'bw', pages: 80, cost: 40000, location: 'Kampala, Ntinda', status: 'ready' },
  { id: 'PRT-0043', customer: 'John Mukasa', type: 'color', pages: 8, cost: 12000, location: 'Mukono, Seeta', status: 'ready' },
  { id: 'PRT-0042', customer: 'Patricia N.', type: 'bw', pages: 60, cost: 30000, location: 'Wakiso, Kira', status: 'delivered' },
  { id: 'PRT-0041', customer: 'Esther Nalubega', type: 'color', pages: 15, cost: 22500, location: 'Wakiso, Namasuba', status: 'delivered' },
];

/* ──────── Type ──────── */
type ViewKey = 'dashboard' | 'farmers' | 'orders' | 'products' | 'printdrop' | 'payments' | 'analytics' | 'settings';

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

/* ──────── Status Badge ──────── */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    in_transit: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    printing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.pending}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

/* ═══════════════ ADMIN DASHBOARD ═══════════════ */
export default function AdminDashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine active view from URL
  const path = location.pathname;
  const activeView: ViewKey =
    path.includes('/farmers') ? 'farmers' :
    path.includes('/orders') ? 'orders' :
    path.includes('/products') ? 'products' :
    path.includes('/printdrop') ? 'printdrop' :
    path.includes('/payments') ? 'payments' :
    path.includes('/analytics') ? 'analytics' :
    path.includes('/settings') ? 'settings' : 'dashboard';

  const navigateTo = (view: ViewKey) => {
    if (view === 'dashboard') navigate('/admin');
    else navigate(`/admin/${view}`);
  };

  /* ──────── DASHBOARD VIEW ──────── */
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: demoStats.totalOrders.toLocaleString(), icon: ShoppingCart, color: 'text-emerald-400' },
          { label: 'Total Farmers', value: demoStats.totalFarmers.toString(), icon: Users, color: 'text-emerald-400' },
          { label: 'Total Revenue', value: `UGX ${(demoStats.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-amber-400' },
          { label: 'Your Commission (2.5%)', value: `UGX ${(demoStats.commissionEarned / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Pending Orders', value: demoStats.pendingOrders.toString(), icon: Clock, color: 'text-amber-400' },
          { label: 'Pending Farmers', value: demoStats.pendingFarmers.toString(), icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Print Orders', value: '48', icon: Printer, color: 'text-emerald-400' },
          { label: 'Products Listed', value: demoStats.totalProducts.toString(), icon: Package, color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="font-bold text-2xl text-[#E2E8F0]">{stat.value}</div>
            <div className="text-[13px] text-[#94A3B8] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155] flex items-center justify-between">
          <h3 className="font-semibold text-[#E2E8F0]">Recent Orders</h3>
          <button onClick={() => navigateTo('orders')} className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                {['Order ID', 'Buyer', 'Farmer', 'Items', 'Total', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {demoOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{order.buyer}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{order.farmer}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{order.items}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">UGX {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
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
          Your Commission Summary (2.5% Platform Fee)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Total Sales</p>
            <p className="text-xl font-bold text-[#E2E8F0]">UGX 2,847,500</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Platform Fee (2.5%)</p>
            <p className="text-xl font-bold text-emerald-400">UGX 71,188</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Paid to Farmers</p>
            <p className="text-xl font-bold text-[#E2E8F0]">UGX 2,776,312</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ──────── PRINTDROP VIEW ──────── */
  const PrintDropView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: '12', icon: Printer, color: 'text-emerald-400' },
          { label: 'Pending Print', value: '5', icon: Clock, color: 'text-amber-400' },
          { label: 'Print Revenue', value: 'UGX 186K', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Pages Printed', value: '1,240', icon: CheckCircle, color: 'text-blue-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="font-bold text-2xl text-[#E2E8F0]">{stat.value}</div>
            <div className="text-[13px] text-[#94A3B8] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155]">
          <h3 className="font-semibold text-[#E2E8F0]">Print Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                {['Order ID', 'Customer', 'Type', 'Pages', 'Cost', 'Location', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {demoPrintOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm font-semibold text-[#E2E8F0]">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{order.customer}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8] capitalize">{order.type === 'bw' ? 'B&W' : 'Color'}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">{order.pages}</td>
                  <td className="px-4 py-3 text-sm text-[#E2E8F0]">UGX {order.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{order.location}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ──────── Placeholder Views ──────── */
  const PlaceholderView = ({ title, icon: Icon }: { title: string; icon: typeof Users }) => (
    <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
      <Icon className="w-16 h-16 mb-4 opacity-20" />
      <h2 className="text-xl font-semibold text-[#E2E8F0] mb-2">{title}</h2>
      <p className="text-sm">This section is coming soon.</p>
    </div>
  );

  /* ──────── Render Current View ──────── */
  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'printdrop': return <PrintDropView />;
      case 'farmers': return <PlaceholderView title="Farmers Management" icon={Users} />;
      case 'orders': return <PlaceholderView title="Orders Management" icon={ShoppingCart} />;
      case 'products': return <PlaceholderView title="Products Management" icon={Package} />;
      case 'payments': return <PlaceholderView title="Payments" icon={CreditCard} />;
      case 'analytics': return <PlaceholderView title="Analytics" icon={BarChart3} />;
      case 'settings': return <PlaceholderView title="Settings" icon={Settings} />;
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
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-[#94A3B8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { navigateTo(item.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 h-[44px] px-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-emerald-400 rounded-r-full" />}
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.key === 'printdrop' && (
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">NEW</span>
                )}
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
            <button className="text-[#94A3B8] hover:text-red-400 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
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
          <h1 className="text-lg font-semibold text-[#E2E8F0] capitalize">{activeView}</h1>
          <div className="ml-auto text-sm text-[#94A3B8]">
            Commission: <span className="text-emerald-400 font-semibold">2.5%</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
