import React from 'react';
import { X, ShoppingBag, Eye, Heart, BookOpen, Compass } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isWishlisted: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
  isWishlisted,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-charcoal/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-brand-bg rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-brand-clay/20 z-10 grid grid-cols-1 md:grid-cols-12"
      >
        {/* Close Button Top Right */}
        <button
          id="close-quick-view-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-bg/90 border border-brand-clay/20 hover:bg-brand-beige text-brand-charcoal hover:scale-105 transition-all duration-300 shadow-sm"
          aria-label="Close modal dialog"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Thumbnail Image Left/Upper */}
        <div className="md:col-span-6 relative aspect-square md:aspect-auto md:h-full bg-brand-beige/25 border-b md:border-b-0 md:border-r border-brand-clay/10 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {product.bestSeller && (
            <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[8px] font-sans font-semibold tracking-widest uppercase bg-brand-terracotta text-brand-bg rounded-md">
              Heritage Best Seller
            </span>
          )}
        </div>

        {/* Information Panel Right */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-center">
          
          <div className="flex items-center gap-1.5 text-brand-olive text-xs font-semibold tracking-widest uppercase mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>{product.category} studio</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-brand-charcoal tracking-tight leading-snug">
            {product.name}
          </h3>
          
          <p className="font-serif text-sm italic text-brand-terracotta mt-1 mb-4">
            {product.banglaName}
          </p>

          <div className="text-sm font-serif font-bold text-brand-charcoal mb-4 bg-brand-beige/35 py-1.5 px-3 rounded-md inline-block w-fit">
            Price: ৳{product.price}
          </div>

          {/* Description */}
          <div className="text-xs text-brand-charcoal/70 leading-relaxed mb-5 text-justify-custom font-sans">
            {product.description}
          </div>

          {/* Key materials bullet point preview */}
          <div className="mb-6 space-y-2 border-t border-brand-clay/15 pt-4">
            <span className="block text-[10px] font-semibold tracking-wider text-brand-olive uppercase">Materials & Origin:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.materials.slice(0, 2).map((mat, idx) => (
                <span key={idx} className="bg-brand-beige/50 border border-brand-clay/15 text-[10px] text-brand-charcoal/80 px-2.5 py-1 rounded-md">
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-2">
            <button
              id={`quick-add-to-cart-${product.id}`}
              disabled={product.stock === 0}
              onClick={() => {
                if (product.stock === 0) return;
                onAddToCart(product);
                onClose();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                product.stock === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-200' 
                  : 'bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {product.stock === 0 ? 'Stock Out' : 'Add to Bag'}
            </button>

            <button
              id={`quick-wishlist-${product.id}`}
              onClick={() => onToggleWishlist(product)}
              className={`p-3.5 border rounded-xl hover:scale-105 transition-all duration-300 ${
                isWishlisted ? 'text-brand-terracotta border-brand-terracotta bg-brand-beige/20' : 'border-brand-clay/35 text-brand-charcoal/70 hover:text-brand-terracotta'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button
            id={`quick-visit-detail-${product.id}`}
            onClick={() => {
              onViewDetails(product);
              onClose();
            }}
            className="mt-4 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-brand-olive hover:text-brand-terracotta transition-colors py-1.5 border-t border-brand-clay/10 pt-3"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Review Full Heritage Journal Entries
          </button>

        </div>
      </motion.div>
    </div>
  );
};
