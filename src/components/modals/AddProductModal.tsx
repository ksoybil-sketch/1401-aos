import React from 'react';
import { CATEGORIES, TESHIR_URUNLERI } from '../../constants';

interface AddProductModalProps {
  scannedBarcode: string;
  productName: string;
  productCategory: string;
  expirationDate: string;
  quantity: number;
  isNewProduct: boolean;
  isLookingUpProduct?: boolean;
  onClose: () => void;
  onSetProductName: (val: string) => void;
  onSetProductCategory: (val: string) => void;
  onSetExpirationDate: (val: string) => void;
  onSetQuantity: (val: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  scannedBarcode,
  productName,
  productCategory,
  expirationDate,
  quantity,
  isNewProduct,
  isLookingUpProduct = false,
  onClose,
  onSetProductName,
  onSetProductCategory,
  onSetExpirationDate,
  onSetQuantity,
  onSubmit
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isNewProduct ? "Yeni Ürün Girişi" : "Ürün SKT Kaydı"}</h2>
          <button onClick={onClose} className="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-inner">
          <div className="form-group">
            <span className="form-label">Barkod No</span>
            <input
              type="text"
              className="form-input"
              value={scannedBarcode}
              disabled
              style={{ backgroundColor: 'var(--surface)', fontWeight: 'bold', color: '#888', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Ürün Adı
              {isLookingUpProduct && (
                <span className="api-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span>
              )}
            </span>
            {productCategory === 'Teşhir Dolabı' ? (
              <select
                className="form-input"
                value={productName}
                onChange={(e) => onSetProductName(e.target.value)}
                required
                style={{ backgroundColor: 'var(--surface)', padding: '12px', fontSize: '15px', color: 'var(--text-primary)' }}
              >
                <option value="" disabled>Lütfen menüden bir ürün seçin...</option>
                {TESHIR_URUNLERI.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                placeholder={isLookingUpProduct ? 'Ürün aranıyor...' : 'Örn: Espresso Çekirdeği 1Kg'}
                value={productName}
                onChange={(e) => onSetProductName(e.target.value)}
                disabled={isLookingUpProduct}
                required
              />
            )}
          </div>

          <div className="form-group">
            <span className="form-label">Kategori</span>
            <select
              className="form-select"
              value={productCategory}
              onChange={(e) => onSetProductCategory(e.target.value)}
            >
              {CATEGORIES
                .filter((cat) => scannedBarcode.startsWith('VITRIN-') || cat !== 'Teşhir Dolabı')
                .map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <span className="form-label">Son Tüketim Tarihi</span>
              <input
                type="date"
                className="form-input"
                value={expirationDate}
                onChange={(e) => onSetExpirationDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <span className="form-label">Miktar (Adet)</span>
              <input
                type="number"
                min="1"
                className="form-input"
                value={quantity}
                onChange={(e) => onSetQuantity(parseInt(e.target.value, 10) || 1)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              İptal / Yeniden Tara
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
