import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { getDaysRemaining } from '../utils/helpers';
import { DisplayCabinetSummaryCard, FrozenStockSummaryCard } from '../components/DashboardStockSummary';
import { Icon } from '../components/Icon';
import {
  btn, btnLg, btnPrimary, btnToned, iconChip, listGroup, listRow,
  rowChevron, sectionLabel
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
      <div className="mt-1 mb-0.5">
        <h2 className="text-[24px] font-bold text-crema tracking-tight leading-tight">
          Merhaba, {activeBaristaName ? activeBaristaName.split(' ')[0] : 'Barista'}
        </h2>
        <p className="text-fg-3 text-[13px] mt-1">
          Hızlı işlemlere aşağıdan ulaşabilirsin.
        </p>
      </div>

      {/* ---------- Operasyon ----------
          Günlük üç ana eylem bir arada. Her biri kendi ince renkli
          çerçevesiyle ayrışır; dolgular nötr kaldığı için sayfa sakin durur. */}
      <div className="flex flex-col gap-2.5">
        <button onClick={handleStartScan} className={`${btn} ${btnPrimary} ${btnLg} w-full`}>
          <Icon name="camera" size={18} />
          Barkod Tara ve Ekle
        </button>

        <button onClick={handleOpenAddTeshir} className={`${btn} ${btnToned('caution')} ${btnLg} w-full`}>
          <Icon name="cabinet" size={18} className="text-caution" />
          Teşhir Dolabına Ürün Ekle
        </button>

        <button onClick={() => navigate('/frozen-stock')} className={`${btn} ${btnToned('accent')} ${btnLg} w-full`}>
          <Icon name="snowflake" size={18} className="text-accent" />
          Donuk Ürün Stok
        </button>
      </div>

      {/* ---------- Modüller ---------- */}
      <div className={`${sectionLabel} mt-1.5`}>Modüller</div>

      <div className={listGroup}>
        <button onClick={() => navigate('/training')} className={listRow}>
          <span className={iconChip()}>
            <Icon name="cap" size={17} />
          </span>
          <span className="flex-1 text-[15px] font-medium text-crema">Eğitim ve Sınav</span>
          <Icon name="chevronRight" size={16} className={rowChevron} />
        </button>
      </div>

      <DisplayCabinetSummaryCard />
      <FrozenStockSummaryCard />

      {/* ---------- Bildirimler ---------- */}
      <div className={`${sectionLabel} mt-1.5`}>Bildirimler</div>

      <div className={listGroup}>
        <button
          onClick={() => { setInventoryStatusFilter('warning'); navigate('/inventory'); }}
          className={listRow}
        >
          <span className={iconChip(soonExpiringCount > 0 ? 'caution' : 'neutral')}>
            <Icon name="bell" size={17} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[15px] font-medium text-crema">Yaklaşan SKT</span>
            <span className="block text-[12px] text-fg-3 mt-0.5">
              {soonExpiringCount} ürünün süresi yaklaşıyor
            </span>
          </span>
          <Icon name="chevronRight" size={16} className={rowChevron} />
        </button>

        {expiredCount > 0 && (
          <button
            onClick={() => { setInventoryStatusFilter('danger'); navigate('/inventory'); }}
            className={listRow}
          >
            <span className={iconChip('negative')}>
              <Icon name="alert" size={17} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[15px] font-medium text-negative">Tarihi geçen ürün var</span>
              <span className="block text-[12px] text-negative/70 mt-0.5">
                {expiredCount} ürünü imha etmeniz gerekiyor
              </span>
            </span>
            <Icon name="chevronRight" size={16} className={rowChevron} />
          </button>
        )}
      </div>
    </>
  );
};
