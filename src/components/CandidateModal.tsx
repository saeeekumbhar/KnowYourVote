import { Candidate, CandidateHistoryRole } from '../types';
import { X, GraduationCap, Calendar, History } from 'lucide-react';
import { useEffect } from 'react';

interface CandidateModalProps {
  candidate: Candidate | null;
  history: CandidateHistoryRole[];
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateModal({ candidate, history, isOpen, onClose }: CandidateModalProps) {
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-24 sm:pt-28" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[60] border border-[#E6E4DF] animate-fade-in-up">
        {/* Close Button - Floats over content for better visibility */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-[70] p-2 bg-white/80 backdrop-blur-md text-[#1A1A17] hover:bg-red-50 hover:text-red-600 rounded-full transition-all shadow-md border border-[#E6E4DF] active:scale-90"
          title="Close Details"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#F5F2ED] rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#E6E4DF] shadow-sm">
               <img 
                   src={candidate.photo} 
                   alt={candidate.name} 
                   className="w-full h-full object-cover"
               />
            </div>
            <div className="flex-1 space-y-1">
                <h3 className="text-3xl font-black text-[#1A1A17] tracking-tight font-outfit">{candidate.name}</h3>
                <p className="text-lg font-bold text-[#5A5A40] flex items-center justify-center sm:justify-start gap-2">
                  {candidate.party}
                  <span className="w-1 h-1 bg-[#A3A199] rounded-full"></span>
                  <span className="text-sm font-medium text-[#706F66]">Candidate for {candidate.constituency_id.replace('_ls', '').toUpperCase()}</span>
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center sm:justify-start mt-4 text-sm">
                     {candidate.age && (
                       <div className="flex items-center gap-1.5 bg-[#F9F8F6] border border-[#E6E4DF] px-3 py-1.5 rounded-xl text-[#33332D] shadow-sm">
                          <Calendar className="w-4 h-4 text-[#D97706]" />
                          <span className="font-bold">Age: {candidate.age}</span>
                       </div>
                     )}
                     {candidate.education && (
                       <div className="flex items-center gap-1.5 bg-[#F9F8F6] border border-[#E6E4DF] px-3 py-1.5 rounded-xl text-[#33332D] shadow-sm">
                          <GraduationCap className="w-4 h-4 text-[#D97706]" />
                          <span className="font-bold">{candidate.education}</span>
                       </div>
                     )}
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             <div className="bg-[#FEF3C7]/40 p-4 rounded-2xl border border-[#F59E0B]/10">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-[#92400E] mb-1">Political Affiliation</span>
                  <p className="text-[#33332D] font-bold">Previously: {candidate.pastParty || 'Always with current party'}</p>
             </div>
             <div className="bg-[#F9F8F6] p-4 rounded-2xl border border-[#E6E4DF]">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-[#706F66] mb-1">Local Context</span>
                  <p className="text-[#33332D] font-bold">Resides in {candidate.residence || candidate.hometown}</p>
             </div>
          </div>

          <div>
             <h4 className="flex items-center gap-2 text-xl font-bold text-[#1A1A17] mb-6 pb-2 border-b border-[#E6E4DF] font-outfit">
                <History className="w-5 h-5 text-[#5A5A40]" />
                Career & Experience
             </h4>
             
             {history.length > 0 ? (
                  <div className="space-y-6 pl-2 border-l-2 border-[#EFECE8] ml-2">
                     {history.map((item, index) => (
                         <div key={index} className="relative pl-6">
                             <div className="absolute w-3 h-3 bg-white border-2 border-[#5A5A40] rounded-full -left-[7px] top-1.5" />
                             <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-[#5A5A40] text-white mb-1 border border-[#5A5A40]">
                                 {item.year}
                             </span>
                             <h5 className="font-bold text-[#1A1A17] mb-1">{item.role}</h5>
                             <p className="text-sm text-[#706F66] leading-relaxed">{item.description}</p>
                         </div>
                     ))}
                  </div>
             ) : (candidate.pastPositions || candidate.experience) ? (
                  <div className="grid grid-cols-1 gap-3">
                    {(candidate.pastPositions || [candidate.experience]).map((pos, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-[#E6E4DF] rounded-xl shadow-sm">
                        <div className="w-8 h-8 bg-[#F5F2ED] rounded-lg flex items-center justify-center text-[#5A5A40]">
                          <span className="font-bold text-xs">{idx + 1}</span>
                        </div>
                        <span className="text-sm font-bold text-[#33332D]">{pos}</span>
                      </div>
                    ))}
                  </div>
             ) : (
                  <p className="text-sm text-[#8B8982] italic py-4 text-center bg-[#F9F8F6] rounded-xl border border-dashed border-[#CBC8BE]">
                    Detailed career history is being updated for the 2024 simulation.
                  </p>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
