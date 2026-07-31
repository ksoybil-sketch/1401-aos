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
      <main className="app-content" style={{ paddingBottom: '80px' }}>
        <React.Suspense fallback={<div className="api-loading-overlay"><div className="api-spinner"></div></div>}>
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
