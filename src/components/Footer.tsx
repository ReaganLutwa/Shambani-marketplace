import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLangStore } from '@/store';
import { Printer, ExternalLink, Settings } from 'lucide-react';

const languages = [
  { code: 'en' as const, label: 'English', flag: '\uD83C\uDDFA\uD83C\uDDFC' },
  { code: 'sw' as const, label: 'Kiswahili', flag: '\uD83C\uDDF9\uD83C\uDDFF' },
  { code: 'rw' as const, label: 'Runyarwanda', flag: '\uD83C\uDDF7\uD83C\uDDFC' },
  { code: 'lg' as const, label: 'Luganda', flag: '\uD83C\uDDFA\uD83C\uDDEC' },
];

const ecosystemLinks = [
  { name: 'Unifiedfarm BLM', href: 'https://www.unifiedfarmblm.com', external: true },
  { name: 'PrintDrop', href: '/#/print', external: false },
  { name: 'Farm Blog', href: 'https://unifiedfarmblm.blogspot.com', external: true },
  { name: 'Fiverr', href: 'https://www.fiverr.com', external: true },
];

export default function Footer() {
  const { t } = useTranslation();
  const { currentLang, setLanguage } = useLangStore();

  return (
    <footer className="bg-night text-cream/80">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-6">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src="logo.svg" alt="ShambaNi" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed text-cream/70 max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-cream font-poppins font-semibold text-sm mb-4 tracking-wide">
              {t('footer.platform')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/browse" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('nav.browse')}
                </Link>
              </li>
              <li>
                <Link to="/for-buyers" className="text-sm text-mint hover:text-white transition-colors duration-200">
                  For Buyers
                </Link>
              </li>
              <li>
                <Link to="/print" className="text-sm text-mint hover:text-white transition-colors duration-200 flex items-center gap-1.5">
                  <Printer className="w-3 h-3" />
                  PrintDrop
                  <span className="bg-leaf/30 text-mint text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-amber-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
                  <Settings className="w-3 h-3" />
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/ussd" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('nav.ussd')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h4 className="text-cream font-poppins font-semibold text-sm mb-4 tracking-wide">
              {t('footer.forFarmers')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/farmer-register" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.listFarm')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.farmerLogin')}
                </Link>
              </li>
              <li>
                <Link to="/ussd" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.ussdGuide')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.successStories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Buyers - NEW */}
          <div>
            <h4 className="text-cream font-poppins font-semibold text-sm mb-4 tracking-wide">
              For Buyers
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/for-buyers" className="text-sm text-mint hover:text-white transition-colors duration-200">
                  Why Buy on ShambaNi
                </Link>
              </li>
              <li>
                <Link to="/buyer-register" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  Register as Buyer
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  Browse Produce
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  Institutional Buyers
                </Link>
              </li>
            </ul>
          </div>

          {/* My Projects / Ecosystem */}
          <div>
            <h4 className="text-cream font-poppins font-semibold text-sm mb-4 tracking-wide">
              My Projects
            </h4>
            <ul className="space-y-2.5">
              {ecosystemLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cream/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-mint hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - UPDATED: Phone/email hidden, legal links added */}
          <div>
            <h4 className="text-cream font-poppins font-semibold text-sm mb-4 tracking-wide">
              {t('footer.paymentsLegal')}
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-cream/70">Airtel Money</span></li>
              <li><span className="text-sm text-cream/70">MTN Mobile Money</span></li>
              <li><span className="text-sm text-cream/70">PayPal</span></li>
              <li><span className="text-sm text-cream/70">{t('admin.payments')}</span></li>
              <li className="pt-2 border-t border-white/10 mt-2">
                <span className="text-xs text-cream/50 block">Support</span>
                <Link to="/" className="text-sm text-mint hover:text-white transition-colors">
                  Live Chat (bottom right)
                </Link>
              </li>
              <li>
                <span className="text-xs text-cream/50 block">Email</span>
                <span className="text-sm text-cream/70">support@shambani-market.africa</span>
              </li>
              <li>
                <span className="text-xs text-cream/50 block">Location</span>
                <span className="text-sm text-cream/70">Mpigi, Uganda</span>
              </li>
              <li className="pt-2 border-t border-white/10 mt-2">
                <Link to="/privacy" className="text-xs text-cream/50 hover:text-white transition-colors block">Privacy Policy</Link>
                <Link to="/terms" className="text-xs text-cream/50 hover:text-white transition-colors block mt-1">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/50 text-center sm:text-left">
            &copy; {t('footer.copyright')} Part of the <strong className="text-cream/70">Reaganlutwa</strong> ecosystem.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-cream/50">{t('footer.switchLang')}:</span>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  currentLang === lang.code
                    ? 'bg-leaf/20 text-mint font-medium'
                    : 'text-cream/50 hover:text-cream'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
