import { Candidate } from '../types';
import { User, Trophy, MapPin, History, Briefcase } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: (candidate: Candidate) => void | Promise<void>;
  showVotes?: boolean;
}

export function CandidateCard({ candidate, onClick, showVotes }: CandidateCardProps) {
  const photoSrc = candidate.photo;
  const isWinner = showVotes && candidate.status === 'Won';

  return (
    <div 
        className={`group bg-white border p-5 rounded-3xl flex flex-col sm:flex-row gap-5 items-start shadow-sm cursor-pointer hover:shadow-xl hover:border-[#5A5A40]/30 transition-all duration-300 relative overflow-hidden h-full ${isWinner ? 'border-[#D97706] ring-1 ring-[#D97706]/20 bg-[#FFFCF5]' : 'border-[#E6E4DF]'}`}
        onClick={() => onClick(candidate)}
    >
      {/* Left Section: Photo & Party */}
      <div className="flex flex-col gap-3 w-full sm:w-32 flex-shrink-0">
        <div className="w-full h-40 sm:h-auto aspect-[3/4] bg-[#F5F2ED] rounded-2xl flex items-center justify-center overflow-hidden border border-[#E6E4DF] relative">
            {photoSrc ? (
              <img src={photoSrc} alt={candidate.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <User className="w-16 h-16 text-[#A8A29E]" />
            )}

            {isWinner && (
              <div className="absolute top-2 right-2 bg-[#D97706] text-white p-1.5 rounded-full shadow-lg border border-white/20">
                <Trophy className="w-4 h-4" />
              </div>
            )}
        </div>

        {/* Party Badge below photo */}
        <div className="px-3 py-1.5 bg-[#F5F2ED] rounded-xl border border-[#E6E4DF] flex items-center justify-center text-center">
          <span className="text-[10px] font-black text-[#5A5A40] uppercase tracking-widest">{candidate.party}</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-bold text-[#1A1A17] leading-tight group-hover:text-[#5A5A40] transition-colors">{candidate.name}</h3>
          {isWinner && (
            <span className="text-[10px] font-black bg-[#D97706] text-white px-2 py-0.5 rounded-md tracking-widest">ELECTED</span>
          )}
        </div>

        <div className="space-y-3 mt-2 flex-1">
          {/* Residence */}
          <div className="flex items-center gap-2 text-xs text-[#706F66]">
            <MapPin className="w-3.5 h-3.5 text-[#A3A199]" />
            <span className="truncate">Lives in <span className="font-bold text-[#33332D]">{candidate.residence || candidate.hometown}</span></span>
          </div>

          {/* Past Positions */}
          <div className="flex items-start gap-2 text-xs text-[#706F66]">
            <Briefcase className="w-3.5 h-3.5 text-[#A3A199] mt-0.5 shrink-0" />
            <div className="line-clamp-2">
              <span className="font-bold text-[#33332D]">
                {candidate.pastPositions?.join(', ') || candidate.experience}
              </span>
            </div>
          </div>

          {/* Past Party */}
          {candidate.pastParty && (
            <div className="flex items-center gap-2 text-[10px] text-[#92400E] bg-[#FEF3C7]/50 px-2 py-1 rounded-lg border border-[#F59E0B]/10 w-fit">
              <History className="w-3 h-3" />
              <span>Previously with <span className="font-bold">{candidate.pastParty}</span></span>
            </div>
          )}
        </div>

        {/* Votes / Action */}
        <div className="mt-4 flex items-center justify-between gap-4">
           {showVotes && candidate.votes !== undefined ? (
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-[#8B8982] uppercase tracking-tighter">Total Votes</span>
               <span className="text-lg font-black text-[#D97706] leading-none">{candidate.votes.toLocaleString()}</span>
             </div>
           ) : (
             <div className="h-4" /> 
           )}
           
           <button className="text-xs font-bold text-[#5A5A40] bg-[#F5F2ED] px-4 py-2 rounded-xl hover:bg-[#EFECE8] transition-colors border border-[#E6E4DF]">
              Detailed Profile
           </button>
        </div>
      </div>
    </div>
  );
}
