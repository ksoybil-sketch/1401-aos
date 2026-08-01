import React from 'react';
import { Icon } from '../Icon';
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
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className={`${modalBody} flex flex-col gap-2.5`}>
          <button onClick={onExportCSV} className={`${btn} ${btnPrimary} ${btnLg} w-full`}>
            <Icon name="download" size={17} />
            Envanteri dışa aktar
          </button>

          <label className={`${btn} ${btnSecondary} ${btnLg} w-full`}>
            <Icon name="upload" size={17} />
            CSV dosyasından içe aktar
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
