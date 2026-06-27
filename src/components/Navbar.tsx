import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingCart, Printer, Settings } from 'lucide-react';
import { useLangStore } from '@/store';
import { useCartStore } from '@/store';

const languages = [
  { code: 'en' as const, label: 'EN', flag: '\uD83C\uDDFA\uD83C\uDDFC' },
  { code: 'sw' as const, label: 'SW', flag: '\uD83C\uDDF9\uD83C\uDDFF' },
  { code: 'rw' as const, label: 'RW', flag: '\uD83C\uDDF7\uD83C\uDDFC' },
  { code: 'lg' as const, label: 'LG', flag: '\uD83C\uDDFA\uD83C\uDDEC' },
];

const navLinks = [
  { to: '/browse', key: 'nav.browse' },
  { to: '/farmer-register', key: 'nav.farmers' },
  { to: '/#how-it-works', key: 'nav.howItWorks' },
  { to: '/ussd', key: 'nav.ussd' },
  { to: '/about', key: 'nav.about' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { currentLang, setLanguage } = useLangStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 h-[72px] md:h-[72px] transition-all duration-300 ${
        scrolled
          ? 'shadow-[0_2px_20px_rgba(0,0,0,0.06)] bg-[rgba(250,248,243,0.95)] backdrop-blur-xl'
          : 'bg-[rgba(250,248,243,0.95)] backdrop-blur-xl'
      } border-b border-fog`}
    >
      <div className="container-main h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="logo.svg" alt="ShambaNi" className="h-9 w-auto" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-3 py-2 text-sm font-medium text-charcoal hover:text-forest transition-colors group"
            >
              {t(link.key)}
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-leaf scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left" />
            </Link>
          ))}
          {/* PrintDrop Link */}
          <Link
            to="/print"
            className="relative px-3 py-2 text-sm font-medium text-leaf hover:text-forest transition-colors group flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            PrintDrop
            <span className="bg-leaf text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-leaf scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left" />
          </Link>
          {/* Admin Link */}
          <Link
            to="/admin"
            className="relative px-3 py-2 text-sm font-medium text-stone hover:text-forest transition-colors group flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            Admin
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-leaf scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left" />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-cloud transition-colors"
            >
              <span className="text-base">
                {languages.find((l) => l.code === currentLang)?.flag}
              </span>
              <span className="hidden sm:inline">{currentLang.toUpperCase()}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-fog py-1.5 min-w-[140px] z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-cloud transition-colors ${
                      currentLang === lang.code ? 'text-forest font-medium' : 'text-charcoal'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {currentLang === lang.code && (
                      <svg className="w-4 h-4 ml-auto text-leaf" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-lg text-charcoal hover:bg-cloud transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-leaf text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Sign In */}
          <Link
            to="/"
            className="hidden md:inline-flex items-center px-5 py-2.5 bg-leaf text-white text-sm font-poppins font-semibold rounded-xl hover:bg-forest hover:scale-[1.02] transition-all duration-200"
          >
            {t('nav.signIn')}
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-cloud transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-fog shadow-lg">
          <div className="container-main py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-base font-medium text-charcoal hover:text-forest hover:bg-cloud rounded-lg transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
            {/* PrintDrop Mobile */}
            <Link
              to="/print"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-base font-medium text-leaf hover:text-forest hover:bg-cloud rounded-lg transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              PrintDrop
              <span className="bg-leaf text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
            </Link>
            {/* Admin Mobile */}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-base font-medium text-stone hover:text-forest hover:bg-cloud rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Admin Dashboard
            </Link>
            <div className="mt-2 pt-2 border-t border-fog">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-3 bg-leaf text-white font-poppins font-semibold rounded-xl"
              >
                {t('nav.signIn')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
