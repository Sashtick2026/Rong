import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Copy, Check, Upload } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { firestore } from '../lib/mockFirebase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentUser: any;
  onRequestLogin: () => void;
  onPaymentSuccess?: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  onRequestLogin,
  onPaymentSuccess,
}) => {
  const [checkoutStep, setCheckoutStep] = React.useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discountPercent: number; description?: string } | null>(null);
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = React.useState('');

  const [shippingForm, setShippingForm] = React.useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [orderId, setOrderId] = React.useState('');

  const [paymentForm, setPaymentForm] = React.useState({
    senderNumber: '',
    transactionId: '',
    amount: '',
    screenshotUrl: '',
  });
  const [paymentSetting, setPaymentSetting] = React.useState<any>(null);
  const [submittingPayment, setSubmittingPayment] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState('');
  const [copiesSuccessfully, setCopiesSuccessfully] = React.useState(false);

  const validCartItems = React.useMemo(() => cartItems.filter(item => item && item.product), [cartItems]);

  const settings = firestore.getSettings();
  const liveShippingCost = settings.shippingCost ?? 25;
  const liveFreeShippingThreshold = settings.freeShippingThreshold ?? 500;

  const subtotal = validCartItems.reduce((acc, item) => {
    const discountedPrice = item.product.offerPercentage && item.product.offerPercentage > 0
      ? Math.round(item.product.price * (1 - item.product.offerPercentage / 100))
      : item.product.price;
    return acc + discountedPrice * item.quantity;
  }, 0);

  const shippingFee = subtotal >= liveFreeShippingThreshold ? 0 : liveShippingCost;
  const simulatedTax = Math.round(subtotal * 0.05); // 5% VAT
  
  const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const total = Math.max(0, subtotal + shippingFee + simulatedTax - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccessMsg('');
    if (!couponCode.trim()) {
      setCouponError('Please enter a valid code format.');
      return;
    }
    const cleanCode = couponCode.trim().toUpperCase();
    const activeCoupons = firestore.getCoupons();
    const found = activeCoupons.find(c => c.code === cleanCode);
    
    if (!found) {
      setCouponError('Invalid or unregistered coupon code key.');
      setAppliedCoupon(null);
    } else if (!found.active) {
      setCouponError('This coupon key has expired or been disabled.');
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(found);
      setCouponSuccessMsg(`Successfully verified: ${found.discountPercent}% discount has been applied.`);
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      setShippingForm({
        fullName: currentUser.name || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        phone: currentUser.phone || '',
        notes: '',
      });
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingForm({
      ...shippingForm,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!shippingForm.fullName) newErrors.fullName = 'Full Name is required';
    if (!shippingForm.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingForm.email)) newErrors.email = 'Valid email is required';
    if (!shippingForm.address) newErrors.address = 'Full address is required';
    if (!shippingForm.phone) newErrors.phone = 'Phone contact is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const pmSet = firestore.getPaymentSettings();
      setPaymentSetting(pmSet);
      setPaymentForm(prev => ({
        ...prev,
        amount: String(total)
      }));
    } catch (err) {
      console.error('Failed to load bKash settings:', err);
    }

    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (!paymentForm.senderNumber.trim()) {
      setPaymentError('Sender bKash mobile number is required.');
      return;
    }
    if (!paymentForm.transactionId.trim()) {
      setPaymentError('bKash Transaction ID (TxnID) is required.');
      return;
    }
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      setPaymentError('A valid payment amount is required.');
      return;
    }

    setSubmittingPayment(true);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `RNG-2026-${randomNum}`;

    try {
      // 1. Create actual order in simulated Firestore first
      await firestore.createOrder({
        id: newId,
        customerId: currentUser ? currentUser.uid : 'anonymous',
        customerName: shippingForm.fullName,
        customerEmail: shippingForm.email,
        products: validCartItems.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        totalAmount: total,
        status: 'verification_pending',
        shippingAddress: shippingForm.address,
        bkashNumber: paymentForm.senderNumber.trim(),
        bkashTransactionId: paymentForm.transactionId.trim().toUpperCase()
      });

      // 2. Submit Payment verification record (which updates the newly created order)
      await firestore.submitPaymentVerification({
        orderId: newId,
        transactionId: paymentForm.transactionId.trim().toUpperCase(),
        senderNumber: paymentForm.senderNumber.trim(),
        amount: parseFloat(paymentForm.amount),
        screenshotUrl: paymentForm.screenshotUrl || ''
      });

      setOrderId(newId);
      onClearCart();
      if (onPaymentSuccess) {
        onClose();
        setCheckoutStep('cart');
        onPaymentSuccess(newId);
      } else {
        setCheckoutStep('success');
      }
    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'Verification submission error. Check Transaction ID duplicates.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleReset = () => {
    onClearCart();
    setCheckoutStep('cart');
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    setCouponSuccessMsg('');
    setShippingForm({
      fullName: '',
      email: '',
      address: '',
      phone: '',
      notes: '',
    });
    setPaymentForm({
      senderNumber: '',
      transactionId: '',
      amount: '',
      screenshotUrl: '',
    });
    setPaymentError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (checkoutStep !== 'success') onClose();
        }}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-screen max-w-md bg-brand-bg md:border-l border-brand-clay/20 flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-clay/10 flex items-center justify-between bg-brand-beige/20">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-brand-olive font-semibold">Your Selection</span>
              <h2 className="font-serif text-xl font-semibold text-brand-charcoal">
                {checkoutStep === 'cart' && 'Heritage Bag'}
                {checkoutStep === 'shipping' && 'Curator Delivery Details'}
                {checkoutStep === 'success' && 'Order Authenticated'}
              </h2>
            </div>
            {checkoutStep !== 'success' && (
              <button
                id="close-cart-drawer"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-brand-beige/50 text-brand-charcoal/70 hover:text-brand-charcoal transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Core Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* STEP 1: Main Cart View */}
            {checkoutStep === 'cart' && (
              <>
                {validCartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full border border-brand-clay/30 bg-brand-beige/30 flex items-center justify-center text-brand-clay mb-4">
                      <X className="w-8 h-8 stroke-[1]" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-brand-charcoal mb-1">Your bag is breathing empty</h3>
                    <p className="text-xs text-brand-charcoal/60 max-w-xs leading-relaxed mb-6">
                      Explore our handcrafted digital journal collections and secure a piece of Bengal’s heritage.
                    </p>
                    <button
                      id="view-shop-fallback"
                      onClick={() => {
                        onClose();
                      }}
                      className="bg-brand-charcoal hover:bg-brand-terracotta text-brand-bg px-6 py-2.5 rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                    >
                      Browse Studio
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {validCartItems.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="flex gap-4 pb-4 border-b border-brand-clay/10"
                        id={`cart-item-${item.product.id}`}
                      >
                        <div className="w-20 h-24 flex-shrink-0 relative overflow-hidden bg-brand-beige/40 rounded-lg border border-brand-clay/10">
                          <img
                            src={item.product.image || null}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <h4 className="font-serif text-base font-medium text-brand-charcoal line-clamp-1 leading-snug">
                              {item.product.name}
                            </h4>
                            <button
                              id={`remove-cart-item-${item.product.id}`}
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-brand-clay hover:text-brand-terracotta p-1 transition-colors duration-300"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-[10px] text-brand-olive italic mt-0.5 mb-2">{item.product.banglaName}</span>
                          
                          <div className="flex items-center justify-between mt-auto">
                            {/* Counter */}
                            <div className="flex items-center gap-1.5 border border-brand-clay/20 bg-brand-bg rounded-md p-1 scale-90 origin-left">
                              <button
                                id={`dec-qty-${item.product.id}`}
                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                className="p-0.5 hover:bg-brand-beige rounded text-brand-charcoal transition-colors duration-300"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-semibold text-brand-charcoal">
                                {item.quantity}
                              </span>
                              <button
                                id={`inc-qty-${item.product.id}`}
                                onClick={() => onUpdateQuantity(item.product.id, 1)}
                                className="p-0.5 hover:bg-brand-beige rounded text-brand-charcoal transition-colors duration-300"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <span className="font-serif text-sm font-semibold text-brand-charcoal">
                              ৳{item.product.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: Shipping Form */}
            {checkoutStep === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="bg-brand-beige/30 p-4 rounded-xl border border-brand-clay/10 mb-4 text-center">
                  <p className="text-[11px] text-brand-olive leading-relaxed">
                    Our luxury handcrafted products are shipped internationally inside moisture-sealed custom wood-grain cases. Complimentary shipping applies to orders over ৳{liveFreeShippingThreshold}.
                  </p>
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Your Name (Full Name) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingForm.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-terracotta transition-colors"
                    placeholder="Aditi Sen"
                  />
                  {errors.fullName && <p className="text-red-600 text-[10px] mt-0.5">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingForm.email}
                    onChange={handleInputChange}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-terracotta transition-colors"
                    placeholder="aditi@heritage.com"
                  />
                  {errors.email && <p className="text-red-600 text-[10px] mt-0.5">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingForm.address}
                    onChange={handleInputChange}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-terracotta transition-colors"
                    placeholder="Studio House 12, Road 44, Gulshan-2, Dhaka"
                  />
                  {errors.address && <p className="text-red-600 text-[10px] mt-0.5">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Phone Contact (Mobile) *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={handleInputChange}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-terracotta transition-colors"
                    placeholder="+880 1712 123456"
                  />
                  {errors.phone && <p className="text-red-600 text-[10px] mt-0.5">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Personal Curator Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={shippingForm.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-terracotta transition-colors resize-none"
                    placeholder="E.g., Please include a hand-painted gift note with Bengali Alpana motifs."
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="flex-1 border border-brand-clay/30 hover:bg-brand-beige/30 text-brand-charcoal py-3 rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    id="submit-shipping-btn"
                    className="flex-1 bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg py-3 rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2.5: bKash Manual Payment Portal */}
            {checkoutStep === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="bg-brand-beige/40 p-4 rounded-xl border border-brand-clay/15">
                  <div className="flex items-center gap-3 border-b border-brand-clay/15 pb-2 mb-3">
                    <div className="bg-brand-terracotta text-brand-bg rounded px-2.5 py-1 text-[10px] tracking-wider font-extrabold uppercase shrink-0 font-mono">
                      bKash manual
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Traditional Payment</h4>
                      <p className="text-[10px] text-brand-clay">{paymentSetting?.bkashAccountType || 'Personal Account'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] text-brand-olive/80 uppercase font-bold tracking-widest block">bKash Account Number:</span>
                      <div className="flex items-center justify-between bg-brand-bg border border-brand-clay/20 rounded-lg px-3 py-2 mt-1">
                        <span className="font-mono text-sm font-bold text-brand-charcoal tracking-widest">
                          {paymentSetting?.bkashNumber || '01712-345678'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(paymentSetting?.bkashNumber || '01712-345678');
                            setCopiesSuccessfully(true);
                            setTimeout(() => setCopiesSuccessfully(false), 2000);
                          }}
                          className="text-brand-clay hover:text-brand-terracotta transition-colors p-1"
                        >
                          {copiesSuccessfully ? <Check className="w-3.5 h-3.5 text-brand-olive" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-brand-bg rounded-lg border border-brand-clay/15 p-3 text-[11px] text-brand-charcoal/80 leading-relaxed text-justify-custom font-sans">
                      <p className="font-medium text-brand-charcoal mb-0.5">Instructions:</p>
                      <p>{paymentSetting?.paymentInstructions || 'Please make a manual/Send Money bKash transfer of the total order sum. Once completed, specify the sender mobile number, total amount paid, and copy-paste the bKash Transaction ID (TxnID) returned in the SMS/App to initiate verification.'}</p>
                    </div>

                    <div className="bg-brand-terracotta/5 border border-brand-terracotta/20 rounded-lg p-2.5 text-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-clay">Total Payable Sum</span>
                      <p className="font-serif text-2xl font-black text-brand-terracotta mt-1">৳{total}</p>
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="bg-red-50 text-red-600 border border-red-200/50 rounded-xl p-3 text-xs leading-relaxed">
                    <strong>Error:</strong> {paymentError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-0.5">
                      Sender bKash Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={paymentForm.senderNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, senderNumber: e.target.value })}
                      className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-terracotta transition-colors"
                      placeholder="e.g. 01712345678"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-0.5">
                      bKash Transaction ID (TxnID) *
                    </label>
                    <input
                      type="text"
                      value={paymentForm.transactionId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value.toUpperCase() })}
                      className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-brand-terracotta transition-colors"
                      placeholder="e.g. A2B9X8Y7Z6 (exactly as returned in SMS)"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-0.5">
                      Confirmed Amount Paid (৳) *
                    </label>
                    <input
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-terracotta transition-colors"
                      placeholder="e.g. 1500"
                    />
                  </div>

                  {/* Attachment input selector with Drag & Drop or manual pick */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-0.5">
                      Upload bKash Receipt Screenshot (Optional but helpful)
                    </label>
                    <div 
                      className="border border-dashed border-brand-clay/40 hover:border-brand-terracotta transition-colors rounded-xl p-4 bg-brand-bg relative flex flex-col items-center justify-center cursor-pointer group"
                    >
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setPaymentForm({ ...paymentForm, screenshotUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {paymentForm.screenshotUrl ? (
                        <div className="w-full flex flex-col items-center gap-2 relative z-20">
                          <img 
                            src={paymentForm.screenshotUrl} 
                            alt="Receipt preview" 
                            className="h-28 w-auto rounded object-contain border border-brand-clay/10 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPaymentForm({ ...paymentForm, screenshotUrl: '' });
                            }}
                            className="text-[10px] text-brand-terracotta uppercase font-bold tracking-wider hover:underline"
                          >
                            Remove Attachment
                          </button>
                        </div>
                      ) : (
                        <div className="text-center space-y-1 pointer-events-none">
                          <Upload className="w-5 h-5 mx-auto text-brand-clay group-hover:text-brand-terracotta transition-colors" />
                          <p className="text-[11px] text-brand-charcoal/80">
                            Drag & drop or <span className="text-brand-terracotta font-medium hover:underline">browse</span> files
                          </p>
                          <p className="text-[9px] text-brand-clay font-mono">PNG, WEBP, or JPEG</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('shipping')}
                    className="flex-1 border border-brand-clay/30 hover:bg-brand-beige/30 text-brand-charcoal py-3 rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submittingPayment}
                    className="flex-1 bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg py-3 rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-1"
                  >
                    {submittingPayment ? (
                      <span className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Submit Payment Detail'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Checkout Success invoice */}
            {checkoutStep === 'success' && (
              <div className="space-y-6 text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-olive/10 text-brand-olive mb-2">
                  <CheckCircle2 className="w-10 h-10 stroke-[1.25]" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-sans font-semibold tracking-widest uppercase text-brand-olive">Digital Heritage Document</span>
                  <h3 className="font-serif text-2xl font-semibold text-brand-charcoal">Traditional Invoice</h3>
                  <p className="text-[11px] text-brand-clay font-mono">Invoice Reference: {orderId}</p>
                </div>

                <p className="text-xs text-brand-charcoal/70 leading-relaxed text-justify-custom bg-brand-beige/25 p-4 rounded-xl border border-brand-clay/10">
                  {paymentSetting?.verificationMessage || "We have received your payment information. Our team is verifying your payment. You will receive an immediate in-app notice and an invoice email once verified."}
                </p>

                {/* Simulated Invoice Card */}
                <div className="border border-brand-clay/30 rounded-xl bg-brand-beige/10 p-5 text-left font-sans space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-terracotta/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="border-b border-brand-clay/15 pb-2">
                    <span className="text-[9px] text-brand-olive/80 uppercase tracking-widest font-bold">Delivery Destination</span>
                    <p className="text-xs text-brand-charcoal mt-1 font-medium">{shippingForm.address}</p>
                    <p className="text-xs text-brand-charcoal/70 mt-0.5">Phone: {shippingForm.phone}</p>
                  </div>

                  <div>
                    <span className="text-[9px] text-[#555555]/80 uppercase tracking-widest font-bold block mb-2">Purchased Curations</span>
                    <div className="space-y-2">
                      {validCartItems.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-xs text-brand-charcoal">
                          <span>{item.product.name} <span className="text-brand-clay/80 font-semibold flex-shrink-0">x{item.quantity}</span></span>
                          <span className="font-serif shrink-0">৳{item.product.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-brand-clay/15 pt-3 space-y-1.5 text-xs text-brand-charcoal/80">
                    <div className="flex justify-between">
                      <span>Curation Subtotal:</span>
                      <span className="font-serif">৳{subtotal}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-brand-olive font-medium">
                        <span>Heritage Discount ({appliedCoupon.code} -{appliedCoupon.discountPercent}%):</span>
                        <span className="font-serif">-৳{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Heritage Air Freight:</span>
                      <span className="font-serif">{shippingFee === 0 ? 'Complimentary' : `৳${shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Traditional VAT (5%):</span>
                      <span className="font-serif">৳{simulatedTax}</span>
                    </div>
                    <div className="flex justify-between border-t border-brand-clay/20 pt-2 text-sm font-semibold text-brand-charcoal">
                      <span>Final Authenticated Total:</span>
                      <span className="font-serif text-brand-terracotta">৳{total}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full bg-brand-charcoal hover:bg-brand-olive text-brand-bg py-3.5 rounded-xl text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                >
                  Conclude Experience
                </button>
              </div>
            )}

          </div>

          {/* Footer Receipt Summary (Only shows during Step 1) */}
          {checkoutStep === 'cart' && validCartItems.length > 0 && (
            <div className="p-6 border-t border-brand-clay/15 bg-brand-beige/25">
              
              {/* Dynamic Coupon Input Code Field */}
              <div className="border-b border-brand-clay/10 pb-4 mb-4">
                <span className="block text-[9px] font-bold tracking-widest text-[#B8A189] uppercase mb-1.5">Redeem Collector Promo</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. HERITAGE15"
                    className="flex-1 bg-white border border-brand-clay/35 rounded-lg px-2.5 py-1.5 text-[11px] uppercase tracking-wider font-mono text-brand-charcoal focus:outline-none focus:border-brand-terracotta"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-brand-charcoal hover:bg-brand-olive text-[#ECE7E1] px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[10px] text-brand-terracotta mt-1.5 ml-0.5">{couponError}</p>
                )}
                {couponSuccessMsg && (
                  <p className="text-[10px] text-brand-olive mt-1.5 ml-0.5">{couponSuccessMsg}</p>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs text-brand-charcoal/80">
                  <span>Subtotal:</span>
                  <span className="font-serif font-semibold">৳{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-xs text-brand-olive font-medium">
                    <span>Discount Applied ({appliedCoupon.code}):</span>
                    <span className="font-serif">-৳{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-brand-charcoal/80">
                  <span>Traditional VAT (5%):</span>
                  <span className="font-serif">৳{simulatedTax}</span>
                </div>
                <div className="flex justify-between text-xs text-brand-charcoal/80">
                  <span>Shipping (Crate Air Cargo):</span>
                  <span className="font-serif italic">{shippingFee === 0 ? 'Complimentary' : `৳${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-brand-charcoal border-t border-brand-clay/10 pt-2">
                  <span>Estimated Total:</span>
                  <span className="font-serif text-brand-terracotta text-base">৳{total}</span>
                </div>
              </div>

              <div className="space-y-3">
                {currentUser ? (
                  <button
                    id="checkout-next-step"
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg py-4 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="space-y-2 border border-brand-terracotta/20 bg-brand-terracotta/5 p-3 rounded-xl">
                    <p className="text-[10px] text-center text-brand-terracotta font-medium tracking-wide">
                      🔒 Account authentication required to initiate curation checkouts.
                    </p>
                    <button
                      id="checkout-login-trigger"
                      onClick={onRequestLogin}
                      className="w-full flex items-center justify-center gap-2 bg-brand-olive hover:bg-brand-charcoal text-brand-bg py-3 px-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300"
                    >
                      Authenticate to Checkout
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <button
                  onClick={onClearCart}
                  className="w-full text-center text-[10px] uppercase tracking-wider text-brand-clay hover:text-brand-terracotta transition-colors duration-300 py-1"
                >
                  Clear all curations
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[9px] text-brand-olive/80 mt-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Verified Sustainable Bengal Heritage Handcraft</span>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};
