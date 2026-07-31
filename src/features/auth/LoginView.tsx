import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { DEMO_BARISTAS } from '../../constants';
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

  if (!selectedUser) {
    return (
      <div className="flex flex-col min-h-screen px-5 py-8 bg-night">
        <div className="text-center mb-7">
          <img
            src="/icons/logo_goat.svg"
            alt="Logo"
            className="w-16 h-16 object-contain mx-auto mb-3.5 [filter:brightness(0)_invert(0.92)]"
          />
          <h1 className="text-xl font-extrabold text-ink mb-1.5">1401 AOS</h1>
          <p className="text-[13px] text-content-muted">Lütfen giriş yapacak baristayı seçin</p>
        </div>

        <div className="flex flex-col gap-2.5">
          {DEMO_BARISTAS.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedUser(b.id)}
              className="w-full py-4 px-4 rounded-md text-[15px] font-semibold cursor-pointer flex items-center justify-between text-left bg-surface-2 text-content-secondary border border-surface-border transition active:bg-surface-border active:scale-[0.98]"
            >
              <span>🧑‍🍳 {b.name}</span>
              <span className="text-[13px] text-gold font-semibold">Giriş Yap ➔</span>
            </button>
          ))}

          <div className="border-t border-surface-border my-5"></div>
          <button
            onClick={onManagerLoginClick}
            className="w-full py-4 px-4 rounded-md text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 bg-transparent border border-gold text-gold transition active:scale-[0.98]"
          >
            <span>👑 Yönetici Girişi Yap</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-night">
      <div className="p-5 flex items-center">
        <button
          onClick={() => { setSelectedUser(null); setPin(''); setError(''); }}
          className="bg-transparent border-none text-content-secondary text-sm font-semibold cursor-pointer p-2"
        >
          ❮ Geri
        </button>
      </div>

      <div className="text-center px-5">
        <h2 className="text-ink mb-2.5 text-lg font-bold">
          {selectedUser === 'admin' ? 'Yönetici' : DEMO_BARISTAS.find(b => b.id === selectedUser)?.name}
        </h2>
        <p className="text-[13px] text-content-muted mb-7">
          Lütfen şifrenizi girin
        </p>

        <div className="flex justify-center text-content mb-5" style={{ fontSize: '32px', letterSpacing: '10px', height: '40px' }}>
          {pin.length > 0 ? '•'.repeat(pin.length) : <span className="text-content-muted">...</span>}
        </div>

        {error && <p className="text-danger mb-5">{error}</p>}

        <div className="grid grid-cols-3 gap-3 px-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeypad(num)}
              className="aspect-square border-none rounded-lg bg-surface-2 text-ink text-[22px] font-bold cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleLogin}
            className="aspect-square border-none rounded-lg bg-gold text-night text-[22px] font-bold cursor-pointer"
          >
            ✓
          </button>
          <button
            onClick={() => handleKeypad('0')}
            className="aspect-square border-none rounded-lg bg-surface-2 text-ink text-[22px] font-bold cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="aspect-square border-none rounded-lg bg-surface-border text-ink text-lg font-bold cursor-pointer"
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
};
