import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Download, CheckCircle, XCircle, CreditCard, Wallet, TrendingUp, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import type { PaymentMethod, PaymentStatus, WithdrawalStatus } from '@/store/useAdminStore';

const PAGE_SIZE = 6;

function StatusBadge({ status }: { status: PaymentStatus | WithdrawalStatus }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500',
    released: 'bg-admin-accent/10 text-admin-accent',
    held: 'bg-orange-500/10 text-orange-400',
    disputed: 'bg-red-500/10 text-red-400',
    approved: 'bg-admin-accent/10 text-admin-accent',
    rejected: 'bg-red-500/10 text-red-400',
    processed: 'bg-blue-500/10 text-blue-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function MethodIcon({ method }: { method: PaymentMethod }) {
  const labels: Record<string, string> = {
    paypal: 'PayPal',
    airtel: 'Airtel Money',
    mtn: 'MTN MoMo',
    bank: 'Bank Transfer',
  };
  return <span className="text-sm text-admin-text">{labels[method] || method}</span>;
}

export default function PaymentsView() {
  const { t } = useTranslation();
  const transactions = useAdminStore((s) => s.transactions);
  const withdrawals = useAdminStore((s) => s.withdrawals);
  const settings = useAdminStore((s) => s.settings);
  const releasePayment = useAdminStore((s) => s.releasePayment);
  const processWithdrawal = useAdminStore((s) => s.processWithdrawal);
  const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals' | 'methods'>('transactions');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);

  const totalHeld = transactions.filter((t) => t.status === 'pending' || t.status === 'held').reduce((s, t) => s + t.amount, 0);
  const totalProcessed = transactions.filter((t) => t.status === 'released').reduce((s, t) => s + t.amount, 0);
  const totalFees = transactions.filter((t) => t.status === 'released').reduce((s, t) => s + t.platformFee, 0);

  const filtered = activeTab === 'transactions'
    ? transactions.filter((t) => {
        const matchSearch = !search || t.farmer.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchSearch && matchStatus;
      })
    : withdrawals.filter((w) => {
        const matchSearch = !search || w.farmer.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || w.status === statusFilter;
        return matchSearch && matchStatus;
      });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-admin-muted">{t('admin.totalHeld') || 'Total Held'}</p>
              <p className="text-lg font-semibold text-admin-text font-space">UGX {(totalHeld / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          <p className="text-xs text-admin-muted">{t('admin.pendingDeliveries') || 'Funds held for pending deliveries'}</p>
        </div>
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-admin-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-admin-accent" />
            </div>
            <div>
              <p className="text-xs text-admin-muted">{t('admin.processedThisMonth') || 'Processed This Month'}</p>
              <p className="text-lg font-semibold text-admin-text font-space">UGX {(totalProcessed / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          <p className="text-xs text-admin-muted">{transactions.filter((t) => t.status === 'released').length} {t('admin.transactions') || 'transactions'}</p>
        </div>
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-admin-muted">{t('admin.platformFeesCollected') || 'Platform Fees Collected'}</p>
              <p className="text-lg font-semibold text-admin-text font-space">UGX {(totalFees / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          <p className="text-xs text-admin-muted">{settings.platformFeePercent}% {t('admin.perTransaction') || 'per transaction'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-admin-card border border-admin-border rounded-xl p-1 w-fit">
        {[
          { key: 'transactions', label: t('admin.transactions') || 'Transactions' },
          { key: 'withdrawals', label: t('admin.withdrawals') || 'Withdrawals' },
          { key: 'methods', label: t('admin.paymentMethods') || 'Payment Methods' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as typeof activeTab); setPage(0); setSearch(''); setStatusFilter('all'); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key ? 'bg-admin-accent/10 text-admin-accent' : 'text-admin-muted hover:text-admin-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'methods' ? (
        <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-bg/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.method') || 'Method'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.status') || 'Status'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.handle') || 'Handle / Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              <tr className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-admin-accent" />
                    <span className="text-sm font-medium text-admin-text">PayPal</span>
                  </div>
                </td>
                <td className="px-5 py-4"><StatusBadge status="released" /></td>
                <td className="px-5 py-4 text-sm text-admin-text font-medium">{settings.paypalHandle}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-admin-accent" />
                    <span className="text-sm font-medium text-admin-text">Airtel Money</span>
                  </div>
                </td>
                <td className="px-5 py-4"><StatusBadge status="released" /></td>
                <td className="px-5 py-4 text-sm text-admin-muted">{t('admin.adminManaged') || 'Admin-managed'}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-admin-accent" />
                    <span className="text-sm font-medium text-admin-text">MTN Mobile Money</span>
                  </div>
                </td>
                <td className="px-5 py-4"><StatusBadge status="released" /></td>
                <td className="px-5 py-4 text-sm text-admin-muted">{t('admin.adminManaged') || 'Admin-managed'}</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-admin-accent" />
                    <span className="text-sm font-medium text-admin-text">Bank Transfer</span>
                  </div>
                </td>
                <td className="px-5 py-4"><StatusBadge status="released" /></td>
                <td className="px-5 py-4 text-sm text-admin-muted">{t('admin.perFarmerConfig') || 'Per-farmer configuration'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder={activeTab === 'transactions' ? (t('admin.searchTransactions') || 'Search transactions...') : (t('admin.searchWithdrawals') || 'Search withdrawals...')}
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
                {activeTab === 'transactions' ? (
                  <>
                    <option value="pending">{t('admin.pending') || 'Pending'}</option>
                    <option value="released">{t('admin.released') || 'Released'}</option>
                    <option value="held">{t('admin.held') || 'Held'}</option>
                    <option value="disputed">{t('admin.disputed') || 'Disputed'}</option>
                  </>
                ) : (
                  <>
                    <option value="pending">{t('admin.pending') || 'Pending'}</option>
                    <option value="approved">{t('admin.approved') || 'Approved'}</option>
                    <option value="rejected">{t('admin.rejected') || 'Rejected'}</option>
                    <option value="processed">{t('admin.processed') || 'Processed'}</option>
                  </>
                )}
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-admin-border text-admin-muted text-sm rounded-lg hover:bg-admin-card transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin.export') || 'Export'}</span>
            </button>
          </div>

          <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-admin-bg/50">
                    {activeTab === 'transactions' ? (
                      <>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.txId') || 'TX ID'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.date') || 'Date'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.farmer') || 'Farmer'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.amount') || 'Amount'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.fee') || 'Fee'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.net') || 'Net'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.method') || 'Method'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.status') || 'Status'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.actions') || 'Actions'}</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.wdId') || 'WD ID'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.farmer') || 'Farmer'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.amount') || 'Amount'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.method') || 'Method'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.status') || 'Status'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.date') || 'Date'}</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.actions') || 'Actions'}</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {activeTab === 'transactions'
                    ? (paginated as typeof transactions).map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-admin-accent">{tx.id}</td>
                          <td className="px-5 py-3 text-sm text-admin-muted">{tx.date}</td>
                          <td className="px-5 py-3 text-sm text-admin-text">{tx.farmer}</td>
                          <td className="px-5 py-3 text-sm font-medium text-admin-text">UGX {tx.amount.toLocaleString()}</td>
                          <td className="px-5 py-3 text-sm text-amber-500">UGX {tx.platformFee.toLocaleString()}</td>
                          <td className="px-5 py-3 text-sm text-admin-accent">UGX {tx.netToFarmer.toLocaleString()}</td>
                          <td className="px-5 py-3"><MethodIcon method={tx.method} /></td>
                          <td className="px-5 py-3"><StatusBadge status={tx.status} /></td>
                          <td className="px-5 py-3">
                            {tx.status === 'pending' && (
                              <button
                                onClick={() => releasePayment(tx.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-admin-accent/10 text-admin-accent text-xs font-medium rounded-lg hover:bg-admin-accent/20 transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                {t('admin.release') || 'Release'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    : (paginated as typeof withdrawals).map((w) => (
                        <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-admin-accent">{w.id}</td>
                          <td className="px-5 py-3 text-sm text-admin-text">{w.farmer}</td>
                          <td className="px-5 py-3 text-sm font-medium text-admin-text">UGX {w.amount.toLocaleString()}</td>
                          <td className="px-5 py-3"><MethodIcon method={w.method} /></td>
                          <td className="px-5 py-3"><StatusBadge status={w.status} /></td>
                          <td className="px-5 py-3 text-sm text-admin-muted">{w.requestedDate}</td>
                          <td className="px-5 py-3">
                            {w.status === 'pending' && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => processWithdrawal(w.id, 'approve')}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-admin-accent/10 text-admin-accent text-xs font-medium rounded-lg hover:bg-admin-accent/20 transition-colors"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  {t('admin.approve') || 'Approve'}
                                </button>
                                <button
                                  onClick={() => processWithdrawal(w.id, 'reject')}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-colors"
                                >
                                  <XCircle className="w-3 h-3" />
                                  {t('admin.reject') || 'Reject'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={activeTab === 'transactions' ? 9 : 7} className="px-5 py-12 text-center text-sm text-admin-muted">
                        {t('admin.noData') || 'No data found.'}
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
        </>
      )}
    </div>
  );
}
