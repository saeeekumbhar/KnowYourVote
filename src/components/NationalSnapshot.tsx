import { useEffect, useState } from 'react';
import { getNationalOverview } from '../services/api';
import { NationalOverview } from '../types';
import { Info, TrendingUp, Lock } from 'lucide-react';
import { useElectionPhase } from '../context/ElectionPhaseContext';

// Assistant Components
import { HighlightWrapper } from './assistant/HighlightWrapper';

export function NationalSnapshot() {
  const [data, setData] = useState<NationalOverview | null>(null);
  const { currentPhase } = useElectionPhase();

  useEffect(() => {
    getNationalOverview().then(setData);
  }, []);

  if (!data) return null;

  const showResults = currentPhase === 'results';

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HighlightWrapper id="national-snapshot" isActive={false}>
          <div className="bg-[#F9F8F6] rounded-3xl p-8 sm:p-12 border border-[#E6E4DF] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFECE8] text-[#5A5A40] text-xs font-bold uppercase tracking-wider mb-4">
                    <TrendingUp className="w-3 h-3" />
                    National Overview
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A17]">
                    {data.election_name}
                  </h2>
                  <p className="text-[#706F66] mt-2">
                    Total Seats: <span className="font-bold text-[#1A1A17]">{data.total_seats}</span> | 
                    Majority Mark: <span className="font-bold text-[#1A1A17]">{data.majority_mark}</span>
                  </p>
                </div>
                
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#8B8982] uppercase mb-1">Seats Counted</p>
                    <p className="text-3xl font-bold text-[#1A1A17]">
                      {showResults ? "543/543" : "0/543"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#8B8982] uppercase mb-1">Phase</p>
                    <p className="text-3xl font-bold text-[#D97706] capitalize">{currentPhase}</p>
                  </div>
                </div>
              </div>

              {/* Content based on phase */}
              {showResults ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-end">
                    <h3 className="text-sm font-bold text-[#33332D]">Seat Distribution</h3>
                    <div className="flex gap-4">
                      {data.parties.map(party => (
                        <div key={party.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }}></div>
                          <span className="text-xs font-bold text-[#706F66]">{party.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-12 w-full flex rounded-2xl overflow-hidden shadow-inner bg-[#EFECE8]">
                    {data.parties.map((party, index) => {
                      const width = (party.seats / data.total_seats) * 100;
                      return (
                        <div 
                          key={party.name}
                          style={{ width: `${width}%`, backgroundColor: party.color }}
                          className="h-full relative group transition-all hover:opacity-90"
                          title={`${party.name}: ${party.seats} seats`}
                        >
                          {width > 5 && (
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              {party.seats}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                     {data.parties.map(party => (
                       <div key={party.name} className="bg-white p-4 rounded-2xl border border-[#E6E4DF] shadow-sm">
                          <p className="text-[10px] font-bold text-[#8B8982] uppercase mb-1">{party.name}</p>
                          <p className="text-xl font-bold text-[#1A1A17]">{party.seats}</p>
                          <div className="w-full bg-[#F5F2ED] h-1 rounded-full mt-2">
                             <div 
                               className="h-1 rounded-full" 
                               style={{ width: `${(party.seats / data.total_seats) * 100}%`, backgroundColor: party.color }}
                             ></div>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/50 border-2 border-dashed border-[#E6E4DF] rounded-3xl p-12 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-[#EFECE8] text-[#5A5A40] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A17] mb-2">Live Results Coming Soon</h3>
                  <p className="text-[#706F66] max-w-md mx-auto">
                    National results and seat distribution will be live once the voting phase is completed and counting begins.
                  </p>
                  <div className="mt-8 flex justify-center gap-12">
                     <div className="text-left">
                        <p className="text-xs font-bold text-[#8B8982] uppercase mb-1">Eligible Voters</p>
                        <p className="text-2xl font-bold text-[#1A1A17]">Over 960 Million</p>
                     </div>
                     <div className="text-left">
                        <p className="text-xs font-bold text-[#8B8982] uppercase mb-1">Constituencies</p>
                        <p className="text-2xl font-bold text-[#1A1A17]">543</p>
                     </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex items-start gap-3 p-4 bg-[#EFECE8]/50 rounded-2xl border border-[#E6E4DF] text-sm text-[#706F66]">
                <Info className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
                <p>
                  {showResults 
                    ? `This data represents the final results of the 2024 Lok Sabha Elections. The majority mark of 272 is required for a party or coalition to form the government. Currently, you are exploring a curated selection of ${data.curated_seats} key constituencies.`
                    : `Currently in the ${currentPhase} phase. We are simulating the 2024 Lok Sabha Elections. National results will appear here after the Results phase is reached.`
                  }
                </p>
              </div>
            </div>
          </div>
        </HighlightWrapper>
      </div>
    </section>
  );
}
