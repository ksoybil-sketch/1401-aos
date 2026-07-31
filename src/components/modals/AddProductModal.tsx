import React from 'react';
import { CATEGORIES, TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';
import {
  btn, btnLg, btnPrimary, btnSecondary, field, iconBtn, input, label,
  modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle, spinner
} from '../../constants/ui';

interface AddProductModalProps {
  scannedBarcode: string;
  productName: string;
  productCategory: string;
  expirationDate: string;
  quantity: number;
  isNewProduct: boolean;
  isLookingUpProduct?: boolean;
  frozenStockNames: string[];
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
  frozenStockNames,
  onClose,
  onSetProductName,
  onSetProductCategory,
  onSetExpirationDate,
  onSetQuantity,
  onSubmit
}) => {
  const handleProductNameSelect = (val: string) => {
    onSetProductName(val);
    if (KUTU_ICI_ADETLER[val]) {
      onSetQuantity(KUTU_ICI_ADETLER[val]);
    }
  };

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>{isNewProduct ? 'Yeni Ürün Girişi' : 'Ürün SKT Kaydı'}</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className={`${modalBody} flex flex-col gap-4`}>
          <div className={field}>
            <span className={label}>Barkod No</span>
            <input
              type="text"
              className={`${input} font-mono font-bold text-content-muted cursor-not-allowed`}
              value={scannedBarcode}
              disabled
            />
          </div>

          <div className={field}>
            <span className={`${label} flex items-center gap-2`}>
              Ürün Adı
              {isLookingUpProduct && <span className={`${spinner} w-3.5 h-3.5`} />}
            </span>
            {productCategory === 'Teşhir Dolabı' ? (
              frozenStockNames.length === 0 ? (
                <p className="text-[13px] text-danger leading-relaxed">
                  Donuk stokta hiç ürün yok. Önce "❄️ Donuk Stok" ile stok girişi yapın.
                </p>
              ) : (
                <select
                  className={input}
                  value={productName}
                  onChange={(e) => handleProductNameSelect(e.target.value)}
                  required
                >
                  <option value="" disabled>Donuk stoktan bir ürün seçin...</option>
                  {frozenStockNames.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              )
            ) : productCategory === 'Donuk Stok' ? (
              <select
                className={input}
                value={productName}
                onChange={(e) => handleProductNameSelect(e.target.value)}
                required
              >
                <option value="" disabled>Lütfen menüden bir ürün seçin...</option>
                {TESHIR_URUNLERI.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className={input}
                placeholder={isLookingUpProduct ? 'Ürün aranıyor...' : 'Örn: Espresso Çekirdeği 1Kg'}
                value={productName}
                onChange={(e) => onSetProductName(e.target.value)}
                disabled={isLookingUpProduct}
                required
              />
            )}
          </div>

          <div className={field}>
            <span className={label}>Kategori</span>
            <select
              className={input}
              value={productCategory}
              onChange={(e) => onSetProductCategory(e.target.value)}
            >
              {CATEGORIES
                .filter((cat) => scannedBarcode.startsWith('VITRIN-') || cat !== 'Teşhir Dolabı')
                .map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              {!scannedBarcode.startsWith('VITRIN-') && (
                <option value="Donuk Stok">❄️ Donuk Stok</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={field}>
              <span className={label}>Son Tüketim Tarihi</span>
              <input
                type="date"
                className={input}
                value={expirationDate}
                onChange={(e) => onSetExpirationDate(e.target.value)}
                required
              />
            </div>
            <div className={field}>
              <span className={label}>Miktar (Adet)</span>
              <input
                type="number"
                min="1"
                className={input}
                value={quantity}
                onChange={(e) => onSetQuantity(parseInt(e.target.value, 10) || 1)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className={`${btn} ${btnSecondary} ${btnLg} flex-1`}>
              İptal / Yeniden Tara
            </button>
            <button type="submit" className={`${btn} ${btnPrimary} ${btnLg} flex-1`}>
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
