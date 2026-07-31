import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { GlobalModals } from '../components/GlobalModals';
import { useAuthStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { ActiveTab } from '../types';

export const ManagerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBranchId, logout } = useAuthStore();
  const { setModalState } = useUIStore();

  const currentPath = (location.pathname.substring(1) || 'dashboard') as ActiveTab;

  return (
    <div id="root">
      <Header
        userRole="Şube Müdürü"
        activeBranchId={activeBranchId}
        onOpenRoleModal={() => { logout(); navigate('/'); }}
        onOpenBranchModal={() => setModalState('showBranchModal', true)}
      />
      <main className="flex-1 pt-[calc(84px+env(safe-area-inset-top))] px-4 pb-20 flex flex-col gap-4 overflow-y-auto">
        <React.Suspense fallback={<div className="fixed inset-0 w-screen h-screen bg-black/85 backdrop-blur-md z-[10000] flex justify-center items-center"><div className="inline-block w-12 h-12 rounded-full border-4 border-surface-border border-b-gold [animation:rotation_1s_linear_infinite]"></div></div>}>
          <Outlet />
        </React.Suspense>
      </main>
      <BottomNav
        activeTab={currentPath}
        onNavigate={(tab) => navigate(tab === 'dashboard' ? '/' : `/${tab}`)}
        userRole="Şube Müdürü"
      />
      <GlobalModals />
    </div>
  );
};
