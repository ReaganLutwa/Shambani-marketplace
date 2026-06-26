import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Printer,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Leaf,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, labelKey: 'admin.dashboard' },
  { key: 'farmers', icon: Users, labelKey: 'admin.farmers' },
  { key: 'orders', icon: ShoppingCart, labelKey: 'admin.orders' },
  { key: 'products', icon: Package, labelKey: 'admin.products' },
  { key: 'printdrop', icon: Printer, labelKey: 'admin.printdrop' },
  { key: 'payments', icon: CreditCard, labelKey: 'admin.payments' },
  { key: 'analytics', icon: BarChart3, labelKey: 'admin.analytics' },
  { key: 'settings', icon: Settings, labelKey: 'admin.settings' },
];

export default function AdminLayout({ children, activeView, onNavigate }: AdminLayoutProps) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const stats = useAdminStore((s) => s.getStats());

  const pendingFarmers = stats.pendingFarmers;
  const pendingOrders = stats.pendingOrders;
  const flaggedProducts = stats.pendingProducts;

  const getBadge = (key: string) => {
    if (key === 'farmers' && pendingFarmers > 0) return pendingFarmers;
    if (key === 'orders' && pendingOrders > 0) return pendingOrders;
    if (key === 'products' && flaggedProducts > 0) return flaggedProducts;
    return 0;
  };

  return (
    <div className="min-h-[100dvh] bg-admin-bg flex text-admin-text font-inter">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-[100dvh] w-[260px] bg-admin-bg border-r border-admin-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-admin-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-admin-accent/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-admin-accent" />
          </div>
          <div className="flex flex-col">
            <span className="font-poppins font-semibold text-[15px] text-admin-text leading-tight">
              ShambaNi
            </span>
            <span className="text-[10px] text-admin-accent font-medium tracking-wide uppercase">
              Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-admin-muted hover:text-admin-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            const badge = getBadge(item.key);
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 h-[44px] px-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-admin-accent/10 text-admin-accent'
                    : 'text-admin-muted hover:text-admin-text hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-admin-accent rounded-r-full" />
                )}
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left">{t(item.labelKey)}</span>
                {badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
                {item.key === 'printdrop' && (
                  <span className="text-[9px] font-bold bg-admin-accent/20 text-admin-accent px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="px-4 py-4 border-t border-admin-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-admin-accent/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-admin-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-admin-text truncate">Admin</p>
              <p className="text-xs text-admin-muted truncate">admin@shambani.com</p>
            </div>
            <button
              className="text-admin-muted hover:text-red-400 transition-colors"
              title={t('common.logout') || 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-admin-bg border-b border-admin-border flex items-center px-4 md:px-8 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 text-admin-muted hover:text-admin-text p-1"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-poppins font-semibold text-admin-text capitalize">
            {t(`admin.${activeView}`)}
          </h1>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t('common.search') || 'Search...'}
                    className="w-48 md:w-64 h-9 bg-admin-card border border-admin-border rounded-lg px-3 text-sm text-admin-text placeholder:text-admin-muted focus:outline-none focus:border-admin-accent"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                  <button onClick={() => setSearchOpen(false)}>
                    <X className="w-4 h-4 text-admin-muted" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-admin-muted hover:text-admin-text hover:bg-admin-card transition-colors"
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>
              )}
            </div>

            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-admin-muted hover:text-admin-text hover:bg-admin-card transition-colors">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 ml-1"
              >
                <div className="w-8 h-8 rounded-full bg-admin-accent/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-admin-accent" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-admin-muted hidden md:block" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-admin-card border border-admin-border rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-admin-border">
                      <p className="text-sm font-medium text-admin-text">Admin</p>
                      <p className="text-xs text-admin-muted">admin@shambani.com</p>
                    </div>
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-admin-muted hover:text-admin-text hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      {t('admin.settings')}
                    </button>
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('common.logout') || 'Logout'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
