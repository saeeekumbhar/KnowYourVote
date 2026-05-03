import { useState, useEffect, useRef } from 'react';
import { AssistantPanel, StepContent } from './AssistantPanel';
import { FileText, Users, Landmark, MapPin, Search, Compass, Target, HelpCircle, ArrowRight } from 'lucide-react';
import { Constituency, ElectionStatus } from '../../types';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface AssistantOverlayProps {
  isActive: boolean;
  onClose: () => void;
  constituency: Constituency | null;
  status: ElectionStatus | null;
  isRegistered: boolean;
  hasVoted: boolean;
  setHasVoted: (v: boolean) => void;
  onSelectConstituency: (id: string) => void;
  onHighlight?: (id: string | null) => void;
}

type FlowState = 
  | 'INTENT' // Step 1
  | 'FLOW_A1' | 'FLOW_A2' | 'FLOW_A3' // Understand Elections
  | 'FLOW_B1' | 'FLOW_B2' | 'FLOW_B3' // Find Constituency
  | 'FLOW_C1' | 'FLOW_C2' | 'FLOW_C3' // Explore Candidates
  | 'FLOW_D1' // What Should I Do Now
  | 'TOUR_1' | 'TOUR_2' | 'TOUR_3' | 'TOUR_4' | 'TOUR_5' | 'TOUR_END'; // Feature Walkthrough

