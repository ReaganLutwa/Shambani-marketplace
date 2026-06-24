import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Download, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import type { OrderStatus } from '@/store/useAdminStore';

const PAGE_SIZE = 8;

function StatusBadge({ status }: { status: OrderStatus }) {
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status] || status}
    </span>
  );
}

export default function OrdersView() {
  const { t } = useTranslation();
  const orders = useAdminStore((s) => s.orders);
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.farmer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const order = orders.find((o) => o.id === selectedOrder);

  if (order) {
    const statuses: OrderStatus[] = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled', 'disputed'];
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-1.5 text-sm text-admin-muted hover:text-admin-text transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('admin.back') || 'Back'}
          </button>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-admin-text">{order.id}</h2>
              <p className="text-sm text-admin-muted">{t('admin.placedOn') || 'Placed on'} {order.date}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-admin-bg rounded-lg">
              <p className="text-xs text-admin-muted uppercase tracking-wide mb-1">{t('admin.buyer') || 'Buyer'}</p>
              <p className="text-sm font-medium text-admin-text">{order.buyer}</p>
              <p className="text-sm text-admin-muted">{order.buyerPhone}</p>
            </div>
            <div className="p-4 bg-admin-bg rounded-lg">
              <p className="text-xs text-admin-muted uppercase tracking-wide mb-1">{t('admin.farmer') || 'Farmer'}</p>
              <p className="text-sm font-medium text-admin-text">{order.farmer}</p>
            </div>
            <div className="p-4 bg-admin-bg rounded-lg">
              <p className="text-xs text-admin-muted uppercase tracking-wide mb-1">{t('admin.total') || 'Total'}</p>
              <p className="text-sm font-semibold text-admin-text">UGX {order.total.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 bg-admin-bg rounded-lg mb-6">
            <p className="text-xs text-admin-muted uppercase tracking-wide mb-2">{t('admin.items') || 'Items'}</p>
            <p className="text-sm text-admin-text">{order.items}</p>
          </div>

          <div className="border-t border-admin-border pt-6">
            <p className="text-sm font-medium text-admin-text mb-3">{t('admin.updateStatus') || 'Update Status'}</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateOrderStatus(order.id, s)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    order.status === s
                      ? 'bg-admin-accent text-white border-admin-accent'
                      : 'bg-admin-card text-admin-muted border-admin-border hover:text-admin-text hover:border-admin-accent'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-poppins font-semibold text-admin-text">{t('admin.orders')}</h2>
          <p className="text-sm text-admin-muted mt-0.5">{filtered.length} {t('admin.total') || 'total'}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-admin-border text-admin-muted text-sm rounded-lg hover:bg-admin-card transition-colors w-fit">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">{t('admin.export') || 'Export'}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={t('admin.searchOrders') || 'Search orders...'}
            className="w-full h-10 bg-admin-card border border-admin-border rounded-lg pl-10 pr-4 text-sm text-admin-text placeholder:text-admin-muted focus:outline-none focus:border-admin-accent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="h-10 bg-admin-card border border-admin-border rounded-lg pl-9 pr-8 text-sm text-admin-text focus:outline-none focus:border-admin-accent appearance-none cursor-pointer"
          >
            <option value="all">{t('admin.allStatuses') || 'All Statuses'}</option>
            <option value="pending">{t('admin.pending') || 'Pending'}</option>
            <option value="confirmed">{t('admin.confirmed') || 'Confirmed'}</option>
            <option value="in_transit">{t('admin.inTransit') || 'In Transit'}</option>
            <option value="delivered">{t('admin.delivered') || 'Delivered'}</option>
            <option value="cancelled">{t('admin.cancelled') || 'Cancelled'}</option>
            <option value="disputed">{t('admin.disputed') || 'Disputed'}</option>
          </select>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-bg/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.orderId') || 'Order ID'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.buyer') || 'Buyer'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.farmer') || 'Farmer'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.items') || 'Items'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.total') || 'Total'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.status') || 'Status'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.date') || 'Date'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.actions') || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {paginated.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-admin-accent">{o.id}</td>
                  <td className="px-5 py-3 text-sm text-admin-text">{o.buyer}</td>
                  <td className="px-5 py-3 text-sm text-admin-text">{o.farmer}</td>
                  <td className="px-5 py-3 text-sm text-admin-muted max-w-[150px] truncate">{o.items}</td>
                  <td className="px-5 py-3 text-sm font-medium text-admin-text">UGX {o.total.toLocaleString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-sm text-admin-muted">{o.date}</td>
                  <td className="px-5 py-3 relative">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(o.id)}
                        className="px-3 py-1.5 text-xs font-medium text-admin-accent bg-admin-accent/10 rounded-lg hover:bg-admin-accent/20 transition-colors"
                      >
                        {t('admin.view') || 'View'}
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setStatusDropdown(statusDropdown === o.id ? null : o.id)}
                          className="p-1.5 text-admin-muted hover:text-admin-text hover:bg-white/5 rounded-md transition-colors"
                          title={t('admin.updateStatus') || 'Update Status'}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        {statusDropdown === o.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setStatusDropdown(null)} />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-admin-card border border-admin-border rounded-lg shadow-lg py-1 z-50">
                              {(['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled', 'disputed'] as OrderStatus[]).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => { updateOrderStatus(o.id, st); setStatusDropdown(null); }}
                                  className="w-full text-left px-3 py-2 text-sm text-admin-muted hover:text-admin-text hover:bg-white/5 transition-colors capitalize"
                                >
                                  {st.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-admin-muted">
                    {t('admin.noOrdersFound') || 'No orders found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-admin-muted">
            {t('admin.showing') || 'Showing'} {currentPage * PAGE_SIZE + 1}-{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} {t('admin.of') || 'of'} {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="p-2 rounded-lg border border-admin-border text-admin-muted hover:text-admin-text hover:bg-admin-card disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${i === currentPage ? 'bg-admin-accent text-white' : 'text-admin-muted hover:text-admin-text hover:bg-admin-card border border-admin-border'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1} className="p-2 rounded-lg border border-admin-border text-admin-muted hover:text-admin-text hover:bg-admin-card disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
