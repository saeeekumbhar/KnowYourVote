import { BarChart3, Trophy } from 'lucide-react';
import { Candidate } from '../types';

interface QuickFactsViewProps {
  candidates: Candidate[];
  showResults?: boolean;
}

export function QuickFactsView({ candidates, showResults }: QuickFactsViewProps) {
  const sorted = [...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const totalVotes = sorted.reduce((sum, c) => sum + (c.votes || 0), 0);
  const maxVotes = sorted[0]?.votes || 1;
  const hasVotes = showResults && totalVotes > 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E4DF] shadow-sm">
      <div className="flex items-center gap-2 border-b border-[#E6E4DF] pb-4 mb-6">
        <BarChart3 className="w-5 h-5 text-[#8B8982]" />
        <h2 className="text-xl font-bold text-[#1A1A17]">{hasVotes ? 'Election Results' : 'Contesting Candidates'}</h2>
        <span className="ml-auto text-xs text-[#706F66]">Neutral comparison</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E6E4DF]">
              <th className="pb-3 text-xs font-bold text-[#706F66] uppercase tracking-wider">#</th>
              <th className="pb-3 text-xs font-bold text-[#706F66] uppercase tracking-wider">Candidate</th>
              <th className="pb-3 text-xs font-bold text-[#706F66] uppercase tracking-wider">Party</th>
              {hasVotes && (
                <>
                  <th className="pb-3 text-xs font-bold text-[#706F66] uppercase tracking-wider text-right">Votes</th>
                  <th className="pb-3 text-xs font-bold text-[#706F66] uppercase tracking-wider text-right">Diff</th>
                  <th className="pb-3 text-xs font-bold text-[#706F66] uppercase tracking-wider w-32 hidden sm:table-cell">Share</th>
                </>
              )}
              {!hasVotes && (
                <th className="pb-3 text-xs font-bold text-[#706F66] uppercase tracking-wider">Status</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => {
              const isWinner = showResults && c.status === 'Won';
              const voteShare = c.votes && totalVotes ? ((c.votes / totalVotes) * 100) : 0;
              const barWidth = c.votes ? ((c.votes / maxVotes) * 100) : 0;
              const diff = i === 0 ? '-' : `-${(maxVotes - (c.votes || 0)).toLocaleString()}`;
              
              return (
                <tr key={c.id} className={`border-b border-[#F5F2ED] last:border-0 ${isWinner ? 'bg-[#FEF3C7]/30' : ''}`}>
                  <td className="py-3 text-sm text-[#706F66] font-medium">{i + 1}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1A1A17]">{c.name}</span>
                      {isWinner && <Trophy className="w-3.5 h-3.5 text-[#D97706]" />}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-xs font-bold text-[#5A5A40] bg-[#EFECE8] px-2 py-1 rounded-full">{c.party}</span>
                  </td>
                  {hasVotes && (
                    <>
                      <td className="py-3 text-sm font-medium text-[#33332D] text-right">
                        {c.votes?.toLocaleString()}
                      </td>
                      <td className="py-3 text-sm text-[#8B8982] text-right">
                        {diff}
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#5A5A40] min-w-[32px] text-right">{voteShare.toFixed(1)}%</span>
                          <div className="w-full bg-[#F5F2ED] rounded-full h-2 flex-1">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${isWinner ? 'bg-[#D97706]' : 'bg-[#5A5A40]/40'}`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                  {!hasVotes && (
                    <td className="py-3">
                      <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest border border-[#D97706]/20 bg-[#D97706]/5 px-2 py-1 rounded-md">
                        {c.status || 'Contesting'}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
