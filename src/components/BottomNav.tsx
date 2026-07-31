import React from 'react';
import { ActiveTab, UserRole } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  userRole?: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate, userRole }) => {
  return (
    <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-around items-center h-16 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center gap-1 w-20 transition ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-[10px] font-semibold">Ana Ekran</span>
      </button>

      {userRole !== 'Bölge Müdürü' && (
        <button
          onClick={() => onNavigate('inventory')}
          className={`flex flex-col items-center gap-1 w-20 transition ${activeTab === 'inventory' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-[10px] font-semibold">Envanter</span>
        </button>
      )}

      {userRole === 'Barista' && (
        <button
          onClick={() => onNavigate('recipes')}
          className={`flex flex-col items-center gap-1 w-20 transition ${activeTab === 'recipes' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="text-[10px] font-semibold">Reçeteler</span>
        </button>
      )}
    </nav>
  );
};
