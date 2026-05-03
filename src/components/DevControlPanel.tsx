import { Settings, X, ChevronRight } from 'lucide-react';
import { useElectionPhase } from '../context/ElectionPhaseContext';
import { PhaseType } from '../types';

export function DevControlPanel() {
  const { 
    currentPhase, 
    setPhase, 
    announcementStep, 
    setAnnouncementStep,
    isDevPanelOpen,
    setIsDevPanelOpen
  } = useElectionPhase();

  const phases: { id: PhaseType; label: string }[] = [
    { id: 'registration', label: 'Registration' },
    { id: 'announcement', label: 'Announcement' },
    { id: 'campaign', label: 'Campaign' },
    { id: 'voting', label: 'Voting' },
    { id: 'results', label: 'Results' }
  ];

  return (
    <>
      {/* Panel */}
      <div className={`fixed right-0 top-0 bottom-0 w-80 bg-[#1A1A17] text-white p-6 shadow-2xl z-[150] transition-transform duration-300 overflow-y-auto ${isDevPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D97706]" />
            <h2 className="font-bold text-lg uppercase tracking-wider text-white">Dev Control Panel</h2>
          </div>
          <button 
            onClick={() => setIsDevPanelOpen(false)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
            title="Close Panel"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Phase Switcher */}
          <div>
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Election Phase</h3>
            <div className="space-y-2">
              {phases.map(phase => (
                <button
                  key={phase.id}
                  onClick={() => setPhase(phase.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentPhase === phase.id ? 'bg-[#D97706] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                >
                  {phase.label}
                  {currentPhase === phase.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Announcement Controls */}
          {currentPhase === 'announcement' && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Announcement Step</h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setAnnouncementStep(Math.max(1, announcementStep - 1))}
                  className="px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold">
                  Step {announcementStep}
                </div>
                <button 
                  onClick={() => setAnnouncementStep(Math.min(5, announcementStep + 1))}
                  className="px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-white/40 text-center mt-3">Controls staggered candidate reveals</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop */}
      {isDevPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[140]" 
          onClick={() => setIsDevPanelOpen(false)}
        />
      )}
    </>
  );
}
