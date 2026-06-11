import React, { useState, useEffect } from 'react';
import { 
  Tag, Plus, Trash2, CheckCircle2, XCircle, Percent, AlertCircle, Sparkles
} from 'lucide-react';
import { firestore, Coupon } from '../lib/mockFirebase';
import { CornerOrnament } from './Ornaments';

export const CouponManagementPanel: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [newDescription, setNewDescription] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);

  const loadCoupons = () => {
    setCoupons(firestore.getCoupons());
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      alert('Please fill out a valid coupon naming key.');
      return;
    }
    const cleanCode = newCode.trim().toUpperCase();
    
    const duplicate = coupons.find(c => c.code === cleanCode);
    if (duplicate) {
      alert(`The coupon key "${cleanCode}" already exists. Edit or choose another name.`);
      return;
    }

    const newCoupon: Coupon = {
      code: cleanCode,
      discountPercent: Number(newDiscount),
      active: newIsActive,
      description: newDescription.trim() || `${Number(newDiscount)}% dynamic discount code`
    };

    firestore.saveCoupon(newCoupon);
    loadCoupons();

    // Reset fields
    setNewCode('');
    setNewDiscount(10);
    setNewDescription('');
    setNewIsActive(true);
    alert(`Success: Coupon "${cleanCode}" has been created and registered!`);
  };

  const handleToggleActive = (coupon: Coupon) => {
    const updated = { ...coupon, active: !coupon.active };
    firestore.saveCoupon(updated);
    loadCoupons();
  };

  const handleDeleteCoupon = (code: string) => {
    if (confirm(`Do you wish to completely archive and erase the "${code}" discount token?`)) {
      firestore.deleteCoupon(code);
      loadCoupons();
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Title block */}
      <div className="border-b border-brand-clay/15 pb-4">
        <h2 className="font-serif text-2xl font-bold text-brand-charcoal flex items-center gap-2">
          <Tag className="w-6 h-6 text-brand-terracotta" />
          <span>Atelier Coupon Core Controls</span>
        </h2>
        <p className="text-xs text-brand-clay mt-1">
          Regulate the active financial triggers. Configure and index discount tokens redeemable by customers on checkout invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD NEW TOKEN FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-clay/10 h-fit relative overflow-hidden">
          <CornerOrnament position="top-right" />
          
          <h3 className="font-serif text-base font-semibold text-brand-charcoal border-b border-brand-clay/10 pb-2 mb-4 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-brand-terracotta" />
            <span>Generate Discount Token</span>
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">
                Coupon Key Name (Unique)
              </label>
              <input 
                type="text"
                placeholder="RANGHERITAGE20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2.5 font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-brand-terracotta text-brand-charcoal"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">
                Percentage Reduction Amount (%)
              </label>
              <div className="relative">
                <input 
                  type="number"
                  min="1"
                  max="99"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(Number(e.target.value))}
                  className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2.5 pr-8 focus:outline-none focus:border-brand-terracotta text-brand-charcoal font-bold font-mono"
                  required
                />
                <div className="absolute right-3 top-3 text-brand-clay">
                  <Percent className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">
                Manifest Description
              </label>
              <textarea 
                rows={2}
                placeholder="e.g. Traditional Pohela Boishakh celebration discount token"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2.5 focus:outline-none focus:border-brand-terracotta"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox"
                id="active-toggle"
                checked={newIsActive}
                onChange={(e) => setNewIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-brand-clay text-brand-terracotta focus:ring-brand-terracotta"
              />
              <label htmlFor="active-toggle" className="text-[10px] font-bold tracking-widest uppercase text-brand-charcoal cursor-pointer">
                Publish Active Instantly
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-charcoal text-[#ECE7E1] font-bold tracking-widest uppercase py-3 rounded-lg text-xs hover:bg-brand-terracotta transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-terracotta animate-pulse" />
              <span>Register Coupon Code</span>
            </button>
          </form>
        </div>

        {/* LIST OF ACTIVE/PASSIVE COUPONS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-brand-charcoal text-[#ECE7E1] px-4 py-3 rounded-xl flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Dynamic Tokens Register index</span>
            <span className="text-[10px] font-mono bg-brand-terracotta/20 text-brand-terracotta px-2 py-0.5 rounded-full border border-brand-terracotta/40">
              {coupons.length} Curated Tokens
            </span>
          </div>

          {coupons.length === 0 ? (
            <div className="bg-white border border-dashed border-brand-clay/20 p-12 text-center rounded-2xl">
              <AlertCircle className="w-8 h-8 text-brand-clay/45 mx-auto mb-2" />
              <p className="text-sm font-serif italic text-brand-clay">No discount tokens registered. Add our first coupon above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map((coupon) => (
                <div 
                  key={coupon.code}
                  className={`bg-white border p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 ${
                    coupon.active ? 'border-brand-olive/20 hover:shadow-md' : 'border-brand-clay/10 opacity-75'
                  }`}
                >
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-brand-terracotta shrink-0" />
                        <span className="font-mono text-xs font-extrabold text-brand-charcoal tracking-widest uppercase bg-brand-beige/50 px-2 py-0.5 rounded border border-brand-clay/10">
                          {coupon.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono font-extrabold text-[#7D766C]">
                          -{coupon.discountPercent}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-brand-clay leading-relaxed">
                      {coupon.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between border-t border-brand-clay/10 pt-3 mt-4 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(coupon)}
                      className={`flex items-center gap-1 font-bold uppercase tracking-widest ${
                        coupon.active ? 'text-brand-olive hover:text-green-700' : 'text-gray-400 hover:text-brand-charcoal'
                      }`}
                    >
                      {coupon.active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 fill-brand-olive/10" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      className="text-[#9E8B75] hover:text-red-600 transition-colors flex items-center gap-1 font-bold uppercase tracking-widest"
                      title="Archive token"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
