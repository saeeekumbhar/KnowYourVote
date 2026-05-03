import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User, 
  Users, 
  Vote as VoteIcon, 
  Scale, 
  MapPin, 
  ArrowDown, 
  ArrowRight,
  Info, 
  X,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { Volume2 } from 'lucide-react';

interface Node {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  explanation: string;
  color: 'blue' | 'amber' | 'emerald' | 'purple' | 'slate' | 'indigo';
  type: 'node' | 'group';
  childrenIds?: string[];
  actionLabel?: string;
  link?: string;
}

const SYSTEM_NODES: Record<string, Node> = {
  voters: {
    id: 'voters',
    title: 'YOU (VOTER)',
    subtitle: 'You Start Here',
    icon: <VoteIcon className="w-6 h-6" />,
    type: 'node',
    color: 'emerald',
    explanation: 'You are the ultimate source of power in India. Your vote decides the representation in Parliament and ultimately who runs the country.',
    actionLabel: 'Check My Pincode',
    link: '/'
  },
  constituency: {
    id: 'constituency',
    title: 'Constituency',
    subtitle: 'Your Local Area',
    icon: <MapPin className="w-5 h-5" />,
    type: 'node',
    color: 'emerald',
    explanation: 'For Lok Sabha elections, India is divided into 543 geographic areas. You belong to one based on your residence.'
  },
  voting_process: {
    id: 'voting_process',
    title: 'Voting Process',
    subtitle: 'How to Vote',
    icon: <LayoutGrid className="w-5 h-5" />,
    type: 'node',
    color: 'emerald',
    explanation: 'The journey from getting your EPIC card to pressing the button on the EVM-VVPAT machine.',
    actionLabel: 'View Guide',
    link: '/voting-guide'
  },
  legislature: {
    id: 'legislature',
    title: 'LEGISLATURE',
    subtitle: 'Law Making Body',
    icon: <Building2 className="w-6 h-6" />,
    type: 'group',
    color: 'amber',
    explanation: 'Responsible for debating and passing laws, and representing the will of the states and the people.',
    childrenIds: ['lok_sabha', 'rajya_sabha']
  },
  lok_sabha: {
    id: 'lok_sabha',
    title: 'Lok Sabha',
    subtitle: 'House of the People',
    icon: <Users className="w-5 h-5" />,
    type: 'node',
    color: 'amber',
    explanation: 'Members are directly elected by you. This house has the most power in passing financial bills and forming the government.'
  },
  rajya_sabha: {
    id: 'rajya_sabha',
    title: 'Rajya Sabha',
    subtitle: 'Council of States',
    icon: <Users className="w-5 h-5" />,
    type: 'node',
    color: 'amber',
    explanation: 'Represents the interests of the states. Members are elected by state legislatures, ensuring a balanced federal structure.'
  },
  executive: {
    id: 'executive',
    title: 'EXECUTIVE',
    subtitle: 'Governing Body',
    icon: <User className="w-6 h-6" />,
    type: 'group',
    color: 'amber',
    explanation: 'The branch that implements laws and manages the day-to-day administration of the country.',
    childrenIds: ['pm', 'com']
  },
  pm: {
    id: 'pm',
    title: 'Prime Minister',
    subtitle: 'Head of Government',
    icon: <User className="w-5 h-5" />,
    type: 'node',
    color: 'amber',
    explanation: 'The leader of the party with the most seats in Lok Sabha. They lead the nation and pick the cabinet.'
  },
  com: {
    id: 'com',
    title: 'Council of Ministers',
    subtitle: 'Cabinet Ministers',
    icon: <Building2 className="w-5 h-5" />,
    type: 'node',
    color: 'amber',
    explanation: 'Senior leaders chosen by the PM to head critical departments like Finance, Home, and Defense.'
  },
  policy: {
    id: 'policy',
    title: 'Policy Implementation',
    subtitle: 'Result of Your Vote',
    icon: <FileText className="w-6 h-6" />,
    type: 'node',
    color: 'emerald',
    explanation: 'This is where laws become action—hospitals, roads, education, and security that affect your daily life.'
  },
  judiciary: {
    id: 'judiciary',
    title: 'JUDICIARY',
    subtitle: 'Checks & Balances',
    icon: <Scale className="w-6 h-6" />,
    type: 'node',
    color: 'emerald',
    explanation: 'The independent branch that ensures laws follow the Constitution. It acts as a check on both the Legislature and Executive.'
  }
};

