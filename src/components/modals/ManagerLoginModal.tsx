import React, { useState } from 'react';
import { signIn, getUserProfile, UserProfile } from '../../api/auth';
import {
  btn, btnLg, btnPrimary, btnSecondary, field, iconBtn, input, label,
  modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle
} from '../../constants/ui';

interface ManagerLoginModalProps {
  defaultEmail?: string;
  onClose: () => void;
  onSuccess: (profile: UserProfile | null) => void;
}

function mapAuthError(code: string) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi.';
    case 'auth/user-disabled':
      return 'Bu hesap devre dışı bırakılmış.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-posta veya şifre hatalı.';
    case 'auth/too-many-requests':
      return 'Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar dene.';
    default:
      return 'Giriş yapılamadı. Lütfen tekrar dene.';
  }
}

export const ManagerLoginModal: React.FC<ManagerLoginModalProps> = ({ defaultEmail = '', onClose, onSuccess }) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signIn(email.trim(), password);
      const profile = await getUserProfile(user.uid);
      onSuccess(profile);
    } catch (err: any) {
      setError(mapAuthError(err.code));
      setLoading(false);
    }
  };

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>👑 Yönetici Girişi</h2>
          <button onClick={onClose} className={iconBtn} disabled={loading} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`${modalBody} flex flex-col gap-4`}>
          <div className={field}>
            <span className={label}>E-posta</span>
            <input
              type="email"
              className={input}
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className={field}>
            <span className={label}>Şifre</span>
            <input
              type="password"
              className={input}
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-danger text-[13px] font-medium">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className={`${btn} ${btnSecondary} ${btnLg} flex-1`} disabled={loading}>
              İptal
            </button>
            <button type="submit" className={`${btn} ${btnPrimary} ${btnLg} flex-1`} disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
