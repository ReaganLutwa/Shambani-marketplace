import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Search, ChevronDown, Plus, PackageCheck, Clock, Truck, CheckCircle2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const demoOrders = [
  { id: 'PRT-0048', customer: 'Sarah Kimani', type: 'color', pages: 25, cost: 37500, location: 'Kampala, Nakasero', status: 'pending', time: '10 min ago' },
  { id: 'PRT-0047', customer: 'David Mwangi', type: 'bw', pages: 120, cost: 60000, location: 'Wakiso, Entebbe Rd', status: 'pending', time: '25 min ago' },
  { id: 'PRT-0046', customer: 'Grace Akello', type: 'bw', pages: 45, cost: 22500, location: 'Mpigi, Town', status: 'printing', time: '40 min ago' },
  { id: 'PRT-0045', customer: 'Michael Ouma', type: 'color', pages: 12, cost: 18000, location: 'Kampala, Bugolobi', status: 'printing', time: '1 hr ago' },
  { id: 'PRT-0044', customer: 'Jane Akello', type: 'bw', pages: 80, cost: 40000, location: 'Kampala, Ntinda', status: 'ready', time: '1.5 hrs ago' },
  { id: 'PRT-0043', customer: 'John Mukasa', type: 'color', pages: 8, cost: 12000, location: 'Mukono, Seeta', status: 'ready', time: '2 hrs ago' },
  { id: 'PRT-0042', customer: 'Patricia N.', type: 'bw', pages: 60, cost: 30000, location: 'Wakiso, Kira', status: 'delivered', time: '3 hrs ago' },
  { id: 'PRT-0041', customer: 'Esther Nalubega', type: 'color', pages: 15, cost: 22500, location: 'Wakiso, Namasuba', status: 'delivered', time: '5 hrs ago' },
];

type PrintStatus = 'pending' | 'printing' | 'ready' | 'delivered';
const statusConfig: Record<PrintStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  printing: { label: 'Printing', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Printer },
  ready: { label: 'Ready', className: 'bg-green-500/10 text-green-400 border-green-500/20', icon: PackageCheck },
  delivered: { label: 'Delivered', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: CheckCircle2 },
};
const nextStatusMap: Record<PrintStatus, PrintStatus | null> = {
  pending: 'printing', printing: 'ready', ready: 'delivered', delivered: null,
};

