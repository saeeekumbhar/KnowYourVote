import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { AreaChart, Users, ChevronLeft, MapPin, Settings } from 'lucide-react';
import { Constituency, Candidate, CandidateHistoryRole, ElectionStatus } from '../types';
import { 
    getConstituencyById, 
    getCandidatesByConstituency, 
    getCandidateHistory,
    getElectionStatus
} from '../services/api';

import { TimelineTracker } from '../components/TimelineTracker';
import { CandidateCard } from '../components/CandidateCard';
import { CandidateModal } from '../components/CandidateModal';
import { RoleExplanation } from '../components/RoleExplanation';
import { WhyVoteMatters } from '../components/WhyVoteMatters';
import { QuickFactsView } from '../components/QuickFactsView';
import { HowToVote } from '../components/HowToVote';
import { ConstituencySwitcher } from '../components/ConstituencySwitcher';
import { useElectionPhase } from '../context/ElectionPhaseContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

// Assistant Components
import { AssistantOverlay } from '../components/assistant/AssistantOverlay';
import { HighlightWrapper } from '../components/assistant/HighlightWrapper';

export default function Dashboard() {
  const { constituency_id } = useParams<{ constituency_id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPhase, announcementStep, setIsDevPanelOpen } = useElectionPhase();
  const { user } = useAuth();
  
  const [selectedConstituency, setSelectedConstituency] = useState<string>(constituency_id || '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [constituency, setConstituency] = useState<Constituency | null>(null);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [status, setStatus] = useState<ElectionStatus | null>(null);
  
  // Modal state
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateHistory, setCandidateHistory] = useState<CandidateHistoryRole[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Interactive States
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Assistant State
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);
  
  // Registration Link State
  const [showRegLink, setShowRegLink] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get('assistant') === 'true';
    const fromStorage = sessionStorage.getItem('openAssistant') === 'true';
    if (fromUrl || fromStorage) {
      setIsAssistantActive(true);
      sessionStorage.removeItem('openAssistant');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedConstituency) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [consData, electionData] = await Promise.all([
            getConstituencyById(selectedConstituency),
            getElectionStatus()
        ]);

        if (!consData) {
            setError(`No constituency found for ID: ${selectedConstituency}`);
            setLoading(false);
            return;
        }

        setConstituency(consData);
        setStatus(electionData);

        const candData = await getCandidatesByConstituency(consData.id);
        setAllCandidates(candData);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedConstituency]);

  const handleCandidateClick = async (candidate: Candidate) => {
      setSelectedCandidate(candidate);
      setIsModalOpen(true);
      const history = await getCandidateHistory(candidate.id);
      setCandidateHistory(history);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setTimeout(() => setSelectedCandidate(null), 200);
  }

  const handleVoteClick = () => {
    setHasVoted(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Phase Logic
  const visibleCandidates = (() => {
    if (currentPhase === 'registration') return [];
    if (currentPhase === 'announcement') {
      return allCandidates.filter(c => (c.announcement_order || 99) <= announcementStep);
    }
    return allCandidates; // campaign, voting, results
  })();

  const getTimelineStatus = (phaseId: string) => {
    const phases = ['registration', 'announcement', 'campaign', 'voting', 'results'];
    const currentIndex = phases.indexOf(currentPhase);
    const thisIndex = phases.indexOf(phaseId);
    if (thisIndex < currentIndex) return 'completed';
    if (thisIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  const updatedTimeline = status?.timeline.map(t => {
     let phaseId = t.id;
     if (t.id === 'register') phaseId = 'registration';
     if (t.id === 'announced') phaseId = 'announcement';
     if (t.id === 'vote') phaseId = 'voting';
     
     return {
        ...t,
        status: getTimelineStatus(phaseId)
     };
  });

  const showCandidates = currentPhase !== 'registration';
  const showResults = currentPhase === 'results';
  const showVoting = currentPhase === 'voting';

  const winningCandidate = currentPhase === 'results' 
    ? allCandidates.find(c => c.status === "Won" && c.constituency_id === selectedConstituency) 
    : null;
  const currentMpName = winningCandidate?.name || constituency?.previousMP || 'TBD';

  const phaseMessage: Record<string, string> = {
    registration: "Register to vote.",
    announcement: "Candidates are being announced.",
    campaign: "Campaigning is ongoing. Review candidates carefully.",
    voting: "Voting is live. Cast your vote.",
    results: "Results are declared."
  };

  return (
    <>
      <AssistantOverlay 
        isActive={isAssistantActive}
        onClose={() => {
          setIsAssistantActive(false);
          setHighlightedFeature(null);
        }}
        constituency={constituency}
        status={status}
        isRegistered={isRegistered}
        hasVoted={hasVoted}
        setHasVoted={setHasVoted}
        onSelectConstituency={setSelectedConstituency}
        onHighlight={setHighlightedFeature}
      />

      {loading ? (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
            <div className="w-8 h-8 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#706F66] font-medium">Looking up your constituency...</p>
        </div>
      ) : error || !constituency || !status ? (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 bg-[#F9F8F6] text-[#5A5A40] rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A17] mb-2">Location Not Found</h2>
            <p className="text-[#706F66] mb-6 max-w-md">{error}</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#5A5A40] text-white rounded-xl font-medium hover:bg-[#4A4A30] transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Try another PIN code
            </Link>
        </div>
      ) : (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 relative z-0">
          <ConstituencySwitcher 
            currentId={selectedConstituency} 
            onChange={setSelectedConstituency}
          />

        <div className="opacity-0 animate-fade-in-up">
          <HighlightWrapper id="constituency-header" isActive={highlightedFeature === 'constituency-header'}>
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E4DF] shadow-sm relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-between items-start">
                  <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#EFECE8] text-[#92400E] text-xs font-bold uppercase tracking-wider mb-4">
                          <span className="w-2 h-2 bg-[#D97706] rounded-full animate-pulse"></span>
                          Phase: {currentPhase}
                      </div>

                      {user && (
                        <p className="text-[#5A5A40] font-bold mb-1">
                          Welcome, {user.displayName}. Let’s understand your vote.
                        </p>
                      )}

                      <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#1A1A17] mb-2">
                          {constituency.name}
                      </h1>
                      <p className="text-[#706F66] mb-4">{constituency.state} • {constituency.city}</p>
                      
                      {constituency.context && (
                        <div className="bg-[#F9F8F6] p-4 rounded-2xl border border-[#E6E4DF] text-sm text-[#706F66] leading-relaxed max-w-2xl">
                           <span className="font-bold text-[#5A5A40] block mb-1 uppercase text-[10px] tracking-widest">Constituency Context</span>
                           {constituency.context}
                        </div>
                      )}
                  </div>
                  
                  <div className="bg-[#EFECE8] rounded-xl p-4 sm:min-w-[200px] border border-[#E6E4DF]">
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#706F66] mb-1">Current MP</span>
                      <p className="text-lg font-bold text-[#33332D]">{currentMpName}</p>
                  </div>
              </div>
            </div>
          </HighlightWrapper>
        </div>

        <div className="opacity-0 animate-fade-in-up [animation-delay:100ms]">
          <HighlightWrapper id="timeline-tracker" isActive={highlightedFeature === 'timeline-tracker'}>
            <TimelineTracker timeline={updatedTimeline!} currentPhaseId={currentPhase === 'voting' ? 'vote' : currentPhase === 'registration' ? 'register' : currentPhase === 'announcement' ? 'announced' : currentPhase} isRegistered={isRegistered} setIsRegistered={setIsRegistered} />
          </HighlightWrapper>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6 opacity-0 animate-fade-in-up [animation-delay:200ms]">
                {currentPhase === 'registration' && (
                   <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6E4DF] shadow-sm text-center">
                     <h2 className="text-2xl font-bold text-[#1A1A17] mb-4">Registration Phase</h2>
                     <p className="text-[#706F66] mb-6 max-w-md mx-auto">
                        Candidates have not been announced yet. Ensure you are registered to vote and check your details in the electoral roll.
                     </p>
                     
                     <div className="bg-[#F9F8F6] p-6 rounded-2xl inline-block text-left">
                       <p className="text-sm font-bold text-[#33332D] mb-4 text-center">Have you registered to vote?</p>
                       <div className="flex gap-4 justify-center">
                          {isRegistered ? (
                             <span className="px-6 py-2 bg-[#10B981]/10 text-[#059669] rounded-xl font-bold flex items-center gap-2">
                               You're ready to vote!
                             </span>
                          ) : (
                             <>
                                <button className="px-6 py-2 bg-[#5A5A40] text-white rounded-xl font-bold hover:bg-[#4A4A30] transition-colors" onClick={() => setIsRegistered(true)}>Yes</button>
                                <button className="px-6 py-2 bg-white text-[#5A5A40] border border-[#E6E4DF] rounded-xl font-bold hover:bg-[#F9F8F6] transition-colors" onClick={() => setShowRegLink(true)}>Not Yet</button>
                             </>
                          )}
                       </div>
                       
                       {!isRegistered && !showRegLink && (
                         <p className="text-xs text-[#8B8982] mt-4 text-center">
                           Select "Not Yet" if you need to register.
                         </p>
                       )}
                       
                       {!isRegistered && showRegLink && (
                         <div className="mt-4 text-center p-4 bg-[#F9F8F6] rounded-xl border border-[#EFECE8]">
                           <p className="text-xs text-[#706F66] mb-2">Please register to vote at the official ECI portal:</p>
                           <a 
                             href="https://voters.eci.gov.in/" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="inline-block text-xs font-bold text-[#D97706] hover:text-[#B45309] transition-colors"
                           >
                             Register on NVSP →
                           </a>
                         </div>
                       )}
                     </div>
                   </div>
                )}

                {showVoting && (
                  <div className="bg-[#5A5A40] text-white rounded-3xl p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
                     {hasVoted && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-[#5A5A40] px-4 py-2 rounded-xl font-bold shadow-lg animate-fade-in-down whitespace-nowrap">
                           🎉 Your vote has been recorded!
                        </div>
                     )}
                     <h2 className="text-3xl font-bold mb-4">{hasVoted ? 'Thank You For Voting!' : 'Voting is Live'}</h2>
                     <p className="text-white/80 mb-8 max-w-md mx-auto">
                        {hasVoted ? 'Your democratic duty is fulfilled. You can now track results.' : 'Head to your designated polling booth today. Exercise your democratic right.'}
                     </p>
                     {!hasVoted ? (
                       <motion.button 
                         whileHover={{ scale: 1.05, translateY: -2 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={handleVoteClick} 
                         className="px-8 py-4 bg-white text-[#5A5A40] rounded-xl font-bold hover:bg-white/90 transition-colors text-lg shadow-xl"
                       >
                          I Have Voted
                       </motion.button>
                     ) : (
                       <button 
                         onClick={() => setHasVoted(false)} 
                         className="px-6 py-2 bg-transparent text-white/60 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                       >
                         Wait, I haven't voted yet
                       </button>
                     )}
                  </div>
                )}

                {showCandidates && (
                  <HighlightWrapper id="candidates-section" isActive={highlightedFeature === 'candidates-section'}>
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E4DF] shadow-sm">
                      <div className="flex items-center gap-2 border-b border-[#E6E4DF] pb-4 mb-6">
                          <Users className="w-5 h-5 text-[#8B8982]" />
                          <h2 className="text-xl font-bold text-[#1A1A17]">
                             {currentPhase === 'announcement' ? 'Announced Candidates' : 'Candidates'}
                          </h2>
                          <span className="ml-auto bg-[#F5F2ED] text-[#706F66] py-0.5 px-2.5 rounded-full text-xs font-bold">
                              {visibleCandidates.length} Contesting
                          </span>
                      </div>

                      <div className="mb-6 p-4 bg-[#FEF3C7] text-[#92400E] rounded-xl font-bold text-sm text-center border border-[#F59E0B]/20">
                         📣 {phaseMessage[currentPhase]}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {visibleCandidates.map(candidate => (
                              <CandidateCard 
                                key={candidate.id} 
                                candidate={candidate} 
                                onClick={handleCandidateClick} 
                                showVotes={showResults}
                              />
                          ))}
                          {visibleCandidates.length === 0 && (
                              <div className="col-span-full py-12 text-center text-[#8B8982] bg-[#F1F0EC] border border-dashed border-[#CBC8BE] rounded-2xl">
                                  No candidates announced yet in this step.
                              </div>
                          )}
                      </div>
                    </div>
                  </HighlightWrapper>
                )}
            </div>

            <div className="lg:col-span-1 space-y-6 opacity-0 animate-fade-in-up [animation-delay:300ms]">
               <HighlightWrapper id="system-link" isActive={highlightedFeature === 'system-link'}>
                 <RoleExplanation />
               </HighlightWrapper>
               
                <div className="grid grid-cols-1 gap-4">
                  <Link to="/system" className="group block bg-[#EFECE8] border border-[#E6E4DF] rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-start justify-between mb-4">
                        <AreaChart className="w-8 h-8 text-[#5A5A40]" />
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#F9F8F6] transition-colors border border-[#E6E4DF]">
                            <ChevronLeft className="w-4 h-4 rotate-180 text-[#5A5A40]" />
                        </div>
                    </div>
                    <h3 className="font-sans text-xl font-bold mb-2 text-[#1A1A17]">Understand the System</h3>
                    <p className="text-sm text-[#706F66]">See how the Lok Sabha, Parliament, and the Prime Minister connect.</p>
                  </Link>

                  <button 
                    onClick={() => setIsDevPanelOpen(true)}
                    className="group block bg-[#33332D] text-white border border-transparent rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-md text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                        <Settings className="w-8 h-8 text-[#D97706]" />
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <ChevronLeft className="w-4 h-4 rotate-180 text-white" />
                        </div>
                    </div>
                    <h3 className="font-sans text-xl font-bold mb-2">Dev Simulation</h3>
                    <p className="text-sm text-white/60">Switch election phases and simulate different scenarios instantly.</p>
                  </button>
                </div>
            </div>

        </div>

        <div className="opacity-0 animate-fade-in-up [animation-delay:400ms]">
          <WhyVoteMatters constituencyName={constituency.name} stats={status.stats} />
        </div>

        <div className="opacity-0 animate-fade-in-up [animation-delay:500ms]">
          <HowToVote />
        </div>

        <div className="opacity-0 animate-fade-in-up [animation-delay:600ms] relative">
          <QuickFactsView candidates={visibleCandidates} showResults={showResults} />
          {currentPhase !== 'results' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
              <span className="font-bold text-[#5A5A40] bg-white px-4 py-2 rounded-xl shadow-sm border border-[#E6E4DF]">
                 Results will be available after voting.
              </span>
            </div>
          )}
        </div>

        <CandidateModal 
          candidate={selectedCandidate} 
          history={candidateHistory}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

      </div>
      )}
    </>
  );
}
