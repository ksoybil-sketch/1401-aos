import React, { useState } from 'react';
import { signIn, getUserProfile, UserProfile } from '../../api/auth';
import { Icon } from '../Icon';
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
          <h2 className={modalTitle}>Yönetici Girişi</h2>
          <button onClick={onClose} className={iconBtn} disabled={loading} aria-label="Kapat">
            <Icon name="close" size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`${modalBody} flex flex-col gap-3.5`}>
          <div className={field}>
            <span className={label}>E-posta</span>
            <input
              type="email"
              className={input}
              placeholder="ornek@1401coffee.com"
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
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-negative-line bg-negative-bg px-3 py-2.5">
              <Icon name="alert" size={15} className="text-negative mt-px" />
              <span className="text-[13px] text-negative">{error}</span>
            </div>
          )}

          <div className="flex gap-2.5 mt-1.5">
            <button type="button" onClick={onClose} className={`${btn} ${btnSecondary} ${btnLg} flex-1`} disabled={loading}>
              İptal
            </button>
            <button type="submit" className={`${btn} ${btnPrimary} ${btnLg} flex-1`} disabled={loading}>
              {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
