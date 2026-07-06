import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingCart, Printer, Settings } from 'lucide-react';
import { useLangStore } from '@/store';
import { useCartStore } from '@/store';

const languages = [
  { code: 'en' as const, label: 'EN', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { code: 'sw' as const, label: 'SW', flag: '\uD83C\uDDF9\uD83C\uDDFF' },
  { code: 'rw' as const, label: 'RW', flag: '\uD83C\uDDF7\uD83C\uDDFC' },
  { code: 'lg' as const, label: 'LG', flag: '\uD83C\uDDFA\uD83C\uDDEC' },
];

const navLinks = [
  { to: '/browse', key: 'nav.browse' },
  { to: '/farmer-register', key: 'nav.farmers' },
  { to: '/for-buyers', key: 'For Buyers', isNew: true },
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
              className={`relative px-3 py-2 text-sm font-medium transition-colors group ${
                link.isNew ? 'text-leaf hover:text-forest' : 'text-charcoal hover:text-forest'
              }`}
            >
              {link.isNew ? link.key : t(link.key)}
              {link.isNew && (
                <span className="bg-leaf text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ml-1">NEW</span>
              )}
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

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-charcoal hover:text-forest transition-colors"
            >
              <span className="text-base">{languages.find((l) => l.code === currentLang)?.flag}</span>
              <span className="hidden sm:inline">{languages.find((l) => l.code === currentLang)?.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-fog py-1 min-w-[140px] z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                      currentLang === lang.code
                        ? 'bg-leaf/10 text-leaf font-medium'
                        : 'text-charcoal hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-charcoal hover:text-forest transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-leaf text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-forest transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[rgba(250,248,243,0.98)] backdrop-blur-xl border-t border-fog">
          <div className="container-main py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  link.isNew
                    ? 'text-leaf hover:bg-leaf/10'
                    : 'text-charcoal hover:bg-gray-100'
                }`}
              >
                {link.isNew ? link.key : t(link.key)}
                {link.isNew && (
                  <span className="bg-leaf text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ml-2">NEW</span>
                )}
              </Link>
            ))}
            <Link
              to="/print"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-leaf hover:bg-leaf/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              PrintDrop
              <span className="bg-leaf text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-stone hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
