import React, { useState } from 'react';
import { InventoryItem } from '../../types';

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

  return (
    <div className="fixed inset-0 bg-black/65 z-[200] flex justify-center items-end animate-[fadeIn_0.2s_ease]">
      <div className="w-full max-w-[480px] bg-surface-1 rounded-t-xl pt-4 shadow-[0_20px_48px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-y-auto animate-[slideUp_0.35s_cubic-bezier(0.175,0.885,0.32,1.1)]">
        <div className="w-9 h-1 rounded-full bg-surface-border mx-auto mb-4" />
        <div className="flex justify-between items-center px-5 pb-4 border-b border-surface-border-2 mb-5">
          <h2 className="text-[17px] font-bold text-ink tracking-tight">Ürünü Tüket / Sil / Düzelt</h2>
          <button onClick={onClose} className="bg-surface-2 border-none cursor-pointer text-content-muted flex items-center justify-center w-[30px] h-[30px] rounded-full transition active:bg-surface-border">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-10">
          <p className="mb-5 text-[14px] text-content-muted leading-relaxed">
            <strong className="text-content">{item.name}</strong> ürününden kaç adet işlem yapılacak? (Mevcut stok: <strong className="text-gold">{item.quantity}</strong> adet)
          </p>

          <div className="flex flex-col gap-[7px] mb-3.5">
            <span className="text-xs font-bold text-content-secondary uppercase tracking-wide">İşlem Sebebi</span>
            <select
              className="w-full py-[13px] px-3.5 border border-surface-border rounded-md text-[15px] bg-surface-0 text-content transition focus:outline-none focus:border-gold focus:bg-surface-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="Satıldı/Tüketildi">🟢 Satıldı / Tüketildi</option>
              <option value="Tarihi Geçti / Zayi">🔴 Tarihi Geçti / Çöpe Atıldı (Zayi)</option>
              <option value="Hasarlı / Bozuk">🟠 Hasarlı / Bozuldu</option>
              <option value="Hatalı Giriş / Düzeltme">✏️ Hatalı Giriş / Düzeltme (Stok Sayım Düzeltmesi)</option>
            </select>
          </div>

          <div className="flex flex-col gap-[7px] mb-3.5">
            <span className="text-xs font-bold text-content-secondary uppercase tracking-wide">Miktar</span>
            <div className="flex items-center border border-surface-border rounded-md overflow-hidden bg-surface-0">
              <button type="button" className="bg-surface-2 border-none text-content text-[22px] font-light w-[52px] h-[52px] cursor-pointer transition flex items-center justify-center flex-shrink-0 leading-none active:bg-surface-border active:text-gold" onClick={handleMinus}>−</button>
              <input
                type="number"
                className="flex-1 border-none border-x border-surface-border bg-transparent text-content text-[22px] font-bold text-center h-[52px] px-2 focus:outline-none focus:bg-surface-1"
                value={qtyInput}
                min="1"
                max={item.quantity}
                onChange={handleInputChange}
              />
              <button type="button" className="bg-surface-2 border-none text-content text-[22px] font-light w-[52px] h-[52px] cursor-pointer transition flex items-center justify-center flex-shrink-0 leading-none active:bg-surface-border active:text-gold" onClick={handlePlus}>+</button>
            </div>
          </div>

          <div className="flex gap-2.5 mt-5">
            <button
              type="button"
              onClick={() => onConfirm(false, qtyValue, reason)}
              className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-ink text-night active:bg-ink-hover active:scale-[0.98]"
            >
              {qtyValue} Adet İşlem Yap
            </button>
            <button
              type="button"
              onClick={() => onConfirm(true, item.quantity, reason)}
              className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-danger-bg text-danger border border-[rgba(255,107,107,0.3)] active:bg-[rgba(255,107,107,0.2)] active:scale-[0.98]"
            >
              Tümünü Sil ({item.quantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
