import { Map, Users, LayoutDashboard, Menu, X, Fingerprint, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useElectionPhase } from '../context/ElectionPhaseContext';
import { useAuth } from '../context/AuthContext';
import { AccessibilityToolbar } from './AccessibilityToolbar';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { setIsDevPanelOpen } = useElectionPhase();
  const { user, loginWithGoogle, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Understand the System', path: '/system', icon: <Map className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-[#F9F8F6]/90 backdrop-blur-md border-b border-[#E6E4DF] sticky top-0 z-[50] font-outfit shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2 group">
               <div className="flex items-center justify-center text-[#5A5A40] transition-all transform group-hover:scale-110">
                  <Fingerprint className="w-9 h-9 stroke-[1.5]" />
               </div>
               <span className="text-2xl font-black tracking-tighter text-[#1A1A17] ml-1">
                  Know<span className="text-[#5A5A40]">Your</span>Vote
               </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors border-b-2 h-24",
                  location.pathname === item.path
                    ? "border-[#5A5A40] text-[#1A1A17]"
                    : "border-transparent text-[#5A5A40] hover:border-[#E6E4DF] hover:text-[#1A1A17]"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={() => setIsDevPanelOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#EFECE8] text-[#5A5A40] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#E6E4DF] transition-colors"
            >
              <Fingerprint className="w-3 h-3" />
              DEV MODE
            </button>

            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#706F66] hidden md:block">
                  {user.displayName}
                </span>
                
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9F8F6] text-[#706F66] border border-[#E6E4DF] rounded-full text-sm font-bold hover:bg-[#E6E4DF] hover:text-[#5A5A40] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>

                <AccessibilityToolbar />
              </div>
            )}
          </div>

           {/* Mobile menu button */}
           <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#706F66] hover:text-[#5A5A40] hover:bg-[#F9F8F6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#5A5A40]"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

       {/* Mobile nav */}
       {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  location.pathname === item.path
                    ? "bg-[#F9F8F6] border-[#5A5A40] text-[#5A5A40]"
                    : "border-transparent text-[#706F66] hover:bg-[#F9F8F6] hover:border-[#E6E4DF] hover:text-[#5A5A40]"
                )}
              >
                <div className="flex items-center gap-2">
                    {item.icon}
                    {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
