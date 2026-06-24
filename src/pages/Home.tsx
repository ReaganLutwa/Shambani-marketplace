import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingCart, Truck, CheckCircle,
  Smartphone, Globe, Landmark, Phone,
  Star, MapPin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { products, categories, testimonials } from '@/data';
import { useCartStore } from '@/store';

/* ───────── Animation variants ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

/* ───────── Stat Counter Component ───────── */
function AnimatedCounter({ target, suffix = '', duration = 1.5, delay = 0 }: { target: number; suffix?: string; duration?: number; delay?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      let start = 0;
      const increment = target / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, target, duration, delay]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}



/* ───────── Star Rating ───────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-sun fill-sun' : 'text-fog'}`}
        />
      ))}
    </div>
  );
}

/* ───────── Product Card ───────── */
function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-2xl border border-fog overflow-hidden card-hover group"
    >
      <div className="relative h-[180px] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          loading={index < 4 ? 'eager' : 'lazy'}
        />
        <span className="absolute top-3 left-3 bg-mint/90 text-forest text-xs font-semibold px-2.5 py-1 rounded-full">
          {t(product.categoryKey)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-poppins font-semibold text-charcoal text-base">{product.name}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-stone text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>{product.farmer}</span>
          <span className="text-fog">|</span>
          <span>{product.district}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={product.rating} />
          <span className="text-sm text-stone">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-space font-bold text-lg text-forest">
            UGX {product.price.toLocaleString()}
            <span className="text-sm font-normal text-stone">/{t(product.unitKey)}</span>
          </span>
        </div>
        <button
          onClick={() =>
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              farmer: product.farmer,
              unit: product.unit,
            })
          }
          className="w-full mt-3 py-2.5 bg-leaf text-white font-poppins font-semibold text-sm rounded-xl hover:bg-forest hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {t('product.addToCart')}
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════ HOME PAGE ═══════════════ */
export default function Home() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

  const filteredProducts = activeCategory === 'all'
    ? products.slice(0, 8)
    : products.filter((p) => p.category === activeCategory).slice(0, 8);

  const nextTestimonial = () => setTestimonialIdx((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <>
      {/* ═══════ SECTION 1: HERO ═══════ */}
      <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-cream">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-farmer.jpg"
            alt=""
            className="absolute right-0 top-0 w-full md:w-[55%] h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(250,248,243,0.97) 0%, rgba(250,248,243,0.85) 40%, rgba(250,248,243,0.5) 65%, transparent 80%)',
            }}
          />
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: 'rgba(250,248,243,0.88)' }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center container-main pt-12 pb-32">
          <div className="max-w-xl">
            <motion.p
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-4"
            >
              {t('hero.tagline')}
            </motion.p>
            <motion.h1
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="font-poppins font-bold text-4xl md:text-5xl lg:text-[56px] text-charcoal leading-[1.1] tracking-[-0.02em]"
            >
              {t('hero.headline')}
            </motion.h1>
            <motion.p
              custom={0.7}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-5 text-lg text-stone max-w-[520px] leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              custom={0.9}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link to="/browse" className="btn-primary inline-flex items-center gap-2">
                {t('hero.browseCta')}
              </Link>
              <Link to="/farmer-register" className="btn-secondary inline-flex items-center gap-2">
                {t('hero.listCta')}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          ref={statsRef}
          initial={{ y: '100%', opacity: 0 }}
          animate={statsInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 bg-forest/95 text-white"
        >
          <div className="container-main py-6 md:py-0 md:h-[100px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:h-full items-center">
              {[
                { value: 1200, suffix: '+', label: t('stats.farmers') },
                { value: 111, suffix: '+', label: t('stats.districts') },
                { value: 3000, suffix: '+', label: t('stats.buyers') },
                { value: 4, suffix: '', label: t('stats.countries') },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className="font-space font-bold text-2xl md:text-4xl tracking-[-0.02em]">
                    {statsInView ? <AnimatedCounter target={stat.value} suffix={stat.suffix} delay={i * 0.15} /> : `0${stat.suffix}`}
                  </div>
                  <div className="text-xs md:text-[13px] font-medium text-white/70 uppercase tracking-wide mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ SECTION 2: PRODUCE CATEGORIES ═══════ */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
              {t('categories.title')}
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em]">
              {t('categories.subtitle')}
            </h2>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
            className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide justify-start md:justify-center"
          >
            {[{ id: 'all', key: 'categories.all' }, ...categories.map((c) => ({ id: c.id, key: c.nameKey }))].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-leaf text-white'
                    : 'bg-transparent text-charcoal border border-fog hover:border-leaf hover:text-leaf'
                }`}
              >
                {t(cat.key)}
              </button>
            ))}
          </motion.div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.3}
            className="text-center mt-10"
          >
            <Link to="/browse" className="btn-primary inline-flex items-center gap-2">
              {t('categories.browseAll')}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════ SECTION 3: HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="section-padding bg-cloud">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
              {t('howItWorks.eyebrow')}
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em]">
              {t('howItWorks.title')}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Dotted connector line (desktop) */}
            <div className="hidden lg:block absolute top-[32px] left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-mint/40" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative"
            >
              {[
                { num: '01', titleKey: 'howItWorks.step1Title', descKey: 'howItWorks.step1Desc', Icon: Package },
                { num: '02', titleKey: 'howItWorks.step2Title', descKey: 'howItWorks.step2Desc', Icon: ShoppingCart },
                { num: '03', titleKey: 'howItWorks.step3Title', descKey: 'howItWorks.step3Desc', Icon: Truck },
              ].map((step) => (
                <motion.div
                  key={step.num}
                  variants={staggerItem}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-leaf flex items-center justify-center mb-5 relative z-10">
                    <span className="font-space font-bold text-xl text-white">{step.num}</span>
                  </div>
                  <step.Icon className="w-8 h-8 text-leaf mb-3" />
                  <h3 className="font-poppins font-semibold text-xl text-charcoal mb-2">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-stone text-base leading-relaxed max-w-sm">
                    {t(step.descKey)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 4: USSD ═══════ */}
      <section className="section-padding bg-forest overflow-hidden">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <p className="text-mint font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-3">
                {t('ussd.eyebrow')}
              </p>
              <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-white leading-tight tracking-[-0.01em] mb-4">
                {t('ussd.title')}
              </h2>
              <motion.p
                className="font-space font-bold text-5xl md:text-[56px] text-sun leading-none tracking-[0.05em] mb-5"
                style={{ textShadow: '0 0 40px rgba(255,179,0,0.4)' }}
              >
                {t('ussd.code')}
              </motion.p>
              <p className="text-lg text-white/80 leading-relaxed mb-6 max-w-md">
                {t('ussd.description')}
              </p>
              <ul className="space-y-3 mb-8">
                {(['feature1', 'feature2', 'feature3', 'feature4'] as const).map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                    <span className="text-white/80 text-base">{t(`ussd.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/ussd"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white text-white font-poppins font-semibold hover:bg-white hover:text-forest transition-all duration-200"
              >
                {t('ussd.cta')}
              </Link>
            </motion.div>

            {/* Right: Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="relative max-w-[280px] md:max-w-[320px] rotate-[-3deg]">
                <img
                  src="/ussd-phone-mockup.png"
                  alt="USSD *144# feature phone"
                  className="w-full h-auto drop-shadow-2xl"
                />
                {/* Floating particles */}
                <div className="absolute -top-4 -right-4 w-3 h-3 rounded-full bg-mint/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
                <div className="absolute top-8 -left-6 w-2 h-2 rounded-full bg-mint/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
                <div className="absolute bottom-12 -right-8 w-2.5 h-2.5 rounded-full bg-mint/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
                <div className="absolute -bottom-4 left-8 w-2 h-2 rounded-full bg-mint/20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 5: CROSS-BORDER ═══════ */}
      <section className="section-padding bg-wheat">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/map-east-africa.svg"
                alt="East Africa map"
                className="w-full h-auto rounded-2xl"
              />
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
                {t('crossBorder.eyebrow')}
              </p>
              <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em] mb-4">
                {t('crossBorder.title')}
              </h2>
              <p className="text-lg text-stone leading-relaxed mb-6">
                {t('crossBorder.description')}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { flag: '\uD83C\uDDEC\uD83C\uDDEA', name: 'Uganda', descKey: 'crossBorder.uganda' as const },
                  { flag: '\uD83C\uDDF0\uD83C\uDDEA', name: 'Kenya', descKey: 'crossBorder.kenya' as const },
                  { flag: '\uD83C\uDDF9\uD83C\uDDFF', name: 'Tanzania', descKey: 'crossBorder.tanzania' as const },
                  { flag: '\uD83C\uDDF7\uD83C\uDDFC', name: 'Rwanda', descKey: 'crossBorder.rwanda' as const },
                ].map((c) => (
                  <div key={c.name} className="bg-white/60 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{c.flag}</span>
                      <span className="font-poppins font-semibold text-charcoal text-sm">{c.name}</span>
                    </div>
                    <p className="text-xs text-stone">{t(c.descKey)}</p>
                  </div>
                ))}
              </div>
              <Link to="/farmer-register" className="btn-primary inline-flex items-center gap-2">
                {t('crossBorder.cta')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 6: PAYMENT METHODS ═══════ */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
              {t('payments.eyebrow')}
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em]">
              {t('payments.title')}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { titleKey: 'payments.airtelTitle' as const, descKey: 'payments.airtelDesc' as const, Icon: Smartphone },
              { titleKey: 'payments.mtnTitle' as const, descKey: 'payments.mtnDesc' as const, Icon: Phone },
              { titleKey: 'payments.paypalTitle' as const, descKey: 'payments.paypalDesc' as const, Icon: Globe },
              { titleKey: 'payments.bankTitle' as const, descKey: 'payments.bankDesc' as const, Icon: Landmark },
            ].map((method) => (
              <motion.div
                key={method.titleKey}
                variants={staggerItem}
                className="bg-white border border-fog rounded-2xl p-8 text-center card-hover"
              >
                <div className="w-14 h-14 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.Icon className="w-7 h-7 text-leaf" />
                </div>
                <h3 className="font-poppins font-semibold text-lg text-charcoal mb-2">
                  {t(method.titleKey)}
                </h3>
                <p className="text-sm text-stone leading-relaxed">{t(method.descKey)}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-stone text-sm mt-8 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-leaf" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('payments.feeNotice')}
          </motion.p>
        </div>
      </section>

      {/* ═══════ SECTION 7: TESTIMONIALS ═══════ */}
      <section className="section-padding bg-cloud">
        <div className="container-main max-w-[1100px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
              {t('testimonials.eyebrow')}
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em]">
              {t('testimonials.title')}
            </h2>
          </motion.div>

          {/* Desktop: 3 columns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="hidden md:grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((tstm) => (
              <motion.div
                key={tstm.id}
                variants={staggerItem}
                className="bg-white border border-fog rounded-2xl p-6 relative"
              >
                <span className="absolute top-4 left-4 text-mint text-5xl font-serif leading-none">&ldquo;</span>
                <div className="pt-8">
                  <p className="text-charcoal text-base leading-relaxed mb-4">
                    {t(tstm.quote)}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="w-4 h-4 text-sun fill-sun" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={tstm.avatar}
                      alt={tstm.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-poppins font-semibold text-sm text-charcoal">{tstm.name}</p>
                      <p className="text-xs text-stone">{t(tstm.role)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile: Carousel */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-fog rounded-2xl p-6 relative"
              >
                <span className="absolute top-4 left-4 text-mint text-5xl font-serif leading-none">&ldquo;</span>
                <div className="pt-8">
                  <p className="text-charcoal text-base leading-relaxed mb-4">
                    {t(testimonials[testimonialIdx].quote)}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="w-4 h-4 text-sun fill-sun" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonials[testimonialIdx].avatar}
                      alt={testimonials[testimonialIdx].name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-poppins font-semibold text-sm text-charcoal">{testimonials[testimonialIdx].name}</p>
                      <p className="text-xs text-stone">{t(testimonials[testimonialIdx].role)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={prevTestimonial} className="p-2 rounded-full bg-white border border-fog hover:bg-cloud transition-colors">
                <ChevronLeft className="w-5 h-5 text-charcoal" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === testimonialIdx ? 'bg-leaf' : 'bg-fog'
                    }`}
                  />
                ))}
              </div>
              <button onClick={nextTestimonial} className="p-2 rounded-full bg-white border border-fog hover:bg-cloud transition-colors">
                <ChevronRight className="w-5 h-5 text-charcoal" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 8: CTA BANNER ═══════ */}
      <section className="relative overflow-hidden">
        <div
          className="py-20"
          style={{
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)',
          }}
        >
          {/* Leaf pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q45 20 30 55 Q15 20 30 5' fill='white'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="container-main text-center relative z-10"
          >
            <motion.h2
              variants={staggerItem}
              className="font-poppins font-bold text-3xl md:text-[40px] text-white leading-tight tracking-[-0.01em] mb-4"
            >
              {t('cta.title')}
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed"
            >
              {t('cta.subtitle')}
            </motion.p>
            <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-4">
              <Link
                to="/farmer-register"
                className="px-8 py-3.5 bg-white text-forest font-poppins font-semibold rounded-xl hover:scale-[1.02] transition-all duration-200"
              >
                {t('cta.sell')}
              </Link>
              <Link
                to="/browse"
                className="px-8 py-3.5 border-2 border-white text-white font-poppins font-semibold rounded-xl hover:bg-white hover:text-forest transition-all duration-200"
              >
                {t('cta.buy')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
