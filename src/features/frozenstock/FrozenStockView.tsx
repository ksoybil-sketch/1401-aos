import React from 'react';
import { useStore } from '../../store/useStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDate } from '../../utils/helpers';
import { KUTU_ICI_ADETLER } from '../../constants';
import { Icon } from '../../components/Icon';
import {
  badge, badgeCaution, badgeNegative, badgePositive, btn, btnDanger,
  btnPrimary, btnSm, card, emptyState, emptyText, screenTitle
} from '../../constants/ui';

export const FrozenStockView: React.FC = () => {
  const { frozenStock } = useStore();
  const { setModalState, openDeleteModal } = useUIStore();

  const sorted = [...frozenStock].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex justify-between items-center gap-3 mt-0.5">
        <h2 className={screenTitle}>Donuk Stok</h2>
        <button
          onClick={() => setModalState('showFrozenModal', true)}
          className={`${btn} ${btnPrimary} ${btnSm} shrink-0`}
        >
          <Icon name="plus" size={14} />
          Stok ekle
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className={emptyState}>
          <Icon name="snowflake" size={26} className="text-fg-3" />
          <p className={emptyText}>Donuk stokta henüz ürün yok.</p>
          <button
            onClick={() => setModalState('showFrozenModal', true)}
            className={`${btn} ${btnPrimary} ${btnSm} mt-1`}
          >
            <Icon name="plus" size={14} />
            Stok ekle
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sorted.map((item) => {
            const boxQty = KUTU_ICI_ADETLER[item.name];
            const isLow = boxQty ? item.quantity <= boxQty / 2 : false;
            const borderClass = isLow ? 'border-l-caution' : 'border-l-accent';
            const badgeClass = item.quantity === 0
              ? badgeNegative
              : isLow
                ? badgeCaution
                : badgePositive;

            return (
              <div
                key={item.id}
                className={`${card} p-3.5 flex flex-col gap-3 animate-[fadeSlideIn_0.2s_ease-out] border-l-2 ${borderClass}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[15px] font-medium text-crema truncate">{item.name}</span>
                    {boxQty && (
                      <span className="text-[11px] text-fg-3 mt-1">Kutu içi {boxQty} adet</span>
                    )}
                  </div>
                  <span className={`${badge} ${badgeClass}`}>
                    {item.quantity === 0 ? 'Tükendi' : item.quantity}
                  </span>
                </div>

                <div className="flex justify-between items-end gap-3 border-t border-line pt-3">
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-fg-3">Giriş</span>
                      <span className="text-[13px] font-medium text-crema tnum">{formatDate(item.dateAdded)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-fg-3">SKT</span>
                      <span className="text-[13px] font-medium text-crema tnum">{formatDate(item.expirationDate)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openDeleteModal(item as any, true)}
                    className={`${btn} ${btnDanger} ${btnSm} shrink-0`}
                  >
                    Tüket / Sil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