const GUIDED_STEPS = [
  { id: 'voters', text: "Democracy starts with YOU. Your vote is the spark that powers the entire system.", focus: ['voters'] },
  { id: 'process', text: "Your vote belongs to a Constituency. Understanding the local process is your first step.", focus: ['voters', 'constituency', 'voting_process'] },
  { id: 'legislature', text: "You directly elect MPs to the Lok Sabha. They represent you in the Legislature, making laws for the nation.", focus: ['legislature', 'lok_sabha'] },
  { id: 'executive', text: "The majority party in the Lok Sabha forms the Executive. They implement laws and run the government.", focus: ['executive', 'pm', 'com'] },
  { id: 'policy', text: "Ultimately, the government you helped choose creates Policies that affect your life every day.", focus: ['policy'] },
  { id: 'judiciary', text: "And throughout this process, the Judiciary stands aside to ensure everything follows the Constitution.", focus: ['judiciary'] },
  { id: 'full', text: "That is the power of your vote—from your finger to the Prime Minister's desk.", focus: [] }
];

export default function SystemMindMap() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isGuided, setIsGuided] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const navigate = useNavigate();
  const { speak, stopSpeaking, isSpeaking } = useAccessibility();

  useEffect(() => {
    if (isGuided && currentStep >= 0) {
      speak(GUIDED_STEPS[currentStep].text);
    }
  }, [currentStep, isGuided]);

  useEffect(() => {
    if (selectedNode) {
      speak(selectedNode.explanation);
    } else {
      stopSpeaking();
    }
  }, [selectedNode]);

  const startGuidedMode = () => {
    setIsGuided(true);
    setCurrentStep(0);
    setSelectedNode(null);
  };

  const nextStep = () => {
    if (currentStep < GUIDED_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsGuided(false);
      setCurrentStep(-1);
      stopSpeaking();
    }
  };

  const isDimmed = (nodeId: string) => {
    if (selectedNode && selectedNode.id !== nodeId) return true;
    if (isGuided && currentStep >= 0) {
      const step = GUIDED_STEPS[currentStep];
      if (step.focus.length > 0 && !step.focus.includes(nodeId)) return true;
    }
    return false;
  };

  const getColorClasses = (color: Node['color']) => {
    // Return subtle accent colors instead of full backgrounds
    switch (color) {
      case 'emerald': return 'border-slate-100 bg-white text-slate-900 shadow-sm';
      case 'amber': return 'border-slate-100 bg-white text-slate-900 shadow-sm';
      case 'slate': return 'border-slate-100 bg-white text-slate-900 shadow-sm';
      default: return 'border-slate-100 bg-white text-slate-900 shadow-sm';
    }
  };

  const getIconBg = (color: Node['color']) => {
    switch (color) {
      case 'amber': return 'bg-amber-50 text-amber-600';
      case 'emerald': return 'bg-[#F5F5F0] text-[#5A5A40]';
      case 'slate': return 'bg-slate-50 text-slate-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const NodeComponent = ({ id, delay = 0, small = false }: { id: string, delay?: number, small?: boolean }) => {
    const node = SYSTEM_NODES[id];
    const dimmed = isDimmed(id);
    const isSelected = selectedNode?.id === id;
    const isVoter = id === 'voters';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ 
          opacity: dimmed ? 0.2 : 1, 
          scale: dimmed ? 0.95 : isSelected ? 1.05 : 1,
          y: 0 
        }}
        transition={{ delay: delay * 0.1, duration: 0.4 }}
        whileHover={{ y: -4, scale: dimmed ? 0.95 : 1.02, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isGuided) setSelectedNode(node);
        }}
        className={`
          relative z-10 p-5 rounded-[2rem] border transition-all cursor-pointer
          ${getColorClasses(node.color)}
          ${isSelected ? 'ring-2 ring-indigo-600 border-indigo-600 shadow-xl' : 'hover:border-slate-200'}
          ${isVoter ? 'ring-2 ring-indigo-100 border-indigo-100' : ''}
          ${small ? 'min-w-[180px]' : 'min-w-[240px]'}
        `}
      >
        {isVoter && !dimmed && (
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute -inset-1 bg-indigo-50 rounded-[2.2rem] -z-10 blur-sm"
          />
        )}

        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl flex-shrink-0 ${getIconBg(node.color)} shadow-sm`}>
            {React.cloneElement(node.icon as React.ReactElement, { className: small ? 'w-4 h-4' : 'w-5 h-5' })}
          </div>
          <div className="text-left overflow-hidden">
            <h4 className={`${small ? 'text-xs' : 'text-sm'} font-black leading-tight tracking-tight text-slate-900 uppercase`}>{node.title}</h4>
            {node.subtitle && (
              <p className={`text-[10px] mt-0.5 font-bold uppercase tracking-widest truncate ${isVoter ? 'text-[#5A5A40]' : 'text-slate-400'}`}>
                {node.subtitle}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const FlowArrow = ({ vertical = true, label = "" }: { vertical?: boolean, label?: string }) => (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-2 py-6 opacity-20`}>
        {label && <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>}
        {vertical ? <ArrowDown className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col md:flex-row relative overflow-hidden font-outfit">
      
      {/* Main Story Flow Area */}
      <div className="flex-1 p-6 md:p-12 overflow-auto relative z-10" onClick={() => !isGuided && setSelectedNode(null)}>
        <header className="mb-16 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <div className="px-5 py-1.5 bg-white border border-slate-100 text-[#D97706] rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-sm">
                Democratic Storyline
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-[#1A1A17] tracking-tighter leading-[0.9]">
              Understand<br />the System
            </h1>
          </motion.div>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
             A high-fidelity guide to the vertical flow of power—from your single vote to national policy.
          </p>
          
          {!isGuided && (
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGuidedMode}
              className="mt-10 px-10 py-5 bg-[#5A5A40] text-white rounded-full font-black flex items-center gap-3 mx-auto shadow-2xl hover:shadow-[#5A5A40]/20 transition-all group"
            >
              <Zap className="w-5 h-5 text-white/80 fill-white/20 group-hover:animate-pulse" />
              START GUIDED EXPLANATION
            </motion.button>
          )}
        </header>

        {/* The Vertical Map */}
        <div className="max-w-5xl mx-auto py-12 flex flex-col items-center">
           
           {/* Layer 1: Voter Level */}
           <div className="flex flex-col items-center mb-4">
              <NodeComponent id="voters" />
              <FlowArrow label="Starts with" />
              <div className="flex gap-10 flex-wrap justify-center">
                 <NodeComponent id="constituency" small />
                 <NodeComponent id="voting_process" small />
              </div>
           </div>

           <FlowArrow label="Your Vote" />

           {/* Layer 2: Representation (Legislature Group) */}
           <div className={`relative p-10 rounded-[4rem] border border-slate-200/60 bg-white/40 flex flex-col items-center shadow-sm mb-4 transition-all duration-700 ${isDimmed('legislature') ? 'opacity-10 blur-md scale-95' : 'opacity-100'}`}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-[#5A5A40] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                 Legislature
              </div>
              <div className="flex gap-12 flex-wrap justify-center pt-4">
                 <NodeComponent id="lok_sabha" />
                 <div className="w-px h-16 bg-slate-100 hidden md:block" />
                 <NodeComponent id="rajya_sabha" />
              </div>
           </div>

           <FlowArrow label="Forms" />

           {/* Layer 3: Government (Executive Group) */}
           <div className={`relative p-10 rounded-[4rem] border border-slate-200/60 bg-white/40 flex flex-col items-center shadow-sm mb-4 transition-all duration-700 ${isDimmed('executive') ? 'opacity-10 blur-md scale-95' : 'opacity-100'}`}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-[#5A5A40] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                 Executive
              </div>
              <div className="flex gap-12 flex-wrap justify-center pt-4">
                 <NodeComponent id="pm" />
                 <div className="w-px h-16 bg-slate-100 hidden md:block" />
                 <NodeComponent id="com" />
              </div>
           </div>

           <FlowArrow label="Delivers" />

           {/* Layer 4: Result */}
           <NodeComponent id="policy" />

           {/* Sidebar: Judiciary */}
           <div className="fixed right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6">
              <div className="h-32 w-px border-l border-dashed border-slate-300" />
              <div className="px-4 py-1.5 bg-white text-indigo-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-100 shadow-sm">
                 Checks & Balances
              </div>
              <NodeComponent id="judiciary" />
              <div className="h-32 w-px border-l border-dashed border-slate-300" />
           </div>

           {/* Mobile Judiciary View */}
           <div className="xl:hidden mt-20 flex flex-col items-center gap-6 w-full">
              <div className="w-full h-px border-t border-dashed border-slate-300" />
              <NodeComponent id="judiciary" />
           </div>

        </div>
      </div>

      {/* Guided Mode Step Guide */}
      <AnimatePresence>
        {isGuided && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-10 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-white text-slate-900 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[110] overflow-hidden border border-[#E5E5E5]"
          >
            <div className="p-8">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="px-3 py-1 bg-[#F5F5F0] text-[#5A5A40] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#E5E5E5]">
                        Guided Experience
                     </div>
                     <span className="text-slate-300">/</span>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Democratic Flow</p>
                  </div>
                  <button onClick={() => setIsGuided(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                     <X className="w-5 h-5 text-slate-400" />
                  </button>
               </div>
               
               <div className="flex gap-6 items-start mb-8">
                  <div className="w-12 h-12 bg-[#F5F5F0] rounded-xl flex items-center justify-center flex-shrink-0 text-[#5A5A40]">
                     {isSpeaking ? <Volume2 className="w-6 h-6 animate-pulse" /> : <Sparkles className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-[#1A1A17] tracking-tight mb-2 flex items-center gap-2">
                      Step {currentStep + 1} of {GUIDED_STEPS.length}
                    </h4>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {GUIDED_STEPS[currentStep].text}
                    </p>
                  </div>
               </div>

               <div className="flex items-center justify-between gap-4 pt-4">
                  <button 
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-5 py-3.5 rounded-xl bg-white border border-[#E5E5E5] text-[#5A5A40] disabled:opacity-20 hover:bg-slate-50 transition-colors font-bold text-sm"
                  >
                    Back
                  </button>
                  <button 
                    onClick={nextStep}
                    className="flex-1 py-4 bg-[#5A5A40] hover:bg-[#4A4A30] text-white rounded-[10px] font-black shadow-lg shadow-[#5A5A40]/10 transition-all flex items-center justify-center gap-2"
                  >
                    {currentStep === GUIDED_STEPS.length - 1 ? 'Finish Journey' : 'Next Step'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
            
            {/* Progress Bar (Olive) */}
            <div className="h-1 bg-slate-50 w-full">
               <motion.div 
                 animate={{ width: `${((currentStep + 1) / GUIDED_STEPS.length) * 100}%` }}
                 className="h-full bg-[#5A5A40]"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Panel: Knowledge Base */}
      <AnimatePresence>
        {selectedNode && !isGuided && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-white border-l border-[#E5E5E5] shadow-[0_0_80px_rgba(0,0,0,0.05)] z-[100] flex flex-col"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-10">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-[#F5F5F0] text-[#5A5A40] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#E5E5E5]">
                    System Insights
                 </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10">
               <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center shadow-sm border border-[#E5E5E5] ${getIconBg(selectedNode.color)}`}>
                  {React.cloneElement(selectedNode.icon as React.ReactElement, { className: 'w-7 h-7' })}
               </div>

               <h2 className="text-3xl font-black text-[#1A1A17] leading-none mb-3 tracking-tighter">
                 {selectedNode.title}
               </h2>
               {selectedNode.subtitle && (
                 <p className="text-[10px] font-black text-[#5A5A40] uppercase tracking-[0.2em] mb-10">
                   {selectedNode.subtitle}
                 </p>
               )}

               <div className="space-y-10">
                 <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#5A5A40] rounded-full opacity-20" />
                    <p className="text-slate-600 text-lg font-medium leading-relaxed pl-4">
                      {selectedNode.explanation}
                    </p>
                 </div>

                 {selectedNode.actionLabel && (
                   <button
                    onClick={() => {
                      if (selectedNode.link) {
                        navigate(selectedNode.link);
                      } else if (selectedNode.id === 'voters' || selectedNode.id === 'constituency') {
                        navigate('/');
                      }
                    }}
                    className="w-full py-5 rounded-[12px] bg-[#5A5A40] text-white font-black flex items-center justify-center gap-3 transition-all shadow-xl hover:bg-[#4A4A30] hover:-translate-y-0.5 active:scale-95"
                   >
                     {selectedNode.actionLabel}
                     <ChevronRight className="w-5 h-5" />
                   </button>
                 )}
                 
                 <div className="pt-10">
                    <div className="p-6 bg-[#F9F8F6] rounded-2xl border border-[#E5E5E5]">
                       <ShieldCheck className="w-6 h-6 text-slate-400 mb-4" />
                       <h5 className="font-black text-[10px] uppercase tracking-[0.2em] mb-2 text-slate-500">Institutional Role</h5>
                       <p className="text-sm text-slate-600 font-bold leading-relaxed">
                          Ensures that the democratic will of the people is translated into constitutional governance.
                       </p>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-End Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-slate-100/50 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#F5F5F0]/50 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}
