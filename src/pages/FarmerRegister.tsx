import { Link } from 'react-router-dom';
import { Database, LockKeyhole, RadioTower, ShieldCheck } from 'lucide-react';

const readinessItems = [
  {
    icon: Database,
    title: 'Secure backend',
    text: 'Farmer profiles must be stored in a protected database with backups and controlled access.',
  },
  {
    icon: LockKeyhole,
    title: 'Privacy compliance',
    text: 'The privacy notice, consent process and PDPO registration must be complete before personal data is collected.',
  },
  {
    icon: RadioTower,
    title: 'USSD and SMS partner',
    text: 'The pilot needs an approved telecom or licensed aggregator connection. No short code is active yet.',
  },
];

export default function FarmerRegister() {
  return (
    <main className="min-h-[75dvh] bg-[#0F172A] px-4 py-14 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Registration temporarily paused
        </div>
        <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Farmer onboarding will open after the pilot systems pass security and compliance checks
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          ShambaNi does not currently collect farmer passwords, identity documents, bank details or mobile-money credentials on this website. The earlier browser-only registration form has been withdrawn because it did not provide secure server-side storage.
        </p>

        <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Requirements before registration opens">
          {readinessItems.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
              <Icon className="h-6 w-6 text-emerald-400" aria-hidden="true" />
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </article>
          ))}
        </section>

        <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Interested in the Mpigi and Wakiso pilot</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Email the project team with your name, district and produce category. Do not send a National ID, bank account number, password or mobile-money PIN.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400" href="mailto:support@shambani-market.africa?subject=Farmer%20pilot%20interest">
              Email pilot interest
            </a>
            <Link className="rounded-xl border border-slate-600 px-5 py-3 font-semibold hover:border-slate-400" to="/ussd">
              View proposed USSD flow
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
