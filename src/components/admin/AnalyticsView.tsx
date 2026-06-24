import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Simple bar chart component
function BarChart({ data, color = 'bg-admin-accent' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-[120px]">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className={`w-full max-w-[24px] ${color} rounded-t-sm transition-all duration-500`} style={{ height: `${(v / max) * 100}px`, opacity: 0.6 + (v / max) * 0.4 }} />
        </div>
      ))}
    </div>
  );
}

// Simple line chart using SVG
function LineChart({ data, color = '#10B981' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 300;
  const h = 120;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[120px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Pie/donut chart using SVG
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const radius = 50;
  const cx = 60;
  const cy = 60;

  const arcs = segments.map((seg) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return {
      ...seg,
      d: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-28 h-28 shrink-0">
        {arcs.map((arc) => (
          <path key={arc.label} d={arc.d} fill={arc.color} />
        ))}
        <circle cx={cx} cy={cy} r={28} fill="#1E293B" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="600">
          {total}%
        </text>
      </svg>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-sm text-admin-muted">{seg.label}</span>
            <span className="text-sm font-medium text-admin-text">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsView() {
  const { t } = useTranslation();

  // Demo data
  const ordersData = [42, 38, 55, 48, 62, 58, 71, 65, 78, 82, 74, 88, 92, 85, 96, 102, 98, 110, 105, 118, 112, 125, 120, 132, 128, 135, 142, 138, 145, 152];
  const revenueByCountry = [
    { label: 'Uganda', value: 60, color: '#10B981' },
    { label: 'Kenya', value: 20, color: '#3B82F6' },
    { label: 'Tanzania', value: 12, color: '#F59E0B' },
    { label: 'Rwanda', value: 8, color: '#8B5CF6' },
  ];
  const categoryData = [
    { label: 'Livestock', value: 35 },
    { label: 'Vegetables', value: 28 },
    { label: 'Fruits', value: 18 },
    { label: 'Grains', value: 12 },
    { label: 'Dairy', value: 7 },
  ];
  const farmerGrowth = [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48];

  const metrics = [
    { label: t('admin.newFarmers') || 'New Farmers', thisMonth: '45', lastMonth: '38', change: '+18%', up: true },
    { label: t('admin.totalOrders') || 'Total Orders', thisMonth: '342', lastMonth: '298', change: '+15%', up: true },
    { label: t('admin.avgOrderValue') || 'Avg Order Value', thisMonth: 'UGX 24,500', lastMonth: 'UGX 22,100', change: '+11%', up: true },
    { label: t('admin.deliverySuccess') || 'Delivery Success', thisMonth: '96%', lastMonth: '94%', change: '+2%', up: true },
  ];

  const topFarmers = [
    { name: 'Reagan Lutwama', sales: 'UGX 2.4M', orders: 48 },
    { name: 'Nakamya Josephine', sales: 'UGX 1.8M', orders: 36 },
    { name: 'Acen Mary', sales: 'UGX 1.5M', orders: 29 },
    { name: 'Nantume Grace', sales: 'UGX 1.2M', orders: 24 },
    { name: 'Kato John', sales: 'UGX 980K', orders: 19 },
  ];

  const topProducts = [
    { name: 'Fresh Eggs', sales: 'UGX 3.2M', orders: 156 },
    { name: 'Green Matooke', sales: 'UGX 2.1M', orders: 89 },
    { name: 'Groundnuts', sales: 'UGX 1.6M', orders: 72 },
    { name: 'Fresh Milk', sales: 'UGX 1.4M', orders: 128 },
    { name: 'Ripe Tomatoes', sales: 'UGX 980K', orders: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Over Time */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.ordersOverTime') || 'Orders Over Time (30 Days)'}
            </h3>
            <div className="flex items-center gap-1 text-admin-accent">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">+12%</span>
            </div>
          </div>
          <LineChart data={ordersData} />
        </div>

        {/* Revenue by Country */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-admin-text mb-4">
            {t('admin.revenueByCountry') || 'Revenue by Country'}
          </h3>
          <DonutChart segments={revenueByCountry} />
        </div>

        {/* Top Categories */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-admin-text mb-4">
            {t('admin.topCategories') || 'Top Product Categories'}
          </h3>
          <div className="space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-admin-text">{cat.label}</span>
                  <span className="text-sm font-medium text-admin-text">{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-admin-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-admin-accent rounded-full transition-all duration-500"
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farmer Growth */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.farmerGrowth') || 'Farmer Growth (12 Months)'}
            </h3>
            <div className="flex items-center gap-1 text-admin-accent">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">+8%</span>
            </div>
          </div>
          <BarChart data={farmerGrowth} />
          <div className="flex justify-between mt-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
              <span key={m} className="text-[10px] text-admin-muted flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Table */}
      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-admin-border">
          <h3 className="text-sm font-semibold text-admin-text">
            {t('admin.keyMetrics') || 'Key Metrics'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-bg/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.metric') || 'Metric'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.thisMonth') || 'This Month'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.lastMonth') || 'Last Month'}</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-admin-muted uppercase tracking-wider">{t('admin.change') || 'Change'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {metrics.map((m) => (
                <tr key={m.label} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-admin-text">{m.label}</td>
                  <td className="px-5 py-3 text-sm text-admin-text">{m.thisMonth}</td>
                  <td className="px-5 py-3 text-sm text-admin-muted">{m.lastMonth}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 text-sm ${m.up ? 'text-admin-accent' : 'text-red-400'}`}>
                      {m.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {m.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Farmers & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-admin-border">
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.topFarmers') || 'Top Farmers'}
            </h3>
          </div>
          <div className="divide-y divide-admin-border">
            {topFarmers.map((f, i) => (
              <div key={f.name} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-7 h-7 rounded-full bg-admin-accent/10 flex items-center justify-center text-xs font-semibold text-admin-accent">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-admin-text truncate">{f.name}</p>
                  <p className="text-xs text-admin-muted">{f.orders} {t('admin.orders') || 'orders'}</p>
                </div>
                <span className="text-sm font-medium text-admin-text">{f.sales}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-admin-border">
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.topProducts') || 'Top Products'}
            </h3>
          </div>
          <div className="divide-y divide-admin-border">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-semibold text-blue-400">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-admin-text truncate">{p.name}</p>
                  <p className="text-xs text-admin-muted">{p.orders} {t('admin.orders') || 'orders'}</p>
                </div>
                <span className="text-sm font-medium text-admin-text">{p.sales}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
