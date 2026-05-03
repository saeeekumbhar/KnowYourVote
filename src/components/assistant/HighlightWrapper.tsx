import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface HighlightWrapperProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  id?: string;
}

export function HighlightWrapper({ children, isActive: manualActive, className, id }: HighlightWrapperProps) {
  // If we wanted to make this truly global, we could use a context, 
  // but for now, we'll let Dashboard handle the ID matching.
  const isActive = manualActive;

  return (
    <div
      id={id}
      className={cn(
        "transition-all duration-700 rounded-[2.5rem]",
        isActive 
          ? "relative z-[60] bg-white ring-[20px] ring-white shadow-[0_0_100px_rgba(0,0,0,0.3)] scale-[1.01]" 
          : "relative z-10",
        className
      )}
    >
      {children}
    </div>
  );
}
