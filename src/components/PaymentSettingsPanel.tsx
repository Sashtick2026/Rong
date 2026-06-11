import React, { useState } from 'react';
import { Settings, Save, Shield, HelpCircle, CheckCircle } from 'lucide-react';
import { firestore } from '../lib/mockFirebase';

interface PaymentSettingsPanelProps {
  settings: any;
  onReload: () => void;
  triggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PaymentSettingsPanel: React.FC<PaymentSettingsPanelProps> = ({
  settings,
  onReload,
  triggerToast,
}) => {
  const [bkashNumber, setBkashNumber] = useState(settings?.bkashNumber || '01712-345678');
  const [bkashAccountType, setBkashAccountType] = useState(settings?.bkashAccountType || 'Personal Account');
  const [paymentInstructions, setPaymentInstructions] = useState(
    settings?.paymentInstructions || 
    'Please make a manual/Send Money bKash transfer of the total order sum. Once completed, specify the sender mobile number, total amount paid, and copy-paste the bKash Transaction ID (TxnID) returned in the SMS/App to initiate verification.'
  );
  const [verificationMessage, setVerificationMessage] = useState(
    settings?.verificationMessage || 
    'We have received your payment information. Our team is verifying your payment with bKash archives. This usually takes between 10-30 minutes. You will receive an immediate in-app notice and an invoice email once verified.'
  );
  const [notificationSettings, setNotificationSettings] = useState(settings?.notificationSettings || 'enabled');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bkashNumber.trim()) {
      triggerToast('Please provide a valid bKash number.', 'error');
      return;
    }

    setSaving(true);
    try {
      await firestore.savePaymentSettings({
        bkashNumber: bkashNumber.trim(),
        bkashAccountType: bkashAccountType.trim(),
        paymentInstructions: paymentInstructions.trim(),
        verificationMessage: verificationMessage.trim(),
        notificationSettings
      });
      triggerToast('bKash gate payment settings saved successfully to Firestore!', 'success');
      onReload();
    } catch (err: any) {
      triggerToast(err.message || 'Saving payment settings failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" id="payment-settings-panel">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-clay/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2A26]">bKash Gateway settings</h2>
          <p className="text-xs text-brand-clay">Manage user manual payment guidelines, copy strings and responses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Settings Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4 bg-brand-bg border border-brand-clay/10 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-brand-clay/10 pb-2 mb-3">
            <Settings className="w-4 h-4 text-brand-terracotta" />
            <h4 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider">Gate Configuration</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                bKash Phone Number (Format) *
              </label>
              <input
                type="text"
                required
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-terracotta transition-colors"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                placeholder="e.g. 01712-345678"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                Account Type Label
              </label>
              <input
                type="text"
                required
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-terracotta transition-colors"
                value={bkashAccountType}
                onChange={(e) => setBkashAccountType(e.target.value)}
                placeholder="e.g. Personal Account"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
              Active Payment Instructions (Checkout) *
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-3 text-xs focus:outline-none focus:border-brand-terracotta transition-colors resize-none leading-relaxed"
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              placeholder="Provide clean, visual payment send guidelines for customers."
            />
            <p className="text-[10px] text-brand-clay mt-1">This text appears directly on the bKash step during the checkout slide-out panel.</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D2A26] mb-1">
              Submission Verification Response Message *
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-3 text-xs focus:outline-none focus:border-brand-terracotta transition-colors resize-none leading-relaxed"
              value={verificationMessage}
              onChange={(e) => setVerificationMessage(e.target.value)}
              placeholder="What should the customer read immediately after hitting submit?"
            />
            <p className="text-[10px] text-brand-clay mt-1">This text is displayed on the order success screen after bKash verification is initiated.</p>
          </div>

          <div className="pt-2 border-t border-brand-clay/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#5B6349] hover:bg-brand-charcoal text-white font-bold py-2.5 px-5 rounded-lg text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Right Info Box */}
        <div className="space-y-4">
          <div className="bg-[#FAF8F5] border border-brand-clay/15 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-brand-olive">
              <Shield className="w-5 h-5 shrink-0" />
              <h4 className="font-serif font-black text-brand-charcoal text-sm">Security Protocols</h4>
            </div>
            
            <p className="text-xs text-brand-clay leading-relaxed text-justify-custom">
              Our traditional manual verification structure relies heavily on system indicators to maintain zero credit duplicates.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-brand-olive shrink-0 mt-0.5" />
                <span><strong>No duplications:</strong> Transaction IDs cannot be registered more than once.</span>
              </div>
              <div className="flex gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-brand-olive shrink-0 mt-0.5" />
                <span><strong>Transactional states:</strong> Checking pending status blocks further adjustments till audit.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
