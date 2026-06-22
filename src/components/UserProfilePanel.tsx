import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, Trash2, LogOut, Save, ShieldAlert,
  ArrowLeft, CheckCircle, RefreshCcw, Sparkles 
} from 'lucide-react';
import { UserProfile, firestore, firebaseAuth } from '../lib/mockFirebase';
import { CornerOrnament, AlpanaCircular } from './Ornaments';

interface UserProfilePanelProps {
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile | null) => void;
  onNavigateHome: () => void;
  triggerToast: (msg: string) => void;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({
  currentUser,
  onUpdateUser,
  onNavigateHome,
  triggerToast
}) => {
  // Form coordinates
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [profileImage, setProfileImage] = useState('https://i.ibb.co.com/mV2JMRFb/Pngtree-default-male-avatar-5939655.png');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerToast('Name coordinate cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      triggerToast('Please provide a valid email coordinate.');
      return;
    }

    setIsSaving(true);

    const updatedFields: Partial<UserProfile> = {
      name,
      email,
      phone: phone.trim() ? phone.trim() : undefined,
      address: address.trim() ? address.trim() : undefined,
      profileImage: profileImage,
    };

    setTimeout(() => {
      firestore.updateUserProfile(currentUser.uid, updatedFields);
      
      // Update active state in parent container
      const freshUser = firebaseAuth.getCurrentUser();
      onUpdateUser(freshUser);
      
      setIsSaving(false);
      triggerToast('Profile coordinates updated successfully.');
    }, 600);
  };

  const handleLogout = () => {
    firebaseAuth.logout();
    onUpdateUser(null);
    onNavigateHome();
    triggerToast('Logged out securely.');
  };

  const handleDeleteAccount = () => {
    if (currentUser.uid === 'user_super_admin' || currentUser.role === 'superAdmin') {
      triggerToast('Security Protocol: The system core super administrator account cannot be deleted.');
      return;
    }

    // Delete representation
    firestore.deleteUser(currentUser.uid);
    firebaseAuth.logout();
    onUpdateUser(null);
    onNavigateHome();
    triggerToast('Your Rong account coordinates have been wiped as requested.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12" id="user-profile-panel">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-clay/15">
        <div>
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-brand-clay hover:text-brand-charcoal transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Curation Home
          </button>
          <span className="text-[10px] font-sans font-bold tracking-widest text-[#6A7450] uppercase block">
            Keeper Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-charcoal leading-none mt-1">
            Studio Profile Settings
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 border border-brand-terracotta/25 text-brand-terracotta text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-brand-terracotta hover:text-brand-bg transition-all duration-300 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Visual Slip Portrait & Local Upload Controls */}
        <div className="space-y-6">
          <div className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl relative overflow-hidden shadow-sm flex flex-col items-center text-center">
            <CornerOrnament position="top-right" />
            
            {/* Ambient subtle orbit */}
            <div className="absolute top-[-30px] left-[-30px] opacity-[0.04]">
              <AlpanaCircular size={140} />
            </div>

            <div className="relative group mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-brand-terracotta p-1 bg-brand-bg">
                <img 
                  src={profileImage || null} 
                  alt={name} 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-0 right-1 bg-brand-olive text-white p-1.5 rounded-full shadow-sm text-xs" title="Curator Verified">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-brand-charcoal whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              {name || 'Handmade Collector'}
            </h3>
            <span className="text-[9px] uppercase tracking-widest text-brand-olive font-bold px-2 px-2.5 py-0.5 bg-brand-beige/50 rounded-full border border-brand-clay/10 mt-1">
              {currentUser.role} Account Status
            </span>
            <p className="text-[10px] text-brand-clay select-none mt-2 font-mono">
              Coordinates listed since: {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Right Column: Form Inputs and Danger Zone */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleSave} className="bg-brand-bg border border-brand-clay/15 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-brand-charcoal border-b border-brand-clay/10 pb-2 flex items-center justify-between">
              <span>Personal Coordinates</span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#B8A189]">Secure TLS Connection</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-brand-charcoal/80 uppercase mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-brand-terracotta" /> Name Coordinate
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-brand-charcoal/80 uppercase mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-brand-terracotta" /> Email coordinate
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-brand-charcoal/80 uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-brand-olive" /> Phone Line
                </label>
                <input
                  type="text"
                  placeholder="+880 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-brand-charcoal/80 uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-olive" /> Shipping address coordinates
                </label>
                <input
                  type="text"
                  placeholder="Street address, City, Bangladesh"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-brand-charcoal hover:bg-brand-olive disabled:bg-brand-clay text-brand-bg px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Coordinates</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="bg-red-50/40 border border-red-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h4 className="font-serif text-sm font-bold text-red-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-terracotta" />
              <span>Security Terminal: Permanent Account Removal</span>
            </h4>
            <p className="text-xs text-brand-charcoal/70 leading-relaxed">
              If you request deletion, all history of curated physical acquisitions, personal journals, wishlist arrays, and login security credentials will be deleted from the database. This step is irreversible.
            </p>

            {showDeleteConfirm ? (
              <div className="bg-white border border-red-200 p-4 rounded-xl space-y-3">
                <p className="text-xs text-red-700 font-medium">Are you absolutely sure regarding deleting this boutique portfolio?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors"
                  >
                    Yes, Delete Coordinate Permanently
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-brand-bg hover:bg-brand-beige border border-brand-clay/35 text-brand-charcoal px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors"
                  >
                    Cancel Action
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-100/60 text-red-700 hover:bg-red-100 hover:text-red-900 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all duration-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Request Account Deletion</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
