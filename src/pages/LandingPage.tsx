import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { StatusCard } from '../components/StatusCard';
import { NationalSnapshot } from '../components/NationalSnapshot';
import { HowItWorks } from '../components/HowItWorks';
import { TimelinePreview } from '../components/TimelinePreview';
import { FeatureCards } from '../components/FeatureCards';
import { Footer } from '../components/Footer';
import { AssistantOverlay } from '../components/assistant/AssistantOverlay';
import { getElectionStatus } from '../services/api';
import { ElectionStatus } from '../types';

import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [status, setStatus] = useState<ElectionStatus | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    getElectionStatus().then(setStatus);
  }, []);

  const scrollToSearch = () => {
    const input = document.getElementById('search-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectConstituency = (id: string) => {
    setIsAssistantActive(false);
    navigate(`/constituency/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AssistantOverlay 
        isActive={isAssistantActive}
        onClose={() => setIsAssistantActive(false)}
        constituency={null}
        status={status}
        isRegistered={isRegistered}
        hasVoted={hasVoted}
        setHasVoted={setHasVoted}
        onSelectConstituency={handleSelectConstituency}
      />

      <HeroSection onStartAssistant={() => setIsAssistantActive(true)} />
      <StatusCard />
      <NationalSnapshot />
      <HowItWorks />
      <TimelinePreview />
      <FeatureCards />
      
      {/* Final CTA Section */}
      <section className="py-24 bg-[#EFECE8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#1A1A17] mb-8">
            Ready to understand your vote?
          </h2>
          <motion.button 
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToSearch}
            className="inline-flex items-center justify-center px-8 py-4 bg-[#5A5A40] text-white rounded-full font-bold text-lg hover:bg-[#4A4A30] transition-colors shadow-lg hover:shadow-xl"
          >
            Check Your Constituency
          </motion.button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
