import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Download, Plus, Edit3, Flag, Eye, Trash2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import type { ProductStatus } from '@/store/useAdminStore';

const PAGE_SIZE = 8;

function StatusBadge({ status }: { status: ProductStatus }) {
  const colors: Record<string, string> = {
    active: 'bg-admin-accent/10 text-admin-accent',
    flagged: 'bg-orange-500/10 text-orange-400',
    out_of_stock: 'bg-red-500/10 text-red-400',
    hidden: 'bg-gray-500/10 text-gray-400',
  };
  const labels: Record<string, string> = {
    active: 'Active',
    flagged: 'Flagged',
    out_of_stock: 'Out of Stock',
    hidden: 'Hidden',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status] || status}
    </span>
  );
}

export default function ProductsView() {
  const { t } = useTranslation();
  const products = useAdminStore((s) => s.products);
  const updateProductStatus = useAdminStore((s) => s.updateProductStatus);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.farmer.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const categories = ['vegetables', 'fruits', 'grains', 'livestock', 'dairy', 'spices', 'nuts', 'roots'];

  const handleFeature = (id: string) => {
    // Feature = keep active
    updateProductStatus(id, 'active');
  };

  const handleUnlist = (id: string) => {
    updateProductStatus(id, 'hidden');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-poppins font-semibold text-admin-text">{t('admin.products')}</h2>
          <p className="text-sm text-admin-muted mt-0.5">{filtered.length} {t('admin.total') || 'total'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-admin-border text-admin-muted text-sm rounded-lg hover:bg-admin-card transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('admin.export') || 'Export'}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('admin.addProduct') || 'Add Product'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={t('admin.searchProducts') || 'Search products...'}
            className="w-full h-10 bg-admin-card border border-admin-border rounded-lg pl-10 pr-4 text-sm text-admin-text placeholder:text-admin-muted focus:outline-none focus:border-admin-accent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
            className="h-10 bg-admin-card border border-admin-border rounded-lg pl-9 pr-8 text-sm text-admin-text focus:outline-none focus:border-admin-accent appearance-none cursor-pointer"
          >
            <option value="all">{t('admin.allCategories') || 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="h-10 bg-admin-card border border-admin-border rounded-lg pl-9 pr-8 text-sm text-admin-text focus:outline-none focus:border-admin-accent appearance-none cursor-pointer"
          >
            <option value="all">{t('admin.allStatuses') || 'All Statuses'}</option>
            <option value="active">{t('admin.active') || 'Active'}</option>
            <option value="flagged">{t('admin.flagged') || 'Flagged'}</option>
            <option value="out_of_stock">{t('admin.outOfStock') || 'Out of Stock'}</option>
            <option value="hidden">{t('admin.hidden') || 'Hidden'}</option>
          </select>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-bg/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.product') || 'Product'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.category') || 'Category'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.farmer') || 'Farmer'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.price') || 'Price'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.stock') || 'Stock'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.status') || 'Status'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.actions') || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-admin-bg flex items-center justify-center overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-admin-muted" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-admin-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-admin-muted capitalize">{p.category}</td>
                  <td className="px-5 py-3 text-sm text-admin-text">{p.farmer}</td>
                  <td className="px-5 py-3 text-sm font-medium text-admin-text">UGX {p.price.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-sm ${p.stock === 0 ? 'text-red-400' : p.stock < 50 ? 'text-amber-500' : 'text-admin-accent'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleFeature(p.id)}
                        className="p-1.5 text-admin-accent hover:bg-admin-accent/10 rounded-md transition-colors"
                        title={t('admin.feature') || 'Feature'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateProductStatus(p.id, 'flagged')}
                        className="p-1.5 text-orange-400 hover:bg-orange-500/10 rounded-md transition-colors"
                        title={t('admin.flag') || 'Flag'}
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUnlist(p.id)}
                        className="p-1.5 text-admin-muted hover:text-admin-text hover:bg-white/5 rounded-md transition-colors"
                        title={t('admin.unlist') || 'Unlist'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        title={t('common.delete') || 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-admin-muted">
                    {t('admin.noProductsFound') || 'No products found.'}
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
