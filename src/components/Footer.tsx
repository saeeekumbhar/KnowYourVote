import { Link } from 'react-router-dom';
import { Mail, Fingerprint } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1A17] text-[#A3A199] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-start">
          {/* Brand & Description */}
          <div className="md:col-span-2 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
               <div className="text-white transition-all">
                  <Fingerprint className="w-8 h-8 stroke-[1.5]" />
               </div>
               <span className="text-xl font-black tracking-tighter text-white">
                  Know<span className="text-[#5A5A40]">Your</span>Vote
               </span>
            </div>
            <p className="text-xs leading-relaxed text-[#8B8982]">
              Know Your Vote is an interactive platform designed to make election data accessible, 
              interactive, and engaging. By combining real-time constituency insights and candidate histories, 
              we're bridging the gap between voters and the democratic process.
            </p>
          </div>
          
          {/* Contact Section */}
          <div className="md:text-right">
            <h4 className="text-white font-bold mb-1 text-sm">Still have questions?</h4>
            <p className="text-xs text-[#8B8982] mb-3 font-medium">Email us at:</p>
            <a 
              href="mailto:saeeekumbhar@gmail.com" 
              className="inline-flex items-center gap-2 text-white font-bold hover:text-[#5A5A40] transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              saeeekumbhar@gmail.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-xl text-white font-medium mb-6 font-outfit">
            Credits: <span className="text-white font-black underline decoration-[#5A5A40] underline-offset-4 decoration-2">Saee Kumbhar</span>. All Rights Reserved.
          </p>
          
          <div className="bg-white/5 inline-block px-8 py-4 rounded-2xl border border-white/5 text-sm text-[#8B8982] max-w-3xl mx-auto leading-relaxed shadow-sm">
            <span className="font-bold text-[#A3A199] mr-1 uppercase tracking-widest text-xs block mb-2">Disclaimer:</span> 
            This platform is for educational and informational purposes only. It is not affiliated with any government authority or the Election Commission of India. For official information, please refer to the Election Commission of India.
          </div>
        </div>
      </div>
    </footer>
  );
}
