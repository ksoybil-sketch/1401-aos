import React from 'react';
import { CATEGORIES, TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';

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

const formInputClass = "w-full py-[13px] px-3.5 border border-surface-border rounded-md text-[15px] bg-surface-0 text-content transition focus:outline-none focus:border-gold focus:bg-surface-2";
const formLabelClass = "text-xs font-bold text-content-secondary uppercase tracking-wide";

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
    <div className="fixed inset-0 bg-black/65 z-[200] flex justify-center items-end animate-[fadeIn_0.2s_ease]">
      <div className="w-full max-w-[480px] bg-surface-1 rounded-t-xl pt-4 shadow-[0_20px_48px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-y-auto animate-[slideUp_0.35s_cubic-bezier(0.175,0.885,0.32,1.1)]">
        <div className="w-9 h-1 rounded-full bg-surface-border mx-auto mb-4" />
        <div className="flex justify-between items-center px-5 pb-4 border-b border-surface-border-2 mb-5">
          <h2 className="text-[17px] font-bold text-ink tracking-tight">{isNewProduct ? "Yeni Ürün Girişi" : "Ürün SKT Kaydı"}</h2>
          <button onClick={onClose} className="bg-surface-2 border-none cursor-pointer text-content-muted flex items-center justify-center w-[30px] h-[30px] rounded-full transition active:bg-surface-border">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-5 pb-10">
          <div className="flex flex-col gap-[7px] mb-3.5">
            <span className={formLabelClass}>Barkod No</span>
            <input
              type="text"
              className={`${formInputClass} bg-surface-1 font-bold text-[#888] cursor-not-allowed`}
              value={scannedBarcode}
              disabled
            />
          </div>

          <div className="flex flex-col gap-[7px] mb-3.5">
            <span className={`${formLabelClass} flex items-center gap-2`}>
              Ürün Adı
              {isLookingUpProduct && (
                <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-surface-border border-b-gold [animation:rotation_1s_linear_infinite]"></span>
              )}
            </span>
            {productCategory === 'Teşhir Dolabı' ? (
              frozenStockNames.length === 0 ? (
                <p className="text-[13px] text-danger mt-1 mb-0">
                  Donuk stokta hiç ürün yok. Önce "❄️ Donuk Stok" ile stok girişi yapın.
                </p>
              ) : (
                <select
                  className={formInputClass}
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
                className={formInputClass}
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
                className={formInputClass}
                placeholder={isLookingUpProduct ? 'Ürün aranıyor...' : 'Örn: Espresso Çekirdeği 1Kg'}
                value={productName}
                onChange={(e) => onSetProductName(e.target.value)}
                disabled={isLookingUpProduct}
                required
              />
            )}
          </div>

          <div className="flex flex-col gap-[7px] mb-3.5">
            <span className={formLabelClass}>Kategori</span>
            <select
              className={formInputClass}
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

          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-[7px] mb-3.5">
              <span className={formLabelClass}>Son Tüketim Tarihi</span>
              <input
                type="date"
                className={formInputClass}
                value={expirationDate}
                onChange={(e) => onSetExpirationDate(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-[7px] mb-3.5">
              <span className={formLabelClass}>Miktar (Adet)</span>
              <input
                type="number"
                min="1"
                className={formInputClass}
                value={quantity}
                onChange={(e) => onSetQuantity(parseInt(e.target.value, 10) || 1)}
                required
              />
            </div>
          </div>

          <div className="flex gap-2.5 mt-5">
            <button type="button" onClick={onClose} className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-surface-2 text-content-secondary border border-surface-border active:bg-surface-border active:scale-[0.98]">
              İptal / Yeniden Tara
            </button>
            <button type="submit" className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-ink text-night active:bg-ink-hover active:scale-[0.98]">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
