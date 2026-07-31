import React, { useState } from 'react';
import { TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';
import {
  btn, btnLg, btnPrimary, field, iconBtn, input, label,
  modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle
} from '../../constants/ui';

interface FrozenModalProps {
  onClose: () => void;
  onAdd: (name: string, qty: number) => void;
}

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
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>❄️ Donuk Stok Ekle</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`${modalBody} flex flex-col gap-4`}>
          <div className={field}>
            <div className="flex justify-between items-center">
              <label className={label}>Ürün {isManual ? 'Adı' : 'Seçin'}</label>
              <button
                type="button"
                onClick={() => handleToggleManual(!isManual)}
                className="text-gold text-xs font-semibold cursor-pointer transition-opacity hover:opacity-75"
              >
                {isManual ? 'Listeden Seç' : 'Manuel Gir'}
              </button>
            </div>
            {isManual ? (
              <input
                type="text"
                className={input}
                placeholder="Örn: Vişneli Cheesecake"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            ) : (
              <select
                className={input}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              >
                {TESHIR_URUNLERI.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            )}
          </div>

          <div className={field}>
            <label className={label}>Kutu / Adet Miktarı</label>
            {KUTU_ICI_ADETLER[name] && (
              <span className="text-xs text-content-muted -mt-1">
                Kutu içi standart adet: {KUTU_ICI_ADETLER[name]}
              </span>
            )}
            <input
              type="number"
              className={input}
              min="1"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            />
          </div>

          <button type="submit" className={`${btn} ${btnPrimary} ${btnLg} w-full mt-2`}>
            Stoğa Ekle
          </button>
        </form>
      </div>
    </div>
  );
};
