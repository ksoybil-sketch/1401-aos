import React, { useState } from 'react';
import { TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';
import { Icon } from '../Icon';
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
          <h2 className={modalTitle}>Donuk Stok Ekle</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <Icon name="close" size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`${modalBody} flex flex-col gap-3.5`}>
          <div className={field}>
            <div className="flex justify-between items-center">
              <label className={label}>Ürün {isManual ? 'adı' : 'seçin'}</label>
              <button
                type="button"
                onClick={() => handleToggleManual(!isManual)}
                className="text-fg-2 text-[12px] font-medium cursor-pointer transition-colors hover:text-crema"
              >
                {isManual ? 'Listeden seç' : 'Manuel gir'}
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
            <label className={label}>Kutu / adet miktarı</label>
            <input
              type="number"
              className={`${input} tnum`}
              min="1"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            />
            {KUTU_ICI_ADETLER[name] && (
              <span className="text-[12px] text-fg-3">
                Kutu içi standart adet: {KUTU_ICI_ADETLER[name]}
              </span>
            )}
          </div>

          <button type="submit" className={`${btn} ${btnPrimary} ${btnLg} w-full mt-1.5`}>
            Stoğa Ekle
          </button>
        </form>
      </div>
    </div>
  );
};
