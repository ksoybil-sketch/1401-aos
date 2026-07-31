import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import {
  btn, btnDanger, btnLg, btnPrimary, field, iconBtn, input, label,
  modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle
} from '../../constants/ui';

interface DeleteModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onConfirm: (deleteAll: boolean, qty: number, reason: string) => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ item, onClose, onConfirm }) => {
  if (!item) return null;

  const [qtyInput, setQtyInput] = useState<string>('1');
  const [qtyValue, setQtyValue] = useState<number>(1);
  const [reason, setReason] = useState<string>('Satıldı/Tüketildi');

  const handleMinus = () => {
    const cur = parseInt(qtyInput) || 1;
    if (cur > 1) {
      const next = cur - 1;
      setQtyInput(String(next));
      setQtyValue(next);
    }
  };

  const handlePlus = () => {
    const cur = parseInt(qtyInput) || 1;
    if (cur < item.quantity) {
      const next = cur + 1;
      setQtyInput(String(next));
      setQtyValue(next);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQtyInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      setQtyValue(Math.min(parsed, item.quantity));
    }
  };

  const stepperBtn =
    'w-14 h-14 shrink-0 flex items-center justify-center text-2xl font-light text-content cursor-pointer transition-colors hover:bg-glass-2 active:text-gold';

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>Ürünü Tüket / Sil</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={`${modalBody} flex flex-col gap-4`}>
          <p className="text-sm text-content-muted leading-relaxed">
            <strong className="text-content">{item.name}</strong> ürününden kaç adet işlem yapılacak?
            {' '}(Mevcut stok: <strong className="text-gold">{item.quantity}</strong> adet)
          </p>

          <div className={field}>
            <span className={label}>İşlem Sebebi</span>
            <select
              className={input}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="Satıldı/Tüketildi">🟢 Satıldı / Tüketildi</option>
              <option value="Tarihi Geçti / Zayi">🔴 Tarihi Geçti / Çöpe Atıldı (Zayi)</option>
              <option value="Hasarlı / Bozuk">🟠 Hasarlı / Bozuldu</option>
              <option value="Hatalı Giriş / Düzeltme">✏️ Hatalı Giriş / Düzeltme (Stok Sayım Düzeltmesi)</option>
            </select>
          </div>

          <div className={field}>
            <span className={label}>Miktar</span>
            <div className="flex items-center rounded-2xl border border-hairline bg-surface-0/70 overflow-hidden">
              <button type="button" className={stepperBtn} onClick={handleMinus}>−</button>
              <input
                type="number"
                className="flex-1 min-w-0 h-14 bg-transparent border-x border-hairline text-content text-2xl font-bold text-center focus:outline-none focus:bg-glass [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={qtyInput}
                min="1"
                max={item.quantity}
                onChange={handleInputChange}
              />
              <button type="button" className={stepperBtn} onClick={handlePlus}>+</button>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => onConfirm(false, qtyValue, reason)}
              className={`${btn} ${btnPrimary} ${btnLg} flex-1`}
            >
              {qtyValue} Adet İşlem Yap
            </button>
            <button
              type="button"
              onClick={() => onConfirm(true, item.quantity, reason)}
              className={`${btn} ${btnDanger} ${btnLg} flex-1`}
            >
              Tümünü Sil ({item.quantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
