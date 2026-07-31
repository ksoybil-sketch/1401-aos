import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { GlobalModals } from '../components/GlobalModals';
import { useAuthStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';

export const RegionalLayout: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, logout } = useAuthStore();
  const { setModalState } = useUIStore();

  return (
    <div id="root">
      <Header
        userRole="Bölge Müdürü"
        activeBranchId={activeBranchId}
        onOpenRoleModal={() => { logout(); navigate('/'); }}
        onOpenBranchModal={() => setModalState('showBranchModal', true)}
      />
      <main className="app-content" style={{ paddingBottom: '20px' }}>
         {activeBranchId && (
          <div style={{ padding: '16px 16px 0' }}>
            <button 
              onClick={() => useAuthStore.getState().setBranch('')}
              style={{ padding: '8px 12px', background: 'var(--surface-2)', border: 'none', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              ← Tüm Şubelere Dön
            </button>
          </div>
        )}
        <React.Suspense fallback={<div className="api-loading-overlay"><div className="api-spinner"></div></div>}>
          <Outlet />
        </React.Suspense>
      </main>
      <GlobalModals />
    </div>
  );
};
