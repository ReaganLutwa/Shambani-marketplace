import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, ShoppingCart, Check, ChevronRight, Truck, User, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { useCartStore } from '@/store';
import StarRating from '@/components/StarRating';
import QuantitySelector from '@/components/QuantitySelector';
import ProductCard from '@/components/ProductCard';

const easing = [0.4, 0, 0.2, 1] as [number, number, number, number];

const productReviews = [
  { name: 'Atwine Sarah', initial: 'A', date: '2 weeks ago', rating: 5, text: 'The quality is always exceptional. Well-packaged and always fresh. The farmer is very reliable!' },
  { name: 'Mukasa David', initial: 'M', date: '1 month ago', rating: 5, text: 'Best produce I have found on ShambaNi. Consistently great quality and delivery is always on time.' },
  { name: 'Nakato Grace', initial: 'N', date: '2 months ago', rating: 4, text: 'Very good quality overall. Sometimes slightly different from the photo but always fresh and tasty.' },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'farmer' | 'reviews'>('details');
  const [mainImage, setMainImage] = useState(0);

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  // Generate gallery images based on product (use same image + category images)
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const base = [product.image];
    // Add related images from same category
    const related = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3)
      .map((p) => p.image);
    return [...base, ...related].slice(0, 4);
  }, [product]);

  // Related products (same category)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  // Breadcrumb category
  const categoryLabel = useMemo(() => {
    if (!product) return '';
    const cat = categories.find((c) => c.id === product.category);
    return cat ? t(cat.nameKey) : product.category;
  }, [product, t]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      farmer: product.farmer,
      unit: product.unit,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  if (!product) {
    return (
      <div className="min-h-[60dvh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-poppins font-bold text-charcoal mb-3">
          {t('common.error')}
        </h1>
        <p className="text-stone mb-6">{t('browse.productNotFound')}</p>
        <Link to="/browse" className="btn-primary">
          {t('browse.backToBrowse')}
        </Link>
      </div>
    );
  }

  const stockColor =
    product.stock === 0
      ? 'text-error'
      : product.stock < 50
        ? 'text-warning'
        : 'text-sprout';

  const platformFee = Math.round(product.price * 0.025);

  const tabs = [
    { key: 'details' as const, label: t('product.tabDetails') },
    { key: 'farmer' as const, label: t('product.tabFarmer') },
    { key: 'reviews' as const, label: t('product.tabReviews') },
  ];

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Breadcrumb + Product Hero */}
      <section className="pt-6 pb-8 md:pb-12">
        <div className="container-main">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm text-stone mb-6"
          >
            <Link to="/" className="hover:text-forest transition-colors">
              {t('nav.home')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/browse" className="hover:text-forest transition-colors">
              {t('nav.browse')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/browse?category=${product.category}`} className="hover:text-forest transition-colors">
              {categoryLabel}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-charcoal font-medium truncate max-w-[200px]">{product.name}</span>
          </motion.nav>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: easing }}
            >
              <div className="relative rounded-2xl overflow-hidden bg-white border border-fog">
                <img
                  src={galleryImages[mainImage] || product.image}
                  alt={product.name}
                  className="w-full aspect-[4/3] object-cover"
                />
                {/* Badges */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-mint text-forest text-sm font-medium rounded-full">
                  {categoryLabel}
                </span>
                <span
                  className={`absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium rounded-full ${stockColor}`}
                >
                  {product.stock === 0
                    ? t('product.outOfStock')
                    : product.stock < 50
                      ? t('product.lowStock')
                      : t('product.inStock')}
                </span>
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        mainImage === i ? 'border-leaf' : 'border-transparent hover:border-fog'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right: Product Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: easing }}
                className="mb-3"
              >
                <span className="inline-block px-3 py-1 bg-mint/30 text-forest text-xs font-medium rounded-full mb-3">
                  {categoryLabel}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: easing }}
                className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4"
              >
                {product.name}
              </motion.h1>

              {/* Farmer Mini Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: easing }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-10 h-10 rounded-full bg-leaf/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-leaf" />
                </div>
                <div>
                  <p className="font-poppins font-semibold text-charcoal text-sm">{product.farmer}</p>
                  <p className="text-stone text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {product.district}, {product.country}
                  </p>
                </div>
              </motion.div>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: easing }}
                className="mb-4"
              >
                <StarRating rating={product.rating} reviews={product.reviews} size="md" />
              </motion.div>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: easing }}
                className="mb-4"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-space font-bold text-3xl text-forest">
                    {product.price.toLocaleString()} UGX
                  </span>
                  <span className="text-stone text-base">
                    / {t(product.unitKey)}
                  </span>
                </div>
                <p className="text-xs text-stone mt-1">
                  + {t('product.platformFee')} ({platformFee.toLocaleString()} UGX)
                </p>
              </motion.div>

              {/* Stock */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: easing }}
                className="mb-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-medium ${stockColor}`}>
                    {product.stock} {t(product.unitKey)} {t('product.available')}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-fog rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      product.stock < 50 ? 'bg-warning' : 'bg-sprout'
                    }`}
                    style={{ width: `${Math.min((product.stock / 1000) * 100, 100)}%` }}
                  />
                </div>
              </motion.div>

              {/* Quantity Selector + Add to Cart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: easing }}
                className="space-y-3"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-charcoal">{t('product.quantity')}:</span>
                  <QuantitySelector
                    quantity={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={Math.min(product.stock, 50)}
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full h-[52px] flex items-center justify-center gap-2 bg-leaf text-white font-poppins font-semibold rounded-xl hover:bg-forest hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(46,125,50,0.3)]"
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        {t('product.added')}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {t('product.addToCart')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Delivery Info */}
                <div className="flex items-start gap-2 text-sm text-stone pt-2">
                  <Truck className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{t('product.deliveryInfo')}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="bg-white border-t border-fog">
        <div className="container-main py-10 md:py-14">
          {/* Tab Buttons */}
          <div className="flex gap-1 mb-8 border-b border-fog overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium font-poppins whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? 'text-forest border-forest'
                    : 'text-stone border-transparent hover:text-charcoal hover:border-fog'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-poppins font-semibold text-charcoal mb-4">
                  {t('product.aboutTitle')}
                </h3>
                <p className="text-charcoal leading-relaxed mb-8 max-w-3xl">
                  {product.description}
                </p>

                <h4 className="text-base font-poppins font-semibold text-charcoal mb-4">
                  {t('product.specifications')}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
                  {[
                    { label: t('product.specCategory'), value: categoryLabel },
                    { label: t('product.specOrigin'), value: `${product.district}, ${product.country}` },
                    { label: t('product.specUnit'), value: `${t(product.unitKey)}` },
                    { label: t('product.specFreshness'), value: t('product.freshnessValue') },
                    { label: t('product.specMinOrder'), value: '1' },
                    { label: t('product.specDelivery'), value: t('product.deliveryValue') },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="bg-cloud rounded-xl p-4"
                    >
                      <p className="text-xs text-stone mb-1">{item.label}</p>
                      <p className="font-poppins font-medium text-charcoal text-sm">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Farmer Tab */}
            {activeTab === 'farmer' && (
              <motion.div
                key="farmer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl"
              >
                <div className="bg-cloud rounded-2xl p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-8">
                    {/* Left: Avatar & Name */}
                    <div className="text-center md:text-left">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-leaf/10 flex items-center justify-center mx-auto md:mx-0 mb-4">
                        <User className="w-12 h-12 text-leaf" />
                      </div>
                      <h3 className="text-lg font-poppins font-bold text-charcoal mb-1">
                        {product.farmer}
                      </h3>
                      <p className="text-xs text-stone mb-2">{t('product.memberSince')}</p>
                      <div className="flex items-center gap-1 justify-center md:justify-start text-sprout">
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{t('product.verifiedFarmer')}</span>
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div>
                      <h4 className="text-base font-poppins font-semibold text-charcoal mb-3">
                        {t('product.aboutFarmer')}
                      </h4>
                      <p className="text-charcoal leading-relaxed mb-6 text-sm">
                        {t('product.farmerBio')}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                          { value: '47', label: t('product.productsSold') },
                          { value: String(product.rating), label: t('product.avgRating') },
                          { value: String(product.reviews), label: t('product.reviewsLabel') },
                        ].map((stat) => (
                          <div key={stat.label} className="text-center md:text-left">
                            <p className="font-space font-bold text-2xl text-forest">{stat.value}</p>
                            <p className="text-xs text-stone">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Contact */}
                      <div className="flex flex-wrap gap-4 text-sm text-stone">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4" />
                          <span>+256 7XX XXX XXX</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{product.district}, {product.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl"
              >
                {/* Rating Summary */}
                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-fog">
                  <div>
                    <p className="font-space font-bold text-5xl text-charcoal">{product.rating}</p>
                    <StarRating rating={product.rating} reviews={product.reviews} size="md" />
                  </div>
                  <div className="flex-1 max-w-xs space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = star === 5 ? 18 : star === 4 ? 3 : star === 3 ? 2 : 0;
                      const pct = product.reviews > 0 ? (count / product.reviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="text-stone w-3">{star}</span>
                          <Star className="w-3 h-3 fill-sun text-sun" />
                          <div className="flex-1 h-1.5 bg-fog rounded-full overflow-hidden">
                            <div className="h-full bg-sun rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-stone w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {productReviews.map((review, i) => (
                    <motion.div
                      key={review.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="pb-6 border-b border-fog last:border-0"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-leaf/10 flex items-center justify-center text-forest font-poppins font-semibold text-sm">
                          {review.initial}
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-charcoal text-sm">{review.name}</p>
                          <p className="text-xs text-stone">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`w-3.5 h-3.5 ${
                              j < review.rating ? 'fill-sun text-sun' : 'text-fog fill-fog'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-charcoal text-sm leading-relaxed">{review.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-cream border-t border-fog py-12 md:py-16">
          <div className="container-main">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-poppins font-bold text-charcoal mb-8"
            >
              {t('product.relatedTitle')}
            </motion.h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {relatedProducts.map((rp, i) => (
                <ProductCard key={rp.id} product={rp} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
