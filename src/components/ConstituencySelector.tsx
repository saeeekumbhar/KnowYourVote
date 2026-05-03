import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Check } from 'lucide-react';
import { getAllConstituencies } from '../services/api';
import { Constituency } from '../types';
import mapping from '../data/pincode_mapping.json';

interface ConstituencySelectorProps {
  onSelect: (id: string) => void;
  onHighlight?: (id: string | null) => void;
  assistantMode?: boolean;
}

export function ConstituencySelector({ onSelect, onHighlight, assistantMode }: ConstituencySelectorProps) {
  const [mode, setMode] = useState<'pin' | 'browse'>('pin');
  const [pincode, setPincode] = useState('');
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getAllConstituencies().then(setConstituencies);
  }, []);

  useEffect(() => {
    if (!onHighlight) return;
    const val = pincode.trim();
    if (val.length === 6 && /^\d+$/.test(val)) {
      const match = mapping.find(m => m.pincode === val);
      onHighlight(match ? match.constituency_id : null);
    } else {
      onHighlight(null);
    }
  }, [pincode, onHighlight]);

  const [error, setError] = useState<string | null>(null);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = pincode.trim();
    if (!val) return;
    
    if (val.length !== 6 || !/^\d+$/.test(val)) {
      setError("Enter valid 6-digit PIN");
      return;
    }
    
    setError(null);
    const match = mapping.find(m => m.pincode === val);
    if (match) {
      onSelect(match.constituency_id);
    } else {
      setError("PIN not found. Try Browse mode.");
    }
  };

  const handleBrowseSelect = (id: string) => {
    setSelectedId(id);
    setIsOpen(false);
    if (onHighlight) onHighlight(id);
    onSelect(id);
  };

  return (
    <div className="w-full max-w-md relative z-50">
      {assistantMode && (
        <div className="absolute -top-3 left-4 bg-[#D97706] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm z-10 animate-pulse">
          Assistant Mode On
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <button 
          onClick={() => setMode('pin')}
          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${mode === 'pin' ? 'bg-[#5A5A40] text-white' : 'bg-[#EFECE8] text-[#706F66] hover:bg-[#E6E4DF]'}`}
        >
          By PIN Code
        </button>
        <button 
          onClick={() => setMode('browse')}
          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${mode === 'browse' ? 'bg-[#5A5A40] text-white' : 'bg-[#EFECE8] text-[#706F66] hover:bg-[#E6E4DF]'}`}
        >
          Browse Key Seats
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-[#E6E4DF] focus-within:border-[#5A5A40] focus-within:ring-2 focus-within:ring-[#EFECE8] transition-all relative z-50">
        {mode === 'pin' ? (
          <>
          <form onSubmit={handlePinSubmit} className="relative flex items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#8B8982]" />
              </div>
              <input
                id="search-input"
                type="text"
                className="block w-full pl-11 pr-4 py-3 sm:text-sm border-0 focus:ring-0 rounded-xl bg-transparent placeholder:text-[#8B8982] outline-none text-[#33332D]"
                placeholder="Enter PIN (e.g. 411001, 400001)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-[#5A5A40] hover:bg-[#4A4A30] focus:outline-none transition-colors disabled:opacity-50"
              disabled={!pincode.trim()}
            >
              Search
            </button>
          </form>
          {error && <p className="text-xs text-red-500 font-bold mt-2 ml-2">{error}</p>}
          </>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between pl-11 pr-4 py-3 text-sm text-[#33332D] outline-none rounded-xl hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-[#8B8982]" />
              </div>
              <span>
                {selectedId ? constituencies.find(c => c.id === selectedId)?.name : 'Select a featured constituency'}
              </span>
              <ChevronDown className={`h-4 w-4 text-[#8B8982] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E6E4DF] rounded-2xl shadow-xl z-[9999] py-2 max-h-60 overflow-y-auto">
                {constituencies.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleBrowseSelect(c.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-[#706F66] hover:bg-[#F9F8F6] hover:text-[#1A1A17] transition-colors"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{c.name}</span>
                      <span className="text-[10px] text-[#8B8982] uppercase">{c.state}</span>
                    </div>
                    {selectedId === c.id && <Check className="w-4 h-4 text-[#5A5A40]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {mode === 'pin' && (
        <p className="text-[10px] text-[#8B8982] mt-2 ml-2 uppercase font-bold tracking-widest">
          Try 411001, 400001, 440001, 422001, 431001
        </p>
      )}
    </div>
  );
}
