import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysRemaining } from '../utils/helpers';
import { BaristaPerformanceReport } from '../features/reports/BaristaPerformanceReport';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { DisplayCabinetSummaryCard, FrozenStockSummaryCard } from '../components/DashboardStockSummary';

interface ManagerDashboardProps {
  readOnly?: boolean;
}

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
      {/* Hayati Aksiyon Butonları */}
      <div className="flex flex-col gap-4 mt-2">
        {!readOnly && (
          <button
            onClick={() => navigate('/frozen-stock')}
            className="flex items-center justify-center gap-3 w-full bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl py-4 px-4 font-bold shadow-sm hover:bg-blue-100 active:scale-95 transition-transform"
          >
            <span className="text-2xl">❄️</span> Donuk Ürün Stok
          </button>
        )}

        {!readOnly && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setModalState('showSmartReorderModal', true)}
              className="flex flex-col items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl p-4 font-bold shadow-sm hover:bg-amber-100 active:scale-95 transition-transform text-center"
            >
              <span className="text-2xl">📦</span>
              <span className="text-xs">Ne Sipariş Vermeliyim?</span>
            </button>

            <button
              onClick={() => navigate('/inventory')}
              className="flex flex-col items-center justify-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-2xl p-4 font-bold shadow-sm hover:bg-indigo-100 active:scale-95 transition-transform text-center"
            >
              <span className="text-2xl">🔔</span>
              <span className="text-xs">Günlük SKT Bildirimi</span>
            </button>
          </div>
        )}

        <button
          onClick={() => navigate('/reports')}
          className="flex items-center justify-center gap-3 w-full bg-purple-50 border border-purple-200 text-purple-700 rounded-2xl py-4 px-4 font-bold shadow-sm hover:bg-purple-100 active:scale-95 transition-transform"
        >
          <span className="text-2xl">📊</span> Raporlar ve Analizler
        </button>
      </div>

      <div className="w-full h-px bg-gray-200 my-6"></div>

      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
        <span>Genel Durum</span>
      </div>

      {readOnly ? (
        <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl py-6 shadow-sm">
          <div className="text-2xl font-extrabold text-emerald-500">{totalItems}</div>
          <div className="text-[10px] text-gray-400 font-bold mt-1">TOPLAM STOK</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl py-4 shadow-sm cursor-pointer hover:bg-gray-50 transition" onClick={() => { setInventoryStatusFilter('Hepsi'); navigate('/inventory'); }}>
            <div className="text-xl font-extrabold text-emerald-500">{totalItems}</div>
            <div className="text-[10px] text-gray-400 font-bold mt-1">TOPLAM ÜRÜN</div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl py-4 shadow-sm cursor-pointer hover:bg-gray-50 transition" onClick={() => { setInventoryStatusFilter('warning'); navigate('/inventory'); }}>
            <div className="text-xl font-extrabold text-amber-500">{soonExpiringCount}</div>
            <div className="text-[10px] text-gray-400 font-bold mt-1">YAKLAŞAN SKT</div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white border border-red-100 rounded-2xl py-4 shadow-sm cursor-pointer hover:bg-red-50 transition" onClick={() => { setInventoryStatusFilter('danger'); navigate('/inventory'); }}>
            <div className="text-xl font-extrabold text-red-500">{expiredCount}</div>
            <div className="text-[10px] text-gray-400 font-bold mt-1">TARİHİ GEÇEN</div>
          </div>
        </div>
      )}

      {!readOnly && expiredCount > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mt-4 shadow-sm">
          <div className="text-red-500 flex-shrink-0 mt-0.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-700">Dikkat: Tarihi Geçmiş Ürün Var!</h4>
            <p className="text-xs text-red-600 mt-1">Envanterinizde süresi dolmuş {expiredCount} ürün bulunuyor. Lütfen imha edin.</p>
          </div>
        </div>
      )}

      {/* Operasyon Butonları */}
      {!readOnly && (
        <div className="flex flex-col gap-4 mt-6">
          <button onClick={handleStartScan} className="flex items-center justify-center gap-3 w-full bg-indigo-600 text-white rounded-2xl py-5 px-4 font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-transform text-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Barkod Tara ve Ekle
          </button>

          <button
            onClick={handleOpenAddTeshir}
            className="w-full bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl py-4 px-4 font-bold shadow-sm hover:bg-indigo-50 active:scale-95 transition-transform text-sm"
          >
            🎂 Teşhir Dolabına Ürün Ekle (3 Gün SKT)
          </button>
        </div>
      )}

      {/* Geri Bildirim Mesajı */}
      {frozenFeedbackMsg && (
        <div className="dashboard-feedback-msg">
          {frozenFeedbackMsg}
        </div>
      )}

      <DisplayCabinetSummaryCard />
      {!readOnly && <FrozenStockSummaryCard />}

      {quizResults && quizResults.length > 0 && (
        <div className="dashboard-report-container mt-6">
          <BaristaPerformanceReport />
        </div>
      )}
    </>
  );
};
