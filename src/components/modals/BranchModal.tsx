import React from 'react';
import { useStore } from '../../store/useStore';

interface BranchModalProps {
  currentBranchId: string;
  onClose: () => void;
  onSelectBranch: (branchId: string) => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({ currentBranchId, onClose, onSelectBranch }) => {
  const { branches } = useStore();
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Şube Bağlantısı</h2>
          <button onClick={onClose} className="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-inner">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            İşlem yapmak istediğiniz şubeyi listeden seçin:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                  className="btn"
                  style={{
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-2)',
                    color: isSelected ? '#000' : 'var(--text-main)',
                    border: '1px solid var(--surface-border)',
                    textAlign: 'left',
                    justifyContent: 'space-between',
                    padding: '14px 16px'
                  }}
                >
                  <span style={{ fontWeight: 700 }}>📍 {b.name}</span>
                  <span style={{ fontSize: '12px', opacity: 0.8 }}>{b.city}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
