import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AccessibilityContextType {
  fontSize: number; // 1 = 100%, 1.2 = 120%, etc.
  isHighContrast: boolean;
  setFontSize: (size: number) => void;
  toggleHighContrast: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(1);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const toggleHighContrast = () => setIsHighContrast(prev => !prev);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a better voice
    // Try to find a premium/natural sounding English voice
    const preferredVoice = voices.find(v => 
      (v.name.includes('Google') && v.lang.startsWith('en')) || 
      (v.name.includes('Premium') && v.lang.startsWith('en')) ||
      (v.name.includes('Natural') && v.lang.startsWith('en')) ||
      (v.name.includes('Samantha') && v.lang.startsWith('en')) ||
      (v.name.includes('Daniel') && v.lang.startsWith('en'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.95; // Slightly faster but still clear
    utterance.pitch = 1.05; // Slightly higher pitch for a more friendly, less robotic feel
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${fontSize * 16}px`;
    
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [fontSize, isHighContrast]);

  return (
    <AccessibilityContext.Provider value={{ 
      fontSize, 
      isHighContrast, 
      setFontSize, 
      toggleHighContrast, 
      speak, 
      stopSpeaking,
      isSpeaking 
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
