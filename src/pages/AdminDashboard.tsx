import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardOverview from '@/components/admin/DashboardOverview';
import FarmersView from '@/components/admin/FarmersView';
import OrdersView from '@/components/admin/OrdersView';
import ProductsView from '@/components/admin/ProductsView';
import PaymentsView from '@/components/admin/PaymentsView';
import AnalyticsView from '@/components/admin/AnalyticsView';
import SettingsView from '@/components/admin/SettingsView';

type ViewKey = 'dashboard' | 'farmers' | 'orders' | 'products' | 'payments' | 'analytics' | 'settings';

const viewMap: Record<string, ViewKey> = {
  '/admin': 'dashboard',
  '/admin/': 'dashboard',
  '/admin/farmers': 'farmers',
  '/admin/orders': 'orders',
  '/admin/products': 'products',
  '/admin/payments': 'payments',
  '/admin/analytics': 'analytics',
  '/admin/settings': 'settings',
};

const reverseViewMap: Record<ViewKey, string> = {
  dashboard: '/admin',
  farmers: '/admin/farmers',
  orders: '/admin/orders',
  products: '/admin/products',
  payments: '/admin/payments',
  analytics: '/admin/analytics',
  settings: '/admin/settings',
};

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const getViewFromPath = useCallback((): ViewKey => {
    const path = location.pathname;
    return viewMap[path] || 'dashboard';
  }, [location.pathname]);

  const [activeView, setActiveView] = useState<ViewKey>(getViewFromPath);

  useEffect(() => {
    setActiveView(getViewFromPath());
  }, [getViewFromPath]);

  const handleNavigate = (view: string) => {
    const key = view as ViewKey;
    setActiveView(key);
    navigate(reverseViewMap[key]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'farmers':
        return <FarmersView />;
      case 'orders':
        return <OrdersView />;
      case 'products':
        return <ProductsView />;
      case 'payments':
        return <PaymentsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AdminLayout activeView={activeView} onNavigate={handleNavigate}>
      {renderView()}
    </AdminLayout>
  );
}
