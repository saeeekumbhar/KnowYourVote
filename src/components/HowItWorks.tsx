import { Search, MapPin, BookOpen, Clock } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-6 h-6 text-[#5A5A40]" />,
      title: "Enter PIN",
      description: "Enter your PIN code to locate your constituency."
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#5A5A40]" />,
      title: "Select Constituency",
      description: "Pick your area from the list of results."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#5A5A40]" />,
      title: "Understand System",
      description: "Learn about the election system and your candidates."
    },
    {
      icon: <Clock className="w-6 h-6 text-[#5A5A40]" />,
      title: "Follow Election Timeline",
      description: "Track the phases and key dates for your vote."
    }
  ];

  return (
    <section className="py-20 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A17] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[#706F66]">
            Four simple steps to becoming an informed voter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6E4DF] hover:shadow-md transition-shadow relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#EFECE8] flex items-center justify-center text-sm font-bold text-[#5A5A40] border-4 border-[#F9F8F6]">
                {index + 1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F9F8F6] flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A17] mb-3">{step.title}</h3>
              <p className="text-[#706F66] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
