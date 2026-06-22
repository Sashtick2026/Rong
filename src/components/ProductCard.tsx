import React from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';
import { AnimatedHeart } from './AnimatedHeart';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col font-sans"
      id={`product-card-${product.id}`}
    >
      {/* Visual Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-brand-beige/30 border border-brand-clay/10 rounded-xl mb-4 group-hover:border-brand-clay/30 transition-colors duration-500">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.stock === 0 && (
            <span className="px-2.5 py-1 text-[8px] sm:text-[9px] font-sans font-bold tracking-widest uppercase bg-brand-terracotta text-brand-bg rounded-full shadow-sm">
              Stock Out
            </span>
          )}
          {product.bestSeller && (
            <span className="px-2.5 py-1 text-[8px] sm:text-[9px] font-sans font-semibold tracking-widest uppercase bg-[#B49275] text-brand-bg rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {product.newArrival && (
            <span className="px-2.5 py-1 text-[8px] sm:text-[9px] font-sans font-semibold tracking-widest uppercase bg-brand-olive text-brand-bg rounded-full shadow-sm">
              New Arrival
            </span>
          )}
        </div>

        {/* Favorite Icon Toggle */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full border bg-brand-bg/90 border-brand-clay/20 hover:scale-110 transition-all duration-300 ${
            isWishlisted ? 'text-brand-terracotta border-brand-terracotta/40' : 'text-brand-charcoal/60 hover:text-brand-terracotta'
          }`}
          aria-label="Add to favorites"
        >
          <AnimatedHeart isWishlisted={isWishlisted} className="w-4 h-4" />
        </button>

        {/* Product image with slow hover zoom & subtle pan */}
        <img
          src={product.image || null}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out scale-102 group-hover:scale-108"
        />

        {/* Tactile overlay on hover */}
        <div className="absolute inset-0 bg-brand-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 gap-2">
          
          <div className="flex gap-2 w-full animate-fade-in">
            {/* Quick view button */}
            <button
              id={`quick-view-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-brand-bg hover:bg-brand-beige border border-brand-clay/20 py-2.5 px-3 rounded-lg text-[10px] font-medium tracking-widest uppercase text-brand-charcoal transition-all duration-300"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
            
            {/* Direct addToCart */}
            <button
              id={`direct-add-${product.id}`}
              disabled={product.stock === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (product.stock === 0) return;
                onAddToCart(product);
              }}
              className={`p-2.5 rounded-lg transition-colors duration-300 ${
                product.stock === 0 
                  ? 'bg-gray-400/80 cursor-not-allowed text-gray-200' 
                  : 'bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg'
              }`}
              aria-label={product.stock === 0 ? "Artifact currently out of stock" : "Add item to checkout shopping cart"}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive view details button */}
          <button
            id={`open-detail-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="w-full bg-brand-charcoal/90 hover:bg-brand-charcoal text-brand-bg py-2 rounded-md text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-center transition-colors duration-300"
          >
            Read Heritage Journal
          </button>

        </div>
      </div>

      {/* Text descriptions */}
      <div className="flex flex-col flex-grow items-center text-center px-1">
        <span className="text-[10px] font-sans font-semibold tracking-widest uppercase text-brand-olive mb-1 block">
          {product.category === 'sarees' ? 'Hand-Painted Saree' : product.category}
        </span>
        
        <h3 
          onClick={() => onViewDetails(product)}
          className="font-serif text-base sm:text-lg font-medium text-brand-charcoal group-hover:text-brand-terracotta cursor-pointer transition-colors duration-300 tracking-tight leading-snug line-clamp-1"
        >
          {product.name}
        </h3>
        
        <p className="font-serif text-xs italic text-brand-clay font-normal mt-0.5 mb-2.5">
          {product.banglaName}
        </p>
        
        <div className="flex items-center gap-3 mt-auto">
          {/* Accent divider dot */}
          <span className="h-[1px] w-4 bg-brand-clay" />
          <span className="font-serif text-sm font-semibold text-brand-charcoal">
            ৳{product.price}
          </span>
          <span className="h-[1px] w-4 bg-brand-clay" />
        </div>
      </div>
    </motion.div>
  );
};
