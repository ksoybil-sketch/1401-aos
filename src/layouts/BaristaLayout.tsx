import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { GlobalModals } from '../components/GlobalModals';
import { useAuthStore } from '../store/useStore';
import { ActiveTab } from '../types';
import { fullscreenLoader, spinner } from '../constants/ui';

export const BaristaLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBranchId, activeBarista, logout } = useAuthStore();

  const isScanner = location.pathname === '/scanner';
  const currentPath = (location.pathname.substring(1) || 'dashboard') as ActiveTab;

  return (
    <div id="root" className="min-h-screen">
      {!isScanner && (
        <Header
          userRole="Barista"
          activeBranchId={activeBranchId}
          activeBarista={activeBarista}
          onOpenRoleModal={() => { logout(); navigate('/'); }}
          onOpenBranchModal={() => {}} // Baristas can't change branch
        />
      )}
      <main
        className={
          isScanner
            ? ''
            : 'max-w-[560px] mx-auto px-4 pt-[calc(80px+env(safe-area-inset-top))] pb-[calc(100px+env(safe-area-inset-bottom))] flex flex-col gap-4'
        }
      >
        <React.Suspense
          fallback={
            <div className={fullscreenLoader}>
              <div className={`${spinner} w-11 h-11`} />
            </div>
          }
        >
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
