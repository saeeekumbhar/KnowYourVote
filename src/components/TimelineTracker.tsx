import { TimelinePhase } from '../types';
import { cn } from '../lib/utils';

interface TimelineTrackerProps {
  timeline: TimelinePhase[];
  currentPhaseId: string;
  isRegistered: boolean;
  setIsRegistered: (val: boolean) => void;
}

export function TimelineTracker({ timeline, currentPhaseId, isRegistered, setIsRegistered }: TimelineTrackerProps) {

  return (
    <div className="w-full bg-white border border-[#E6E4DF] rounded-2xl p-6 shadow-sm mb-8">
      <div className="relative">
        <div className="absolute top-5 left-4 right-4 h-0.5 bg-[#E6E4DF] hidden sm:block z-0" aria-hidden="true" />
        <div className="absolute top-5 left-4 h-0.5 bg-[#5A5A40] hidden sm:block z-0 transition-all duration-500 ease-in-out" style={{ width: `${Math.max(0, (timeline.findIndex(p => p.id === currentPhaseId) / (timeline.length - 1)) * 100)}%` }} aria-hidden="true" />

        <ul className="relative flex flex-col sm:flex-row justify-between w-full space-y-6 sm:space-y-0 z-10">
          {timeline.map((phase, index) => {
            let status = phase.status;
            if (phase.id === 'registration' && isRegistered) {
                status = 'completed';
            }

            const isCompleted = status === 'completed';
            const isActive = phase.id === currentPhaseId || status === 'active';

            return (
              <li 
                key={phase.id} 
                className={cn(
                  "relative flex flex-row sm:flex-col items-center gap-4 sm:gap-2 sm:flex-1 bg-white px-2 group cursor-pointer transition-all",
                  isActive && "scale-105"
                )}
                title={`${phase.name} - ${status}`}
              >
                 
                 {/* Mobile connecting line */}
                 {index !== timeline.length -1 && (
                     <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-[#E6E4DF] sm:hidden z-0 transition-colors group-hover:bg-[#5A5A40]/30" />
                 )}

                <div className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full bg-white shrink-0 z-10 text-xs font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
                  isCompleted ? "bg-[#5A5A40] text-white" :
                  isActive ? "border-4 border-[#5A5A40] text-[#1A1A17]" : "border-2 border-[#E6E4DF] text-[#706F66] opacity-40 group-hover:opacity-100 group-hover:border-[#5A5A40]/50"
                )}>
                  {isCompleted ? "✓" : index + 1}
                </div>
                
                <div className="flex flex-col items-start sm:items-center text-left sm:text-center mt-1 sm:mt-0 bg-white">
                    <span className={cn(
                        "text-[10px] font-bold uppercase",
                        isActive ? "text-[#5A5A40]" : (isCompleted ? "text-[#1A1A17]" : "text-[#706F66] opacity-40")
                    )}>
                    {phase.name}
                    </span>

                    {/* Show date */}
                    {phase.date && (
                      <span className={cn(
                        "text-[10px] mt-0.5",
                        isCompleted || isActive ? "text-[#706F66]" : "text-[#A8A29E] opacity-40"
                      )}>
                        {phase.date}
                      </span>
                    )}

                    {phase.id === 'registration' && (
                       <button 
                         type="button"
                         onClick={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             setIsRegistered(!isRegistered);
                         }}
                         className="mt-1 text-xs text-[#5A5A40] hover:text-[#33332D] underline underline-offset-2 relative z-20 pointer-events-auto"
                        >
                           {isRegistered ? "Unmark as done" : "Mark as done"}
                       </button>
                    )}
                </div>

              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
