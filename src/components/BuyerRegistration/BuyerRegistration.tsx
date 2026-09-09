import { Link } from 'react-router-dom';
import { Building2, ClipboardCheck, ShieldCheck } from 'lucide-react';
import './BuyerRegistration.css';

export default function BuyerRegistration() {
  return (
    <main className="min-h-[75dvh] bg-cream px-4 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-900">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Buyer registration temporarily paused
        </div>
        <h1 className="mt-5 max-w-2xl font-poppins text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
          Institutional buyer onboarding will begin with a controlled Mpigi and Wakiso pilot
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-stone">
          The public prototype does not yet create buyer accounts or store procurement records. ShambaNi will open registration after server-side authentication, data-protection controls and an approved operating process are in place.
        </p>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-fog bg-white p-6">
            <Building2 className="h-7 w-7 text-leaf" aria-hidden="true" />
            <h2 className="mt-4 font-poppins text-lg font-semibold text-charcoal">Pilot buyers</h2>
            <p className="mt-2 text-sm leading-6 text-stone">The first cohort will focus on schools, restaurants, produce retailers and households that can document real demand.</p>
          </article>
          <article className="rounded-2xl border border-fog bg-white p-6">
            <ClipboardCheck className="h-7 w-7 text-leaf" aria-hidden="true" />
            <h2 className="mt-4 font-poppins text-lg font-semibold text-charcoal">Manual confirmation</h2>
            <p className="mt-2 text-sm leading-6 text-stone">Prices, quantity, delivery and payment arrangements will be confirmed before any pilot order is treated as accepted.</p>
          </article>
        </section>

        <div className="mt-10 rounded-2xl border border-fog bg-white p-6">
          <h2 className="font-poppins text-xl font-semibold text-charcoal">Express pilot interest</h2>
          <p className="mt-2 text-sm leading-6 text-stone">
            Email the project team with your organization type, district and produce requirements. Do not email passwords, payment credentials, tax records or confidential procurement documents.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="btn-primary inline-flex" href="mailto:support@shambani-market.africa?subject=Buyer%20pilot%20interest">Email pilot interest</a>
            <Link className="btn-secondary inline-flex" to="/operations">Review pilot controls</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