export default function PrintDropView() {
  const [orders, setOrders] = useState(demoOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PrintStatus | 'all'>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  const stats = {
    today: orders.filter((o) => o.status !== 'delivered').length + 4,
    pending: orders.filter((o) => o.status === 'pending').length,
    revenue: orders.reduce((sum, o) => sum + o.cost, 0),
    pages: orders.reduce((sum, o) => sum + o.pages, 0),
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = !searchQuery || order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const advanceStatus = (id: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id === id) { const next = nextStatusMap[o.status as PrintStatus]; return next ? { ...o, status: next } : o; }
      return o;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: stats.today, icon: Printer, color: 'text-admin-accent' },
          { label: 'Pending Print', value: stats.pending, icon: Clock, color: 'text-amber-400' },
          { label: 'Print Revenue', value: `UGX ${(stats.revenue / 1000).toFixed(0)}K`, icon: PackageCheck, color: 'text-green-400' },
          { label: 'Pages Printed', value: stats.pages.toLocaleString(), icon: CheckCircle2, color: 'text-blue-400' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-admin-card border-admin-border p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-admin-muted mb-1">{stat.label}</p><p className={`text-2xl font-bold font-space ${stat.color}`}>{stat.value}</p></div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </div>
          </Card>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search print orders..." className="pl-9 bg-admin-card border-admin-border text-admin-text placeholder:text-admin-muted" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as PrintStatus | 'all')} className="h-10 px-4 pr-10 bg-admin-card border border-admin-border rounded-lg text-sm text-admin-text focus:outline-none focus:border-admin-accent appearance-none">
            <option value="all">All Orders</option><option value="pending">Pending</option><option value="printing">Printing</option><option value="ready">Ready</option><option value="delivered">Delivered</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted pointer-events-none" />
        </div>
        <Button onClick={() => setShowNewModal(true)} className="bg-admin-accent hover:bg-admin-accent/90 text-white"><Plus className="w-4 h-4 mr-1.5" />New Order</Button>
      </div>
      <Card className="bg-admin-card border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-admin-border">{['Order ID','Customer','Type','Pages','Cost','Location','Status','Time','Action'].map((h) => (<th key={h} className="text-left px-4 py-3 text-xs font-semibold text-admin-muted uppercase tracking-wider">{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-admin-border">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as PrintStatus]; const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-admin-text">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-admin-text">{order.customer}</td>
                    <td className="px-4 py-3 text-sm text-admin-muted capitalize">{order.type === 'bw' ? 'B&W' : 'Color'}</td>
                    <td className="px-4 py-3 text-sm text-admin-text">{order.pages}</td>
                    <td className="px-4 py-3 text-sm font-space text-admin-text">UGX {order.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-admin-muted">{order.location}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}><StatusIcon className="w-3 h-3" />{status.label}</span></td>
                    <td className="px-4 py-3 text-xs text-admin-muted">{order.time}</td>
                    <td className="px-4 py-3">{order.status !== 'delivered' ? (
                      <Button size="sm" variant="outline" onClick={() => advanceStatus(order.id)} className="h-7 text-xs border-admin-border text-admin-text hover:bg-admin-accent/10 hover:text-admin-accent hover:border-admin-accent">
                        {order.status === 'pending' && <Printer className="w-3 h-3 mr-1" />}{order.status === 'printing' && <PackageCheck className="w-3 h-3 mr-1" />}{order.status === 'ready' && <Truck className="w-3 h-3 mr-1" />}
                        {order.status === 'pending' ? 'Start' : order.status === 'printing' ? 'Done' : 'Deliver'}
                      </Button>
                    ) : (<span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Complete</span>)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (<div className="text-center py-12 text-admin-muted"><Printer className="w-10 h-10 mx-auto mb-3 opacity-20" /><p className="text-sm">No print orders found.</p></div>)}
      </Card>
      <AnimatePresence>
        {showNewModal && (<><div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowNewModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <Card className="bg-admin-card border-admin-border p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-poppins font-semibold text-admin-text">New Print Order</h3><button onClick={() => setShowNewModal(false)} className="text-admin-muted hover:text-admin-text"><X className="w-5 h-5" /></button></div>
              <div className="space-y-4">
                <div><label className="text-xs text-admin-muted mb-1.5 block">Customer Name</label><Input placeholder="e.g. Sarah Kimani" className="bg-white/5 border-admin-border text-admin-text placeholder:text-admin-muted/50" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-admin-muted mb-1.5 block">Print Type</label><select className="w-full h-10 px-3 bg-white/5 border border-admin-border rounded-lg text-sm text-admin-text focus:outline-none focus:border-admin-accent"><option value="bw">Black & White</option><option value="color">Color</option></select></div>
                  <div><label className="text-xs text-admin-muted mb-1.5 block">Pages</label><Input type="number" placeholder="20" className="bg-white/5 border-admin-border text-admin-text placeholder:text-admin-muted/50" /></div>
                </div>
                <div><label className="text-xs text-admin-muted mb-1.5 block">Delivery Location</label><Input placeholder="e.g. Kampala, Makindye" className="bg-white/5 border-admin-border text-admin-text placeholder:text-admin-muted/50" /></div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowNewModal(false)} className="flex-1 border-admin-border text-admin-muted hover:text-admin-text">Cancel</Button>
                  <Button onClick={() => setShowNewModal(false)} className="flex-1 bg-admin-accent hover:bg-admin-accent/90 text-white">Create Order</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>)}
      </AnimatePresence>
    </div>
  );
}
