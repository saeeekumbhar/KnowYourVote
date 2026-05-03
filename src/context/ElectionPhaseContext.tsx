import React, { createContext, useContext, useState, useEffect } from 'react';
import { PhaseType } from '../types';
import phaseData from '../data/election_phase.json';

interface ElectionPhaseContextType {
  currentPhase: PhaseType;
  setPhase: (phase: PhaseType) => void;
  announcementStep: number;
  setAnnouncementStep: (step: number) => void;
  isDevPanelOpen: boolean;
  setIsDevPanelOpen: (isOpen: boolean) => void;
}

const ElectionPhaseContext = createContext<ElectionPhaseContextType | undefined>(undefined);

export function ElectionPhaseProvider({ children }: { children: React.ReactNode }) {
  const [currentPhase, setPhase] = useState<PhaseType>(phaseData.current_phase as PhaseType || 'campaign');
  const [announcementStep, setAnnouncementStep] = useState(1);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);

  return (
    <ElectionPhaseContext.Provider value={{ 
      currentPhase, 
      setPhase, 
      announcementStep, 
      setAnnouncementStep,
      isDevPanelOpen,
      setIsDevPanelOpen
    }}>
      {children}
    </ElectionPhaseContext.Provider>
  );
}

export function useElectionPhase() {
  const context = useContext(ElectionPhaseContext);
  if (context === undefined) {
    throw new Error('useElectionPhase must be used within an ElectionPhaseProvider');
  }
  return context;
}
