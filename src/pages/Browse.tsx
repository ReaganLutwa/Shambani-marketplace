import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, ChevronDown, SlidersHorizontal, RotateCcw, Printer, MessageCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { supportedCountries, getDistrictsForCountry } from '@/data/districts';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'stock';

const sortOptions: { value: SortOption; labelKey: string }[] = [
  { value: 'featured', labelKey: 'browse.sortFeatured' },
  { value: 'price-low', labelKey: 'browse.sortPriceLow' },
  { value: 'price-high', labelKey: 'browse.sortPriceHigh' },
  { value: 'rating', labelKey: 'browse.sortRating' },
  { value: 'stock', labelKey: 'browse.sortStock' },
];

const allCategory = { id: 'all', name: 'All', nameKey: 'categories.all', description: '', image: '', icon: '' };

const easing = [0.4, 0, 0.2, 1] as [number, number, number, number];

export default function Browse() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Derived data
  const districts = useMemo(
    () => (selectedCountry ? getDistrictsForCountry(selectedCountry) : []),
    [selectedCountry]
  );

  const allCategories = [allCategory, ...categories];

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.farmer.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          t(p.categoryKey).toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Country filter
    if (selectedCountry) {
      const countryName = supportedCountries.find((c) => c.code === selectedCountry)?.name;
      if (countryName) {
        result = result.filter((p) => p.country === countryName);
      }
    }

    // District filter
    if (selectedDistrict) {
      result = result.filter((p) => p.district === selectedDistrict);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'stock':
        result.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedCountry, selectedDistrict, sortBy, t]);

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'all' || selectedCountry || selectedDistrict || sortBy !== 'featured';

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCountry('');
    setSelectedDistrict('');
    setSortBy('featured');
  }, []);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    setSelectedDistrict('');
  };

  // Show PrintDrop card when no filters are active or when searching for print-related terms
  const showPrintDrop = !hasActiveFilters || searchQuery.toLowerCase().includes('print');

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Page Header */}
      <section className="pt-8 pb-6 md:pt-10 md:pb-8">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easing }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-charcoal mb-2">
              {t('browse.title')}
            </h1>
            <p className="text-base md:text-lg text-stone max-w-2xl mb-6">
              {t('browse.subtitle')}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easing }}
            className="relative max-w-2xl"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('browse.searchPlaceholder')}
              className="w-full h-14 pl-12 pr-12 bg-white border border-fog rounded-xl text-base text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-leaf focus:ring-3 focus:ring-leaf/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-cloud transition-colors"
              >
                <X className="w-4 h-4 text-stone" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════ PRINTDROP SERVICE CARD (shown when no filters) ═══════ */}
      <AnimatePresence>
        {showPrintDrop && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pb-4"
          >
            <div className="container-main">
              <Link
                to="/print"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-forest rounded-2xl p-5 sm:p-6 text-white hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                    <Printer className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-poppins font-bold text-lg">{t('printDrop.bannerTitle')}</h3>
                      <span className="bg-mint text-forest text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                    </div>
                    <p className="text-white/70 text-sm">
                      {t('printDrop.bannerSubtitle')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto">
                  <span className="font-space font-bold text-xl">UGX 500+</span>
                  <span className="text-white/50 text-sm">/page</span>
                  <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/25 transition-colors ml-2">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-40 bg-white border-b border-fog shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="container-main py-3">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: easing }}
            className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide"
          >
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium font-poppins transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-forest text-white shadow-md'
                    : 'bg-cloud text-charcoal hover:bg-fog'
                }`}
              >
                {t(cat.nameKey)}
              </button>
            ))}
          </motion.div>

          {/* Filter Controls Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters
                  ? 'border-leaf bg-leaf/5 text-forest'
                  : 'border-fog text-charcoal hover:bg-cloud'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{t('browse.filters')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Country Filter */}
            <div className="relative group">
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-fog rounded-lg text-sm text-charcoal focus:outline-none focus:border-leaf cursor-pointer hover:bg-cloud transition-colors"
              >
                <option value="">{t('browse.allCountries')}</option>
                {supportedCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone pointer-events-none" />
            </div>

            {/* District Filter */}
            <div className="relative group">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedCountry}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-fog rounded-lg text-sm text-charcoal focus:outline-none focus:border-leaf cursor-pointer hover:bg-cloud transition-colors disabled:opacity-50 disabled:cursor-not-allowed max-w-[160px]"
              >
                <option value="">{t('browse.allDistricts')}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative group ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-fog rounded-lg text-sm text-charcoal focus:outline-none focus:border-leaf cursor-pointer hover:bg-cloud transition-colors"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone pointer-events-none" />
            </div>

            {/* Reset Filters */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-stone hover:text-error transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t('browse.reset')}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 md:py-10">
        <div className="container-main">
          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-sm text-stone">
              {t('browse.showing')} {filteredProducts.length} {t('browse.products')}
            </p>
          </motion.div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-fog/50 rounded-full flex items-center justify-center mb-5">
                <Search className="w-10 h-10 text-stone/50" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-charcoal mb-2">
                {t('browse.noResults')}
              </h3>
              <p className="text-stone max-w-md mb-6">{t('browse.noResultsDesc')}</p>
              <button
                onClick={handleClearFilters}
                className="btn-primary"
              >
                {t('browse.clearFilters')}
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
