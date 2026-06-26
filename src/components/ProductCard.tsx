import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/data/products';
import { useCartStore } from '@/store';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      farmer: product.farmer,
      unit: product.unit,
    });
  };

  const stockColor =
    product.stock === 0
      ? 'text-error'
      : product.stock < 50
        ? 'text-warning'
        : 'text-sprout';

  const stockLabel =
    product.stock === 0
      ? t('product.outOfStock')
      : product.stock < 50
        ? `${product.stock} ${t('product.lowStock')}`
        : `${t('product.inStock')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-white rounded-2xl border border-fog overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />
          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 bg-mint text-forest text-xs font-medium rounded-full">
            {t(product.categoryKey)}
          </span>
          {/* Stock Badge */}
          <span
            className={`absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full ${stockColor}`}
          >
            {stockLabel}
          </span>
          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-end gap-2">
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-leaf hover:text-white transition-colors"
              title={t('product.addToCart')}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-poppins font-semibold text-charcoal text-base mb-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Farmer row with photo and verified badge */}
          <div className="flex items-center gap-2 mb-2">
            {product.farmerPhoto ? (
              <img
                src={product.farmerPhoto}
                alt={product.farmer}
                className="w-6 h-6 rounded-full object-cover border border-fog"
                loading="lazy"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-fog flex items-center justify-center">
                <span className="text-[10px] font-bold text-stone">
                  {product.farmer.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-sm text-stone truncate">{product.farmer}</span>
              {product.farmerVerified && (
                <BadgeCheck className="w-4 h-4 text-leaf shrink-0" title="Verified Farmer" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-stone text-sm mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{product.district}</span>
          </div>

          <StarRating rating={product.rating} reviews={product.reviews} size="sm" />

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-space font-bold text-lg text-forest">
                {product.price.toLocaleString()}
              </span>
              <span className="text-stone text-xs">
                UGX/{t(product.unitKey)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button - Full width below */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-3 w-full py-2.5 bg-leaf text-white font-poppins font-semibold text-sm rounded-xl hover:bg-forest hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {t('product.addToCart')}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
