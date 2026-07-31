import React, { useState } from 'react';
import { TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">❄️ Donuk Stok Ekle</h2>
          <button onClick={onClose} className="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-inner">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Ürün {isManual ? 'Adı' : 'Seçin'}</label>
                <button
                  type="button"
                  onClick={() => handleToggleManual(!isManual)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {isManual ? 'Listeden Seç' : 'Manuel Gir'}
                </button>
              </div>
              {isManual ? (
                <input
                  type="text"
                  className="form-input"
                  placeholder="Örn: Vişneli Cheesecake"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              ) : (
                <select
                  className="form-select"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                >
                  {TESHIR_URUNLERI.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Kutu / Adet Miktarı</label>
              {KUTU_ICI_ADETLER[name] && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Kutu içi standart adet: {KUTU_ICI_ADETLER[name]}
                </span>
              )}
              <input 
                type="number" 
                className="form-input" 
                min="1" 
                value={qty} 
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Stoğa Ekle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
