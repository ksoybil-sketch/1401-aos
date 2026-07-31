import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysRemaining, getStatusDetails, formatDate } from '../../utils/helpers';
import { CATEGORIES } from '../../constants';
import { useStore } from '../../store/useStore';
import { useUIStore } from '../../store/useUIStore';
import { ROLE_PERMISSIONS } from '../../constants/roles';
import {
  badge, btn, btnDanger, btnSm, btnPrimary, card, chip, chipActive, chipIdle,
  emptyState, emptyText, input, screenTitle
} from '../../constants/ui';

export const InventoryList: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, inventory } = useStore();
  const {
    setModalState, openDeleteModal,
    inventoryStatusFilter: statusFilter, setInventoryStatusFilter: setStatusFilter,
    inventoryCategoryFilter: selectedCategoryFilter, setInventoryCategoryFilter: setSelectedCategoryFilter
  } = useUIStore();
  const canEdit = ROLE_PERMISSIONS[userRole].canEditInventory;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategoryFilter === 'Hepsi' || item.category === selectedCategoryFilter;

    const days = getDaysRemaining(item.expirationDate);
    const warningThreshold = item.category === 'Teşhir Dolabı' ? 1 : 3;
    let matchesStatus = true;
    if (statusFilter === 'danger') matchesStatus = days <= 0;
    else if (statusFilter === 'warning') matchesStatus = days > 0 && days <= warningThreshold;
    else if (statusFilter === 'success') matchesStatus = days > warningThreshold;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <section className="flex flex-col gap-4">
      {/* Arama + Filtreler */}
      <div className={`${card} p-4 flex flex-col gap-3.5`}>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted w-4 h-4 pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={`${input} pl-11`}
            placeholder="Ürün adı, barkod veya kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Kategori Filtre Butonları */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            className={`${chip} ${selectedCategoryFilter === 'Hepsi' ? chipActive : chipIdle}`}
            onClick={() => setSelectedCategoryFilter('Hepsi')}
          >
            Tümü
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${chip} ${selectedCategoryFilter === cat ? chipActive : chipIdle}`}
              onClick={() => setSelectedCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SKT Durum Filtresi */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setStatusFilter('Hepsi')}
            className={`${chip} ${statusFilter === 'Hepsi' ? chipActive : chipIdle}`}
          >
            Tüm Durumlar
          </button>
          <button
            onClick={() => setStatusFilter('danger')}
            className={`${chip} ${
              statusFilter === 'danger'
                ? 'bg-danger text-white border-danger shadow-[0_4px_16px_-6px_rgba(255,107,107,0.8)]'
                : 'bg-danger-bg text-danger border-danger-border hover:bg-danger/20'
            }`}
          >
            🔴 Tarihi Geçen
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`${chip} ${
              statusFilter === 'warning'
                ? 'bg-warning text-night border-warning shadow-[0_4px_16px_-6px_rgba(245,179,60,0.8)]'
                : 'bg-warning-bg text-warning border-warning-border hover:bg-warning/20'
            }`}
          >
            🟡 Kritik (Son 3 Gün)
          </button>
        </div>
      </div>

      {/* Başlık ve Sayaç */}
      <div className="flex justify-between items-center gap-3">
        <h2 className={screenTitle}>Stoktaki Ürünler</h2>
        <div className="flex gap-3 items-center shrink-0">
          <span className="text-xs text-content-muted font-medium">{filteredInventory.length} ürün</span>
          {/* Baristalar CSV butonunu görmemeli */}
          {userRole !== 'Barista' && (
            <button
              onClick={() => setModalState('showCsvModal', true)}
              className="text-content-muted text-xs cursor-pointer transition-colors hover:text-gold"
            >
              ⚙️ CSV
            </button>
          )}
        </div>
      </div>

      {/* Liste Görünümü */}
      {filteredInventory.length === 0 ? (
        <div className={emptyState}>
          <div className="text-4xl opacity-40">📦</div>
          <p className={emptyText}>Aradığınız kriterlere uygun ürün bulunamadı.</p>
          {canEdit && (
            <button onClick={() => navigate('/scanner')} className={`${btn} ${btnPrimary} ${btnSm} mt-1`}>
              + Yeni Ürün Ekle
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredInventory.map((item) => {
            const days = getDaysRemaining(item.expirationDate);
            const status = getStatusDetails(days, item.category);

            return (
              <div
                key={item.id}
                className={`${card} p-4 pl-5 flex flex-col gap-3 animate-[fadeSlideIn_0.3s_ease-out] ${status.statusBorderClass}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[15px] font-bold text-content tracking-tight truncate">{item.name}</span>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-glass-2 border border-hairline text-[10px] font-semibold text-content-secondary">
                        {item.category}
                      </span>
                      <span className="font-mono text-[10px] text-content-muted">Kod: {item.barcode}</span>
                    </div>
                  </div>
                  <span className={`${badge} ${status.statusClass}`}>{item.quantity} Adet</span>
                </div>

                <div className="flex justify-between items-end gap-3 border-t border-hairline pt-3">
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-content-muted uppercase font-bold tracking-[0.1em]">SKT Tarihi</span>
                      <span className="text-[13px] font-semibold text-content">{formatDate(item.expirationDate)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-content-muted uppercase font-bold tracking-[0.1em]">Durum</span>
                      <span className="text-[13px] font-semibold text-content">{status.label}</span>
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => openDeleteModal(item)}
                      className={`${btn} ${btnDanger} ${btnSm} shrink-0`}
                      title="Tüket / Sil"
                    >
                      Tüket / Sil
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
