import { Check } from 'lucide-react';
import electionData from '../data/election_status.json';
import { useElectionPhase } from '../context/ElectionPhaseContext';

export function TimelinePreview() {
  const { currentPhase } = useElectionPhase();
  
  // Map context phase IDs to timeline IDs
  const phaseMap: Record<string, string> = {
    'registration': 'register',
    'announcement': 'announced',
    'campaign': 'campaign',
    'voting': 'vote',
    'results': 'results'
  };

  const currentPhaseId = phaseMap[currentPhase] || 'campaign';
  
  return (
    <section className="py-20 bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A1A17] mb-4">
            Understand where we are
          </h2>
          <p className="text-[#706F66] text-lg">
            Follow the election process from start to finish.
          </p>
        </div>
 
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E6E4DF] -translate-y-1/2 hidden sm:block"></div>
          <div className="grid sm:grid-cols-5 gap-8 sm:gap-4 relative">
            {electionData.timeline.map((phase, index) => {
              const phases = ['register', 'announced', 'campaign', 'vote', 'results'];
              const currentIndex = phases.indexOf(currentPhaseId);
              const thisIndex = phases.indexOf(phase.id);
              
              const isPast = thisIndex < currentIndex;
              const isActive = phase.id === currentPhaseId;
              
              return (
                <div key={phase.id} className="relative flex sm:flex-col items-center gap-4 sm:gap-3 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-[#F9F8F6] relative z-10 transition-colors ${
                    isActive ? 'bg-[#D97706] text-white shadow-md' :
                    isPast ? 'bg-[#5A5A40] text-white' :
                    'bg-[#E6E4DF] text-[#A3A199]'
                  }`}>
                    {isPast ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                  </div>
                  <div className="sm:absolute sm:top-14 sm:left-1/2 sm:-translate-x-1/2 w-32">
                    <p className={`font-medium text-sm ${isActive ? 'text-[#1A1A17]' : 'text-[#706F66]'}`}>
                      {phase.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
