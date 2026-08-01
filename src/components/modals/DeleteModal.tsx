import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { Icon } from '../Icon';
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
    'w-12 h-11 shrink-0 flex items-center justify-center text-fg-2 cursor-pointer transition-colors hover:bg-panel-2 hover:text-crema active:opacity-70';

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>Tüket / Sil</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className={`${modalBody} flex flex-col gap-3.5`}>
          <p className="text-[14px] text-fg-2 leading-relaxed">
            <span className="text-crema font-medium">{item.name}</span> ürününden kaç adet işlem yapılacak?
            {' '}Mevcut stok: <span className="text-crema font-medium tnum">{item.quantity}</span>
          </p>

          <div className={field}>
            <span className={label}>İşlem sebebi</span>
            <select
              className={input}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="Satıldı/Tüketildi">Satıldı / Tüketildi</option>
              <option value="Tarihi Geçti / Zayi">Tarihi geçti / Çöpe atıldı (zayi)</option>
              <option value="Hasarlı / Bozuk">Hasarlı / Bozuldu</option>
              <option value="Hatalı Giriş / Düzeltme">Hatalı giriş / Düzeltme</option>
            </select>
          </div>

          <div className={field}>
            <span className={label}>Miktar</span>
            <div className="flex items-center rounded-lg border border-line bg-roast overflow-hidden">
              <button type="button" className={stepperBtn} onClick={handleMinus} aria-label="Azalt">
                <Icon name="minus" size={16} />
              </button>
              <input
                type="number"
                className="flex-1 min-w-0 h-11 bg-transparent border-x border-line text-crema text-[17px] font-medium text-center tnum focus:outline-none focus:bg-panel-2 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={qtyInput}
                min="1"
                max={item.quantity}
                onChange={handleInputChange}
              />
              <button type="button" className={stepperBtn} onClick={handlePlus} aria-label="Artır">
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-2.5 mt-1.5">
            <button
              type="button"
              onClick={() => onConfirm(false, qtyValue, reason)}
              className={`${btn} ${btnPrimary} ${btnLg} flex-1`}
            >
              {qtyValue} adet işle
            </button>
            <button
              type="button"
              onClick={() => onConfirm(true, item.quantity, reason)}
              className={`${btn} ${btnDanger} ${btnLg} flex-1`}
            >
              Tümünü sil ({item.quantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
