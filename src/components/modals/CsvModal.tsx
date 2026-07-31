import React from 'react';
import {
  btn, btnLg, btnPrimary, btnSecondary, iconBtn, modalBody, modalGrabber,
  modalHeader, modalOverlay, modalPanel, modalTitle
} from '../../constants/ui';

interface CsvModalProps {
  onClose: () => void;
  onExportCSV: () => void;
  onImportCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CsvModal: React.FC<CsvModalProps> = ({ onClose, onExportCSV, onImportCSV }) => {
  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>CSV İşlemleri</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={`${modalBody} flex flex-col gap-3`}>
          <button onClick={onExportCSV} className={`${btn} ${btnPrimary} ${btnLg} w-full`}>
            📥 Envanteri CSV Olarak Dışarı Aktar
          </button>

          <label className={`${btn} ${btnSecondary} ${btnLg} w-full`}>
            📤 CSV Dosyasından İçeri Aktar
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onImportCSV}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
