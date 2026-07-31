import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysRemaining } from '../utils/helpers';
import { BaristaPerformanceReport } from '../features/reports/BaristaPerformanceReport';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { DisplayCabinetSummaryCard, FrozenStockSummaryCard } from '../components/DashboardStockSummary';
import {
  actionTile, btn, btnLg, btnPrimary, btnSecondary, card, cardInteractive,
  cardPad, eyebrow, tileBadge
} from '../constants/ui';

interface ManagerDashboardProps {
  readOnly?: boolean;
}

/** Tek bir istatistik kutusu — tıklanabilir ya da salt gösterim. */
const StatCard: React.FC<{
  value: number;
  label: string;
  tone: string;
  onClick?: () => void;
  large?: boolean;
}> = ({ value, label, tone, onClick, large }) => (
  <div
    onClick={onClick}
    className={`${onClick ? cardInteractive : card} flex flex-col items-center justify-center gap-1 ${large ? 'py-7' : 'py-5'}`}
  >
    <div className={`${large ? 'text-4xl' : 'text-2xl'} font-extrabold tracking-tight ${tone}`}>
      {value}
    </div>
    <div className="text-[10px] font-bold text-content-muted uppercase tracking-[0.1em] text-center px-2">
      {label}
    </div>
  </div>
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
      <div className={`${eyebrow} mt-1`}>Genel Durum</div>

      {readOnly ? (
        <StatCard value={totalItems} label="Toplam Stok" tone="text-success" large />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            value={totalItems}
            label="Toplam Ürün"
            tone="text-success"
            onClick={() => { setInventoryStatusFilter('Hepsi'); navigate('/inventory'); }}
          />
          <StatCard
            value={soonExpiringCount}
            label="Yaklaşan SKT"
            tone="text-warning"
            onClick={() => { setInventoryStatusFilter('warning'); navigate('/inventory'); }}
          />
          <StatCard
            value={expiredCount}
            label="Tarihi Geçen"
            tone="text-danger"
            onClick={() => { setInventoryStatusFilter('danger'); navigate('/inventory'); }}
          />
        </div>
      )}

      {!readOnly && expiredCount > 0 && (
        <div className="flex items-start gap-3.5 rounded-3xl border border-danger-border bg-danger-bg backdrop-blur-xl p-5">
          <span className="text-xl leading-none mt-0.5">⚠️</span>
          <div>
            <h4 className="text-sm font-bold text-danger">Dikkat: Tarihi Geçmiş Ürün Var!</h4>
            <p className="text-xs text-danger/80 mt-1 leading-relaxed">
              Envanterinizde süresi dolmuş {expiredCount} ürün bulunuyor. Lütfen imha edin.
            </p>
          </div>
        </div>
      )}

      {/* ---------- Operasyon ---------- */}
      {!readOnly && (
        <>
          <div className={`${eyebrow} mt-2`}>Operasyon</div>

          <button onClick={handleStartScan} className={`${btn} ${btnPrimary} w-full h-[68px] text-base rounded-3xl`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Barkod Tara ve Ekle
          </button>

          <button onClick={handleOpenAddTeshir} className={`${btn} ${btnSecondary} w-full ${btnLg}`}>
            🎂 Teşhir Dolabına Ürün Ekle (3 Gün SKT)
          </button>
        </>
      )}

      {/* ---------- Hızlı Erişim ---------- */}
      <div className={`${eyebrow} mt-2`}>Hızlı Erişim</div>

      <div className="flex flex-col gap-3">
        {!readOnly && (
          <button onClick={() => navigate('/frozen-stock')} className={actionTile('info')}>
            <span className={tileBadge('info')}>❄️</span>
            <span className="flex-1 font-bold text-[15px] text-content">Donuk Ürün Stok</span>
            <span className="text-content-muted">›</span>
          </button>
        )}

        {!readOnly && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setModalState('showSmartReorderModal', true)}
              className={`${cardInteractive} ${cardPad} flex flex-col items-start gap-3 text-left`}
            >
              <span className={tileBadge('warning')}>📦</span>
              <span className="text-[13px] font-bold text-content leading-snug">Ne Sipariş Vermeliyim?</span>
            </button>

            <button
              onClick={() => navigate('/inventory')}
              className={`${cardInteractive} ${cardPad} flex flex-col items-start gap-3 text-left`}
            >
              <span className={tileBadge('gold')}>🔔</span>
              <span className="text-[13px] font-bold text-content leading-snug">Günlük SKT Bildirimi</span>
            </button>
          </div>
        )}

        <button onClick={() => navigate('/reports')} className={actionTile('violet')}>
          <span className={tileBadge('violet')}>📊</span>
          <span className="flex-1 font-bold text-[15px] text-content">Raporlar ve Analizler</span>
          <span className="text-content-muted">›</span>
        </button>
      </div>

      {/* Geri Bildirim Mesajı */}
      {frozenFeedbackMsg && (
        <div className="rounded-2xl border border-success-border bg-success-bg backdrop-blur-xl py-3.5 px-4 text-[13px] font-semibold text-success">
          {frozenFeedbackMsg}
        </div>
      )}

      <DisplayCabinetSummaryCard />
      {!readOnly && <FrozenStockSummaryCard />}

      {quizResults && quizResults.length > 0 && (
        <div className="mt-2">
          <BaristaPerformanceReport />
        </div>
      )}
    </>
  );
};
