import React, { useState } from 'react';
import { signIn, getUserProfile, UserProfile } from '../../api/auth';

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

const formInputClass = "w-full py-[13px] px-3.5 border border-surface-border rounded-md text-[15px] bg-surface-0 text-content transition focus:outline-none focus:border-gold focus:bg-surface-2";
const formLabelClass = "text-xs font-bold text-content-secondary uppercase tracking-wide";

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
    <div className="fixed inset-0 bg-black/65 z-[200] flex justify-center items-end animate-[fadeIn_0.2s_ease]">
      <div className="w-full max-w-[400px] bg-surface-1 rounded-t-xl pt-4 shadow-[0_20px_48px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-y-auto animate-[slideUp_0.35s_cubic-bezier(0.175,0.885,0.32,1.1)]">
        <div className="w-9 h-1 rounded-full bg-surface-border mx-auto mb-4" />
        <div className="flex justify-between items-center px-5 pb-4 border-b border-surface-border-2 mb-5">
          <h2 className="text-[17px] font-bold text-ink tracking-tight">👑 Yönetici Girişi</h2>
          <button onClick={onClose} className="bg-surface-2 border-none cursor-pointer text-content-muted flex items-center justify-center w-[30px] h-[30px] rounded-full transition active:bg-surface-border disabled:opacity-50" disabled={loading}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-10">
          <div className="flex flex-col gap-[7px] mb-3.5">
            <span className={formLabelClass}>E-posta</span>
            <input
              type="email"
              className={formInputClass}
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-[7px] mb-3.5">
            <span className={formLabelClass}>Şifre</span>
            <input
              type="password"
              className={formInputClass}
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-danger text-[13px] -mt-2.5 mb-2.5">{error}</p>}

          <div className="flex gap-2.5 mt-5">
            <button type="button" onClick={onClose} className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-surface-2 text-content-secondary border border-surface-border active:bg-surface-border active:scale-[0.98] disabled:opacity-50" disabled={loading}>
              İptal
            </button>
            <button type="submit" className="flex-1 py-[15px] rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition bg-ink text-night active:bg-ink-hover active:scale-[0.98] disabled:opacity-50" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
