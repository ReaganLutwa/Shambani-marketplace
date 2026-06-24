import { useTranslation } from 'react-i18next';
import {
  Users,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  DollarSign,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType,
  warning,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  change: string;
  changeType?: 'positive' | 'negative' | 'warning';
  warning?: boolean;
}) {
  return (
    <div
      className={`bg-admin-card border rounded-xl p-5 transition-all duration-200 hover:border-admin-accent/30 ${
        warning ? 'border-amber-500/30' : 'border-admin-border'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            warning ? 'bg-amber-500/10' : 'bg-admin-accent/10'
          }`}
        >
          <Icon className={`w-5 h-5 ${warning ? 'text-amber-500' : 'text-admin-accent'}`} />
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp
            className={`w-3.5 h-3.5 ${
              changeType === 'negative'
                ? 'text-red-400'
                : warning
                ? 'text-amber-500'
                : 'text-admin-accent'
            }`}
          />
          <span
            className={`text-xs ${
              changeType === 'negative'
                ? 'text-red-400'
                : warning
                ? 'text-amber-500'
                : 'text-admin-accent'
            }`}
          >
            {change}
          </span>
        </div>
      </div>
      <div className="font-space font-bold text-2xl text-admin-text">{value}</div>
      <div className="text-[13px] text-admin-muted mt-0.5">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-admin-accent/10 text-admin-accent border-admin-accent/20',
    review: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    approved: 'bg-admin-accent/10 text-admin-accent border-admin-accent/20',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        colors[status] || colors.pending
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function StatusBadgeOrder({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500',
    confirmed: 'bg-blue-500/10 text-blue-400',
    in_transit: 'bg-purple-500/10 text-purple-400',
    delivered: 'bg-admin-accent/10 text-admin-accent',
    cancelled: 'bg-red-500/10 text-red-400',
    disputed: 'bg-red-500/10 text-red-400',
  };
  const labels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || colors.pending
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

// Simple bar chart using divs
function RevenueChart() {
  const { t } = useTranslation();
  const data = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 80 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 75 },
    { day: 'Sat', value: 55 },
    { day: 'Sun', value: 85 },
  ];
  return (
    <div className="bg-admin-card border border-admin-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-admin-text mb-4">
        {t('admin.totalRevenue')} ({t('admin.last7Days') || 'Last 7 Days'})
      </h3>
      <div className="flex items-end gap-2 h-[180px]">
        {data.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex justify-center">
              <div
                className="w-full max-w-[40px] bg-admin-accent/80 rounded-t-md transition-all duration-500 hover:bg-admin-accent"
                style={{ height: `${d.value * 1.8}px` }}
              />
            </div>
            <span className="text-[11px] text-admin-muted">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { t } = useTranslation();
  const stats = useAdminStore((s) => s.getStats());
  const orders = useAdminStore((s) => s.orders);
  const farmers = useAdminStore((s) => s.farmers);
  const activities = useAdminStore((s) => s.activities);
  const approveFarmer = useAdminStore((s) => s.approveFarmer);
  const rejectFarmer = useAdminStore((s) => s.rejectFarmer);

  const pendingFarmersList = farmers.filter((f) => f.status === 'pending').slice(0, 5);
  const recentOrders = orders.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label={t('admin.farmers')}
          value={stats.totalFarmers.toLocaleString()}
          change={'+3 ' + (t('admin.thisWeek') || 'this week')}
          changeType="positive"
        />
        <StatCard
          icon={ShoppingCart}
          label={t('admin.orders')}
          value={stats.totalOrders.toLocaleString()}
          change={'+8 ' + (t('admin.thisWeek') || 'this week')}
          changeType="positive"
        />
        <StatCard
          icon={CreditCard}
          label={t('admin.totalRevenue')}
          value={'UGX ' + (stats.totalRevenue / 1000000).toFixed(1) + 'M'}
          change={'+15%'}
          changeType="positive"
        />
        <StatCard
          icon={AlertTriangle}
          label={t('admin.pendingApprovals')}
          value={stats.pendingFarmers.toString()}
          change={t('admin.actionNeeded') || 'Action needed'}
          changeType="warning"
          warning
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label={t('admin.products')}
          value={stats.totalProducts.toString()}
          change={'+2 '}
          changeType="positive"
        />
        <StatCard
          icon={DollarSign}
          label={t('admin.commissionEarned') || 'Commission Earned'}
          value={'UGX ' + stats.commissionEarned.toLocaleString()}
          change={'2.5%'}
          changeType="positive"
        />
        <StatCard
          icon={Clock}
          label={t('admin.pendingOrders') || 'Pending Orders'}
          value={stats.pendingOrders.toString()}
          change={t('admin.requiresAttention') || 'Requires attention'}
          changeType="warning"
          warning={stats.pendingOrders > 0}
        />
        <StatCard
          icon={CheckCircle}
          label={t('admin.completedOrders') || 'Completed Orders'}
          value={orders.filter((o) => o.status === 'delivered').length.toString()}
          change={'96%'}
          changeType="positive"
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-admin-text mb-4">
            {t('admin.recentActivity') || 'Recent Activity'}
          </h3>
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-admin-accent mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-admin-text truncate">{a.activity}</p>
                  <p className="text-xs text-admin-muted">
                    {a.user} · {a.time}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-admin-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-admin-text">
            {t('admin.recentOrders') || 'Recent Orders'}
          </h3>
          <span className="text-xs text-admin-muted">{orders.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-bg/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  {t('admin.orderId') || 'Order ID'}
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  {t('admin.buyer') || 'Buyer'}
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  {t('admin.farmer') || 'Farmer'}
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  {t('admin.items') || 'Items'}
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  {t('admin.total') || 'Total'}
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  {t('admin.status') || 'Status'}
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  {t('admin.date') || 'Date'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-admin-accent">{order.id}</td>
                  <td className="px-5 py-3 text-sm text-admin-text">{order.buyer}</td>
                  <td className="px-5 py-3 text-sm text-admin-text">{order.farmer}</td>
                  <td className="px-5 py-3 text-sm text-admin-muted">{order.items}</td>
                  <td className="px-5 py-3 text-sm font-medium text-admin-text">
                    UGX {order.total.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadgeOrder status={order.status} />
                  </td>
                  <td className="px-5 py-3 text-sm text-admin-muted">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Farmers - Pending Approvals */}
      {pendingFarmersList.length > 0 && (
        <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-admin-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.pendingApprovals') || 'Pending Approvals'}
            </h3>
            <span className="text-xs text-amber-500">{pendingFarmersList.length} pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-admin-bg/50">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                    {t('admin.farmer') || 'Farmer'}
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                    {t('admin.farm') || 'Farm'}
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                    {t('admin.location') || 'Location'}
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                    {t('admin.phone') || 'Phone'}
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                    {t('admin.actions') || 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {pendingFarmersList.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-admin-text">
                      {farmer.name}
                    </td>
                    <td className="px-5 py-3 text-sm text-admin-muted">{farmer.farmName}</td>
                    <td className="px-5 py-3 text-sm text-admin-muted">
                      {farmer.district}, {farmer.country}
                    </td>
                    <td className="px-5 py-3 text-sm text-admin-muted">{farmer.phone}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveFarmer(farmer.id)}
                          className="px-3 py-1.5 bg-admin-accent/10 text-admin-accent text-xs font-medium rounded-lg hover:bg-admin-accent/20 transition-colors"
                        >
                          {t('admin.approve') || 'Approve'}
                        </button>
                        <button
                          onClick={() => rejectFarmer(farmer.id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          {t('admin.reject') || 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-admin-text mb-4">
          {t('admin.quickActions') || 'Quick Actions'}
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2.5 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors">
            {t('admin.processWithdrawals') || 'Process Withdrawals'}
          </button>
          <button className="px-4 py-2.5 bg-admin-card border border-admin-border text-admin-text text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">
            {t('admin.exportData') || 'Export Data'}
          </button>
          <button className="px-4 py-2.5 bg-admin-card border border-admin-border text-admin-text text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">
            {t('admin.sendAnnouncement') || 'Send Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
}
