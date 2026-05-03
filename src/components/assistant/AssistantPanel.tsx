import React from 'react';
import { X, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StepContent {
  title: string;
  message: string;
  details?: React.ReactNode;
  options?: {
    label: string;
    onClick: () => void;
    primary?: boolean;
    icon?: React.ReactNode;
  }[];
}

interface AssistantPanelProps {
  content: StepContent;
  onSkip: () => void;
  canGoBack?: boolean;
  onBack?: () => void;
  isWalkthrough?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export function AssistantPanel({ 
  content, 
  onSkip,
  canGoBack,
  onBack,
  isWalkthrough,
  currentStep = 0,
  totalSteps = 0
}: AssistantPanelProps) {
  
  return (
    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-[#E6E4DF] z-[60] overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto relative">
      
      {/* Header */}
      <div className="bg-[#5A5A40] text-white px-6 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#D97706]" />
            <span className="font-bold text-base tracking-tight">Guided Assistant</span>
          </div>
          
          {isWalkthrough && currentStep > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Tour</span>
              <div className="h-3 w-[1px] bg-white/20" />
              <span className="text-[10px] font-bold text-white/70">Step {currentStep} of {totalSteps}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isWalkthrough && (
            <button 
              onClick={onSkip} 
              className="text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors px-3 py-1.5 border border-white/20 rounded-lg hover:bg-white/10"
            >
              Skip Tour
            </button>
          )}
          <button onClick={onSkip} className="text-white/70 hover:text-white transition-colors p-1" title="Close Assistant">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Main Content */}
        <div>
          <h3 className="text-3xl font-bold text-[#1A1A17] mb-3 tracking-tight">{content.title}</h3>
          <p className="text-[#706F66] text-lg leading-relaxed font-light">{content.message}</p>
          {content.details && (
            <div className="mt-4">
              {content.details}
            </div>
          )}
        </div>

        {/* Dynamic Options Area */}
        {content.options && content.options.length > 0 && (
          <div className="space-y-3 mt-6">
             {content.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={opt.onClick}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl text-left font-bold transition-all text-lg",
                    opt.primary 
                      ? "bg-[#5A5A40] text-white hover:bg-[#4A4A30] shadow-md hover:scale-[1.01]" 
                      : "bg-[#F9F8F6] text-[#1A1A17] border border-[#E6E4DF] hover:border-[#5A5A40] hover:bg-white"
                  )}
                >
                   {opt.icon && <span className={opt.primary ? "text-white" : "text-[#5A5A40]"}>{opt.icon}</span>}
                   <span className="flex-1">{opt.label}</span>
                </button>
             ))}
          </div>
        )}
      </div>

      {/* Footer Back Button (if applicable) */}
      {canGoBack && onBack && (
         <div className="p-6 border-t border-[#EFECE8] bg-[#F9F8F6] shrink-0">
            <button 
              onClick={onBack}
              className="px-6 py-2.5 text-base font-bold text-[#706F66] hover:text-[#1A1A17] transition-colors"
            >
              ← Back to previous
            </button>
         </div>
      )}

    </div>
  );
}
