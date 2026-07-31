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
    <header className="fixed top-0 inset-x-0 z-40 bg-void/70 backdrop-blur-2xl border-b border-hairline pt-[calc(12px+env(safe-area-inset-top))] pb-3 px-4">
      <div className="flex items-center justify-between gap-3 max-w-[560px] mx-auto">
        <div
          className="flex items-center gap-3 min-w-0 cursor-pointer transition-opacity active:opacity-60"
          onClick={() => navigate('/')}
        >
          {/* Logo — altın hâlesiyle */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gold/25 blur-lg [animation:auraPulse_4s_ease-in-out_infinite]" />
            <img
              src="/icons/logo_goat.svg"
              alt="1401 Logo"
              className="relative w-10 h-10 object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="font-extrabold text-[15px] tracking-[0.02em] text-content leading-tight">
              1401 COFFEE
            </div>
            <div className="text-[10px] font-bold text-content-muted uppercase tracking-[0.12em] truncate">
              {activeBranchId ? `${branchDisplayName} ŞUBESİ` : 'AKILLI OPERASYON SİSTEMİ'}
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center shrink-0">
          {/* Sadece Şube Müdürü ve Bölge Müdürü şube değiştirebilir */}
          {userRole !== 'Barista' && (
            <button
              onClick={onOpenBranchModal}
              className="h-9 px-3 rounded-full bg-glass-2 border border-hairline text-gold text-[11px] font-semibold max-w-[104px] truncate cursor-pointer transition-all duration-200 hover:bg-glass-3 active:scale-95"
            >
              {branchDisplayName}
            </button>
          )}

          <button
            onClick={onOpenRoleModal}
            className="h-9 px-3.5 rounded-full bg-gradient-to-b from-gold-soft to-gold text-night text-[11px] font-bold cursor-pointer transition-all duration-200 shadow-[0_6px_18px_-8px_rgba(217,182,95,0.8)] hover:brightness-110 active:scale-95"
          >
            {userRole === 'Barista' && activeBarista ? activeBarista.name.split(' ')[0] : userRole}
          </button>
        </div>
      </div>
    </header>
  );
};
