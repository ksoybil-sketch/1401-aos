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
      <main className="app-content" style={{ paddingBottom: isScanner ? '0' : '80px' }}>
        <React.Suspense fallback={<div className="api-loading-overlay"><div className="api-spinner"></div></div>}>
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
