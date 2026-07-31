import React from 'react';
import { useStore } from '../../store/useStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDate } from '../../utils/helpers';
import { KUTU_ICI_ADETLER } from '../../constants';
import {
  badge, btn, btnDanger, btnPrimary, btnSm, card, emptyState, emptyText, screenTitle
} from '../../constants/ui';

export const FrozenStockView: React.FC = () => {
  const { frozenStock } = useStore();
  const { setModalState, openDeleteModal } = useUIStore();

  const sorted = [...frozenStock].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-3">
        <h2 className={screenTitle}>🧀 Donuk Ürün Stoğu</h2>
        <button
          onClick={() => setModalState('showFrozenModal', true)}
          className={`${btn} ${btnPrimary} ${btnSm} shrink-0`}
        >
          + Stok Ekle
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className={emptyState}>
          <div className="text-4xl opacity-40">🧀</div>
          <p className={emptyText}>Donuk stokta henüz ürün yok.</p>
          <button
            onClick={() => setModalState('showFrozenModal', true)}
            className={`${btn} ${btnPrimary} ${btnSm} mt-1`}
          >
            + Stok Ekle
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((item) => {
            const boxQty = KUTU_ICI_ADETLER[item.name];
            const isLow = boxQty ? item.quantity <= boxQty / 2 : false;
            const borderClass = isLow
              ? 'border-warning-border border-l-4 border-l-warning'
              : 'border-l-4 border-l-info/60';
            const badgeClass = item.quantity === 0
              ? 'bg-danger-bg text-danger border-danger-border'
              : isLow
                ? 'bg-warning-bg text-warning border-warning-border'
                : 'bg-success-bg text-success border-success-border';

            return (
              <div
                key={item.id}
                className={`${card} p-4 pl-5 flex flex-col gap-3 animate-[fadeSlideIn_0.3s_ease-out] ${borderClass}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[15px] font-bold text-content tracking-tight truncate">{item.name}</span>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-glass-2 border border-hairline text-[10px] font-semibold text-content-secondary">
                        Donuk Stok
                      </span>
                      {boxQty && <span className="font-mono text-[10px] text-content-muted">Kutu içi: {boxQty}</span>}
                    </div>
                  </div>
                  <span className={`${badge} ${badgeClass}`}>
                    {item.quantity === 0 ? 'Tükendi!' : `${item.quantity} Adet`}
                  </span>
                </div>

                <div className="flex justify-between items-end gap-3 border-t border-hairline pt-3">
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-content-muted uppercase font-bold tracking-[0.1em]">Giriş Tarihi</span>
                      <span className="text-[13px] font-semibold text-content">{formatDate(item.dateAdded)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-content-muted uppercase font-bold tracking-[0.1em]">SKT</span>
                      <span className="text-[13px] font-semibold text-content">{formatDate(item.expirationDate)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openDeleteModal(item as any, true)}
                    className={`${btn} ${btnDanger} ${btnSm} shrink-0`}
                    title="Tüket / Sil"
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
