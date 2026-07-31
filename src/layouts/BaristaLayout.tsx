import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { GlobalModals } from '../components/GlobalModals';
import { useAuthStore } from '../store/useStore';
import { ActiveTab } from '../types';

export const BaristaLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBranchId, activeBarista, logout } = useAuthStore();

  const isScanner = location.pathname === '/scanner';
  const currentPath = (location.pathname.substring(1) || 'dashboard') as ActiveTab;

  return (
    <div id="root">
      {!isScanner && (
        <Header
          userRole="Barista"
          activeBranchId={activeBranchId}
          activeBarista={activeBarista}
          onOpenRoleModal={() => { logout(); navigate('/'); }}
          onOpenBranchModal={() => {}} // Baristas can't change branch
        />
      )}
      <main className={`flex-1 pt-[calc(84px+env(safe-area-inset-top))] px-4 flex flex-col gap-4 overflow-y-auto ${isScanner ? 'pb-0' : 'pb-20'}`}>
        <React.Suspense fallback={<div className="fixed inset-0 w-screen h-screen bg-black/85 backdrop-blur-md z-[10000] flex justify-center items-center"><div className="inline-block w-12 h-12 rounded-full border-4 border-surface-border border-b-gold [animation:rotation_1s_linear_infinite]"></div></div>}>
          <Outlet />
        </React.Suspense>
      </main>
      {!isScanner && (
        <BottomNav
          activeTab={currentPath}
          onNavigate={(tab) => navigate(tab === 'dashboard' ? '/' : `/${tab}`)}
          userRole="Barista"
        />
      )}
      <GlobalModals />
    </div>
  );
};
