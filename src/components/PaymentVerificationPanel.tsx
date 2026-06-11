import React, { useState } from 'react';
import { Search, Eye, Check, X, ShieldCheck, Copy, Filter, Calendar, Info, FileImage } from 'lucide-react';
import { firestore } from '../lib/mockFirebase';

interface PaymentVerificationPanelProps {
  verifications: any[];
  onReload: () => void;
  triggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PaymentVerificationPanel: React.FC<PaymentVerificationPanelProps> = ({
  verifications,
  onReload,
  triggerToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verification_pending' | 'payment_verified' | 'payment_rejected'>('all');
  const [selectedVer, setSelectedVer] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [expandScreenshot, setExpandScreenshot] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter verifications
  const filteredList = verifications.filter((ver) => {
    const matchesSearch =
      ver.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ver.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ver.senderNumber.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || ver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Count headers
  const countPending = verifications.filter(v => v.status === 'verification_pending').length;
  const countVerified = verifications.filter(v => v.status === 'payment_verified').length;
  const countRejected = verifications.filter(v => v.status === 'payment_rejected').length;

  const handleApprove = async (ver: any) => {
    try {
      await firestore.verifyPayment(ver.verificationId, 'payment_verified');
      triggerToast(`Payment verification approved for Order ${ver.orderId}!`, 'success');
      setSelectedVer(null);
      onReload();
    } catch (err: any) {
      triggerToast(err.message || 'Verification approval failed.', 'error');
    }
  };

  const handleRejectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      triggerToast('Please provide a rejection reason.', 'error');
      return;
    }
    if (!selectedVer) return;

    try {
      await firestore.verifyPayment(selectedVer.verificationId, 'payment_rejected', rejectReason.trim());
      triggerToast(`Payment rejected for Order ${selectedVer.orderId}.`, 'error');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedVer(null);
      onReload();
    } catch (err: any) {
      triggerToast(err.message || 'Verification rejection failed.', 'error');
    }
  };

  return (
    <div className="space-y-6" id="payment-verification-panel">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-clay/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2A26]">bKash Payments Queue</h2>
          <p className="text-xs text-brand-clay">Verify customer manual bKash SMS and app payments against archives</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {countPending} Pending Approvals
          </span>
        </div>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setStatusFilter('verification_pending')}
          className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
            statusFilter === 'verification_pending' 
              ? 'bg-[#EFECE8] border-amber-600 shadow-md scale-[1.02]' 
              : 'bg-[#F9F7F5] border-brand-clay/10 hover:border-amber-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49275]">Awaiting Auditing</span>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-3xl font-serif font-black text-amber-700">{countPending}</span>
            <span className="text-[11px] text-brand-clay">Transactions</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('payment_verified')}
          className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
            statusFilter === 'payment_verified' 
              ? 'bg-[#EFECE8] border-emerald-600 shadow-md scale-[1.02]' 
              : 'bg-[#F9F7F5] border-brand-clay/10 hover:border-emerald-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49275]">Approved Payments</span>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-3xl font-serif font-black text-emerald-700">{countVerified}</span>
            <span className="text-[11px] text-brand-clay">Transactions</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('payment_rejected')}
          className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
            statusFilter === 'payment_rejected' 
              ? 'bg-[#EFECE8] border-rose-600 shadow-md scale-[1.02]' 
              : 'bg-[#F9F7F5] border-brand-clay/10 hover:border-rose-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49275]">Rejected Logs</span>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-3xl font-serif font-black text-rose-700">{countRejected}</span>
            <span className="text-[11px] text-brand-clay">Fraud / Typos</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Control bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#F9F7F5] p-3 rounded-xl border border-brand-clay/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#B49275]" />
          <input
            type="text"
            className="w-full bg-brand-bg pl-9 pr-4 py-2 rounded-lg border border-brand-clay/20 text-xs focus:outline-none focus:border-brand-terracotta"
            placeholder="Search by TxnID, Order Ref, bKash Sender number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
              statusFilter === 'all'
                ? 'bg-brand-charcoal text-white'
                : 'bg-brand-bg text-brand-charcoal hover:bg-brand-beige/50 border border-brand-clay/15'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setStatusFilter('verification_pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
              statusFilter === 'verification_pending'
                ? 'bg-amber-100 text-amber-800 font-extrabold border border-amber-300'
                : 'bg-brand-bg text-brand-charcoal hover:bg-brand-beige/50 border border-brand-clay/15'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('payment_verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
              statusFilter === 'payment_verified'
                ? 'bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300'
                : 'bg-brand-bg text-brand-charcoal hover:bg-brand-beige/50 border border-brand-clay/15'
            }`}
          >
            Verified
          </button>
        </div>
      </div>

      {/* Grid Layout containing Main list and active Detail view */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Main List Column */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-brand-bg rounded-xl border border-brand-clay/10 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-brand-clay/10 bg-brand-beige/10 font-serif font-bold text-[#2D2A26] flex justify-between items-center text-sm">
              <span>Auditing List ({filteredList.length} logs matched)</span>
            </div>

            {filteredList.length === 0 ? (
              <div className="p-10 text-center text-brand-clay space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto stroke-[1.25]" />
                <p className="text-xs">No traditional payment entries found matching keywords.</p>
              </div>
            ) : (
              <div className="divide-y divide-brand-clay/10 max-h-[500px] overflow-y-auto">
                {filteredList.map((ver) => {
                  const isSelected = selectedVer?.verificationId === ver.verificationId;
                  return (
                    <div
                      key={ver.verificationId}
                      className={`p-4 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected 
                          ? 'bg-brand-beige/50 border-l-4 border-brand-terracotta' 
                          : 'hover:bg-brand-beige/10'
                      }`}
                      onClick={() => {
                        setSelectedVer(ver);
                        setRejectReason('');
                        setShowRejectModal(false);
                      }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-brand-charcoal select-all">
                            TxnID: {ver.transactionId}
                          </span>
                          <span className="text-[10px] font-mono bg-brand-beige py-0.5 px-2 rounded-full border border-brand-clay/10 text-[#403B37]">
                            {ver.orderId}
                          </span>
                        </div>
                        <div className="text-[10px] text-brand-clay flex items-center gap-3">
                          <span>Sender: <strong className="text-brand-charcoal">{ver.senderNumber}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono"><Calendar className="w-3 h-3" /> {new Date(ver.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-serif text-sm font-black text-brand-charcoal block">৳{ver.amount}</span>
                          <span className="text-[10px] text-brand-clay font-mono block">Paid Amount</span>
                        </div>

                        <div>
                          {ver.status === 'verification_pending' && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200/50 text-[10px] uppercase font-bold tracking-wider py-1 px-2.5 rounded-full">
                              Pending
                            </span>
                          )}
                          {ver.status === 'payment_verified' && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] uppercase font-bold tracking-wider py-1 px-2.5 rounded-full">
                              Verified
                            </span>
                          )}
                          {ver.status === 'payment_rejected' && (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200/50 text-[10px] uppercase font-bold tracking-wider py-1 px-2.5 rounded-full">
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Detail Column */}
        <div className="space-y-4">
          {selectedVer ? (
            <div className="bg-[#FAF8F5] border border-brand-clay/15 rounded-xl p-5 shadow-sm space-y-5 sticky top-24 font-sans animate-fade-in">
              <div className="flex justify-between items-center border-b border-brand-clay/10 pb-3">
                <h3 className="font-serif font-black text-brand-charcoal text-base">Auditor Inspector</h3>
                <button
                  onClick={() => setSelectedVer(null)}
                  className="p-1 rounded-full hover:bg-brand-beige text-brand-clay"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Header card with status indicators */}
              <div className="space-y-3.5">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-clay font-medium uppercase font-mono">Status Status</span>
                  {selectedVer.status === 'verification_pending' && (
                    <span className="text-amber-700 font-extrabold uppercase bg-amber-50 rounded px-2.5 py-0.5 border border-amber-200 text-[10px]">
                      Awaiting Audit
                    </span>
                  )}
                  {selectedVer.status === 'payment_verified' && (
                    <span className="text-emerald-700 font-extrabold uppercase bg-emerald-50 rounded px-2.5 py-0.5 border border-emerald-200 text-[10px]">
                      APPROVED
                    </span>
                  )}
                  {selectedVer.status === 'payment_rejected' && (
                    <span className="text-rose-700 font-extrabold uppercase bg-rose-50 rounded px-2.5 py-0.5 border border-rose-200 text-[10px]">
                      REJECTED
                    </span>
                  )}
                </div>

                <div className="bg-brand-bg rounded-lg border border-brand-clay/10 p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-clay">Order Reference:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-brand-charcoal bg-brand-beige/50 px-2 py-0.5 rounded">
                      <span>{selectedVer.orderId}</span>
                      <button onClick={() => handleCopy(selectedVer.orderId, 'order')} className="hover:text-brand-terracotta">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-clay">bKash Transaction ID:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-brand-charcoal bg-brand-beige/50 px-2 py-0.5 rounded">
                      <span className="tracking-widest uppercase">{selectedVer.transactionId}</span>
                      <button onClick={() => handleCopy(selectedVer.transactionId, 'txn')} className="hover:text-brand-terracotta">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-clay">Sender Mobile:</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-brand-charcoal bg-brand-beige/50 px-2 py-0.5 rounded">
                      <span>{selectedVer.senderNumber}</span>
                      <button onClick={() => handleCopy(selectedVer.senderNumber, 'sender')} className="hover:text-brand-terracotta">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-brand-clay/10 pt-2">
                    <span className="text-brand-clay">Submitted At:</span>
                    <span className="font-mono text-brand-charcoal text-[11px]">
                      {new Date(selectedVer.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  {selectedVer.verifiedAt && (
                    <div className="flex justify-between items-center text-xs border-t border-brand-clay/10 pt-2">
                      <span className="text-brand-clay">Audited At:</span>
                      <span className="font-mono text-brand-charcoal text-[11px]">
                        {new Date(selectedVer.verifiedAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedVer.rejectionReason && (
                    <div className="text-xs bg-red-50 text-red-700 rounded p-2.5 border border-red-200/50 mt-1">
                      <strong>Rejection Reason:</strong> {selectedVer.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="text-center p-3.5 bg-brand-terracotta/5 border border-brand-terracotta/10 rounded-xl">
                  <span className="text-[10px] text-brand-clay uppercase font-bold tracking-widest block">Buyer Confirmed Amount</span>
                  <span className="font-serif text-3xl font-black text-brand-terracotta block mt-1">৳{selectedVer.amount}</span>
                </div>

                {/* Screenshot view */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#B49275] uppercase font-bold tracking-wider block">Receipt Screenshot Panel</span>
                  {selectedVer.screenshotUrl ? (
                    <div className="relative border border-brand-clay/15 rounded-xl overflow-hidden bg-brand-bg group">
                      <img 
                        src={selectedVer.screenshotUrl} 
                        alt="Receipt preview" 
                        className="w-full h-40 object-contain p-2"
                      />
                      <button
                        onClick={() => setExpandScreenshot(true)}
                        className="absolute bottom-2 right-2 bg-brand-charcoal/80 text-white text-[10px] font-sans font-bold py-1 px-2.5 rounded-md hover:bg-brand-charcoal backdrop-blur-sm shadow"
                      >
                        Expand Receipt
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 border border-dashed border-brand-clay/35 rounded-xl text-center bg-brand-bg text-brand-clay space-y-1">
                      <FileImage className="w-5 h-5 mx-auto stroke-[1.25]" />
                      <p className="text-[11px]">No photographic receipt attached by buyer.</p>
                    </div>
                  )}
                </div>

                {/* Action buttons (only show if pending) */}
                {selectedVer.status === 'verification_pending' ? (
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="flex-1 border border-rose-300 text-rose-700 hover:bg-rose-50 font-sans font-bold py-3 px-1.5 rounded-lg text-xs uppercase tracking-wider transition-colors"
                    >
                      Reject Fraud
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedVer)}
                      className="flex-1 bg-brand-olive hover:bg-brand-charcoal text-brand-bg font-sans font-bold py-3 px-1.5 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow"
                    >
                      <Check className="w-4 h-4" />
                      Approve Order
                    </button>
                  </div>
                ) : (
                  <div className="bg-brand-beige/25 p-3 rounded-lg border border-brand-clay/10 text-center text-xs text-brand-clay flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-olive shrink-0" />
                    <span>Auditing Completed & Saved</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF8F5] border border-brand-clay/10 rounded-xl p-8 text-center text-brand-clay space-y-2 sticky top-24">
              <ShieldCheck className="w-10 h-10 mx-auto stroke-[1.25]" />
              <h3 className="font-serif font-black text-brand-charcoal text-sm">Select an Audit Entry</h3>
              <p className="text-xs">Click on any bKash submission in the queue to load transaction metadata and visual screenshot receipts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal dialog */}
      {showRejectModal && selectedVer && (
        <div className="fixed inset-0 bg-brand-charcoal/30 backdrop-blur-sm flex items-center justify-center p-4 z-55">
          <div className="bg-brand-bg border border-brand-clay/20 shadow-2xl rounded-2xl p-5 max-w-md w-full font-sans space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-brand-clay/10 pb-2">
              <h4 className="font-serif font-black text-brand-charcoal text-base">Reject Payment Submission</h4>
              <button onClick={() => setShowRejectModal(false)} className="text-brand-clay hover:opacity-85">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-brand-clay">
              This action rejects Order <strong className="text-brand-charcoal">{selectedVer.orderId}</strong>'s verification and alerts the customer (TxnID: {selectedVer.transactionId}). Please declare the auditing rejection reason clearly.
            </p>

            <form onSubmit={handleRejectConfirm} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2.5 text-xs focus:outline-none focus:border-brand-terracotta resize-none"
                  placeholder="e.g., The Transaction ID provided does not match our bKash ledger statements. Please try again with valid SMS credentials."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border border-brand-clay/30 hover:bg-brand-beige/30 rounded-lg text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg rounded-lg text-xs font-bold uppercase shadow"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenshot Overlay Modal */}
      {expandScreenshot && selectedVer && selectedVer.screenshotUrl && (
        <div 
          className="fixed inset-0 bg-brand-charcoal/80 flex items-center justify-center p-4 z-55 cursor-zoom-out"
          onClick={() => setExpandScreenshot(false)}
        >
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-brand-clay/10 shadow-2xl relative">
            <button 
              onClick={() => setExpandScreenshot(false)}
              className="absolute top-4 right-4 bg-brand-charcoal text-white rounded-full p-2 hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={selectedVer.screenshotUrl} 
              alt="Verification document details" 
              className="max-w-full max-h-[80vh] object-contain bg-brand-bg"
            />
          </div>
        </div>
      )}

    </div>
  );
};
