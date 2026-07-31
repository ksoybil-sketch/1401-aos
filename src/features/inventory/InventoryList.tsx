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
  const { setModalState, openDeleteModal, inventoryStatusFilter: statusFilter, setInventoryStatusFilter: setStatusFilter } = useUIStore();
  const canEdit = ROLE_PERMISSIONS[userRole].canEditInventory;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Hepsi');

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
    <section className="inventory-list">
      {/* Filtre ve Arama Alanı */}
      <div className="filter-section">
        <div className="search-input-wrapper">
          <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Ürün adı, barkod veya kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Kategori Filtre Butonları */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${selectedCategoryFilter === 'Hepsi' ? 'active' : ''}`}
            onClick={() => setSelectedCategoryFilter('Hepsi')}
          >
            Tümü
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${selectedCategoryFilter === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SKT Durum Filtresi */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingTop: '4px' }}>
          <button
            onClick={() => setStatusFilter('Hepsi')}
            style={{
              padding: '4px 10px',
              borderRadius: '100px',
              fontSize: '11px',
              border: '1px solid var(--surface-border)',
              background: statusFilter === 'Hepsi' ? 'var(--primary)' : 'var(--surface-0)',
              color: statusFilter === 'Hepsi' ? '#000' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Tüm Durumlar
          </button>
          <button
            onClick={() => setStatusFilter('danger')}
            style={{
              padding: '4px 10px',
              borderRadius: '100px',
              fontSize: '11px',
              border: '1px solid var(--danger-border)',
              background: statusFilter === 'danger' ? 'var(--danger)' : 'var(--danger-bg)',
              color: statusFilter === 'danger' ? '#fff' : 'var(--danger)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🔴 Tarihi Geçen
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            style={{
              padding: '4px 10px',
              borderRadius: '100px',
              fontSize: '11px',
              border: '1px solid var(--warning-border)',
              background: statusFilter === 'warning' ? 'var(--warning)' : 'var(--warning-bg)',
              color: statusFilter === 'warning' ? '#000' : 'var(--warning)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🟡 Kritik (Son 3 Gün)
          </button>
        </div>
      </div>

      {/* Başlık ve Sayaç */}
      <div className="list-header" style={{ marginTop: '10px' }}>
        <span className="list-title">Stoktaki Ürünler</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="list-count">{filteredInventory.length} ürün</span>
          {/* Baristalar CSV butonunu görmemeli */}
          {userRole !== 'Barista' && (
            <button
              onClick={() => setModalState('showCsvModal', true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
            >
              ⚙️ CSV
            </button>
          )}
        </div>
      </div>

      {/* Liste Görünümü */}
      {filteredInventory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p className="empty-text">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          {canEdit && (
            <button onClick={() => navigate('/scanner')} className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '13px' }}>
              + Yeni Ürün Ekle
            </button>
          )}
        </div>
      ) : (
        filteredInventory.map((item) => {
          const days = getDaysRemaining(item.expirationDate);
          const status = getStatusDetails(days, item.category);

          return (
            <div key={item.id} className={`inventory-item ${status.statusBorderClass}`}>
              <div className="item-top">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <div className="item-meta">
                    <span className="item-category">{item.category}</span>
                    <span className="item-barcode">Kod: {item.barcode}</span>
                  </div>
                </div>
                <span className={`status-badge ${status.statusClass}`}>
                  {item.quantity} Adet
                </span>
              </div>

              <div className="item-bottom">
                <div className="item-details">
                  <div className="detail-group">
                    <span className="detail-label">SKT Tarihi</span>
                    <span className="detail-value">{formatDate(item.expirationDate)}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Durum</span>
                    <span className="detail-value">{status.label}</span>
                  </div>
                </div>

                {canEdit && (
                  <div className="item-actions">
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="btn-delete"
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
