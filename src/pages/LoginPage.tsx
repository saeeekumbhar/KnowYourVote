import { LogIn, Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="h-screen w-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] mix-blend-multiply"
        style={{ 
          backgroundImage: 'url("/voting-bg.png")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          filter: 'grayscale(20%)'
        }}
      ></div>
      <div className="absolute inset-0 z-[1] bg-radial-gradient from-transparent to-[#F9F8F6]/80"></div>

      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5A5A40]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D97706]/5 rounded-full blur-[150px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-12 relative z-10"
      >
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="bg-white p-5 rounded-[2rem] shadow-xl border border-[#E6E4DF] cursor-pointer"
          >
            <Fingerprint className="w-12 h-12 text-[#5A5A40] stroke-[1.2]" />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter text-[#1A1A17] leading-none">
              Know<span className="text-[#5A5A40]">Your</span>Vote
            </h1>
            <p className="text-xl text-[#706F66] font-medium tracking-tight max-w-lg mx-auto leading-relaxed">
              Understand your vote, your constituency, <br className="hidden md:block" /> and your role in democracy.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={loginWithGoogle}
            className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#3c4043] rounded-full font-bold text-lg hover:shadow-xl transition-all border border-[#dadce0] shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-outfit tracking-tight">Continue with Google</span>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="pt-8"
        >
          <div className="max-w-[320px] mx-auto text-center">
            <p className="text-[10px] text-[#8B8982] leading-relaxed uppercase tracking-wider opacity-80">
              <span className="font-bold block mb-1">Educational Platform</span> 
              Not affiliated with any government authority or the Election Commission of India.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
