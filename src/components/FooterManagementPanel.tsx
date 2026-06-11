import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Save, RefreshCw, Eye, BookOpen, AlertCircle, Sparkles, Plus, Trash2, CheckCircle2 
} from 'lucide-react';
import { firestore, FooterSettings } from '../lib/mockFirebase';
import { AlpanaCircular, CornerOrnament } from './Ornaments';

export const FooterManagementPanel: React.FC = () => {
  // Configured in localStorage under two states: the live state, and the active draft
  const [liveSettings, setLiveSettings] = useState<FooterSettings | null>(null);
  const [draftSettings, setDraftSettings] = useState<FooterSettings | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Buffer fields for list components (e.g. adding navigation links)
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkHref, setNewLinkHref] = useState('');

  useEffect(() => {
    const live = firestore.getFooterSettings();
    setLiveSettings(live);

    // Draft loads from separate local draft prefix, falling back to live if empty
    const savedDraft = localStorage.getItem('siteSettings_footer_draft');
    if (savedDraft) {
      setDraftSettings(JSON.parse(savedDraft));
    } else {
      setDraftSettings({ ...live });
    }
  }, []);

  const handleUpdateField = (path: string, value: any) => {
    if (!draftSettings) return;
    
    // Support deep path updates like 'socialLinks.instagram'
    if (path.includes('.')) {
      const [parent, child] = path.split('.');
      setDraftSettings({
        ...draftSettings,
        [parent]: {
          ...(draftSettings[parent as keyof FooterSettings] as any),
          [child]: value
        }
      });
    } else {
      setDraftSettings({
        ...draftSettings,
        [path]: value
      });
    }
    setIsSaved(false);
  };

  const handleAddLink = () => {
    if (!draftSettings || !newLinkLabel.trim() || !newLinkHref.trim()) return;
    const updatedLinks = [...(draftSettings.navigationLinks || []), { label: newLinkLabel.trim(), href: newLinkHref.trim() }];
    setDraftSettings({
      ...draftSettings,
      navigationLinks: updatedLinks
    });
    setNewLinkLabel('');
    setNewLinkHref('');
    setIsSaved(false);
  };

  const handleRemoveLink = (idx: number) => {
    if (!draftSettings) return;
    const updatedLinks = (draftSettings.navigationLinks || []).filter((_, i) => i !== idx);
    setDraftSettings({
      ...draftSettings,
      navigationLinks: updatedLinks
    });
    setIsSaved(false);
  };

  const handleSaveDraft = () => {
    if (!draftSettings) return;
    localStorage.setItem('siteSettings_footer_draft', JSON.stringify(draftSettings));
    setIsSaved(true);
    // Trigger window toast event
    alert('Draft settings successfully cached in local Workspace storage!');
  };

  const handlePublish = () => {
    if (!draftSettings) return;
    firestore.saveFooterSettings(draftSettings);
    setLiveSettings(draftSettings);
    localStorage.removeItem('siteSettings_footer_draft');
    setIsSaved(true);
    alert('Dynamic footer settings successfully published to active Ateliers database!');
  };

  const handleRevert = () => {
    if (!liveSettings) return;
    setDraftSettings({ ...liveSettings });
    localStorage.removeItem('siteSettings_footer_draft');
    setIsSaved(true);
    alert('Draft reset successfully to active production settings.');
  };

  if (!draftSettings) return null;

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-clay/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-charcoal flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-terracotta" />
            <span>Interactive Footer Orchestrator</span>
          </h2>
          <p className="text-xs text-brand-clay mt-1">
            Re-engineer the final scroll chapter of Rang heritage stories with a rich dynamic, real-time draft workflow.
          </p>
        </div>

        {/* Workflow actions */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleRevert}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-clay/30 rounded-lg text-xs font-semibold text-brand-clay hover:text-brand-charcoal hover:bg-brand-beige/20 transition-all"
            title="Discard current draft edits and load published data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Revert Changes</span>
          </button>
          
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-olive/45 rounded-lg text-xs font-semibold text-brand-olive hover:bg-brand-olive/5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-charcoal text-[#ECE7E1] rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-brand-terracotta transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Main panel body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* EDITING FORM */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-brand-clay/10 relative overflow-hidden">
          <CornerOrnament position="top-right" />
          
          <h3 className="font-serif text-base font-semibold text-brand-charcoal flex items-center gap-2 border-b border-brand-clay/10 pb-2">
            <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-pulse" />
            <span>Atelier Farewell Meta Content</span>
          </h3>

          <div className="space-y-4 text-xs font-sans">
            {/* Brand Title and Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">Farewell Brand Name</label>
                <input 
                  type="text" 
                  value={draftSettings.brandName}
                  onChange={(e) => handleUpdateField('brandName', e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2 focus:outline-none focus:border-brand-terracotta font-serif text-sm text-brand-charcoal"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">Sub-tagline</label>
                <input 
                  type="text" 
                  value={draftSettings.brandTagline}
                  onChange={(e) => handleUpdateField('brandTagline', e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2 focus:outline-none focus:border-brand-terracotta text-brand-charcoal font-semibold"
                />
              </div>
            </div>

            {/* Logo Image URL */}
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">Logo URL (Optional Overlay)</label>
              <input 
                type="text" 
                value={draftSettings.logoUrl}
                onChange={(e) => handleUpdateField('logoUrl', e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2 focus:outline-none focus:border-brand-terracotta font-mono"
                placeholder="https://..."
              />
            </div>

            {/* Poetic Message */}
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">Editorial farewell message</label>
              <textarea 
                rows={3}
                value={draftSettings.footerMessage}
                onChange={(e) => handleUpdateField('footerMessage', e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2 focus:outline-none focus:border-brand-terracotta font-serif text-xs italic text-brand-charcoal"
              />
            </div>

            {/* Newsletter Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-clay/10 pt-3">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">Newsletter Header</label>
                <input 
                  type="text" 
                  value={draftSettings.newsletterTitle}
                  onChange={(e) => handleUpdateField('newsletterTitle', e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">Newsletter description</label>
                <input 
                  type="text" 
                  value={draftSettings.newsletterDescription}
                  onChange={(e) => handleUpdateField('newsletterDescription', e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                />
              </div>
            </div>

            {/* Legal / Copyright Tag */}
            <div className="border-t border-brand-clay/10 pt-3">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">Closing Copyright Legend</label>
              <input 
                type="text" 
                value={draftSettings.copyrightText}
                onChange={(e) => handleUpdateField('copyrightText', e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
              />
            </div>

            {/* Contact Coordinates */}
            <div className="space-y-3 pt-3 border-t border-brand-clay/10">
              <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Studio Coordinates</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">Inscribed Email</label>
                  <input 
                    type="email" 
                    value={draftSettings.email}
                    onChange={(e) => handleUpdateField('email', e.target.value)}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">Loom Phone</label>
                  <input 
                    type="text" 
                    value={draftSettings.phone}
                    onChange={(e) => handleUpdateField('phone', e.target.value)}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">Atelier Address</label>
                <input 
                  type="text" 
                  value={draftSettings.address}
                  onChange={(e) => handleUpdateField('address', e.target.value)}
                  className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                />
              </div>
            </div>

            {/* Social Matrix Coordinates */}
            <div className="space-y-3 pt-3 border-t border-brand-clay/10">
              <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Social Coordinates</h4>
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">Instagram</label>
                  <input 
                    type="text" 
                    value={draftSettings.socialLinks.instagram}
                    onChange={(e) => handleUpdateField('socialLinks.instagram', e.target.value)}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">Facebook</label>
                  <input 
                    type="text" 
                    value={draftSettings.socialLinks.facebook}
                    onChange={(e) => handleUpdateField('socialLinks.facebook', e.target.value)}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">WhatsApp</label>
                  <input 
                    type="text" 
                    value={draftSettings.socialLinks.whatsapp}
                    onChange={(e) => handleUpdateField('socialLinks.whatsapp', e.target.value)}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">YouTube</label>
                  <input 
                    type="text" 
                    value={draftSettings.socialLinks.youtube}
                    onChange={(e) => handleUpdateField('socialLinks.youtube', e.target.value)}
                    className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            {/* Quick Links Navigator */}
            <div className="space-y-3 pt-3 border-t border-brand-clay/10">
              <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Indexed Portals</h4>
              
              <div className="flex flex-wrap gap-2 mb-2 bg-[#F6F5F2] p-2.5 rounded-lg max-h-40 overflow-y-auto">
                {draftSettings.navigationLinks && draftSettings.navigationLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-clay/15 rounded-lg text-[10.5px]">
                    <span className="font-bold text-brand-charcoal uppercase">{link.label}</span>
                    <span className="text-gray-400">({link.href})</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveLink(i)}
                      className="text-brand-terracotta hover:text-red-600 transition-colors ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-2 items-end">
                <div className="col-span-2">
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">Link Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Story" 
                    value={newLinkLabel} 
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    className="w-full bg-brand-bg border border-[#CECECE] p-1.5 rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-brand-clay mb-1">Link Page</label>
                  <input 
                    type="text" 
                    placeholder="e.g. story" 
                    value={newLinkHref} 
                    onChange={(e) => setNewLinkHref(e.target.value)}
                    className="w-full bg-brand-bg border border-[#CECECE] p-1.5 rounded font-mono"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="w-full bg-brand-charcoal text-[#ECE7E1] py-2 rounded font-bold hover:bg-brand-olive transition-all flex items-center justify-center border border-brand-charcoal"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* COMPACT REAL-TIME DRAFT PREVIEW PANEL */}
        <div className="space-y-4">
          <div className="bg-brand-charcoal p-4 rounded-xl flex items-center justify-between text-[#ECE7E1]">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-terracotta animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Atelier Final Screen Live Simulator</span>
            </div>
          </div>

          {/* Simulated Mobile/Compact Device Canvas Frame */}
          <div className="relative border-4 border-brand-charcoal rounded-3xl overflow-hidden shadow-2xl h-[95%] min-h-[500px]">
            <div className="absolute inset-0 bg-[#1a1715] text-[#ECE7E1] p-6 flex flex-col justify-between overflow-y-auto font-sans leading-relaxed text-left text-xs">
              
              {/* Paper shadow overlay */}
              <div 
                className="absolute inset-[1px] bg-cover opacity-[0.055] bg-center mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=1200')` }}
              />

              {/* Simulated Rotating Circular backdrop */}
              <div className="relative py-8 flex flex-col items-center justify-center text-center">
                <div className="absolute w-44 h-44 rounded-full border border-dashed border-brand-terracotta/40 flex items-center justify-center opacity-30 animate-spin-slow pointer-events-none">
                  <AlpanaCircular size={150} />
                </div>

                <div className="relative">
                  {draftSettings.logoUrl ? (
                    <img src={draftSettings.logoUrl} alt="Logo" className="w-12 h-12 rounded-full border border-brand-clay/10 p-0.5 mix-blend-lighten mb-1.5 mx-auto" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-brand-terracotta bg-brand-charcoal/40 flex items-center justify-center mx-auto mb-1.5">
                      <span className="font-serif font-bold text-lg text-brand-terracotta">র</span>
                    </div>
                  )}

                  <h1 className="font-serif text-lg tracking-[0.25em] font-semibold text-white uppercase leading-none">
                    {draftSettings.brandName}
                  </h1>
                  <span className="text-[8px] font-mono tracking-[0.3em] text-[#B8A189] uppercase block mt-1">
                    {draftSettings.brandTagline}
                  </span>
                </div>

                <p className="font-serif text-[#ECE7E1]/80 max-w-sm px-4 mt-4 italic font-light text-[11px]">
                  "{draftSettings.footerMessage}"
                </p>
              </div>

              {/* Newsletter Subscribed Area */}
              <div className="mt-4 p-4 border border-brand-clay/15 rounded-xl bg-black/15 space-y-2">
                <span className="font-bold font-serif text-[#FFFFFF] text-[10px] uppercase tracking-wider block">
                  ✦ {draftSettings.newsletterTitle}
                </span>
                <p className="text-[10px] text-gray-400">{draftSettings.newsletterDescription}</p>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter email coordinate..." 
                    disabled 
                    className="w-full bg-[#24211F] border border-brand-clay/20 p-1.5 rounded-l text-[10px]"
                  />
                  <button type="button" disabled className="bg-brand-charcoal px-3 text-brand-terracotta border-brand-clay/20 border rounded-r">
                    Send
                  </button>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-brand-clay/10 pt-4 text-[10px]">
                <div>
                  <h4 className="font-bold text-white uppercase text-[9px] mb-1">Index directories</h4>
                  <ul className="space-y-1">
                    {draftSettings.navigationLinks && draftSettings.navigationLinks.map((link, i) => (
                      <li key={i} className="text-gray-400 hover:text-white uppercase tracking-wider text-[8px] font-semibold">
                        • {link.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-[9px] mb-1">Enquiry box</h4>
                  <div className="space-y-1 text-gray-400">
                    <p>{draftSettings.address}</p>
                    <p>{draftSettings.phone}</p>
                    <p className="truncate text-[8px] font-semibold">{draftSettings.email}</p>
                  </div>
                </div>
              </div>

              {/* Copyright bottom */}
              <div className="mt-8 pt-4 border-t border-brand-clay/10 text-center text-[9px] text-[#8C857B]">
                <p>{draftSettings.copyrightText}</p>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
