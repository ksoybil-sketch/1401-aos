import React, { useState } from 'react';
import { TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';

interface FrozenModalProps {
  onClose: () => void;
  onAdd: (name: string, qty: number) => void;
}

const formInputClass = "w-full py-[13px] px-3.5 border border-surface-border rounded-md text-[15px] bg-surface-0 text-content transition focus:outline-none focus:border-gold focus:bg-surface-2";
const formLabelClass = "text-xs font-bold text-content-secondary uppercase tracking-wide";

export const FrozenModal: React.FC<FrozenModalProps> = ({ onClose, onAdd }) => {
  const [isManual, setIsManual] = useState(false);
  const [name, setName] = useState(TESHIR_URUNLERI[0]);
  const [qty, setQty] = useState(KUTU_ICI_ADETLER[TESHIR_URUNLERI[0]] || 1);

  const handleNameChange = (val: string) => {
    setName(val);
    if (KUTU_ICI_ADETLER[val]) {
      setQty(KUTU_ICI_ADETLER[val]);
    }
  };

  const handleToggleManual = (manual: boolean) => {
    setIsManual(manual);
    if (manual) {
      setName('');
      setQty(1);
    } else {
      setName(TESHIR_URUNLERI[0]);
      setQty(KUTU_ICI_ADETLER[TESHIR_URUNLERI[0]] || 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/65 z-[200] flex justify-center items-end animate-[fadeIn_0.2s_ease]">
      <div className="w-full max-w-[480px] bg-surface-1 rounded-t-xl pt-4 shadow-[0_20px_48px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-y-auto animate-[slideUp_0.35s_cubic-bezier(0.175,0.885,0.32,1.1)]">
        <div className="w-9 h-1 rounded-full bg-surface-border mx-auto mb-4" />
        <div className="flex justify-between items-center px-5 pb-4 border-b border-surface-border-2 mb-5">
          <h2 className="text-[17px] font-bold text-ink tracking-tight">❄️ Donuk Stok Ekle</h2>
          <button onClick={onClose} className="bg-surface-2 border-none cursor-pointer text-content-muted flex items-center justify-center w-[30px] h-[30px] rounded-full transition active:bg-surface-border">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-[7px] mb-3.5">
              <div className="flex justify-between items-center mb-1.5">
                <label className={formLabelClass}>Ürün {isManual ? 'Adı' : 'Seçin'}</label>
                <button
                  type="button"
                  onClick={() => handleToggleManual(!isManual)}
                  className="bg-transparent border-none text-gold text-xs font-semibold cursor-pointer"
                >
                  {isManual ? 'Listeden Seç' : 'Manuel Gir'}
                </button>
              </div>
              {isManual ? (
                <input
                  type="text"
                  className={formInputClass}
                  placeholder="Örn: Vişneli Cheesecake"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              ) : (
                <select
                  className={formInputClass}
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                >
                  {TESHIR_URUNLERI.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-[7px] mb-3.5">
              <label className={formLabelClass}>Kutu / Adet Miktarı</label>
              {KUTU_ICI_ADETLER[name] && (
                <span className="text-xs text-content-muted block mb-1">
                  Kutu içi standart adet: {KUTU_ICI_ADETLER[name]}
                </span>
              )}
              <input
                type="number"
                className={formInputClass}
                min="1"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              />
            </div>

            <button type="submit" className="w-full py-[15px] mt-2.5 rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-ink text-night active:bg-ink-hover active:scale-[0.98]">
              Stoğa Ekle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
