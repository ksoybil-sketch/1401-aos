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
      <main className="flex-1 pt-[calc(84px+env(safe-area-inset-top))] px-4 pb-5 flex flex-col gap-4 overflow-y-auto">
        {activeBranchId && (
          <div>
            <button
              onClick={() => useAuthStore.getState().setBranch('')}
              className="py-2 px-3 bg-surface-2 border-none text-content rounded-md font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              ← Tüm Şubelere Dön
            </button>
          </div>
        )}
        <React.Suspense fallback={<div className="fixed inset-0 w-screen h-screen bg-black/85 backdrop-blur-md z-[10000] flex justify-center items-center"><div className="inline-block w-12 h-12 rounded-full border-4 border-surface-border border-b-gold [animation:rotation_1s_linear_infinite]"></div></div>}>
          <Outlet />
        </React.Suspense>
      </main>
      <GlobalModals />
    </div>
  );
};
