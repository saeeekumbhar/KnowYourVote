import { ArrowRight, PlayCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConstituencySelector } from './ConstituencySelector';
import { MaharashtraMap } from './MaharashtraMap';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onStartAssistant?: () => void;
}

export function HeroSection({ onStartAssistant }: HeroSectionProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [highlightedMapId, setHighlightedMapId] = useState<string | null>(null);

  const handleSelect = (id: string, assistant?: boolean) => {
    if (assistant && onStartAssistant) {
      onStartAssistant();
      return;
    }
    navigate(`/constituency/${id}`);
  };

  const scrollToSearch = () => {
    const input = document.getElementById('search-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 500);
    }
  };

  return (
    <section className="relative pt-20 pb-32 overflow-visible z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Side (Content) */}
          <div className="max-w-2xl relative z-50">
            <h1 className="text-5xl sm:text-7xl font-bold text-[#1A1A17] tracking-tight mb-6 leading-tight">
              Know Your Vote
            </h1>
            <p className="text-2xl text-[#706F66] mb-8 font-light leading-relaxed">
              Understand your vote, your constituency, and your role in democracy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <motion.button 
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToSearch}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-colors shadow-lg hover:shadow-xl"
              >
                Check Your Constituency
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartAssistant ? onStartAssistant() : navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#5A5A40] border border-[#E6E4DF] rounded-full font-medium hover:bg-[#F9F8F6] transition-colors shadow-md hover:shadow-lg"
              >
                <PlayCircle className="w-5 h-5" />
                Start Guided Experience
              </motion.button>
            </div>

            {/* NEW Constituency Selector */}
            <div className="relative z-50">
              <ConstituencySelector 
                onSelect={(id) => handleSelect(id)} 
                onHighlight={setHighlightedMapId} 
              />
            </div>
          </div>

          {/* Right Side (Interactive Leaflet Map) */}
          <div className="relative hidden lg:block w-full">
            <div className="w-full animate-fade-in-up">
              <MaharashtraMap 
                selectedId={highlightedMapId} 
                onSelect={(id) => handleSelect(id)} 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
