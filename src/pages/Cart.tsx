import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Shield,
  Lock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Clock,
  Truck,
  Smartphone,
  Globe,
  Landmark,
  Minus,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store';
import { supportedCountries, getDistrictsForCountry } from '@/data/districts';

const easing = [0.4, 0, 0.2, 1] as [number, number, number, number];

const paymentMethods = [
  {
    id: 'airtel',
    label: 'Airtel Money',
    icon: Smartphone,
    desc: 'cart.airtelDesc',
  },
  {
    id: 'mtn',
    label: 'MTN Mobile Money',
    icon: Smartphone,
    desc: 'cart.mtnDesc',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: Globe,
    desc: 'cart.paypalDesc',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: Landmark,
    desc: 'cart.bankDesc',
  },
];

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review' | 'success';

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Shipping form state
  const [shipping, setShipping] = useState({
    fullName: '',
    phone: '',
    email: '',
    country: '',
    district: '',
    address: '',
    notes: '',
  });

  const platformFee = Math.round(totalPrice() * 0.025);
  const deliveryFee = totalPrice() > 50000 ? 0 : 5000;
  const finalTotal = totalPrice() + platformFee + deliveryFee;

  const districts = useMemo(
    () => (shipping.country ? getDistrictsForCountry(shipping.country) : []),
    [shipping.country]
  );

  const isShippingValid = shipping.fullName && shipping.phone && shipping.country && shipping.district && shipping.address;

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQty);
    }
  };

  const handlePlaceOrder = () => {
    if (!termsAccepted) return;
    setOrderNumber(`SN${Date.now().toString().slice(-6)}`);
    clearCart();
    setStep('success');
  };

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'cart', label: t('cart.stepCart') },
    { key: 'shipping', label: t('cart.stepShipping') },
    { key: 'payment', label: t('cart.stepPayment') },
    { key: 'review', label: t('cart.stepReview') },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  // ─── Empty Cart ───
  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-[80dvh] bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easing }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="w-24 h-24 bg-fog/50 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-stone/50" />
          </div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-charcoal mb-3">
            {t('cart.emptyTitle')}
          </h1>
          <p className="text-stone mb-8 leading-relaxed">
            {t('cart.emptyDescription')}
          </p>
          <Link to="/browse" className="btn-primary flex items-center gap-2">
            {t('cart.browseProduce')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Page Header */}
      <section className="pt-8 pb-6">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-charcoal mb-2">
              {step === 'success' ? t('cart.successTitle') : t('cart.title')}
            </h1>
            <p className="text-stone">
              {step === 'cart' && t('cart.subtitle')}
              {step === 'shipping' && t('cart.shippingSubtitle')}
              {step === 'payment' && t('cart.paymentSubtitle')}
              {step === 'review' && t('cart.reviewSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Checkout Progress Bar (hidden on cart and success) */}
      {step !== 'cart' && step !== 'success' && (
        <div className="border-b border-fog bg-white">
          <div className="container-main py-4">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        i <= currentStepIndex
                          ? 'bg-leaf text-white'
                          : 'bg-fog text-stone'
                      }`}
                    >
                      {i < currentStepIndex ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`hidden md:inline text-sm font-medium ${
                        i <= currentStepIndex ? 'text-forest' : 'text-stone'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight
                      className={`w-4 h-4 ${
                        i < currentStepIndex ? 'text-leaf' : 'text-fog'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container-main py-8 pb-20">
        {/* ─── CART STEP ─── */}
        {step === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-2xl border border-fog p-4 md:p-5 flex gap-4"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.id}`}
                      className="shrink-0 w-24 h-20 md:w-28 md:h-24 rounded-xl overflow-hidden bg-cloud"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-poppins font-semibold text-charcoal text-sm md:text-base truncate hover:text-forest transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-stone text-xs md:text-sm mt-0.5 flex items-center gap-1">
                        <span>{item.farmer}</span>
                      </p>
                      <p className="text-xs text-mint mt-0.5">{item.unit}</p>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col items-end justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-fog rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-cloud transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="w-7 md:w-8 h-7 md:h-8 flex items-center justify-center font-space font-semibold text-sm"
                          >
                            {item.quantity}
                          </motion.span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-cloud transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-space font-semibold text-charcoal text-sm md:text-base">
                          {(item.price * item.quantity).toLocaleString()} UGX
                        </p>
                        <p className="text-xs text-stone">
                          {item.price.toLocaleString()} / {item.unit}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone hover:text-error transition-colors text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        {t('cart.remove')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary (Sticky) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-[100px] self-start"
            >
              <div className="bg-white rounded-2xl border border-fog p-6">
                <h3 className="font-poppins font-semibold text-charcoal text-lg mb-4">
                  {t('cart.orderSummary')}
                </h3>

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-stone">
                      {t('cart.subtotal')} ({totalItems()} {t('cart.items')})
                    </span>
                    <span className="text-charcoal">
                      {totalPrice().toLocaleString()} UGX
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone">{t('cart.platformFee')}</span>
                    <span className="text-charcoal">{platformFee.toLocaleString()} UGX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone">{t('cart.delivery')}</span>
                    <span className="text-charcoal">
                      {deliveryFee === 0 ? t('cart.freeDelivery') : `${deliveryFee.toLocaleString()} UGX`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-fog pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-poppins font-semibold text-charcoal">{t('cart.total')}</span>
                    <span className="font-space font-bold text-2xl text-forest">
                      {finalTotal.toLocaleString()} UGX
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('shipping')}
                  className="w-full h-[52px] flex items-center justify-center gap-2 bg-leaf text-white font-poppins font-semibold rounded-xl hover:bg-forest hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_16px_rgba(46,125,50,0.3)] mb-3"
                >
                  {t('cart.checkout')}
                  <ChevronRight className="w-4 h-4" />
                </button>

                <Link
                  to="/browse"
                  className="w-full h-11 flex items-center justify-center gap-1 text-sm text-stone hover:text-forest transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {t('cart.continueShopping')}
                </Link>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-fog">
                  <div className="flex items-center gap-1 text-xs text-stone">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{t('cart.secure')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone">
                    <Lock className="w-3.5 h-3.5" />
                    <span>No card stored</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ─── SHIPPING STEP ─── */}
        {step === 'shipping' && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: easing }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-white rounded-2xl border border-fog p-6 md:p-8">
              <h2 className="text-xl font-poppins font-bold text-charcoal mb-6">
                {t('cart.shippingDetails')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-poppins font-semibold text-charcoal mb-1.5">
                    {t('cart.fullName')} *
                  </label>
                  <input
                    type="text"
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    placeholder={t('cart.fullNamePlaceholder')}
                    className="w-full px-4 py-3 bg-white border border-fog rounded-xl text-charcoal placeholder:text-stone focus:outline-none focus:border-leaf focus:ring-3 focus:ring-leaf/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-poppins font-semibold text-charcoal mb-1.5">
                    {t('cart.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="+256 7XX XXX XXX"
                    className="w-full px-4 py-3 bg-white border border-fog rounded-xl text-charcoal placeholder:text-stone focus:outline-none focus:border-leaf focus:ring-3 focus:ring-leaf/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-poppins font-semibold text-charcoal mb-1.5">
                    {t('cart.email')}
                  </label>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white border border-fog rounded-xl text-charcoal placeholder:text-stone focus:outline-none focus:border-leaf focus:ring-3 focus:ring-leaf/10 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-poppins font-semibold text-charcoal mb-1.5">
                      {t('cart.country')} *
                    </label>
                    <select
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value, district: '' })}
                      className="w-full px-4 py-3 bg-white border border-fog rounded-xl text-charcoal focus:outline-none focus:border-leaf focus:ring-3 focus:ring-leaf/10 transition-all appearance-none"
                    >
                      <option value="">{t('cart.selectCountry')}</option>
                      {supportedCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-semibold text-charcoal mb-1.5">
                      {t('cart.district')} *
                    </label>
                    <select
                      value={shipping.district}
                      onChange={(e) => setShipping({ ...shipping, district: e.target.value })}
                      disabled={!shipping.country}
                      className="w-full px-4 py-3 bg-white border border-fog rounded-xl text-charcoal focus:outline-none focus:border-leaf focus:ring-3 focus:ring-leaf/10 transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="">{t('cart.selectDistrict')}</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-poppins font-semibold text-charcoal mb-1.5">
                    {t('cart.address')} *
                  </label>
                  <textarea
                    rows={3}
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder={t('cart.addressPlaceholder')}
                    className="w-full px-4 py-3 bg-white border border-fog rounded-xl text-charcoal placeholder:text-stone focus:outline-none focus:border-leaf focus:ring-3 focus:ring-leaf/10 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-poppins font-semibold text-charcoal mb-1.5">
                    {t('cart.deliveryNotes')}
                  </label>
                  <textarea
                    rows={2}
                    value={shipping.notes}
                    onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                    placeholder={t('cart.notesPlaceholder')}
                    className="w-full px-4 py-3 bg-white border border-fog rounded-xl text-charcoal placeholder:text-stone focus:outline-none focus:border-leaf focus:ring-3 focus:ring-leaf/10 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('cart')}
                  className="flex-1 h-11 flex items-center justify-center gap-1 text-stone hover:text-charcoal transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('cart.back')}
                </button>
                <button
                  onClick={() => setStep('payment')}
                  disabled={!isShippingValid}
                  className="flex-[2] h-11 flex items-center justify-center gap-2 bg-leaf text-white font-poppins font-semibold rounded-xl hover:bg-forest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('cart.nextPayment')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── PAYMENT STEP ─── */}
        {step === 'payment' && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: easing }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-white rounded-2xl border border-fog p-6 md:p-8">
              <h2 className="text-xl font-poppins font-bold text-charcoal mb-6">
                {t('cart.paymentMethod')}
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-leaf bg-leaf/5'
                          : 'border-fog hover:border-stone/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-leaf text-white' : 'bg-cloud text-stone'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-charcoal text-sm">
                            {method.label}
                          </p>
                          <p className="text-stone text-xs mt-0.5">{t(method.desc)}</p>
                          {isSelected && method.id === 'paypal' && (
                            <p className="text-xs text-leaf mt-2">{t('cart.paypalRedirect')}</p>
                          )}
                          {isSelected && method.id === 'bank' && (
                            <div className="mt-2 p-3 bg-cloud rounded-lg text-xs text-charcoal space-y-1">
                              <p><strong>{t('cart.bankName')}</strong> Shared after order approval</p>
                              <p><strong>{t('cart.accountName')}</strong> ShambaNi / approved business account</p>
                              <p><strong>{t('cart.accountNumber')}</strong> Provided with payment instructions</p>
                            </div>
                          )}
                          {isSelected && (method.id === 'airtel' || method.id === 'mtn') && (
                            <div className="mt-2">
                              <input
                                type="tel"
                                placeholder={t('cart.momoPhonePlaceholder')}
                                className="w-full px-3 py-2 border border-fog rounded-lg text-sm text-charcoal placeholder:text-stone focus:outline-none focus:border-leaf"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('shipping')}
                  className="flex-1 h-11 flex items-center justify-center gap-1 text-stone hover:text-charcoal transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('cart.back')}
                </button>
                <button
                  onClick={() => setStep('review')}
                  disabled={!selectedPayment}
                  className="flex-[2] h-11 flex items-center justify-center gap-2 bg-leaf text-white font-poppins font-semibold rounded-xl hover:bg-forest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('cart.nextReview')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── REVIEW STEP ─── */}
        {step === 'review' && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: easing }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl border border-fog p-6 md:p-8">
              <h2 className="text-xl font-poppins font-bold text-charcoal mb-6">
                {t('cart.reviewOrder')}
              </h2>

              {/* Delivery Summary */}
              <div className="mb-6 p-4 bg-cloud rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-poppins font-semibold text-sm text-charcoal">
                    {t('cart.deliverySummary')}
                  </h4>
                  <button onClick={() => setStep('shipping')} className="text-leaf text-xs hover:underline">
                    {t('common.edit')}
                  </button>
                </div>
                <p className="text-sm text-charcoal">{shipping.fullName}</p>
                <p className="text-sm text-stone">{shipping.phone}</p>
                <p className="text-sm text-stone">{shipping.address}</p>
                <p className="text-sm text-stone">
                  {shipping.district}, {supportedCountries.find((c) => c.code === shipping.country)?.name}
                </p>
              </div>

              {/* Payment Summary */}
              <div className="mb-6 p-4 bg-cloud rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-poppins font-semibold text-sm text-charcoal">
                    {t('cart.paymentSummary')}
                  </h4>
                  <button onClick={() => setStep('payment')} className="text-leaf text-xs hover:underline">
                    {t('common.edit')}
                  </button>
                </div>
                <p className="text-sm text-charcoal">
                  {paymentMethods.find((m) => m.id === selectedPayment)?.label}
                </p>
              </div>

              {/* Items */}
              <div className="border-t border-fog pt-4 mb-6">
                <h4 className="font-poppins font-semibold text-sm text-charcoal mb-3">
                  {t('cart.itemsTitle')}
                </h4>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-cloud"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
                        <p className="text-xs text-stone">
                          {item.quantity}x {item.price.toLocaleString()} UGX
                        </p>
                      </div>
                      <p className="font-space font-semibold text-sm text-charcoal">
                        {(item.price * item.quantity).toLocaleString()} UGX
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-fog pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone">{t('cart.subtotal')}</span>
                  <span className="text-charcoal">{totalPrice().toLocaleString()} UGX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone">{t('cart.platformFee')}</span>
                  <span className="text-charcoal">{platformFee.toLocaleString()} UGX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone">{t('cart.delivery')}</span>
                  <span className="text-charcoal">
                    {deliveryFee === 0 ? t('cart.freeDelivery') : `${deliveryFee.toLocaleString()} UGX`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-fog">
                  <span className="font-poppins font-semibold text-charcoal">{t('cart.total')}</span>
                  <span className="font-space font-bold text-xl text-forest">
                    {finalTotal.toLocaleString()} UGX
                  </span>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-leaf"
                />
                <span className="text-sm text-stone">{t('cart.terms')}</span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('payment')}
                  className="flex-1 h-11 flex items-center justify-center gap-1 text-stone hover:text-charcoal transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('cart.back')}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!termsAccepted}
                  className="flex-[2] h-11 flex items-center justify-center gap-2 bg-leaf text-white font-poppins font-semibold rounded-xl hover:bg-forest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('cart.placeOrder')}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── SUCCESS STEP ─── */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            {/* Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: easing, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-sprout/10 flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3, ease: easing }}
              >
                <CheckCircle className="w-12 h-12 text-sprout" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-2xl md:text-3xl font-poppins font-bold text-charcoal mb-2"
            >
              {t('cart.orderPlaced')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-space font-bold text-xl text-leaf mb-4"
            >
              {t('cart.orderNumber')} #{orderNumber}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-stone leading-relaxed mb-8 max-w-md mx-auto"
            >
              {t('cart.successMessage')}
            </motion.p>

            {/* What Happens Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="grid grid-cols-3 gap-4 mb-10"
            >
              {[
                { icon: Clock, label: t('cart.step1Label'), desc: t('cart.step1Desc') },
                { icon: Truck, label: t('cart.step2Label'), desc: t('cart.step2Desc') },
                { icon: CheckCircle, label: t('cart.step3Label'), desc: t('cart.step3Desc') },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-cloud flex items-center justify-center mx-auto mb-2">
                    <s.icon className="w-5 h-5 text-leaf" />
                  </div>
                  <p className="text-xs font-medium text-charcoal">{s.label}</p>
                  <p className="text-[10px] text-stone mt-0.5">{s.desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link to="/browse" className="btn-primary">
                {t('cart.continueShopping')}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
