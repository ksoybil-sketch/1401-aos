import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { DEMO_BARISTAS } from '../../constants';
import { cardInteractive } from '../../constants/ui';
/**
 * DİKKAT: Barista işlemlerinin sorumluluk sınırı hakkında not
 * Baristaların ayrı bir Firebase Auth kullanıcısı (hesabı) yoktur.
 * Buradaki PIN girişi sadece client-side (Zustand state) değişimidir.
 * Yani envanter/işlem kayıtlarındaki "hangi barista yaptı" bilgisi
 * Firebase güvenlik kuralları tarafından doğrulanamaz, tamamen cihaz
 * oturumuna (Şube Müdürü auth) dayanır ve sadece operasyonel bilgi amaçlıdır.
 */
interface LoginViewProps {
  onLogin: (role: UserRole, baristaId?: string) => void;
  onManagerLoginClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onManagerLoginClick }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleKeypad = (num: string) => {
    if (pin.length < 10) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleLogin = () => {
    if (selectedUser) {
      const barista = DEMO_BARISTAS.find(b => b.id === selectedUser);
      if (barista && barista.pin === pin) {
        onLogin('Barista', barista.id);
      } else {
        setError('Hatalı Şifre');
      }
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      handleLogin();
    }
  }, [pin]);

  const keypadBtn =
    'aspect-square rounded-2xl bg-glass-2 border border-hairline text-content text-2xl font-bold cursor-pointer transition-all duration-200 hover:bg-glass-3 active:scale-90';

  if (!selectedUser) {
    return (
      <div className="flex flex-col min-h-screen px-5 pt-[calc(48px+env(safe-area-inset-top))] pb-10 max-w-[440px] mx-auto">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-5">
            <div className="absolute inset-0 rounded-full bg-gold/30 blur-2xl [animation:auraPulse_4s_ease-in-out_infinite]" />
            <img src="/icons/logo_goat.svg" alt="Logo" className="relative w-20 h-20 object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-content tracking-tight">1401 AOS</h1>
          <p className="text-[13px] text-content-muted mt-2">Lütfen giriş yapacak baristayı seçin</p>
        </div>

        <div className="flex flex-col gap-3">
          {DEMO_BARISTAS.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedUser(b.id)}
              className={`${cardInteractive} py-4 px-5 flex items-center justify-between gap-3 text-left`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-2xl bg-gold/15 text-lg">🧑‍🍳</span>
                <span className="font-bold text-content truncate">{b.name}</span>
              </span>
              <span className="text-[13px] text-gold font-semibold shrink-0">Giriş Yap ➔</span>
            </button>
          ))}

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-hairline" />
            <span className="text-[10px] uppercase tracking-[0.14em] text-content-muted font-bold">veya</span>
            <div className="flex-1 h-px bg-hairline" />
          </div>

          <button
            onClick={onManagerLoginClick}
            className="w-full h-14 rounded-2xl bg-transparent border border-gold/50 text-gold font-bold cursor-pointer transition-all duration-200 hover:bg-gold/10 active:scale-[0.98]"
          >
            👑 Yönetici Girişi Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-[440px] mx-auto pt-[calc(20px+env(safe-area-inset-top))] pb-10">
      <div className="px-5 flex items-center">
        <button
          onClick={() => { setSelectedUser(null); setPin(''); setError(''); }}
          className="text-content-secondary text-sm font-semibold cursor-pointer py-2 pr-3 transition-colors hover:text-content"
        >
          ❮ Geri
        </button>
      </div>

      <div className="text-center px-5 mt-8">
        <h2 className="text-content text-xl font-extrabold tracking-tight">
          {selectedUser === 'admin' ? 'Yönetici' : DEMO_BARISTAS.find(b => b.id === selectedUser)?.name}
        </h2>
        <p className="text-[13px] text-content-muted mt-2 mb-8">
          Lütfen şifrenizi girin
        </p>

        {/* PIN göstergesi */}
        <div className="flex justify-center items-center gap-3 h-10 mb-3">
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? 'bg-gold scale-110 shadow-[0_0_12px_2px_rgba(217,182,95,0.6)]'
                  : 'bg-glass-3 border border-hairline'
              }`}
            />
          ))}
        </div>

        <p className={`text-danger text-sm font-semibold h-6 mb-4 transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
          {error || ' '}
        </p>

        <div className="grid grid-cols-3 gap-3 px-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button key={num} onClick={() => handleKeypad(num)} className={keypadBtn}>
              {num}
            </button>
          ))}
          <button
            onClick={handleLogin}
            className="aspect-square rounded-2xl bg-gradient-to-b from-gold-soft to-gold text-night text-2xl font-bold cursor-pointer transition-all duration-200 shadow-[0_8px_24px_-8px_rgba(217,182,95,0.7)] hover:brightness-110 active:scale-90"
          >
            ✓
          </button>
          <button onClick={() => handleKeypad('0')} className={keypadBtn}>
            0
          </button>
          <button
            onClick={handleBackspace}
            className={`${keypadBtn} text-lg text-content-secondary`}
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
};
