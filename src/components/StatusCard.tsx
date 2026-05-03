import { CalendarClock, AlertCircle } from 'lucide-react';
import { useElectionPhase } from '../context/ElectionPhaseContext';
import electionData from '../data/election_status.json';

export function StatusCard() {
  const { currentPhase } = useElectionPhase();
  const phaseInfo = electionData.timeline.find(t => {
    let phaseId = t.id;
    if (t.id === 'register') phaseId = 'registration';
    if (t.id === 'announced') phaseId = 'announcement';
    if (t.id === 'vote') phaseId = 'voting';
    return phaseId === currentPhase;
  });

  const phaseMessages: Record<string, string> = {
    registration: "Voter registration is currently open. Check your status.",
    announcement: "Candidates are currently being announced for various constituencies.",
    campaign: "Campaigning is currently ongoing across the country.",
    voting: "Voting is currently live. Make your voice heard.",
    results: "Election results are being declared. Check the live count."
  };

  return (
    <section className="py-12 bg-white relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F9F8F6] border border-[#E6E4DF] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E4DF]">
              <CalendarClock className="w-6 h-6 text-[#5A5A40]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#8B8982] uppercase tracking-wider mb-1">
                Current Election Status
              </h2>
              <div className="text-2xl font-bold text-[#1A1A17] flex items-center gap-2">
                2024 Lok Sabha Elections
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {currentPhase === 'results' ? 'Completed' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 md:text-right">
            <div className="inline-flex flex-col items-start md:items-end p-4 bg-white rounded-xl border border-[#EFECE8] w-full md:w-auto">
              <div className="flex items-center gap-2 text-sm font-medium text-[#5A5A40] mb-1">
                <AlertCircle className="w-4 h-4" />
                Phase: {phaseInfo?.name || currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
              </div>
              <p className="text-[#706F66] text-sm">
                {phaseMessages[currentPhase] || "Follow the election process step by step."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
