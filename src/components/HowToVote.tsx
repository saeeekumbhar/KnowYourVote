import { ClipboardCheck, MapPin, CreditCard, Vote } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    title: "Check Voter Registration",
    description: "Visit the NVSP portal or your nearest Voter Helpline to verify your name is on the electoral roll.",
    link: "https://www.nvsp.in/",
    linkText: "Check on NVSP →"
  },
  {
    icon: MapPin,
    title: "Find Your Polling Booth",
    description: "Use the Voter Helpline app or Electoral Search to find the exact location of your polling station.",
    link: "https://electoralsearch.eci.gov.in/",
    linkText: "Find Booth →"
  },
  {
    icon: CreditCard,
    title: "Carry Valid Photo ID",
    description: "On voting day, carry your Voter ID (EPIC card), Aadhaar, Passport, or any government-approved photo ID.",
  },
  {
    icon: Vote,
    title: "Cast Your Vote",
    description: "Go to your assigned booth, verify your identity, get inked, and press the button on the EVM next to your chosen candidate.",
  }
];

export function HowToVote() {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E4DF] shadow-sm">
      <div className="flex items-center gap-2 border-b border-[#E6E4DF] pb-4 mb-6">
        <Vote className="w-5 h-5 text-[#D97706]" />
        <h2 className="text-xl font-bold text-[#1A1A17]">How to Vote</h2>
        <span className="ml-auto text-xs text-[#706F66]">Step-by-step</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4 p-4 bg-[#F9F8F6] rounded-2xl border border-[#EFECE8] hover:border-[#D97706]/30 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#EFECE8] flex items-center justify-center">
                <span className="text-sm font-bold text-[#5A5A40]">{index + 1}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <step.icon className="w-4 h-4 text-[#5A5A40]" />
                <h3 className="font-bold text-sm text-[#1A1A17]">{step.title}</h3>
              </div>
              <p className="text-xs text-[#706F66] leading-relaxed">{step.description}</p>
              {step.link && (
                <a 
                  href={step.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-bold text-[#D97706] hover:text-[#B45309] transition-colors"
                >
                  {step.linkText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
