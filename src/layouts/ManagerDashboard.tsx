import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysRemaining } from '../utils/helpers';
import { BaristaPerformanceReport } from '../features/reports/BaristaPerformanceReport';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { DisplayCabinetSummaryCard, FrozenStockSummaryCard } from '../components/DashboardStockSummary';
import { Icon, IconName } from '../components/Icon';
import {
  btn, btnLg, btnPrimary, btnToned, card, iconChip, listGroup, listRow,
  rowChevron, sectionLabel, Tone
} from '../constants/ui';

interface ManagerDashboardProps {
  readOnly?: boolean;
}

/** İstatistik kutusu — tıklanabilir ya da salt gösterim. */
const StatCard: React.FC<{
  value: number;
  label: string;
  tone: string;
  onClick?: () => void;
  large?: boolean;
}> = ({ value, label, tone, onClick, large }) => (
  <div
    onClick={onClick}
    className={`${card} flex flex-col items-center justify-center gap-0.5 ${large ? 'py-6' : 'py-4'} ${
      onClick ? 'cursor-pointer transition-colors hover:bg-panel-2 active:bg-panel-3' : ''
    }`}
  >
    <div className={`${large ? 'text-3xl' : 'text-[26px]'} font-semibold tnum tracking-tight ${tone}`}>
      {value}
    </div>
    <div className="text-[11px] text-fg-3 text-center px-1.5">{label}</div>
  </div>
);

/** Gruplu liste satırı — ikon + başlık + chevron. */
const NavRow: React.FC<{
  icon: IconName;
  tone?: Tone;
  title: string;
  subtitle?: string;
  onClick: () => void;
}> = ({ icon, tone = 'neutral', title, subtitle, onClick }) => (
  <button onClick={onClick} className={listRow}>
    <span className={iconChip(tone)}>
      <Icon name={icon} size={17} />
    </span>
    <span className="flex-1 min-w-0">
      <span className="block text-[15px] font-medium text-crema truncate">{title}</span>
      {subtitle && <span className="block text-[12px] text-fg-3 mt-0.5 truncate">{subtitle}</span>}
    </span>
    <Icon name="chevronRight" size={16} className={rowChevron} />
  </button>
);

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ readOnly = false }) => {
  const navigate = useNavigate();
  const { inventory, quizResults } = useStore();
  const { setModalState, openAddModal, frozenFeedbackMsg, setInventoryStatusFilter } = useUIStore();

  const totalItems = inventory.length;
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
    openAddModal(`VITRIN-${Date.now()}`);
  };

  return (
    <>
      {/* ---------- Genel Durum ---------- */}
      <div className={`${sectionLabel} mt-0.5`}>Genel Durum</div>

      {readOnly ? (
        <StatCard value={totalItems} label="Toplam Stok" tone="text-crema" large />
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard
            value={totalItems}
            label="Toplam ürün"
            tone="text-crema"
            onClick={() => { setInventoryStatusFilter('Hepsi'); navigate('/inventory'); }}
          />
          <StatCard
            value={soonExpiringCount}
            label="Yaklaşan SKT"
            tone="text-caution"
            onClick={() => { setInventoryStatusFilter('warning'); navigate('/inventory'); }}
          />
          <StatCard
            value={expiredCount}
            label="Tarihi geçen"
            tone="text-negative"
            onClick={() => { setInventoryStatusFilter('danger'); navigate('/inventory'); }}
          />
        </div>
      )}

      {!readOnly && expiredCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-negative-line bg-negative-bg p-3.5">
          <Icon name="alert" size={18} className="text-negative mt-0.5" />
          <div>
            <h4 className="text-[14px] font-semibold text-negative">Tarihi geçmiş ürün var</h4>
            <p className="text-[12px] text-negative/75 mt-0.5 leading-relaxed">
              Envanterinizde süresi dolmuş {expiredCount} ürün bulunuyor. Lütfen imha edin.
            </p>
          </div>
        </div>
      )}

      {/* ---------- Operasyon ---------- */}
      {!readOnly && (
        <>
          <div className={`${sectionLabel} mt-1.5`}>Operasyon</div>

          {/* Günlük üç ana eylem bir arada; her biri kendi ince renkli
              çerçevesiyle ayrışır, dolgular nötr kaldığı için sayfa sakin durur. */}
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
        </>
      )}

      {/* ---------- Hızlı Erişim ---------- */}
      <div className={`${sectionLabel} mt-1.5`}>Hızlı Erişim</div>

      <div className={listGroup}>
        {!readOnly && (
          <NavRow
            icon="package"
            tone="caution"
            title="Ne Sipariş Vermeliyim?"
            subtitle="Tüketim ve stok analizine göre öneri"
            onClick={() => setModalState('showSmartReorderModal', true)}
          />
        )}
        {!readOnly && (
          <NavRow
            icon="bell"
            title="Günlük SKT Bildirimi"
            onClick={() => navigate('/inventory')}
          />
        )}
        <NavRow
          icon="chart"
          title="Raporlar ve Analizler"
          onClick={() => navigate('/reports')}
        />
      </div>

      {/* Geri Bildirim Mesajı */}
      {frozenFeedbackMsg && (
        <div className="flex items-start gap-2.5 rounded-xl border border-positive-line bg-positive-bg py-3 px-3.5">
          <Icon name="check" size={16} className="text-positive mt-0.5" />
          <span className="text-[13px] text-positive">{frozenFeedbackMsg}</span>
        </div>
      )}

      <DisplayCabinetSummaryCard />
      {!readOnly && <FrozenStockSummaryCard />}

      {quizResults && quizResults.length > 0 && (
        <div className="mt-1.5">
          <BaristaPerformanceReport />
        </div>
      )}
    </>
  );
};
