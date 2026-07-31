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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Ürünü Tüket / Sil / Düzelt</h2>
          <button onClick={onClose} className="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-inner">
          <p style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            <strong style={{ color: 'var(--text-main)' }}>{item.name}</strong> ürününden kaç adet işlem yapılacak? (Mevcut stok: <strong style={{ color: 'var(--accent)' }}>{item.quantity}</strong> adet)
          </p>

          <div className="form-group">
            <span className="form-label">İşlem Sebebi</span>
            <select className="form-select" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="Satıldı/Tüketildi">🟢 Satıldı / Tüketildi</option>
              <option value="Tarihi Geçti / Zayi">🔴 Tarihi Geçti / Çöpe Atıldı (Zayi)</option>
              <option value="Hasarlı / Bozuk">🟠 Hasarlı / Bozuldu</option>
              <option value="Hatalı Giriş / Düzeltme">✏️ Hatalı Giriş / Düzeltme (Stok Sayım Düzeltmesi)</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-label">Miktar</span>
            <div className="qty-stepper">
              <button type="button" className="qty-stepper-btn" onClick={handleMinus}>−</button>
              <input
                type="number"
                className="qty-stepper-input"
                value={qtyInput}
                min="1"
                max={item.quantity}
                onChange={handleInputChange}
              />
              <button type="button" className="qty-stepper-btn" onClick={handlePlus}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => onConfirm(false, qtyValue, reason)}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {qtyValue} Adet İşlem Yap
            </button>
            <button
              type="button"
              onClick={() => onConfirm(true, item.quantity, reason)}
              className="btn btn-secondary"
              style={{ flex: 1, backgroundColor: 'rgba(255,107,107,0.15)', color: 'var(--danger)', borderColor: 'rgba(255,107,107,0.3)' }}
            >
              Tümünü Sil ({item.quantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
