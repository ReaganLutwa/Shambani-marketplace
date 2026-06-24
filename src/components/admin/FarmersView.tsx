import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Download, UserPlus, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import type { FarmerStatus } from '@/store/useAdminStore';

const PAGE_SIZE = 8;

function StatusBadge({ status }: { status: FarmerStatus }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500',
    approved: 'bg-admin-accent/10 text-admin-accent',
    rejected: 'bg-red-500/10 text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function FarmersView() {
  const { t } = useTranslation();
  const farmers = useAdminStore((s) => s.farmers);
  const approveFarmer = useAdminStore((s) => s.approveFarmer);
  const rejectFarmer = useAdminStore((s) => s.rejectFarmer);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [detailFarmer, setDetailFarmer] = useState<string | null>(null);

  const filtered = farmers.filter((f) => {
    const matchSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.phone.includes(search) ||
      f.farmName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchCountry = countryFilter === 'all' || f.country === countryFilter;
    return matchSearch && matchStatus && matchCountry;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const selectedFarmer = farmers.find((f) => f.id === detailFarmer);

  if (selectedFarmer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDetailFarmer(null)}
            className="flex items-center gap-1.5 text-sm text-admin-muted hover:text-admin-text transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('admin.back') || 'Back'}
          </button>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-admin-accent/20 flex items-center justify-center">
                <span className="text-lg font-semibold text-admin-accent">
                  {selectedFarmer.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-admin-text">{selectedFarmer.name}</h2>
                <p className="text-sm text-admin-muted">{selectedFarmer.farmName}</p>
              </div>
            </div>
            <StatusBadge status={selectedFarmer.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-admin-muted uppercase tracking-wide">{t('admin.email') || 'Email'}</p>
                <p className="text-sm text-admin-text">{selectedFarmer.email}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted uppercase tracking-wide">{t('admin.phone') || 'Phone'}</p>
                <p className="text-sm text-admin-text">{selectedFarmer.phone}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-admin-muted uppercase tracking-wide">{t('admin.location') || 'Location'}</p>
                <p className="text-sm text-admin-text">{selectedFarmer.district}, {selectedFarmer.country}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted uppercase tracking-wide">{t('admin.products') || 'Products'}</p>
                <p className="text-sm text-admin-text">{selectedFarmer.products.join(', ')}</p>
              </div>
            </div>
          </div>

          {selectedFarmer.status === 'pending' && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-admin-border">
              <button
                onClick={() => {
                  approveFarmer(selectedFarmer.id);
                  setDetailFarmer(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                {t('admin.approve') || 'Approve'}
              </button>
              <button
                onClick={() => {
                  rejectFarmer(selectedFarmer.id);
                  setDetailFarmer(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                {t('admin.reject') || 'Reject'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-poppins font-semibold text-admin-text">
            {t('admin.farmers')}
          </h2>
          <p className="text-sm text-admin-muted mt-0.5">
            {filtered.length} {t('admin.total') || 'total'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-admin-border text-admin-muted text-sm rounded-lg hover:bg-admin-card transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('admin.export') || 'Export'}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('admin.addFarmer') || 'Add Farmer'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={t('admin.searchByName') || 'Search by name or phone...'}
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
            <option value="approved">{t('admin.approved') || 'Approved'}</option>
            <option value="rejected">{t('admin.rejected') || 'Rejected'}</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted pointer-events-none" />
          <select
            value={countryFilter}
            onChange={(e) => { setCountryFilter(e.target.value); setPage(0); }}
            className="h-10 bg-admin-card border border-admin-border rounded-lg pl-9 pr-8 text-sm text-admin-text focus:outline-none focus:border-admin-accent appearance-none cursor-pointer"
          >
            <option value="all">{t('admin.allCountries') || 'All Countries'}</option>
            <option value="Uganda">Uganda</option>
            <option value="Kenya">Kenya</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Rwanda">Rwanda</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-bg/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.farmer') || 'Farmer'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.farm') || 'Farm'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.location') || 'Location'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.phone') || 'Phone'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.status') || 'Status'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.joined') || 'Joined'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.actions') || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {paginated.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-admin-text">{farmer.name}</td>
                  <td className="px-5 py-3 text-sm text-admin-muted">{farmer.farmName}</td>
                  <td className="px-5 py-3 text-sm text-admin-muted">{farmer.district}, {farmer.country}</td>
                  <td className="px-5 py-3 text-sm text-admin-muted">{farmer.phone}</td>
                  <td className="px-5 py-3"><StatusBadge status={farmer.status} /></td>
                  <td className="px-5 py-3 text-sm text-admin-muted">{farmer.joinedDate}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setDetailFarmer(farmer.id)} className="p-1.5 text-admin-muted hover:text-admin-text hover:bg-white/5 rounded-md transition-colors" title={t('admin.view') || 'View'}>
                        <Eye className="w-4 h-4" />
                      </button>
                      {farmer.status === 'pending' && (
                        <>
                          <button onClick={() => approveFarmer(farmer.id)} className="p-1.5 text-admin-accent hover:bg-admin-accent/10 rounded-md transition-colors" title={t('admin.approve') || 'Approve'}>
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => rejectFarmer(farmer.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title={t('admin.reject') || 'Reject'}>
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-admin-muted">
                    {t('admin.noFarmersFound') || 'No farmers found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  i === currentPage ? 'bg-admin-accent text-white' : 'text-admin-muted hover:text-admin-text hover:bg-admin-card border border-admin-border'
                }`}
              >
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
