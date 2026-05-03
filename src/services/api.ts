import dependenciesJson from '../data/constituencies.json';
import candidatesJson from '../data/candidates.json';
import candidateHistoryJson from '../data/candidate_history.json';
import electionStatusJson from '../data/election_status.json';
import nationalOverviewJson from '../data/national_overview.json';

import { Constituency, Candidate, CandidateHistoryRole, ElectionStatus, NationalOverview } from '../types';

// Mocking simple API calls with a delay to simulate network requests

export const getConstituencyById = async (id: string): Promise<Constituency | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        const constituencies = dependenciesJson as Constituency[];
        const match = constituencies.find(c => c.id === id);
        resolve(match);
    }, 300);
  });
};

export const getAllConstituencies = async (): Promise<Constituency[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(dependenciesJson as Constituency[]);
    }, 200);
  });
};

export const getCandidatesByConstituency = async (constituencyId: string): Promise<Candidate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        const candidates = candidatesJson as Candidate[];
        resolve(candidates.filter(c => c.constituency_id === constituencyId));
    }, 400);
  });
};

export const getCandidateHistory = async (candidateId: string): Promise<CandidateHistoryRole[]> => {
   return new Promise((resolve) => {
    setTimeout(() => {
        const historyMap = candidateHistoryJson as Record<string, CandidateHistoryRole[]>;
        resolve(historyMap[candidateId] || []);
    }, 200);
  });
}

export const getElectionStatus = async (): Promise<ElectionStatus> => {
   return new Promise((resolve) => {
    setTimeout(() => {
        resolve(electionStatusJson as ElectionStatus);
    }, 200);
  });
}

export const getNationalOverview = async (): Promise<NationalOverview> => {
   return new Promise((resolve) => {
    setTimeout(() => {
        resolve(nationalOverviewJson as NationalOverview);
    }, 200);
  });
}
