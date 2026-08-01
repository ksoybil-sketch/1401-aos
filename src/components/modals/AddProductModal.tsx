import React from 'react';
import { CATEGORIES, TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';
import { Icon } from '../Icon';
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
    // Kutu içi adet SADECE donuk stok girişinde otomatik gelir: oraya kutu
    // bütün olarak girer. Teşhir dolabına ise donuk stoğun tamamı değil,
    // vitrine konan kadarı çıkar — o yüzden adet elle girilir.
    if (productCategory === 'Donuk Stok' && KUTU_ICI_ADETLER[val]) {
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
            <Icon name="close" size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className={`${modalBody} flex flex-col gap-3.5`}>
          <div className={field}>
            <span className={label}>Barkod No</span>
            <input
              type="text"
              className={`${input} font-mono text-fg-3 cursor-not-allowed`}
              value={scannedBarcode}
              disabled
            />
          </div>

          <div className={field}>
            <span className={`${label} flex items-center gap-2`}>
              Ürün Adı
              {isLookingUpProduct && <span className={`${spinner} w-3 h-3`} />}
            </span>
            {productCategory === 'Teşhir Dolabı' ? (
              frozenStockNames.length === 0 ? (
                <div className="flex items-start gap-2 rounded-lg border border-negative-line bg-negative-bg px-3 py-2.5">
                  <Icon name="alert" size={15} className="text-negative mt-px" />
                  <span className="text-[13px] text-negative leading-relaxed">
                    Donuk stokta hiç ürün yok. Önce Donuk Stok ekranından giriş yapın.
                  </span>
                </div>
              ) : (
                <select
                  className={input}
                  value={productName}
                  onChange={(e) => handleProductNameSelect(e.target.value)}
                  required
                >
                  <option value="" disabled>Donuk stoktan bir ürün seçin…</option>
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
                <option value="" disabled>Lütfen menüden bir ürün seçin…</option>
                {TESHIR_URUNLERI.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className={input}
                placeholder={isLookingUpProduct ? 'Ürün aranıyor…' : 'Örn: Espresso Çekirdeği 1Kg'}
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
                <option value="Donuk Stok">Donuk Stok</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
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
              <span className={label}>Miktar</span>
              <input
                type="number"
                min="1"
                className={`${input} tnum`}
                value={quantity}
                onChange={(e) => onSetQuantity(parseInt(e.target.value, 10) || 1)}
                required
              />
            </div>
          </div>

          <div className="flex gap-2.5 mt-1.5">
            <button type="button" onClick={onClose} className={`${btn} ${btnSecondary} ${btnLg} flex-1`}>
              İptal
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
