import React from 'react';

interface CsvModalProps {
  onClose: () => void;
  onExportCSV: () => void;
  onImportCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CsvModal: React.FC<CsvModalProps> = ({ onClose, onExportCSV, onImportCSV }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">CSV İşlemleri</h2>
          <button onClick={onClose} className="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={onExportCSV} className="btn btn-primary">
            📥 Envanteri CSV Olarak Dışarı Aktar
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer', textAlign: 'center' }}>
            📤 CSV Dosyasından İçeri Aktar
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={onImportCSV}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
