import React from 'react';
import { Mail, Phone, MapPin, Feather, Compass, Info, Heart, ArrowRight, Share2, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { JournalArticle, Testimonial } from '../types';
import { journalArticles, testimonials } from '../data';
import { OrganicDivider, CornerOrnament, PotteryOrnament, AlpanaCircular } from './Ornaments';
import { motion, AnimatePresence } from 'motion/react';
import { firestore } from '../lib/mockFirebase';

// ==========================================
// ABOUT VIEW (Editorial, Museum-like)
// ==========================================
export const AboutView: React.FC = () => {
  const settings = firestore.getAboutSettings();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans text-brand-charcoal"
      id="about-view-container"
    >
      {/* Intro Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-terracotta mb-2 inline-block">
          {settings.pretitle}
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-semibold mb-6 tracking-tight leading-tight">
          {settings.titleLine1} <br className="sm:inline hidden" />
          <span className="italic text-brand-olive font-normal font-serif">{settings.titleLine2}</span>
        </h1>
        <p className="font-serif text-lg text-brand-charcoal/80 leading-relaxed italic">
          “{settings.quote || 'Curation celebrating organic longevity of heritage and craftsmanship.'}”
        </p>
        <OrganicDivider />
      </div>

      {/* Two-Column Editorial Inception Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center mb-24">
        <div className="lg:col-span-6 relative flex items-center justify-center">
          {/* Circular Motif floating offset */}
          <div className="absolute -top-12 -left-12 opacity-15">
            <AlpanaCircular size={220} />
          </div>
          <div className="relative border border-brand-clay/30 p-3 sm:p-5 rounded-2xl bg-brand-beige/25 shadow-base max-w-md">
            <CornerOrnament position="top-left" />
            <CornerOrnament position="bottom-right" />
            <img
              src={settings.image || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop"}
              alt="Narrative visual chronicle"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover rounded-xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-6 -right-6 bg-brand-charcoal text-brand-bg px-4 py-3.5 rounded-lg text-xs tracking-widest uppercase font-mono shadow-md">
              {settings.badge}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6 text-justify-custom text-sm leading-relaxed text-brand-charcoal/85">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-charcoal tracking-tight mb-2">
            {settings.manifestoTitle}
          </h2>
          <p>{settings.manifestoPara1}</p>
          <p>{settings.manifestoPara2}</p>
          <div className="flex gap-4 pt-4 border-l-2 border-brand-terracotta pl-4 italic text-xs text-brand-olive font-medium">
            <span>“{settings.manifestoQuote}”</span>
          </div>
        </div>
      </div>

      {/* The Core Brand Values - Bento Style Grid */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <span className="text-[10px] font-sans font-semibold tracking-widest text-brand-olive uppercase select-none">Curation Pillars</span>
          <h3 className="font-serif text-3xl font-medium tracking-tight mt-1 text-brand-charcoal">Our Eternal Commitments</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-brand-beige/20 border border-brand-clay/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-terracotta/40 transition-colors duration-300 relative group overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-olive/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="mb-4">
              <div className="w-10 h-10 rounded-full border border-brand-olive/30 text-brand-olive flex items-center justify-center mb-4 bg-brand-bg">
                <Feather className="w-5 h-5 stroke-[1.25]" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-brand-charcoal mb-2">{settings.pillar1Title}</h4>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed text-justify-custom">
                {settings.pillar1Desc}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-brand-olive font-bold mt-4">
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>{settings.pillar1Badge}</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-brand-beige/20 border border-brand-clay/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-terracotta/40 transition-colors duration-300 relative group overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-terracotta/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="mb-4">
              <div className="w-10 h-10 rounded-full border border-brand-terracotta/30 text-brand-terracotta flex items-center justify-center mb-4 bg-brand-bg">
                <Compass className="w-5 h-5 stroke-[1.25]" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-brand-charcoal mb-2">{settings.pillar2Title}</h4>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed text-justify-custom">
                {settings.pillar2Desc}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#C46E4E] font-bold mt-4">
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>{settings.pillar2Badge}</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-brand-beige/20 border border-brand-clay/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-terracotta/40 transition-colors duration-300 relative group overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-olive/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="mb-4">
              <div className="w-10 h-10 rounded-full border border-brand-clay/35 text-brand-charcoal flex items-center justify-center mb-4 bg-brand-bg">
                <Info className="w-5 h-5 stroke-[1.25]" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-brand-charcoal mb-2">{settings.pillar3Title}</h4>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed text-justify-custom">
                {settings.pillar3Desc}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#5B6349] font-bold mt-4">
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>{settings.pillar3Badge}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Sustainable Vision Signature Wrap */}
      <div className="bg-brand-beige/35 border border-brand-clay/20 p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute bottom-4 left-4 opacity-5">
          <PotteryOrnament size={120} />
        </div>
        <span className="text-[10px] tracking-widest uppercase text-brand-olive font-bold">{settings.earthPretitle}</span>
        <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-charcoal mt-2 mb-4">{settings.earthTitle}</h4>
        <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed max-w-2xl mx-auto">
          {settings.earthDesc}
        </p>
      </div>

    </motion.div>
  );
};


// ==========================================
// JOURNAL VIEW (Editorial Blog)
// ==========================================
export const JournalView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = React.useState<JournalArticle | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans text-brand-charcoal"
      id="journal-view-container"
    >
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <span className="text-[10px] font-sans font-bold tracking-widest text-brand-olive uppercase">Heritage Journal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-brand-charcoal tracking-tight mt-1 mb-4">
          The Craft Chronicles
        </h1>
        <p className="text-xs sm:text-sm tracking-widest uppercase text-brand-clay">Volume VI / June 2026 Edition</p>
        <OrganicDivider />
      </div>

      {/* Main Grid: Editorial Magazine Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {journalArticles.map((article) => (
          <motion.article 
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group flex flex-col h-full bg-brand-beige/10 border border-brand-clay/10 p-5 rounded-2xl hover:border-brand-terracotta/30 transition-colors duration-500 hover:shadow-lg"
          >
            {/* Visual Thumbnail */}
            <div className="relative overflow-hidden aspect-[16/10] bg-brand-beige/35 rounded-xl border border-brand-clay/10 mb-5">
              <img
                src={article.image}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 bg-brand-bg/95 border border-brand-clay/20 px-2.5 py-1 text-[9px] font-semibold tracking-wider uppercase text-brand-charcoal rounded">
                {article.category}
              </span>
            </div>

            {/* Contents */}
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center text-[10px] text-brand-olive font-medium tracking-wide mb-2">
                <span>{article.date}</span>
                <span>• {article.readTime}</span>
              </div>

              <h2 className="font-serif text-lg sm:text-xl font-semibold text-brand-charcoal group-hover:text-brand-terracotta cursor-pointer transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h2>
              
              <p className="font-serif text-xs italic text-brand-clay font-normal mt-0.5 mb-3">
                {article.banglaTitle}
              </p>

              <p className="text-xs text-brand-charcoal/70 leading-relaxed text-justify-custom line-clamp-3 mb-6 font-sans">
                {article.excerpt}
              </p>

              <button
                id={`read-article-${article.id}`}
                onClick={() => setSelectedArticle(article)}
                className="mt-auto flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal group-hover:text-brand-terracotta transition-colors text-left"
              >
                <span>Read Document</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Dynamic Journal Article Reading Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
              onClick={() => setSelectedArticle(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-brand-bg max-w-2xl w-full p-6 sm:p-10 rounded-2xl overflow-y-auto max-h-[85vh] z-10 shadow-2xl border border-brand-clay/20 font-sans"
            >
              <button
                id="close-journal-modal"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige text-brand-charcoal transition-colors shadow-sm bg-brand-bg/95 border border-brand-clay/20"
                aria-label="Close modal dialog"
              >
                <XIcon className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-brand-olive text-xs font-semibold uppercase tracking-wider mb-2">
                <span>{selectedArticle.category}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-brand-charcoal leading-tight">
                {selectedArticle.title}
              </h2>
              
              <p className="font-serif text-base italic text-brand-terracotta mt-1.5 mb-6">
                {selectedArticle.banglaTitle}
              </p>

              {/* Large Image illustration inside modal */}
              <div className="relative overflow-hidden aspect-[16/9] rounded-xl border border-brand-clay/10 bg-brand-beige/40 mb-6 shadow-inner">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Multi-paragraph content */}
              <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed text-justify-custom font-sans">
                {selectedArticle.content.map((para, idx) => (
                  <p key={idx} className="indent-4">{para}</p>
                ))}
              </div>

              <div className="border-t border-brand-clay/15 mt-8 pt-4 flex justify-between items-center text-xs text-brand-clay">
                <span>By: <strong>{selectedArticle.author}</strong></span>
                <span className="font-mono text-[10px]">Rang Digital Archives / 2026</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M13.5 4.5l-9 9M4.5 4.5l9 9" />
  </svg>
);


// ==========================================
// CONTACT VIEW (Posters and form)
// ==========================================
export const ContactView: React.FC = () => {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [sentSuccess, setSentSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert('Kindly fill in the required fields with accurate information.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSentSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans text-brand-charcoal"
      id="contact-view-container"
    >
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-sans font-bold tracking-widest text-brand-olive uppercase">Establish Connection</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-brand-charcoal tracking-tight mt-1">
          Keep in Touch
        </h1>
        <p className="text-xs sm:text-sm text-brand-clay uppercase tracking-widest mt-1">We welcome curators, inquiries, and artistic commissions</p>
        <OrganicDivider />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
        
        {/* Left column: coordinates and map placeholder */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold mb-4 text-brand-charcoal">The Rang Atelier</h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed text-justify-custom">
              Our principal workshop, curing chamber, and design archive is based in Dhaka. Visits by design curators and collectors are welcomed exclusively by pre-notified private appointments.
            </p>
          </div>

          <div className="space-y-4 border-l-2 border-brand-terracotta pl-4">
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-terracotta mt-0.5 flex-shrink-0 stroke-[1.25]" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold block text-brand-charcoal">Studio Location</span>
                <span className="text-brand-charcoal/70">Gulshan-2, Road 44, Building 5A, Dhaka 1212, Bangladesh</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-olive mt-0.5 flex-shrink-0 stroke-[1.25]" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold block text-brand-charcoal">General Dialog</span>
                <a href="mailto:dialog@rangheritage.com" className="hover:text-brand-terracotta transition-colors">dialog@rangheritage.com</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-clay mt-0.5 flex-shrink-0 stroke-[1.25]" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold block text-brand-charcoal">Secure Wire</span>
                <span className="text-brand-charcoal/70">+880 2 8812345 (Corporate)</span>
              </div>
            </div>

          </div>

          {/* Handdrawn Map style placeholder */}
          <div className="border border-brand-clay/35 rounded-2xl bg-brand-beige/25 p-6 h-64 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
              {/* Giant pottery decorative element in coordinates bg */}
              <PotteryOrnament size={160} />
            </div>
            
            <div>
              <span className="text-[9px] uppercase tracking-wider text-brand-olive font-bold">Cartographic Coordinates</span>
              <h3 className="font-serif text-lg font-medium text-brand-charcoal">Shitalakshya River Map</h3>
            </div>

            {/* Custom stylized vector landscape map */}
            <svg className="w-full h-32 text-brand-clay/40" viewBox="0 0 300 100" fill="none" stroke="currentColor">
              {/* Rivers flowing elegantly */}
              <path d="M 0,20 C 50,22 100,50 150,45 C 200,40 250,80 300,75" strokeWidth="2.5" strokeDasharray="3 3" />
              <path d="M 0,45 C 70,40 120,70 180,60 C 240,50 280,95 300,90" strokeWidth="1.5" className="opacity-60" />
              {/* Star symbol for Gulshan */}
              <g transform="translate(160, 52)">
                <circle cx="0" cy="0" r="4" fill="#C46E4E" stroke="#F7F2EA" strokeWidth="1" />
                <text x="8" y="3" fontSize="8" fontFamily="var(--font-sans)" fontWeight="bold" fill="#2D2A26" className="tracking-widest">GULSHAN STUDIO</text>
              </g>
              {/* Star symbol for Sonargaon */}
              <g transform="translate(240, 78)">
                <circle cx="0" cy="0" r="4" fill="#6A7450" stroke="#F7F2EA" strokeWidth="1" />
                <text x="8" y="3" fontSize="8" fontFamily="var(--font-sans)" fill="#2D2A26" className="opacity-70">SONARGAON LOOMS</text>
              </g>
            </svg>

            <span className="text-[10px] text-brand-clay/90 tracking-wide block font-mono">23.7925° N, 90.4078° E</span>
          </div>

        </div>

        {/* Right column: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="bg-brand-beige/20 border border-brand-clay/20 p-6 sm:p-10 rounded-2xl relative">
            <CornerOrnament position="top-right" />
            <CornerOrnament position="bottom-left" />

            <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-6 text-brand-charcoal">Curation Inquiry</h3>
            
            {sentSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-olive/15 text-brand-olive">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-medium text-brand-charcoal">Transmission Successful</h4>
                <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed max-w-sm mx-auto">
                  Your inquiry has been successfully dispatched to our digital heritage archive. Our communications assistant will reach out to you within forty-eight hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSentSuccess(false)}
                  className="bg-brand-charcoal hover:bg-brand-olive text-brand-bg px-6 py-2 rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors"
                >
                  New Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Your True Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-brand-bg border border-brand-clay/40 rounded-lg px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta"
                    placeholder="Nilufer Begum"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Email coordinates *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-brand-bg border border-brand-clay/40 rounded-lg px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta"
                    placeholder="nilufer@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Subject of Commission (Optional)
                  </label>
                  <input
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full bg-brand-bg border border-brand-clay/40 rounded-lg px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta"
                    placeholder="Custom Hand-Painted Saree Commission"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
                    Your Inscribed Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-brand-bg border border-brand-clay/40 rounded-lg px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta resize-none"
                    placeholder="Share detail specifications or questions about custom hand-molded vessels here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Transmitting Inscription...' : 'Dispatch Message'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </motion.div>
  );
};
