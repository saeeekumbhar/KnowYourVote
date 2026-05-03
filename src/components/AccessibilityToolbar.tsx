import { Settings, Type, Eye, VolumeX, Minus, Plus } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AccessibilityToolbar() {
  const { fontSize, setFontSize, isHighContrast, toggleHighContrast, isSpeaking, stopSpeaking } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all ${isOpen ? 'bg-[#1A1A17] text-white rotate-90' : 'bg-[#F9F8F6] text-[#706F66] border border-[#E6E4DF] hover:bg-[#E6E4DF] hover:text-[#5A5A40]'}`}
        title="Accessibility Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 bg-white p-5 rounded-2xl shadow-2xl border border-[#E6E4DF] w-[280px] space-y-6 z-[100] text-[16px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#706F66] flex items-center gap-2">
                  <Type className="w-4 h-4" /> Text Size
                </span>
                <span className="text-xs font-bold text-[#5A5A40] bg-[#F9F8F6] px-2 py-1 rounded-md">{Math.round(fontSize * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setFontSize(Math.max(0.8, fontSize - 0.1))}
                  className="w-10 h-10 rounded-xl border border-[#E6E4DF] flex items-center justify-center hover:bg-[#F9F8F6] transition-colors active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 h-1.5 bg-[#EFECE8] rounded-full relative">
                  <div className="absolute left-0 top-0 h-full bg-[#5A5A40] rounded-full transition-all duration-300" style={{ width: `${((fontSize - 0.8) / 0.7) * 100}%` }}></div>
                </div>
                <button 
                  onClick={() => setFontSize(Math.min(1.5, fontSize + 0.1))}
                  className="w-10 h-10 rounded-xl border border-[#E6E4DF] flex items-center justify-center hover:bg-[#F9F8F6] transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EFECE8]">
              <button 
                onClick={toggleHighContrast}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${isHighContrast ? 'bg-[#5A5A40] text-white border-transparent' : 'bg-white text-[#1A1A17] border-[#E6E4DF] hover:bg-[#F9F8F6]'}`}
              >
                <span className="text-sm font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4" /> High Contrast
                </span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${isHighContrast ? 'bg-white/20' : 'bg-[#EFECE8]'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${isHighContrast ? 'right-1 bg-white' : 'left-1 bg-[#8B8982]'}`}></div>
                </div>
              </button>
            </div>

            {isSpeaking && (
              <div className="pt-4 border-t border-[#EFECE8]">
                <button 
                  onClick={stopSpeaking}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-sm hover:bg-red-100 transition-colors"
                >
                  <VolumeX className="w-4 h-4" /> Stop Audio
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
