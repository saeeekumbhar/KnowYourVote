export interface Constituency {
  id: string;
  pincodes?: string[];
  city?: string;
  name: string;
  state: string;
  previousMP: string;
}

export interface Candidate {
  id: string;
  constituency_id: string;
  name: string;
  party: string;
  photo?: string;
  hometown: string;
  residence?: string;
  experience: string;
  pastPositions?: string[];
  pastParty?: string;
  age?: number;
  education?: string;
  status?: string;
  votes?: number;
  announcement_order?: number;
}

export interface CandidateHistoryRole {
  role: string;
  year: string;
  description: string;
}

export type PhaseType = 'registration' | 'announcement' | 'campaign' | 'voting' | 'results';

export interface TimelinePhase {
  id: PhaseType;
  name: string;
  status: 'completed' | 'active' | 'upcoming';
  date?: string;
}

export interface ElectionStats {
  total_electors: number;
  votes_polled: number;
  turnout_percent: number;
  constituency_type: string;
}

export interface ElectionStatus {
  current_phase_id: string;
  timeline: TimelinePhase[];
  stats?: ElectionStats;
}

export interface PartyData {
  name: string;
  seats: number;
  color: string;
}

export interface NationalOverview {
  election_name: string;
  total_seats: number;
  majority_mark: number;
  curated_seats: number;
  parties: PartyData[];
}
