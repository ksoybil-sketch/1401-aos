import React from 'react';
import { useStore } from '../../store/useStore';
import { Icon } from '../Icon';
import {
  iconBtn, iconChip, listGroup, listRow, modalBody, modalGrabber,
  modalHeader, modalOverlay, modalPanel, modalTitle
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
          <h2 className={modalTitle}>Şube Seç</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className={modalBody}>
          <p className="text-[13px] text-fg-3 mb-3.5">
            İşlem yapmak istediğiniz şubeyi listeden seçin.
          </p>

          <div className={listGroup}>
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
                  className={listRow}
                >
                  <span className={iconChip(isSelected ? 'positive' : 'neutral')}>
                    <Icon name="store" size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[15px] truncate ${isSelected ? 'text-crema font-semibold' : 'text-crema font-medium'}`}>
                      {b.name}
                    </span>
                    {b.city && <span className="block text-[12px] text-fg-3 mt-0.5 truncate">{b.city}</span>}
                  </span>
                  {isSelected && <Icon name="check" size={16} className="text-positive shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
