import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore, useAuthStore } from './store/useStore';
import { useSyncData } from './hooks/useSyncData';
import { BARISTAS } from './constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { useUIStore } from './store/useUIStore';
// Layouts
import { BaristaLayout } from './layouts/BaristaLayout';
import { ManagerLayout } from './layouts/ManagerLayout';
import { RegionalLayout } from './layouts/RegionalLayout';

// Features / Views
import { Splash } from './features/auth/Splash';
import { LoginView } from './features/auth/LoginView';
import { BaristaDashboard } from './layouts/BaristaDashboard';
import { ManagerDashboard } from './layouts/ManagerDashboard';
import { RegionalDashboard } from './layouts/RegionalDashboard';

import { ChangePasswordScreen } from './features/auth/ChangePasswordScreen';
import { watchAuthState, AuthUserWithProfile, UserProfile } from './api/auth';
import { ManagerLoginModal } from './components/modals/ManagerLoginModal';
import { SyncStatusBanner } from './components/SyncStatusBanner';
import { BroadcastBanner } from './components/BroadcastBanner';
import { UpdateBanner } from './components/UpdateBanner';
import { useBroadcastListener } from './hooks/useBroadcastListener';
import { useVersionCheck } from './hooks/useVersionCheck';
import { UserRole } from './types';

// Lazy Loaded Routes
const InventoryList = React.lazy(() => import('./features/inventory/InventoryList').then(m => ({ default: m.InventoryList })));
const RecipesView = React.lazy(() => import('./features/recipes/RecipesView').then(m => ({ default: m.RecipesView })));
const TrainingQuiz = React.lazy(() => import('./features/training/TrainingQuiz').then(m => ({ default: m.TrainingQuiz })));
const ScannerView = React.lazy(() => import('./features/scanner/ScannerView').then(m => ({ default: m.ScannerView })));
const ReportsView = React.lazy(() => import('./features/reports/ReportsView').then(m => ({ default: m.ReportsView })));
const BaristaPerformanceReport = React.lazy(() => import('./features/reports/BaristaPerformanceReport').then(m => ({ default: m.BaristaPerformanceReport })));
const RegionalReportsView = React.lazy(() => import('./features/reports/RegionalReportsView').then(m => ({ default: m.RegionalReportsView })));
const FrozenStockView = React.lazy(() => import('./features/frozenstock/FrozenStockView').then(m => ({ default: m.FrozenStockView })));
const BroadcastView = React.lazy(() => import('./features/broadcast/BroadcastView').then(m => ({ default: m.BroadcastView })));

