import { Vote, MapPin, Clock } from 'lucide-react';

export function FeatureCards() {
  const features = [
    {
      icon: <Vote className="w-8 h-8 text-[#5A5A40]" />,
      title: "Understand Elections",
      description: "Get clear insights into how elections work and why your vote matters."
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#5A5A40]" />,
      title: "Explore Your Constituency",
      description: "Dive deep into your local candidates, their history, and constituency data."
    },
    {
      icon: <Clock className="w-8 h-8 text-[#5A5A40]" />,
      title: "Track Election Phases",
      description: "Stay updated with real-time tracking of election timelines and phases."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A17] mb-4">
            Why use Know Your Vote?
          </h2>
          <p className="text-lg text-[#706F66]">
            Our mission is to make democracy accessible to everyone.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-[#F9F8F6] border border-[#EFECE8] flex items-center justify-center mb-6 transform transition-transform hover:scale-105">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1A1A17] mb-2">{feature.title}</h3>
              <p className="text-[#706F66] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
