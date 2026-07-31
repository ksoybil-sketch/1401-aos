import React from 'react';

interface CsvModalProps {
  onClose: () => void;
  onExportCSV: () => void;
  onImportCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CsvModal: React.FC<CsvModalProps> = ({ onClose, onExportCSV, onImportCSV }) => {
  return (
    <div className="fixed inset-0 bg-black/65 z-[200] flex justify-center items-end animate-[fadeIn_0.2s_ease]">
      <div className="w-full max-w-[480px] bg-surface-1 rounded-t-xl pt-4 shadow-[0_20px_48px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-y-auto animate-[slideUp_0.35s_cubic-bezier(0.175,0.885,0.32,1.1)]">
        <div className="w-9 h-1 rounded-full bg-surface-border mx-auto mb-4" />
        <div className="flex justify-between items-center px-5 pb-4 border-b border-surface-border-2 mb-5">
          <h2 className="text-[17px] font-bold text-ink tracking-tight">CSV İşlemleri</h2>
          <button onClick={onClose} className="bg-surface-2 border-none cursor-pointer text-content-muted flex items-center justify-center w-[30px] h-[30px] rounded-full transition active:bg-surface-border">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-10 flex flex-col gap-4">
          <button onClick={onExportCSV} className="w-full py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-ink text-night active:bg-ink-hover active:scale-[0.98]">
            📥 Envanteri CSV Olarak Dışarı Aktar
          </button>

          <label className="w-full py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-surface-2 text-content-secondary border border-surface-border active:bg-surface-border text-center">
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
