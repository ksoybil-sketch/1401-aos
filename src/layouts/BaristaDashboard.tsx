import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { getDaysRemaining } from '../utils/helpers';
import { CATEGORIES } from '../constants';
import { DisplayCabinetSummaryCard, FrozenStockSummaryCard } from '../components/DashboardStockSummary';

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
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-content">
          Hoş geldin, {activeBaristaName ? activeBaristaName.split(' ')[0] : 'Barista'} 👋
        </h2>
        <p className="text-content-muted text-sm mt-1">
          Hızlı işlemlere aşağıdan ulaşabilirsin.
        </p>
      </div>

      {/* Operasyon Butonları */}
      <div className="flex flex-col gap-4 mt-0">
        <button onClick={handleStartScan} className="flex items-center justify-center gap-3 w-full bg-indigo-600 text-white rounded-2xl py-6 px-4 font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform text-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Barkod Tara ve Ekle
        </button>

        <button
          onClick={handleOpenAddTeshir}
          className="w-full bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl py-6 px-4 font-bold shadow-sm hover:bg-indigo-50 active:scale-95 transition-transform text-base"
        >
          🎂 Teşhir Dolabına Ürün Ekle (3 Gün SKT)
        </button>
      </div>

      <div className="w-full h-px bg-gray-200 my-6"></div>

      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
        <span>Ekstra Modüller</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate('/frozen-stock')}
          className="flex flex-col items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl p-4 font-bold shadow-sm active:scale-95 transition-transform"
        >
          <span className="text-3xl">❄️</span>
          <span className="text-xs text-center">Donuk Ürün Stok</span>
        </button>

        <button
          onClick={() => navigate('/training')}
          className="col-span-2 flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-800 rounded-2xl p-4 font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
        >
          <span className="text-2xl">🎓</span> Eğitim & Sınav
        </button>
      </div>

      <DisplayCabinetSummaryCard />
      <FrozenStockSummaryCard />

      <div className="w-full h-px bg-gray-200 mb-4 mt-6"></div>

      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
        <span>Bildirimler</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div
          onClick={() => { setInventoryStatusFilter('warning'); navigate('/inventory'); }}
          className={`bg-surface-1 rounded-lg p-4 flex items-center justify-between cursor-pointer border ${soonExpiringCount > 0 ? 'border-warning' : 'border-surface-border'}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <div className="font-bold text-content">Yaklaşan SKT Bildirimi</div>
              <div className="text-xs text-content-muted">{soonExpiringCount} ürünün süresi yaklaşıyor.</div>
            </div>
          </div>
          <span className="text-gold">İncele ➔</span>
        </div>

        {expiredCount > 0 && (
          <div
            onClick={() => { setInventoryStatusFilter('danger'); navigate('/inventory'); }}
            className="bg-danger-bg border border-danger rounded-lg p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-bold text-danger">Tarihi Geçen Ürün Var!</div>
                <div className="text-xs text-danger opacity-80">{expiredCount} ürünü imha etmeniz gerekiyor.</div>
              </div>
            </div>
            <span className="text-danger">İncele ➔</span>
          </div>
        )}
      </div>
    </>
  );
};