export function AssistantOverlay({ 
  isActive, 
  onClose, 
  constituency,
  status,
  isRegistered,
  hasVoted,
  setHasVoted,
  onSelectConstituency,
  onHighlight
}: AssistantOverlayProps) {
  
  const [isVisible, setIsVisible] = useState(false);
  const [currentState, setCurrentState] = useState<FlowState>('INTENT');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [allConstituencies, setAllConstituencies] = useState<Constituency[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  // 1. Sync highlighting to parent
  useEffect(() => {
    if (onHighlight) {
      onHighlight(highlightedElement);
    }
  }, [highlightedElement, onHighlight]);

  // 2. Fetch constituencies
  useEffect(() => {
    import('../../services/api').then(api => {
      api.getAllConstituencies().then(data => setAllConstituencies(data));
    });
  }, []);

  // 3. Handle activation/deactivation
  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setCurrentState('INTENT');
      document.body.style.overflow = 'hidden'; 
    } else {
      setIsVisible(false);
      setHighlightedElement(null);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isActive]);

  // 4. Highlight spotlight effect (Syncs with state transitions)
  useEffect(() => {
    if (!isActive) return;

    switch (currentState) {
      case 'TOUR_1': setHighlightedElement('constituency-header'); break;
      case 'TOUR_2': setHighlightedElement('timeline-tracker'); break;
      case 'TOUR_3': setHighlightedElement('candidates-section'); break;
      case 'TOUR_4': setHighlightedElement('national-snapshot'); break;
      case 'TOUR_5': setHighlightedElement('system-link'); break;
      case 'TOUR_END':
      case 'INTENT':
      default:
        setHighlightedElement(null);
        break;
    }
  }, [currentState, isActive]);

  // 5. Scrolling logic (Depends on highlightedElement)
  useEffect(() => {
    if (isActive && highlightedElement) {
      const el = document.getElementById(highlightedElement);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedElement, isActive]);

  const onSkipWalkthrough = () => {
    setHighlightedElement(null);
    onClose();
  };

  // --- Early Return ---
  if (!isActive) return null;

  const currentPhase = status?.current_phase_id || 'registration';

  const handleVote = () => {
     setHasVoted(true);
     onClose();
     setTimeout(() => {
        window.scrollTo({ top: 300, behavior: 'smooth' });
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
     }, 300);
  };

  const getStepContent = (): StepContent => {
    switch (currentState) {
      case 'INTENT':
        return {
          title: "What would you like to do today?",
          message: "I am your guided assistant. Select an option below, and I'll help you navigate the election.",
          options: [
            { label: "Take a feature tour", icon: <Compass className="w-4 h-4 text-[#D97706]"/>, primary: true, onClick: () => setCurrentState('TOUR_1') },
            { label: "Understand elections", icon: <Compass className="w-4 h-4"/>, onClick: () => setCurrentState('FLOW_A1') },
            { label: "Find my constituency", icon: <MapPin className="w-4 h-4"/>, onClick: () => setCurrentState('FLOW_B1') },
            { label: "Explore candidates", icon: <Users className="w-4 h-4"/>, onClick: () => setCurrentState('FLOW_C1') },
            { label: "What should I do now?", icon: <Target className="w-4 h-4"/>, onClick: () => setCurrentState('FLOW_D1') }
          ]
        };

      case 'TOUR_1':
        return {
          title: "Constituency Details",
          message: "Here you can see the name of your constituency and its current background context. It's your home base for the election.",
          options: [{ label: "Next", onClick: () => setCurrentState('TOUR_2'), primary: true }]
        };
      case 'TOUR_2':
        return {
          title: "Election Timeline",
          message: "Follow the election step-by-step. You can mark your registration status here to keep track of your progress.",
          options: [{ label: "Next", onClick: () => setCurrentState('TOUR_3'), primary: true }]
        };
      case 'TOUR_3':
        return {
          title: "The Candidates",
          message: "Compare candidates, view their histories, and check their status. We provide deep insights to help you choose wisely.",
          options: [{ label: "Next", onClick: () => setCurrentState('TOUR_4'), primary: true }]
        };
      case 'TOUR_4':
        return {
          title: "National Overview",
          message: "Keep an eye on the bigger picture. See how the election is progressing across the entire country.",
          options: [{ label: "Next", onClick: () => setCurrentState('TOUR_5'), primary: true }]
        };
      case 'TOUR_5':
        return {
          title: "System Insights",
          message: "Understand how the Lok Sabha works and what exactly an MP does for your region.",
          options: [{ label: "Finish Tour", onClick: () => setCurrentState('TOUR_END'), primary: true }]
        };
      case 'TOUR_END':
        return {
          title: "You're All Set!",
          message: "You've seen the core features. Feel free to explore and remember to check back for live updates during the election!",
          options: [{ label: "Explore Now", onClick: onClose, primary: true }]
        };

      case 'FLOW_A1':
        return {
          title: "The Basics",
          message: "In India, you are voting to elect a Member of Parliament (MP). Your MP represents your local area (constituency) in the Lok Sabha.",
          options: [{ label: "Next", onClick: () => setCurrentState('FLOW_A2'), primary: true }]
        };
      case 'FLOW_A2':
        return {
          title: "What does an MP do?",
          message: "Before looking at candidates, it's important to know their responsibilities.",
          details: (
            <div className="space-y-3 mt-4 pointer-events-auto">
              <div className="flex items-start gap-3 bg-[#F9F8F6] p-3 rounded-xl border border-[#EFECE8]">
                 <Landmark className="w-5 h-5 text-[#5A5A40] mt-0.5" />
                 <div>
                   <p className="font-bold text-[#1A1A17] text-sm">Lawmaking</p>
                   <p className="text-xs text-[#706F66]">Drafting and voting on national laws.</p>
                 </div>
              </div>
              <div className="flex items-start gap-3 bg-[#F9F8F6] p-3 rounded-xl border border-[#EFECE8]">
                 <FileText className="w-5 h-5 text-[#5A5A40] mt-0.5" />
                 <div>
                   <p className="font-bold text-[#1A1A17] text-sm">Budget</p>
                   <p className="text-xs text-[#706F66]">Approving how tax money is spent.</p>
                 </div>
              </div>
            </div>
          ),
          options: [{ label: "Next", onClick: () => setCurrentState('FLOW_A3'), primary: true }]
        };
      case 'FLOW_A3':
        return {
          title: "What's next?",
          message: "You now know the basics of what you're voting for.",
          options: [
            { label: "See my constituency", onClick: () => setCurrentState('FLOW_B1') },
            { label: "Explore System Map", onClick: () => { onClose(); navigate('/system'); } }
          ]
        };

      case 'FLOW_B1':
        const filtered = searchQuery.length > 0 
          ? allConstituencies.filter(c => 
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.id.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 4)
          : [];

        return {
          title: "Find your constituency",
          message: "Type your city or constituency name below to find where you belong.",
          details: (
            <div className="space-y-4 mt-4">
              <div className="relative pointer-events-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8982]" />
                <input 
                  type="text" 
                  placeholder="Search (e.g. Pune, Mumbai, 411001)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F9F8F6] border border-[#E6E4DF] rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all"
                  autoFocus
                />
              </div>

              {filtered.length > 0 && (
                <div className="bg-white border border-[#E6E4DF] rounded-2xl overflow-hidden divide-y divide-[#E6E4DF] shadow-sm animate-fade-in pointer-events-auto">
                  {filtered.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => {
                        onSelectConstituency(c.id);
                        setSearchQuery('');
                        setCurrentState('FLOW_B2');
                      }}
                      className="w-full px-5 py-4 text-left hover:bg-[#F9F8F6] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-[#1A1A17]">{c.name}</p>
                        <p className="text-sm text-[#706F66]">{c.state} • {c.city}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#8B8982] group-hover:text-[#5A5A40] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}
              
              {searchQuery.length > 0 && filtered.length === 0 && (
                <p className="text-center py-4 text-[#706F66] italic">No results found. Try a different city or state.</p>
              )}
            </div>
          ),
          options: constituency ? [
            { label: `Continue with ${constituency.name}`, onClick: () => setCurrentState('FLOW_B2'), primary: true }
          ] : []
        };
      case 'FLOW_B2':
        return {
          title: "Location Confirmed",
          message: `You are looking at the ${constituency?.name || 'selected'} constituency.`,
          details: (
            <div className="bg-[#FEF3C7] border border-[#FDE68A] p-6 rounded-2xl flex items-center gap-4 mt-4 animate-fade-in">
              <div className="w-12 h-12 bg-[#D97706] text-white rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-[#92400E] text-xl">{constituency?.name || 'Pune'}</p>
                <p className="text-[#B45309]">{constituency?.state} • {constituency?.city}</p>
              </div>
            </div>
          ),
          options: [{ label: "What should I do next?", onClick: () => setCurrentState('FLOW_B3'), primary: true }]
        };
      case 'FLOW_B3':
        return {
          title: "Next Steps",
          message: "Now that you know your constituency, what would you like to see?",
          options: [
            { label: "Candidates", onClick: () => setCurrentState('FLOW_C1') },
            { label: "What should I do right now?", onClick: () => setCurrentState('FLOW_D1'), primary: true }
          ]
        };

      case 'FLOW_C1':
        if (!constituency) {
           return {
             title: "Select a constituency first",
             message: "We need to know your location to show you the right candidates.",
             options: [{ label: "Find constituency", onClick: () => setCurrentState('FLOW_B1'), primary: true }]
           };
        }
        
        let candMsg = "";
        let pLabel = "Okay";
        let pAction = () => setCurrentState('INTENT');

        if (currentPhase === 'registration') candMsg = "Candidates will be announced soon. Focus on registration right now.";
        else if (currentPhase === 'announcement') {
           candMsg = "Candidates are currently being announced. Check the dashboard to see who's running.";
           pLabel = "View Candidates";
           pAction = () => { onClose(); window.scrollTo({ top: 600, behavior: 'smooth' }); };
        } else if (currentPhase === 'campaign') {
           candMsg = "Campaigning is ongoing! Compare candidates carefully before voting day.";
           pLabel = "Review Candidates";
           pAction = () => { onClose(); window.scrollTo({ top: 600, behavior: 'smooth' }); };
        } else if (currentPhase === 'vote') {
           candMsg = "Review candidates one last time before casting your vote today.";
           pLabel = "Review Candidates";
           pAction = () => { onClose(); window.scrollTo({ top: 600, behavior: 'smooth' }); };
        } else if (currentPhase === 'results') {
           candMsg = "Results are now available. Check the dashboard to see who won.";
           pLabel = "View Results";
           pAction = () => { onClose(); window.scrollTo({ top: 600, behavior: 'smooth' }); };
        }

        return {
          title: "Candidates Overview",
          message: candMsg,
          options: [
            { label: pLabel, onClick: pAction, primary: true },
            { label: "Back to menu", onClick: () => setCurrentState('INTENT') }
          ]
        };

      case 'FLOW_D1':
        if (currentPhase === 'registration') {
           if (!isRegistered) {
              return {
                 title: "Urgent: Register to Vote",
                 message: "You need to register to vote before the deadline. Visit the official NVSP portal to submit your details.",
                 options: [
                    { label: "Guide me how", onClick: () => { onClose(); window.scrollTo({ top: 800, behavior: 'smooth' }); } },
                    { label: "I have already registered", onClick: () => { onClose(); window.scrollTo({ top: 300, behavior: 'smooth' }); }, primary: true }
                 ]
              };
           } else {
              return {
                 title: "You're all set!",
                 message: "Since you are registered, your job right now is done. Wait for the election to be announced.",
                 options: [
                    { label: "Explore Dashboard", onClick: () => onClose(), primary: true },
                    { label: "Back to menu", onClick: () => setCurrentState('INTENT') }
                 ]
              };
           }
        } 
        else if (currentPhase === 'announcement') {
           return {
              title: "Election Announced",
              message: "Election dates are announced. Your next step is to check your constituency and start tracking the candidates as they are revealed.",
              options: [
                 { label: "View Candidates", onClick: () => setCurrentState('FLOW_C1'), primary: true },
                 { label: "Back to menu", onClick: () => setCurrentState('INTENT') }
              ]
           };
        }
        else if (currentPhase === 'campaign') {
           return {
              title: "Campaigning is Live",
              message: "Candidates are actively campaigning. What you should do: Review candidates, understand their background, and compare their experience.",
              options: [
                 { label: "View Candidates", onClick: () => { onClose(); window.scrollTo({ top: 600, behavior: 'smooth' }); }, primary: true },
                 { label: "Back to menu", onClick: () => setCurrentState('INTENT') }
              ]
           };
        }
        else if (currentPhase === 'vote') {
           if (!hasVoted) {
              return {
                 title: "Voting is LIVE today",
                 message: "You should go to your polling booth and carry a valid ID. Exercise your democratic right!",
                 options: [
                    { label: "I have voted", onClick: handleVote, primary: true },
                    { label: "Find polling booth", onClick: () => { onClose(); window.scrollTo({ top: 800, behavior: 'smooth' }); } }
                 ]
              };
           } else {
              return {
                 title: "Thank you for voting!",
                 message: "Your democratic duty is fulfilled. Wait for the results to be declared.",
                 options: [
                    { label: "Close", onClick: () => onClose(), primary: true },
                    { label: "Back to menu", onClick: () => setCurrentState('INTENT') }
                 ]
              };
           }
        }
        else if (currentPhase === 'results') {
           return {
              title: "Results Declared",
              message: "The election is over. You can now see who won and check the final vote share.",
              options: [
                 { label: "View Results", onClick: () => { onClose(); window.scrollTo({ top: 600, behavior: 'smooth' }); }, primary: true },
                 { label: "Back to menu", onClick: () => setCurrentState('INTENT') }
              ]
           };
        }
        
        return { title: "", message: "", options: [] };
 
       default:
        return { title: "", message: "", options: [] };
    }
  };

  const handleBack = () => {
     if (currentState === 'FLOW_A2') setCurrentState('FLOW_A1');
     if (currentState === 'FLOW_A3') setCurrentState('FLOW_A2');
     if (currentState === 'FLOW_B2') setCurrentState('FLOW_B1');
     if (currentState === 'FLOW_B3') setCurrentState('FLOW_B2');
     if (currentState === 'TOUR_2') setCurrentState('TOUR_1');
     if (currentState === 'TOUR_3') setCurrentState('TOUR_2');
     if (currentState === 'TOUR_4') setCurrentState('TOUR_3');
     if (currentState === 'TOUR_5') setCurrentState('TOUR_4');
     if (currentState === 'TOUR_END') setCurrentState('TOUR_5');
  };

  const canGoBack = ['FLOW_A2', 'FLOW_A3', 'FLOW_B2', 'FLOW_B3', 'TOUR_2', 'TOUR_3', 'TOUR_4', 'TOUR_5', 'TOUR_END'].includes(currentState);
  const walkthroughStep = currentState.startsWith('TOUR_') ? parseInt(currentState.split('_')[1]) || 0 : 0;
  const isTour = currentState.startsWith('TOUR_');

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#1A1A17]/80 backdrop-blur-md z-[110] transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-0 flex items-center justify-center p-4 z-[120] pointer-events-none transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"}`}
      >
        <AssistantPanel
          content={getStepContent()}
          onSkip={onSkipWalkthrough}
          canGoBack={canGoBack}
          onBack={handleBack}
          isWalkthrough={isTour}
          currentStep={walkthroughStep}
          totalSteps={5}
        />
      </div>
    </>
  );
}
