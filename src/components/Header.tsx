import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, BaristaProfile } from '../types';
import { useStore } from '../store/useStore';

interface HeaderProps {
  userRole: UserRole;
  activeBranchId: string;
  activeBarista?: BaristaProfile | null;
  onOpenRoleModal: () => void;
  onOpenBranchModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  activeBranchId,
  activeBarista,
  onOpenRoleModal,
  onOpenBranchModal
}) => {
  const { branches } = useStore();
  const navigate = useNavigate();
  const currentBranchObj = branches.find(b => b.id === activeBranchId);
  const branchDisplayName = currentBranchObj ? currentBranchObj.name : (activeBranchId || 'Şube Seç');

  return (
    <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3 cursor-pointer active:opacity-70" onClick={() => navigate('/')}>
        <img src="/icons/logo_goat.svg" alt="1401 Logo" className="w-10 h-10 object-contain drop-shadow-md" />
        <div className="flex flex-col">
          <div className="font-extrabold text-sm tracking-tight text-gray-900">1401 COFFEE</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
            {activeBranchId ? `${branchDisplayName} ŞUBESİ` : 'AKILLI OPERASYON SİSTEMİ'}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 items-center flex-shrink-0">
        {/* Sadece Şube Müdürü ve Bölge Müdürü şube değiştirebilir */}
        {userRole !== 'Barista' && (
          <button
            onClick={onOpenBranchModal}
            className="bg-surface-2 border border-surface-border text-gold text-[11px] py-1 px-2 rounded-md cursor-pointer font-semibold max-w-[90px] overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {branchDisplayName}
          </button>
        )}

        <button
          onClick={onOpenRoleModal}
          className="bg-ink text-[#0E0C0B] border-none text-[11px] py-1 px-2 rounded-full cursor-pointer font-bold whitespace-nowrap"
        >
          {userRole === 'Barista' && activeBarista ? activeBarista.name.split(' ')[0] : userRole}
        </button>
      </div>
    </header>
  );
};
