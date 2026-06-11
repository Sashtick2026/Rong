import React, { useState, useEffect } from 'react';
import { 
  Settings, Image as ImageIcon, RotateCcw, Save, Sparkles, CheckSquare, Grid, Eye
} from 'lucide-react';
import { firestore, PuzzlePieces } from '../lib/mockFirebase';
import { CornerOrnament } from './Ornaments';

// Unsplash premium defaults for recovery
const defaultSet = {
  piece1Url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200', // Loom / Pink silk detail
  piece2Url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200', // Traditional Clay
  piece3Url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200', // Antique brass work
  piece4Url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200', // Color palette brushstroke
};

export const PuzzleManagementPanel: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePieces | null>(null);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [p4, setP4] = useState('');

  const loadPieces = () => {
    const data = firestore.getPuzzlePieces();
    setPieces(data);
    setP1(data.piece1Url);
    setP2(data.piece2Url);
    setP3(data.piece3Url);
    setP4(data.piece4Url);
  };

  useEffect(() => {
    loadPieces();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1.trim() || !p2.trim() || !p3.trim() || !p4.trim()) {
      alert('Please guarantee all four segments have specified image coordinates.');
      return;
    }

    const payload: PuzzlePieces = {
      piece1Url: p1.trim(),
      piece2Url: p2.trim(),
      piece3Url: p3.trim(),
      piece4Url: p4.trim()
    };

    firestore.savePuzzlePieces(payload);
    setPieces(payload);
    alert('Dynamic puzzle asset matrices compiled and updated successfully!');
  };

  const handleResetToDefaults = () => {
    if (confirm('Revert all four puzzle assets to their classic curated default illustrations?')) {
      setP1(defaultSet.piece1Url);
      setP2(defaultSet.piece2Url);
      setP3(defaultSet.piece3Url);
      setP4(defaultSet.piece4Url);

      const payload = { ...defaultSet };
      firestore.savePuzzlePieces(payload);
      setPieces(payload);
      alert('Artisan defaults restored.');
    }
  };

  if (!pieces) return null;

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-clay/15 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-charcoal flex items-center gap-2">
            <Grid className="w-6 h-6 text-brand-terracotta" />
            <span>Artisan Puzzle Assets Desk</span>
          </h2>
          <p className="text-xs text-brand-clay mt-1">
            Reprovision high-fidelity photographic textures dynamically displayed within the converging logo mosaic on the homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToDefaults}
          className="flex items-center gap-1 px-3 py-1.5 border border-brand-clay/35 rounded-lg text-xs font-semibold text-brand-clay hover:text-brand-charcoal transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Museum Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT URL CHANNELS */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-brand-clay/10 relative overflow-hidden h-fit">
          <CornerOrnament position="top-right" />
          
          <h3 className="font-serif text-base font-semibold text-brand-charcoal border-b border-brand-clay/10 pb-2 mb-4 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-brand-terracotta" />
            <span>Segment Coordinate Links</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs text-left">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">
                Loom Segment URL (Top-Left)
              </label>
              <input 
                type="text" 
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2 font-mono text-[11px]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">
                Terracotta Clay URL (Top-Right)
              </label>
              <input 
                type="text" 
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2 font-mono text-[11px]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">
                Antique Brass URL (Bottom-Left)
              </label>
              <input 
                type="text" 
                value={p3}
                onChange={(e) => setP3(e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2 font-mono text-[11px]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-brand-clay mb-1">
                Brushstroke Accent URL (Bottom-Right)
              </label>
              <input 
                type="text" 
                value={p4}
                onChange={(e) => setP4(e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/35 rounded-lg p-2 font-mono text-[11px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-charcoal text-[#ECE7E1] font-bold tracking-widest uppercase py-3 rounded-lg text-xs hover:bg-brand-olive transition-colors flex items-center justify-center gap-1.5 shadow-md mt-6"
            >
              <Save className="w-3.5 h-3.5 text-brand-terracotta" />
              <span>Publish Assets Deck</span>
            </button>
          </form>
        </div>

        {/* REAL-TIME MOSAIC PREVIEW */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-brand-charcoal text-[#ECE7E1] px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand-terracotta animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold">Converged Mosaic Preview Board</span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-[#B8A189] uppercase">HOMEPAGE SEC. 3</span>
          </div>

          <div className="bg-[#1D1917] p-8 sm:p-12 rounded-3xl flex items-center justify-center relative shadow-inner select-none h-fit">
            
            {/* Center concentric target circle backdrop */}
            <div className="absolute w-56 h-56 rounded-full border border-[#B8A189]/10 flex items-center justify-center pointer-events-none">
              <div className="w-36 h-36 rounded-full border border-dashed border-[#B8A189]/5" />
            </div>

            {/* Grid assembly simulating the converged homepage state */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 grid grid-cols-2 gap-4">
              
              {/* Segment 1 */}
              <div className="relative overflow-hidden rounded-2xl border border-[#ECE7E1]/10 bg-brand-charcoal group">
                <img src={p1} alt="Loom Segment" className="w-full h-full object-cover transition-transform duration-500 scale-100 hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-mono uppercase">Top-Left</div>
              </div>

              {/* Segment 2 */}
              <div className="relative overflow-hidden rounded-2xl border border-[#ECE7E1]/10 bg-brand-charcoal group">
                <img src={p2} alt="Clay Segment" className="w-full h-full object-cover transition-transform duration-500 scale-100 hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-mono uppercase">Top-Right</div>
              </div>

              {/* Segment 3 */}
              <div className="relative overflow-hidden rounded-2xl border border-[#ECE7E1]/10 bg-brand-charcoal group">
                <img src={p3} alt="Brass Segment" className="w-full h-full object-cover transition-transform duration-500 scale-100 hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-mono uppercase">Bottom-Left</div>
              </div>

              {/* Segment 4 */}
              <div className="relative overflow-hidden rounded-2xl border border-[#ECE7E1]/10 bg-brand-charcoal group">
                <img src={p4} alt="Brush Segment" className="w-full h-full object-cover transition-transform duration-500 scale-100 hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-mono uppercase">Bottom-Right</div>
              </div>

              {/* Center overlapping absolute logo mark mock representation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-brand-charcoal border border-brand-terracotta flex items-center justify-center shadow-2xl z-10">
                <span className="font-serif font-bold text-lg text-brand-terracotta">রঙ</span>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
