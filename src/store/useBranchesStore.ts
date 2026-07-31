import { create } from 'zustand';
import { BranchInfo } from '../types';

interface BranchesState {
  branches: BranchInfo[];
  setBranches: (branches: BranchInfo[]) => void;
}

export const useBranchesStore = create<BranchesState>((set) => ({
  branches: [],
  setBranches: (branches) => set({ branches }),
}));
