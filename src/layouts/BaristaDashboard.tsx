import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { getDaysRemaining } from '../utils/helpers';
import { DisplayCabinetSummaryCard, FrozenStockSummaryCard } from '../components/DashboardStockSummary';
import {
  actionTile, btn, btnLg, btnPrimary, btnSecondary, cardInteractive,
  cardPad, eyebrow, tileBadge
} from '../constants/ui';

export const BaristaDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeBarista, inventory } = useStore();
  const { openAddModal, setInventoryStatusFilter } = useUIStore();

  const activeBaristaName = activeBarista?.name;

  const expiredCount = inventory.filter(i => getDaysRemaining(i.expirationDate) <= 0).length;
  const soonExpiringCount = inventory.filter(i => {
    const days = getDaysRemaining(i.expirationDate);
    const threshold = i.category === 'Teşhir Dolabı' ? 1 : 3;
    return days > 0 && days <= threshold;
  }).length;

  const handleStartScan = () => {
    navigate('/scanner');
  };

  const handleOpenAddTeshir = () => {
    // Generate a temporary barcode or handle logic for display items
    openAddModal(`VITRIN-${Date.now()}`);
  };

  return (
    <>
      {/* ---------- Karşılama ---------- */}
      <div className="mt-1">
        <h2 className="text-[26px] font-extrabold text-content tracking-tight leading-tight">
          Hoş geldin, {activeBaristaName ? activeBaristaName.split(' ')[0] : 'Barista'} 👋
        </h2>
        <p className="text-content-muted text-sm mt-1.5">
          Hızlı işlemlere aşağıdan ulaşabilirsin.
        </p>
      </div>

      {/* ---------- Operasyon ---------- */}
      <button onClick={handleStartScan} className={`${btn} ${btnPrimary} w-full h-[72px] text-base rounded-3xl mt-1`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        Barkod Tara ve Ekle
      </button>

      <button onClick={handleOpenAddTeshir} className={`${btn} ${btnSecondary} w-full ${btnLg}`}>
        🎂 Teşhir Dolabına Ürün Ekle (3 Gün SKT)
      </button>

      {/* ---------- Ekstra Modüller ---------- */}
      <div className={`${eyebrow} mt-2`}>Ekstra Modüller</div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/frozen-stock')}
          className={`${cardInteractive} ${cardPad} flex flex-col items-start gap-3 text-left`}
        >
          <span className={tileBadge('info')}>❄️</span>
          <span className="text-[13px] font-bold text-content leading-snug">Donuk Ürün Stok</span>
        </button>

        <button
          onClick={() => navigate('/training')}
          className={`${cardInteractive} ${cardPad} flex flex-col items-start gap-3 text-left`}
        >
          <span className={tileBadge('violet')}>🎓</span>
          <span className="text-[13px] font-bold text-content leading-snug">Eğitim &amp; Sınav</span>
        </button>
      </div>

      <DisplayCabinetSummaryCard />
      <FrozenStockSummaryCard />

      {/* ---------- Bildirimler ---------- */}
      <div className={`${eyebrow} mt-2`}>Bildirimler</div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => { setInventoryStatusFilter('warning'); navigate('/inventory'); }}
          className={`${actionTile('warning')} ${soonExpiringCount > 0 ? 'border-warning-border' : ''}`}
        >
          <span className={tileBadge('warning')}>🔔</span>
          <span className="flex-1">
            <span className="block font-bold text-[15px] text-content">Yaklaşan SKT Bildirimi</span>
            <span className="block text-xs text-content-muted mt-0.5">
              {soonExpiringCount} ürünün süresi yaklaşıyor.
            </span>
          </span>
          <span className="text-gold text-sm font-semibold">İncele ➔</span>
        </button>

        {expiredCount > 0 && (
          <button
            onClick={() => { setInventoryStatusFilter('danger'); navigate('/inventory'); }}
            className={`${actionTile('danger')} border-danger-border bg-danger-bg`}
          >
            <span className={tileBadge('danger')}>⚠️</span>
            <span className="flex-1">
              <span className="block font-bold text-[15px] text-danger">Tarihi Geçen Ürün Var!</span>
              <span className="block text-xs text-danger/75 mt-0.5">
                {expiredCount} ürünü imha etmeniz gerekiyor.
              </span>
            </span>
            <span className="text-danger text-sm font-semibold">İncele ➔</span>
          </button>
        )}
      </div>
    </>
  );
};
