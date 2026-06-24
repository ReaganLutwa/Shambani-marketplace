import { useTranslation } from 'react-i18next';
import { LayoutDashboard } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';

function AdminOverview() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60dvh] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 bg-admin-accent/20 rounded-full flex items-center justify-center mb-6">
        <LayoutDashboard className="w-10 h-10 text-admin-accent" />
      </div>
      <h1 className="text-3xl md:text-4xl font-poppins font-bold text-admin-text mb-3 text-center">
        {t('admin.dashboard')}
      </h1>
      <p className="text-lg text-admin-muted text-center max-w-md mb-8">
        {t('common.comingSoon')} — Admin panel with payments, farmer approvals, and analytics
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {[
          { label: t('admin.farmers'), value: '1,200+' },
          { label: t('admin.orders'), value: '8,540' },
          { label: t('admin.payments'), value: 'UGX 450M' },
          { label: t('admin.platformFee'), value: '2.5%' },
        ].map((stat) => (
          <div key={stat.label} className="bg-admin-card border border-admin-border rounded-xl p-4 text-center">
            <div className="text-xl font-space font-bold text-admin-accent">{stat.value}</div>
            <div className="text-xs text-admin-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="bg-admin-bg min-h-[60dvh]">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="farmers" element={<AdminOverview />} />
        <Route path="orders" element={<AdminOverview />} />
        <Route path="products" element={<AdminOverview />} />
        <Route path="payments" element={<AdminOverview />} />
        <Route path="analytics" element={<AdminOverview />} />
        <Route path="settings" element={<AdminOverview />} />
      </Routes>
    </div>
  );
}
