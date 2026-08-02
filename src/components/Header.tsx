import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, BaristaProfile } from '../types';
import { useStore } from '../store/useStore';
import { Icon } from './Icon';

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
    <header className="fixed top-0 inset-x-0 z-40 bg-espresso/85 backdrop-blur-xl border-b border-line pt-[env(safe-area-inset-top)]">
      <div className="h-14 flex items-center justify-between gap-3 px-4 max-w-[560px] mx-auto">
        <div
          className="flex items-center gap-2.5 min-w-0 cursor-pointer transition-opacity active:opacity-60"
          onClick={() => navigate('/')}
        >
          <img src="/icons/logo_goat.svg" alt="" className="w-7 h-7 object-contain opacity-90" />
          <div className="flex flex-col min-w-0 leading-none">
            {/* truncate şart: 320px'lik ekranda şube + rol butonu yan yanayken
                marka adı iki satıra kırılıp butonların altına taşıyordu. */}
            <span className="text-[14px] font-semibold text-crema tracking-tight truncate">1401 Coffee</span>
            <span className="text-[11px] text-fg-3 truncate mt-0.5">
              {activeBranchId ? branchDisplayName : 'Akıllı Operasyon Sistemi'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center shrink-0">
          {/* Sadece Şube Müdürü ve Bölge Müdürü şube değiştirebilir */}
          {userRole !== 'Barista' && (
            <button
              onClick={onOpenBranchModal}
              className="h-8 pl-2 pr-2.5 inline-flex items-center gap-1.5 rounded-lg bg-panel-2 border border-line text-fg-2 text-[12px] font-medium max-w-[84px] min-[360px]:max-w-[112px] cursor-pointer transition-colors hover:bg-panel-3 hover:text-crema active:opacity-80"
            >
              <Icon name="store" size={14} />
              <span className="truncate">{branchDisplayName}</span>
            </button>
          )}

          <button
            onClick={onOpenRoleModal}
            className="h-8 pl-2 pr-2.5 inline-flex items-center gap-1.5 rounded-lg bg-panel-2 border border-line text-crema text-[12px] font-medium cursor-pointer transition-colors hover:bg-panel-3 active:opacity-80"
          >
            <Icon name={userRole === 'Barista' ? 'user' : 'shield'} size={14} />
            {/* 320px'lik ekranda marka adı + şube + rol aynı satıra sığmıyor.
                En dar cihazlarda rol butonu ikona iniyor; şube adı kalıyor
                çünkü müdür için hangi şubede olduğu daha kritik bilgi. */}
            <span className="hidden min-[360px]:inline truncate max-w-[96px]">
              {userRole === 'Barista' && activeBarista ? activeBarista.name.split(' ')[0] : userRole}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
