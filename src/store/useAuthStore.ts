import { create } from 'zustand';
import { UserRole, BaristaProfile } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  activeBarista: BaristaProfile | null;
  branchId: string;
  activeBranchId: string;
  regionId: string | null;
  regionBranches: any[];
  setAuth: (isAuthenticated: boolean, role: UserRole, barista?: BaristaProfile | null, regionId?: string | null) => void;
  logout: () => void;
  setBranch: (branchId: string) => void;
  setRegionBranches: (branches: any[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: 'Barista',
  activeBarista: null,
  branchId: 'moda_cadde',
  activeBranchId: 'moda_cadde',
  regionId: null,
  regionBranches: [],
  setAuth: (isAuthenticated, role, barista = null, regionId = null) => 
    set({ isAuthenticated, userRole: role, activeBarista: barista, regionId }),
  logout: () => set({ isAuthenticated: false, userRole: 'Barista', activeBarista: null, regionId: null, regionBranches: [] }),
  setBranch: (branchId) => set({ branchId, activeBranchId: branchId }),
  setRegionBranches: (branches) => set({ regionBranches: branches }),
}));
