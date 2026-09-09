import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';

export default function PilotStatusBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-950">
      <div className="container-main py-2.5 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <span className="flex items-center gap-2 font-medium">
          <FlaskConical className="h-4 w-4 shrink-0" aria-hidden="true" />
          Pre-pilot prototype: sample listings only. Registration, ordering, payments and USSD are not yet live.
        </span>
        <Link className="font-semibold underline underline-offset-2" to="/operations">
          View readiness status
        </Link>
      </div>
    </div>
  );
}
