import React from 'react';
import { useStore } from '../../store/useStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDate } from '../../utils/helpers';
import { KUTU_ICI_ADETLER } from '../../constants';

export const FrozenStockView: React.FC = () => {
  const { frozenStock } = useStore();
  const { setModalState, openDeleteModal } = useUIStore();

  const sorted = [...frozenStock].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  return (
    <section className="inventory-list">
      <div className="list-header" style={{ marginBottom: '16px' }}>
        <span className="list-title">🧀 Donuk Ürün Stoğu</span>
        <button
          onClick={() => setModalState('showFrozenModal', true)}
          className="btn btn-primary"
          style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}
        >
          + Stok Ekle
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧀</div>
          <p className="empty-text">Donuk stokta henüz ürün yok.</p>
          <button onClick={() => setModalState('showFrozenModal', true)} className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '13px' }}>
            + Stok Ekle
          </button>
        </div>
      ) : (
        sorted.map((item) => {
          const boxQty = KUTU_ICI_ADETLER[item.name];
          const isLow = boxQty ? item.quantity <= boxQty / 2 : false;

          return (
            <div key={item.id} className={`inventory-item ${isLow ? 'warning-border' : ''}`}>
              <div className="item-top">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <div className="item-meta">
                    <span className="item-category">Donuk Stok</span>
                    {boxQty && <span className="item-barcode">Kutu içi: {boxQty}</span>}
                  </div>
                </div>
                <span className={`status-badge ${item.quantity === 0 ? 'danger' : isLow ? 'warning' : 'success'}`}>
                  {item.quantity === 0 ? 'Tükendi!' : `${item.quantity} Adet`}
                </span>
              </div>

              <div className="item-bottom">
                <div className="item-details">
                  <div className="detail-group">
                    <span className="detail-label">Giriş Tarihi</span>
                    <span className="detail-value">{formatDate(item.dateAdded)}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">SKT</span>
                    <span className="detail-value">{formatDate(item.expirationDate)}</span>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    onClick={() => openDeleteModal(item as any, true)}
                    className="btn-delete"
                    title="Tüket / Sil"
                  >
                    Tüket / Sil
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};
