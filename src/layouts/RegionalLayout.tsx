import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { GlobalModals } from '../components/GlobalModals';
import { useAuthStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Icon } from '../components/Icon';
import { btn, btnGhost, btnMd, fullscreenLoader, spinner } from '../constants/ui';

export const RegionalLayout: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, logout } = useAuthStore();
  const { setModalState } = useUIStore();

  return (
    <div id="root" className="min-h-screen">
      <Header
        userRole="Bölge Müdürü"
        activeBranchId={activeBranchId}
        onOpenRoleModal={() => { logout(); navigate('/'); }}
        onOpenBranchModal={() => setModalState('showBranchModal', true)}
      />
      <main className="max-w-[560px] mx-auto px-4 pt-[calc(68px+env(safe-area-inset-top))] pb-[calc(28px+env(safe-area-inset-bottom))] flex flex-col gap-3.5">
        {activeBranchId && (
          <div>
            <button
              onClick={() => useAuthStore.getState().setBranch('')}
              className={`${btn} ${btnGhost} ${btnMd} -ml-2`}
            >
              <Icon name="chevronLeft" size={16} />
              Tüm Şubelere Dön
            </button>
          </div>
        )}
        <React.Suspense
          fallback={
            <div className={fullscreenLoader}>
              <div className={`${spinner} w-8 h-8`} />
            </div>
          }
        >
          <Outlet />
        </React.Suspense>
      </main>
      <GlobalModals />
    </div>
  );
};
