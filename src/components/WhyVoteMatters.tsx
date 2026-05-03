import { Vote, Users, TrendingUp, MapPin } from 'lucide-react';
import { ElectionStats } from '../types';

interface WhyVoteMattersProps {
  constituencyName: string;
  stats?: ElectionStats;
}

export function WhyVoteMatters({ constituencyName, stats }: WhyVoteMattersProps) {
  return (
    <div className="bg-gradient-to-br from-[#5A5A40] to-[#3D3D2B] rounded-3xl p-6 sm:p-8 text-white shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Vote className="w-5 h-5 text-[#D97706]" />
        <h2 className="text-lg font-bold">Why your vote matters in {constituencyName}</h2>
      </div>

      {stats && stats.turnout_percent > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <Users className="w-4 h-4 text-[#D97706] mb-2" />
            <p className="text-2xl font-bold">{(stats.total_electors / 100000).toFixed(1)}L</p>
            <p className="text-xs text-white/70 mt-1">Total Electors</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <TrendingUp className="w-4 h-4 text-[#D97706] mb-2" />
            <p className="text-2xl font-bold">{stats.turnout_percent}%</p>
            <p className="text-xs text-white/70 mt-1">Voter Turnout</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <Vote className="w-4 h-4 text-[#D97706] mb-2" />
            <p className="text-2xl font-bold">{(stats.votes_polled / 100000).toFixed(1)}L</p>
            <p className="text-xs text-white/70 mt-1">Votes Polled</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <MapPin className="w-4 h-4 text-[#D97706] mb-2" />
            <p className="text-2xl font-bold">{stats.constituency_type}</p>
            <p className="text-xs text-white/70 mt-1">Seat Type</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <Users className="w-4 h-4 text-[#D97706] mb-2" />
            <p className="text-2xl font-bold">{stats ? (stats.total_electors / 100000).toFixed(1) : '18.6'}L</p>
            <p className="text-xs text-white/70 mt-1">Total Electors</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <MapPin className="w-4 h-4 text-[#D97706] mb-2" />
            <p className="text-2xl font-bold">{stats?.constituency_type || 'General'}</p>
            <p className="text-xs text-white/70 mt-1">Seat Type</p>
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <p className="text-sm text-white/90 leading-relaxed">
          {stats && stats.turnout_percent > 0 
            ? `Every vote counts. In the 2024 election, the winning margin in ${constituencyName} was over 1.2 lakh votes. Nearly half the electorate didn't vote — your participation can change the outcome.`
            : `Every vote counts. In the upcoming election, you will be one of ${stats ? (stats.total_electors / 100000).toFixed(1) : '18.6'} lakh voters determining the future of ${constituencyName}. Stay informed and make your voice heard.`}
        </p>
      </div>
    </div>
  );
}
