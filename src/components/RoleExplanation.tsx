import { Gavel, Users, Banknote, HelpCircle } from 'lucide-react';

export function RoleExplanation() {
  const roles = [
    {
      icon: <Gavel className="w-5 h-5" />,
      title: "Lawmaking",
      description: "Debating and passing bills that become the laws of the country."
    },
    {
      icon: <Banknote className="w-5 h-5" />,
      title: "Budget Approval",
      description: "Reviewing and authorizing the government's budget and taxation policies."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Representation",
      description: "Raising local constituency issues at the national level in Parliament."
    }
  ];

  return (
    <div className="bg-[#5A5A40] rounded-3xl p-8 text-white flex-1 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-serif italic mb-6 text-white">What does an MP do?</h2>
        
        <div className="space-y-6">
          {roles.map((role, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                {role.icon}
              </div>
              <div>
                <h4 className="font-bold text-white leading-tight mb-1">{role.title}</h4>
                <p className="text-sm text-white/70 leading-relaxed">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 mt-6 border-t border-white/10">
        <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Pro Tip</p>
        <p className="text-sm italic font-serif text-white/90">"Your MP is your direct link to the Prime Minister and the Cabinet."</p>
      </div>
    </div>
  );
}
