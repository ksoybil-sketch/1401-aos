import React from 'react';
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
  const currentBranchObj = branches.find(b => b.id === activeBranchId);
  const branchDisplayName = currentBranchObj ? currentBranchObj.name : (activeBranchId || 'Şube Seç');

  return (
    <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/icons/logo_goat.svg" alt="1401 Logo" className="w-10 h-10 object-contain drop-shadow-md" />
        <div className="flex flex-col">
          <div className="font-extrabold text-sm tracking-tight text-gray-900">1401 COFFEE</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
            {activeBranchId ? `${branchDisplayName} ŞUBESİ` : 'AKILLI OPERASYON SİSTEMİ'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
        {/* Sadece Şube Müdürü ve Bölge Müdürü şube değiştirebilir */}
        {userRole !== 'Barista' && (
          <button
            onClick={onOpenBranchModal}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--surface-border)',
              color: 'var(--accent)',
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              maxWidth: '90px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {branchDisplayName}
          </button>
        )}

        <button
          onClick={onOpenRoleModal}
          style={{
            background: 'var(--primary)',
            color: '#0E0C0B',
            border: 'none',
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '100px',
            cursor: 'pointer',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}
        >
          {userRole === 'Barista' && activeBarista ? activeBarista.name.split(' ')[0] : userRole}
        </button>
      </div>
    </header>
  );
};
