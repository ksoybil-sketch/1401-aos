import React from 'react';
import { useStore } from '../../store/useStore';
import {
  cardInteractive, iconBtn, modalBody, modalGrabber, modalHeader,
  modalOverlay, modalPanel, modalTitle
} from '../../constants/ui';

interface BranchModalProps {
  currentBranchId: string;
  onClose: () => void;
  onSelectBranch: (branchId: string) => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({ currentBranchId, onClose, onSelectBranch }) => {
  const { branches } = useStore();

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>Şube Bağlantısı</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={modalBody}>
          <p className="text-[13px] text-content-muted mb-4">
            İşlem yapmak istediğiniz şubeyi listeden seçin:
          </p>

          <div className="flex flex-col gap-3">
            {branches.map((b) => {
              const isSelected = currentBranchId === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onSelectBranch(b.id);
                    onClose();
                  }}
                  className={`${cardInteractive} rounded-2xl py-4 px-5 flex items-center justify-between gap-3 text-left ${
                    isSelected ? 'border-gold/50 bg-gold/10' : ''
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base">📍</span>
                    <span className={`font-bold truncate ${isSelected ? 'text-gold' : 'text-content'}`}>{b.name}</span>
                  </span>
                  <span className="text-xs text-content-muted shrink-0">{b.city}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
