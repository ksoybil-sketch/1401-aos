import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore, useAuthStore } from './store/useStore';
import { useSyncData } from './hooks/useSyncData';
import { DEMO_BARISTAS } from './constants';
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

import { LoginScreen } from './features/auth/LoginScreen';
import { ChangePasswordScreen } from './features/auth/ChangePasswordScreen';
import { watchAuthState, AuthUserWithProfile } from './api/auth';
import { ManagerReauthModal } from './components/modals/ManagerReauthModal';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

// Lazy Loaded Routes
const InventoryList = React.lazy(() => import('./features/inventory/InventoryList').then(m => ({ default: m.InventoryList })));
const RecipesView = React.lazy(() => import('./features/recipes/RecipesView').then(m => ({ default: m.RecipesView })));
const TrainingQuiz = React.lazy(() => import('./features/training/TrainingQuiz').then(m => ({ default: m.TrainingQuiz })));
const ScannerView = React.lazy(() => import('./features/scanner/ScannerView').then(m => ({ default: m.ScannerView })));
const ReportsView = React.lazy(() => import('./features/reports/ReportsView').then(m => ({ default: m.ReportsView })));
const BaristaPerformanceReport = React.lazy(() => import('./features/reports/BaristaPerformanceReport').then(m => ({ default: m.BaristaPerformanceReport })));

export const App: React.FC = () => {
  const { isAuthenticated, userRole, setAuth } = useStore();
  const activeBranchId = useAuthStore(state => state.activeBranchId);
  const [firebaseUser, setFirebaseUser] = React.useState<AuthUserWithProfile | null | 'loading'>('loading');
  const [showReauthModal, setShowReauthModal] = React.useState(false);
  useSyncData();

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
      barista = DEMO_BARISTAS.find(b => b.id === baristaId) || null;
    }
    setAuth(true, role, barista);
    
    if (role === 'Bölge Müdürü') {
      useAuthStore.getState().setBranch('');
    }
  };

  const handleManagerReturn = () => {
    if (!firebaseUser || firebaseUser === 'loading') return;
    setShowReauthModal(true);
  };

  const handleReauthSuccess = async (password: string) => {
    if (!firebaseUser || firebaseUser === 'loading' || !firebaseUser.email) return;
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, password);
      await reauthenticateWithCredential(firebaseUser, credential);
      
      setShowReauthModal(false);
      
      const roleMap: Record<string, any> = {
        'sube_muduru': 'Şube Müdürü',
        'bolge_muduru': 'Bölge Müdürü'
      };
      const role = roleMap[firebaseUser.profile?.role || ''] || 'Şube Müdürü';
      setAuth(true, role, null, firebaseUser.profile?.regionId);
      if (firebaseUser.profile?.branchId) {
        useAuthStore.getState().setBranch(firebaseUser.profile.branchId);
      }
    } catch (err: any) {
      // Re-auth failed, we should probably pass the error down to the modal or just use alert
      // Wait, let's use a simple alert for now or let the modal handle it by passing an error prop?
      // Since the modal controls its own loading state, it's better to pass a callback that throws if it fails.
      throw new Error("Şifreniz hatalı. Lütfen tekrar deneyin.");
    }
  };

  if (firebaseUser === 'loading') {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 font-medium">Yükleniyor...</div>;
  }

  if (!firebaseUser) {
    return <LoginScreen />;
  }

  if (firebaseUser.profile?.mustChangePassword) {
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
    const managerName = firebaseUser.profile?.role === 'bolge_muduru' ? 'Bölge Müdürü' : 'Şube Müdürü';
    return <LoginView onLogin={handleLogin} onManagerReturn={handleManagerReturn} managerName={managerName} />;
  }

  return (
    <>
      <Splash />
      {showReauthModal && (
        <ManagerReauthModal
          onClose={() => setShowReauthModal(false)}
          onSuccess={(password) => {
             // Handle the promise returned by handleReauthSuccess inside the modal
             // Wait, the modal doesn't await onSuccess. Let me fix the modal to await onSuccess.
             // I'll change onSuccess signature to `(password: string) => Promise<void>` in ManagerReauthModal
             return handleReauthSuccess(password);
          }}
        />
      )}
      <Routes>
        {userRole === 'Barista' && (
          <Route element={<BaristaLayout />}>
            <Route path="/" element={<BaristaDashboard />} />
            <Route path="/scanner" element={<ScannerView />} />
            <Route path="/training" element={<TrainingQuiz />} />
            <Route path="/recipes" element={<RecipesView />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {userRole === 'Şube Müdürü' && (
          <Route element={<ManagerLayout />}>
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/barista-performance" element={<BaristaPerformanceReport />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {userRole === 'Bölge Müdürü' && (
          <Route element={<RegionalLayout />}>
            {activeBranchId ? (
              <Route path="/" element={<ManagerDashboard readOnly />} />
            ) : (
              <Route path="/" element={<RegionalDashboard />} />
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </>
  );
};
