import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysRemaining, getStatusDetails, formatDate } from '../../utils/helpers';
import { CATEGORIES } from '../../constants';
import { useStore } from '../../store/useStore';
import { useUIStore } from '../../store/useUIStore';
import { ROLE_PERMISSIONS } from '../../constants/roles';

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
    <section className="flex flex-col gap-2.5">
      {/* Filtre ve Arama Alanı */}
      <div className="flex flex-col gap-3 bg-surface-1 border border-surface-border p-3.5 rounded-lg">
        <div className="relative w-full">
          <svg className="absolute left-[13px] top-1/2 -translate-y-1/2 text-content-muted w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="w-full py-[11px] pr-3.5 pl-10 border border-surface-border rounded-md text-sm bg-surface-0 text-content transition placeholder:text-content-placeholder focus:outline-none focus:border-gold focus:bg-surface-2"
            placeholder="Ürün adı, barkod veya kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Kategori Filtre Butonları */}
        <div className="flex gap-[7px] overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            className={`py-[7px] px-3.5 border rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${selectedCategoryFilter === 'Hepsi' ? 'bg-ink text-surface-0 border-ink' : 'bg-surface-0 text-content-muted border-surface-border'}`}
            onClick={() => setSelectedCategoryFilter('Hepsi')}
          >
            Tümü
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`py-[7px] px-3.5 border rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${selectedCategoryFilter === cat ? 'bg-ink text-surface-0 border-ink' : 'bg-surface-0 text-content-muted border-surface-border'}`}
              onClick={() => setSelectedCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SKT Durum Filtresi */}
        <div className="flex gap-1.5 overflow-x-auto pt-1">
          <button
            onClick={() => setStatusFilter('Hepsi')}
            className={`py-1 px-2.5 rounded-full text-[11px] font-semibold cursor-pointer border border-surface-border ${statusFilter === 'Hepsi' ? 'bg-ink text-black' : 'bg-surface-0 text-content-muted'}`}
          >
            Tüm Durumlar
          </button>
          <button
            onClick={() => setStatusFilter('danger')}
            className={`py-1 px-2.5 rounded-full text-[11px] font-semibold cursor-pointer border border-danger-border ${statusFilter === 'danger' ? 'bg-danger text-white' : 'bg-danger-bg text-danger'}`}
          >
            🔴 Tarihi Geçen
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`py-1 px-2.5 rounded-full text-[11px] font-semibold cursor-pointer border border-warning-border ${statusFilter === 'warning' ? 'bg-warning text-black' : 'bg-warning-bg text-warning'}`}
          >
            🟡 Kritik (Son 3 Gün)
          </button>
        </div>
      </div>

      {/* Başlık ve Sayaç */}
      <div className="flex justify-between items-center px-0.5 mt-2.5">
        <span className="text-[15px] font-bold text-ink tracking-tight">Stoktaki Ürünler</span>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-content-muted font-medium">{filteredInventory.length} ürün</span>
          {/* Baristalar CSV butonunu görmemeli */}
          {userRole !== 'Barista' && (
            <button
              onClick={() => setModalState('showCsvModal', true)}
              className="bg-transparent border-none text-content-muted cursor-pointer text-xs"
            >
              ⚙️ CSV
            </button>
          )}
        </div>
      </div>

      {/* Liste Görünümü */}
      {filteredInventory.length === 0 ? (
        <div className="text-center py-12 px-5 bg-surface-1 border-[1.5px] border-dashed border-surface-border rounded-lg flex flex-col items-center gap-3">
          <div className="text-4xl opacity-35">📦</div>
          <p className="text-[13px] text-content-muted max-w-[240px] leading-relaxed">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          {canEdit && (
            <button onClick={() => navigate('/scanner')} className="py-2.5 px-5 rounded-md text-[13px] font-semibold cursor-pointer bg-ink text-night w-auto active:bg-ink-hover active:scale-[0.98]">
              + Yeni Ürün Ekle
            </button>
          )}
        </div>
      ) : (
        filteredInventory.map((item) => {
          const days = getDaysRemaining(item.expirationDate);
          const status = getStatusDetails(days, item.category);

          return (
            <div key={item.id} className={`bg-surface-1 border rounded-lg py-3.5 px-3.5 pl-[18px] flex flex-col gap-2.5 transition relative overflow-hidden animate-[fadeSlideIn_0.3s_ease-out] ${status.statusBorderClass}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[15px] font-semibold text-content tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-content-muted mt-1 flex-wrap">
                    <span className="bg-surface-2 text-content-secondary py-0.5 px-2 rounded-full font-semibold text-[10px] tracking-wide">{item.category}</span>
                    <span className="font-mono text-[10px] text-content-muted">Kod: {item.barcode}</span>
                  </div>
                </div>
                <span className={`text-[11px] font-bold py-1 px-2.5 rounded-full whitespace-nowrap flex-shrink-0 ${status.statusClass}`}>
                  {item.quantity} Adet
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-surface-border-2 pt-2.5">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-content-muted uppercase font-bold tracking-wide">SKT Tarihi</span>
                    <span className="text-[13px] font-semibold text-content">{formatDate(item.expirationDate)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-content-muted uppercase font-bold tracking-wide">Durum</span>
                    <span className="text-[13px] font-semibold text-content">{status.label}</span>
                  </div>
                </div>

                {canEdit && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="bg-transparent border border-danger-border text-danger py-2 px-2.5 rounded-md cursor-pointer transition flex items-center justify-center active:bg-danger-bg active:scale-[0.93]"
                      title="Tüket / Sil"
                    >
                      Tüket / Sil
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};
