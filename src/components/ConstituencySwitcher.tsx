import { useEffect, useState } from 'react';
import { getAllConstituencies } from '../services/api';
import { Constituency } from '../types';

interface ConstituencySwitcherProps {
  currentId?: string;
  onChange: (id: string) => void;
}

export function ConstituencySwitcher({ currentId, onChange }: ConstituencySwitcherProps) {
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);

  useEffect(() => {
    getAllConstituencies().then(setConstituencies);
  }, []);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex gap-3 min-w-max items-center">
        <span className="text-xs font-bold text-[#8B8982] uppercase tracking-widest mr-2">
          Select Constituency:
        </span>
        {constituencies.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              currentId === c.id
                ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-md scale-105'
                : 'bg-white text-[#706F66] border-[#E6E4DF] hover:border-[#5A5A40] hover:text-[#5A5A40]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
