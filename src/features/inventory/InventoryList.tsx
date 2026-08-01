import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysRemaining, getStatusDetails, formatDate } from '../../utils/helpers';
import { CATEGORIES } from '../../constants';
import { useStore } from '../../store/useStore';
import { useUIStore } from '../../store/useUIStore';
import { ROLE_PERMISSIONS } from '../../constants/roles';
import { Icon } from '../../components/Icon';
import {
  badge, btn, btnDanger, btnSm, btnPrimary, card, chip, chipOff, chipOn,
  emptyState, emptyText, iconBtn, input, screenTitle, scrollX
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
    <section className="flex flex-col gap-3.5">
      {/* Başlık */}
      <div className="flex justify-between items-center gap-3 mt-0.5">
        <h2 className={screenTitle}>Envanter</h2>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[12px] text-fg-3 tnum">{filteredInventory.length} ürün</span>
          {/* Baristalar CSV butonunu görmemeli */}
          {userRole !== 'Barista' && (
            <button onClick={() => setModalState('showCsvModal', true)} className={iconBtn} aria-label="CSV işlemleri">
              <Icon name="sliders" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Arama */}
      <div className="relative">
        <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3 pointer-events-none" />
        <input
          type="text"
          className={`${input} pl-10`}
          placeholder="Ürün, barkod veya kategori ara"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Kategori filtresi */}
      <div className={scrollX}>
        <button
          className={`${chip} ${selectedCategoryFilter === 'Hepsi' ? chipOn : chipOff}`}
          onClick={() => setSelectedCategoryFilter('Hepsi')}
        >
          Tümü
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${chip} ${selectedCategoryFilter === cat ? chipOn : chipOff}`}
            onClick={() => setSelectedCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SKT durum filtresi */}
      <div className={scrollX}>
        <button
          onClick={() => setStatusFilter('Hepsi')}
          className={`${chip} ${statusFilter === 'Hepsi' ? chipOn : chipOff}`}
        >
          Tüm durumlar
        </button>
        <button
          onClick={() => setStatusFilter('danger')}
          className={`${chip} ${
            statusFilter === 'danger'
              ? 'bg-negative text-espresso border-negative'
              : 'bg-negative-bg text-negative border-negative-line hover:bg-negative/20'
          }`}
        >
          Tarihi geçen
        </button>
        <button
          onClick={() => setStatusFilter('warning')}
          className={`${chip} ${
            statusFilter === 'warning'
              ? 'bg-caution text-espresso border-caution'
              : 'bg-caution-bg text-caution border-caution-line hover:bg-caution/20'
          }`}
        >
          Kritik (3 gün)
        </button>
      </div>

      {/* Liste */}
      {filteredInventory.length === 0 ? (
        <div className={emptyState}>
          <Icon name="box" size={26} className="text-fg-3" />
          <p className={emptyText}>Aradığınız kriterlere uygun ürün bulunamadı.</p>
          {canEdit && (
            <button onClick={() => navigate('/scanner')} className={`${btn} ${btnPrimary} ${btnSm} mt-1`}>
              <Icon name="plus" size={14} />
              Yeni ürün ekle
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredInventory.map((item) => {
            const days = getDaysRemaining(item.expirationDate);
            const status = getStatusDetails(days, item.category);

            return (
              <div
                key={item.id}
                className={`${card} p-3.5 flex flex-col gap-3 animate-[fadeSlideIn_0.2s_ease-out] border-l-2 ${status.statusBorderClass}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[15px] font-medium text-crema truncate">{item.name}</span>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[11px] text-fg-3">{item.category}</span>
                      <span className="w-px h-2.5 bg-line-2" />
                      <span className="font-mono text-[11px] text-fg-3">{item.barcode}</span>
                    </div>
                  </div>
                  <span className={`${badge} ${status.statusClass}`}>{item.quantity}</span>
                </div>

                <div className="flex justify-between items-end gap-3 border-t border-line pt-3">
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-fg-3">SKT</span>
                      <span className="text-[13px] font-medium text-crema tnum">{formatDate(item.expirationDate)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-fg-3">Durum</span>
                      <span className="text-[13px] font-medium text-crema">{status.label}</span>
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => openDeleteModal(item)}
                      className={`${btn} ${btnDanger} ${btnSm} shrink-0`}
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
