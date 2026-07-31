import React from 'react';
import { ActiveTab, UserRole } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  userRole?: UserRole;
}

interface NavItem {
  tab: ActiveTab;
  label: string;
  icon: React.ReactNode;
  visible: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate, userRole }) => {
  const items: NavItem[] = [
    {
      tab: 'dashboard',
      label: 'Ana Ekran',
      visible: true,
      icon: (
        <>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      )
    },
    {
      tab: 'inventory',
      label: 'Envanter',
      visible: userRole !== 'Bölge Müdürü',
      icon: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    },
    {
      tab: 'recipes',
      label: 'Reçeteler',
      visible: userRole === 'Barista',
      icon: (
        <>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </>
      )
    },
    {
      tab: 'reports',
      label: 'Raporlar',
      visible: userRole === 'Şube Müdürü',
      icon: (
        <>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </>
      )
    }
  ];

  const visibleItems = items.filter(i => i.visible);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-[calc(14px+env(safe-area-inset-bottom))] pt-2 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-[420px] flex items-center gap-1 p-1.5 rounded-[26px] bg-surface-deep/85 backdrop-blur-2xl border border-hairline shadow-[0_12px_40px_-8px_rgba(0,0,0,0.85)]">
        {visibleItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 h-14 rounded-[20px] cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'bg-gold/12 text-gold'
                  : 'text-content-muted hover:text-content-secondary active:scale-95'
              }`}
            >
              {/* Aktif sekme göstergesi */}
              {isActive && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(217,182,95,0.7)]" />
              )}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[22px] h-[22px]"
              >
                {item.icon}
              </svg>
              <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
