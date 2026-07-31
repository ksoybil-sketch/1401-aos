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
    <section className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[15px] font-bold text-ink tracking-tight">🧀 Donuk Ürün Stoğu</span>
        <button
          onClick={() => setModalState('showFrozenModal', true)}
          className="py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer bg-ink text-night w-auto active:bg-ink-hover active:scale-[0.98]"
        >
          + Stok Ekle
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 px-5 bg-surface-1 border-[1.5px] border-dashed border-surface-border rounded-lg flex flex-col items-center gap-3">
          <div className="text-4xl opacity-35">🧀</div>
          <p className="text-[13px] text-content-muted max-w-[240px] leading-relaxed">Donuk stokta henüz ürün yok.</p>
          <button onClick={() => setModalState('showFrozenModal', true)} className="py-2.5 px-5 rounded-md text-[13px] font-semibold cursor-pointer bg-ink text-night w-auto active:bg-ink-hover active:scale-[0.98]">
            + Stok Ekle
          </button>
        </div>
      ) : (
        sorted.map((item) => {
          const boxQty = KUTU_ICI_ADETLER[item.name];
          const isLow = boxQty ? item.quantity <= boxQty / 2 : false;
          const borderClass = isLow ? 'border-warning-border border-l-4 border-l-warning' : 'border-surface-border';
          const badgeClass = item.quantity === 0
            ? 'bg-danger-bg text-danger border border-danger-border'
            : isLow
              ? 'bg-warning-bg text-warning border border-warning-border'
              : 'bg-success-bg text-success border border-success-border';

          return (
            <div key={item.id} className={`bg-surface-1 border rounded-lg py-3.5 px-3.5 pl-[18px] flex flex-col gap-2.5 transition relative overflow-hidden animate-[fadeSlideIn_0.3s_ease-out] ${borderClass}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[15px] font-semibold text-content tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-content-muted mt-1 flex-wrap">
                    <span className="bg-surface-2 text-content-secondary py-0.5 px-2 rounded-full font-semibold text-[10px] tracking-wide">Donuk Stok</span>
                    {boxQty && <span className="font-mono text-[10px] text-content-muted">Kutu içi: {boxQty}</span>}
                  </div>
                </div>
                <span className={`text-[11px] font-bold py-1 px-2.5 rounded-full whitespace-nowrap flex-shrink-0 ${badgeClass}`}>
                  {item.quantity === 0 ? 'Tükendi!' : `${item.quantity} Adet`}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-surface-border-2 pt-2.5">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-content-muted uppercase font-bold tracking-wide">Giriş Tarihi</span>
                    <span className="text-[13px] font-semibold text-content">{formatDate(item.dateAdded)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-content-muted uppercase font-bold tracking-wide">SKT</span>
                    <span className="text-[13px] font-semibold text-content">{formatDate(item.expirationDate)}</span>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => openDeleteModal(item as any, true)}
                    className="bg-transparent border border-danger-border text-danger py-2 px-2.5 rounded-md cursor-pointer transition flex items-center justify-center active:bg-danger-bg active:scale-[0.93]"
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