export const App: React.FC = () => {
  const { isAuthenticated, userRole, setAuth } = useStore();
  const activeBranchId = useAuthStore(state => state.activeBranchId);
  const [firebaseUser, setFirebaseUser] = React.useState<AuthUserWithProfile | null | 'loading'>('loading');
  const [showManagerLoginModal, setShowManagerLoginModal] = React.useState(false);
  useSyncData();
  const hasSession = firebaseUser !== null && firebaseUser !== 'loading';
  const { banner, dismissBanner } = useBroadcastListener(hasSession);
  const { updateInfo, dismiss: dismissUpdate } = useVersionCheck(hasSession);

  React.useEffect(() => {
    const unsubscribe = watchAuthState((user) => {
      setFirebaseUser(user);
      
      // Auto-login for bolge_muduru to bypass Barista PIN screen
      if (user && user.profile?.role === 'bolge_muduru') {
        setAuth(true, 'Bölge Müdürü', null, user.profile.regionId);
        useAuthStore.getState().setBranch('');
      }
    });
    return unsubscribe;
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const backButtonListener = CapacitorApp.addListener('backButton', () => {
      const state = useUIStore.getState();
      const openModal = ['showBranchModal', 'showAddModal', 'showDeleteModal', 'showCsvModal', 'showSmartReorderModal', 'showFrozenModal'].find(
        (modalName) => state[modalName as keyof typeof state] === true
      );

      if (openModal) {
        state.setModalState(openModal as any, false);
      } else if (location.pathname !== '/') {
        navigate(-1);
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, [location, navigate]);

  const handleLogin = (role: any, baristaId?: string) => {
    let barista = null;
    if (role === 'Barista' && baristaId) {
      barista = BARISTAS.find(b => b.id === baristaId) || null;
    }
    setAuth(true, role, barista);
    
    if (role === 'Bölge Müdürü') {
      useAuthStore.getState().setBranch('');
    }
  };

  const mapFirebaseRole = (role?: string): UserRole => {
    if (role === 'bolge_muduru') return 'Bölge Müdürü';
    return 'Şube Müdürü';
  };

  const handleManagerLoginSuccess = (profile: UserProfile | null) => {
    setAuth(true, mapFirebaseRole(profile?.role), null, profile?.regionId);
    if (profile?.branchId) {
      useAuthStore.getState().setBranch(profile.branchId);
    }
    if (profile?.role === 'bolge_muduru') {
      useAuthStore.getState().setBranch('');
    }
    setShowManagerLoginModal(false);
  };

  if (firebaseUser === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-espresso">
        <div className="w-7 h-7 rounded-full border-2 border-line border-t-crema [animation:rotation_0.7s_linear_infinite]" />
      </div>
    );
  }

  if (firebaseUser && firebaseUser.profile?.mustChangePassword) {
    return <ChangePasswordScreen user={firebaseUser} onPasswordChanged={() => {
      // Refresh the firebase user object to re-evaluate state
      setFirebaseUser({ ...firebaseUser, profile: { ...firebaseUser.profile, mustChangePassword: false } } as AuthUserWithProfile);

      if (firebaseUser.profile?.role === 'bolge_muduru') {
        setAuth(true, 'Bölge Müdürü', null, firebaseUser.profile.regionId);
        useAuthStore.getState().setBranch('');
      }
    }} />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginView onLogin={handleLogin} onManagerLoginClick={() => setShowManagerLoginModal(true)} />
        {showManagerLoginModal && (
          <ManagerLoginModal
            defaultEmail={firebaseUser ? firebaseUser.email ?? '' : ''}
            onClose={() => setShowManagerLoginModal(false)}
            onSuccess={handleManagerLoginSuccess}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Splash />
      <SyncStatusBanner hasSession={!!firebaseUser} />
      <BroadcastBanner broadcast={banner} onDismiss={dismissBanner} />
      {updateInfo && (
        <UpdateBanner latestVersion={updateInfo.latestVersion} note={updateInfo.note} onDismiss={dismissUpdate} />
      )}
      <Routes>
        {userRole === 'Barista' && (
          <Route element={<BaristaLayout />}>
            <Route path="/" element={<BaristaDashboard />} />
            <Route path="/scanner" element={<ScannerView />} />
            <Route path="/training" element={<TrainingQuiz />} />
            <Route path="/recipes" element={<RecipesView />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/frozen-stock" element={<FrozenStockView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {userRole === 'Şube Müdürü' && (
          <Route element={<ManagerLayout />}>
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="/scanner" element={<ScannerView />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/frozen-stock" element={<FrozenStockView />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/barista-performance" element={<BaristaPerformanceReport />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {userRole === 'Bölge Müdürü' && (
          <Route element={<RegionalLayout />}>
            {activeBranchId ? (
              <>
                <Route path="/" element={<ManagerDashboard readOnly />} />
                <Route path="/inventory" element={<InventoryList />} />
                <Route path="/reports" element={<ReportsView />} />
                <Route path="/barista-performance" element={<BaristaPerformanceReport />} />
              </>
            ) : (
              <>
                <Route path="/" element={<RegionalDashboard />} />
                <Route path="/reports" element={<RegionalReportsView />} />
              </>
            )}
            {/* Reçeteler ve duyurular şubeye değil bölgeye ait — şube
                seçili olsun olmasın erişilebilir olmalı. */}
            <Route path="/recipes" element={<RecipesView />} />
            <Route path="/broadcast" element={<BroadcastView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </>
  );
};
