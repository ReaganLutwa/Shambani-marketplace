import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Users, ShoppingBasket, BadgeDollarSign, ClipboardCheck,
  AlertTriangle, FileDown, Lock, CheckCircle2, Clock3, XCircle, ArrowRight,
} from 'lucide-react';

const stats = [
  { label: 'Pilot farmers onboarded', value: '128', note: 'sample data', icon: Users },
  { label: 'Verification queue', value: '17', note: 'phone/location first', icon: ClipboardCheck },
  { label: 'Orders this week', value: '46', note: 'sample data', icon: ShoppingBasket },
  { label: 'Buyer service fees', value: 'UGX 412,500', note: '2.5% buyer-paid', icon: BadgeDollarSign },
];

const queue = [
  { id: 'F-1042', district: 'Mpigi', crop: 'Tomatoes', status: 'Pending review', tone: 'amber' },
  { id: 'F-1037', district: 'Wakiso', crop: 'Matooke', status: 'Phone verified', tone: 'blue' },
  { id: 'F-1029', district: 'Mpigi', crop: 'Eggs', status: 'Approved', tone: 'green' },
  { id: 'F-1018', district: 'Wakiso', crop: 'Cabbage', status: 'Needs farm photo', tone: 'red' },
];

const districts = [
  { name: 'Mpigi', farmers: 74, orders: 26 },
  { name: 'Wakiso', farmers: 54, orders: 20 },
];

const lifecycle = [
  'Order request received',
  'ShambaNi confirms buyer, quantity, delivery and total',
  'Buyer pays listed price + delivery + 2.5% service fee',
  'Delivery is confirmed with the farmer and buyer',
  'Farmer receives listed price; fee is recorded in ledger',
];

const audit = [
  { time: '09:12', actor: 'ShambaNi Ops', action: 'Approved farmer F-1029 after phone/location review' },
  { time: '10:03', actor: 'System', action: 'Order #SN-1188 moved to payment confirmation' },
  { time: '11:27', actor: 'District Partner', action: 'Added pickup note for Mpigi Saturday market' },
  { time: '12:40', actor: 'ShambaNi Ops', action: 'Recorded buyer service fee UGX 7,500 on order #SN-1191' },
];

function StatusPill({ tone, children }: { tone: string; children: ReactNode }) {
  const styles: Record<string, string> = {
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[tone]}`}>{children}</span>;
}

export default function OpsDemo() {
  return (
    <div className="bg-[#FAF8F3] text-charcoal">
      <section className="bg-night text-cream">
        <div className="container-main py-16 md:py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm text-mint mb-6">
            <ShieldCheck className="w-4 h-4" />
            Public operations demo — sample data only
          </div>
          <h1 className="font-space font-bold text-4xl md:text-6xl tracking-[-0.03em] max-w-4xl">
            Operations & Oversight for a trusted farmers marketplace
          </h1>
          <p className="mt-5 max-w-3xl text-cream/75 text-lg leading-relaxed">
            This page shows how ShambaNi administers farmer verification, orders, buyer-paid service fees,
            delivery confirmation, disputes and district reporting — without exposing real farmer IDs,
            phone numbers or payment secrets.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/farmer-register" className="inline-flex items-center gap-2 bg-leaf text-white px-5 py-3 rounded-xl font-semibold hover:bg-forest transition-colors">
              Join pilot farmers <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/for-buyers" className="inline-flex items-center gap-2 border border-white/25 text-cream px-5 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Become a pilot buyer
            </Link>
          </div>
        </div>
      </section>

      <section className="container-main py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-fog p-5 shadow-sm">
              <item.icon className="w-5 h-5 text-leaf mb-4" />
              <div className="font-space font-bold text-2xl md:text-3xl">{item.value}</div>
              <div className="text-sm font-medium mt-1">{item.label}</div>
              <div className="text-xs text-stone mt-1">{item.note}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-fog p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-poppins font-bold text-xl">Farmer verification queue</h2>
                <p className="text-sm text-stone mt-1">Phased checks: phone/location first, secure ID review only after backend activation.</p>
              </div>
              <StatusPill tone="amber">Demo</StatusPill>
            </div>
            <div className="space-y-3">
              {queue.map((farmer) => (
                <div key={farmer.id} className="flex items-center justify-between gap-3 border border-fog rounded-xl px-4 py-3">
                  <div>
                    <div className="font-semibold">{farmer.id} · {farmer.crop}</div>
                    <div className="text-sm text-stone">{farmer.district} district</div>
                  </div>
                  <StatusPill tone={farmer.tone}>{farmer.status}</StatusPill>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-fog p-6 shadow-sm">
            <h2 className="font-poppins font-bold text-xl">Pilot district snapshot</h2>
            <p className="text-sm text-stone mt-1 mb-5">Mpigi and Wakiso first; more districts after fulfillment is proven.</p>
            <div className="space-y-5">
              {districts.map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>{d.name}</span>
                    <span>{d.farmers} farmers · {d.orders} orders</span>
                  </div>
                  <div className="h-3 bg-fog rounded-full overflow-hidden">
                    <div className="h-full bg-leaf rounded-full" style={{ width: `${Math.min(100, d.farmers)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-[#F1F7F2] border border-leaf/20 p-4 text-sm text-forest">
              Government/partner view should show aggregated district reports — not raw farmer IDs or private phone numbers.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-fog p-6 shadow-sm lg:col-span-2">
            <h2 className="font-poppins font-bold text-xl">Order and payout lifecycle</h2>
            <div className="mt-5 space-y-4">
              {lifecycle.map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-leaf text-white flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="pt-1 text-sm md:text-base">{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-fog p-6 shadow-sm">
            <h2 className="font-poppins font-bold text-xl">Controls that matter</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex gap-3"><Lock className="w-4 h-4 text-leaf mt-0.5" /><span>No hardcoded admin password, no public IDs, no API secrets in frontend code.</span></div>
              <div className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-leaf mt-0.5" /><span>Buyer-paid 2.5% service fee is shown before payment confirmation.</span></div>
              <div className="flex gap-3"><Clock3 className="w-4 h-4 text-leaf mt-0.5" /><span>Delivery confirmation happens before farmer payout is marked complete.</span></div>
              <div className="flex gap-3"><AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" /><span>Disputes pause payout until quality/quantity is resolved.</span></div>
              <div className="flex gap-3"><FileDown className="w-4 h-4 text-leaf mt-0.5" /><span>Exports planned: CSV/PDF district reports for partners and auditors.</span></div>
              <div className="flex gap-3"><XCircle className="w-4 h-4 text-red-500 mt-0.5" /><span>No claim of live USSD, escrow or encrypted ID storage until backend is active.</span></div>
            </div>
          </div>
        </div>

        <div className="bg-night text-cream rounded-2xl p-6 md:p-8 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="font-poppins font-bold text-xl md:text-2xl">Audit trail demo</h2>
              <p className="text-cream/70 text-sm mt-1">Every sensitive action should be logged before government or institutional partners rely on the system.</p>
            </div>
            <span className="text-xs uppercase tracking-wide text-mint">Sample log</span>
          </div>
          <div className="mt-6 space-y-3">
            {audit.map((row) => (
              <div key={row.time + row.action} className="grid md:grid-cols-[70px_150px_1fr] gap-2 md:gap-4 border-b border-white/10 pb-3 text-sm">
                <span className="text-mint">{row.time}</span>
                <span className="font-semibold">{row.actor}</span>
                <span className="text-cream/75">{row.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
