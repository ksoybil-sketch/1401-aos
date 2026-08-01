import React from 'react';
import { ActiveTab, UserRole } from '../types';
import { Icon, IconName } from './Icon';

interface BottomNavProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  userRole?: UserRole;
}

interface NavItem {
  tab: ActiveTab;
  label: string;
  icon: IconName;
  visible: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate, userRole }) => {
  const items: NavItem[] = [
    { tab: 'dashboard', label: 'Ana Ekran', icon: 'home', visible: true },
    { tab: 'inventory', label: 'Envanter', icon: 'box', visible: userRole !== 'Bölge Müdürü' },
    { tab: 'recipes', label: 'Reçeteler', icon: 'book', visible: userRole === 'Barista' },
    { tab: 'reports', label: 'Raporlar', icon: 'chart', visible: userRole === 'Şube Müdürü' }
  ];

  const visibleItems = items.filter(i => i.visible);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-bean/92 backdrop-blur-xl border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch max-w-[560px] mx-auto px-2">
        {visibleItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 h-14 cursor-pointer transition-colors duration-150 ${
                isActive ? 'text-crema' : 'text-fg-3 hover:text-fg-2'
              }`}
            >
              <Icon name={item.icon} size={21} strokeWidth={isActive ? 1.9 : 1.5} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
