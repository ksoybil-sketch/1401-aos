import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { DEMO_BARISTAS } from '../../constants';
import { Icon } from '../../components/Icon';
import { iconChip, listGroup, listRow, rowChevron } from '../../constants/ui';
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
        setError('Hatalı şifre');
      }
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      handleLogin();
    }
  }, [pin]);

  const keypadBtn =
    'h-14 rounded-xl bg-panel border border-line text-crema text-[20px] font-medium cursor-pointer transition-colors duration-150 hover:bg-panel-2 active:bg-panel-3';

  if (!selectedUser) {
    return (
      <div className="flex flex-col min-h-screen px-5 pt-[calc(56px+env(safe-area-inset-top))] pb-10 max-w-[420px] mx-auto">
        <div className="mb-9">
          <img src="/icons/logo_goat.svg" alt="" className="w-11 h-11 object-contain opacity-90 mb-5" />
          <h1 className="text-[26px] font-bold text-crema tracking-tight">1401 Coffee</h1>
          <p className="text-[14px] text-fg-3 mt-1.5">Devam etmek için hesabını seç</p>
        </div>

        <div className={listGroup}>
          {DEMO_BARISTAS.map(b => (
            <button key={b.id} onClick={() => setSelectedUser(b.id)} className={listRow}>
              <span className={iconChip()}>
                <Icon name="user" size={16} />
              </span>
              <span className="flex-1 text-[15px] font-medium text-crema truncate">{b.name}</span>
              <Icon name="chevronRight" size={16} className={rowChevron} />
            </button>
          ))}
        </div>

        <div className="mt-3.5">
          <div className={listGroup}>
            <button onClick={onManagerLoginClick} className={listRow}>
              <span className={iconChip()}>
                <Icon name="shield" size={16} />
              </span>
              <span className="flex-1 text-[15px] font-medium text-crema">Yönetici girişi</span>
              <Icon name="chevronRight" size={16} className={rowChevron} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-[420px] mx-auto pt-[calc(12px+env(safe-area-inset-top))] pb-10 px-5">
      <div className="flex items-center h-12">
        <button
          onClick={() => { setSelectedUser(null); setPin(''); setError(''); }}
          className="inline-flex items-center gap-1 text-fg-2 text-[15px] font-medium cursor-pointer transition-colors hover:text-crema -ml-1"
        >
          <Icon name="chevronLeft" size={18} />
          Geri
        </button>
      </div>

      <div className="text-center mt-10">
        <h2 className="text-crema text-[19px] font-semibold tracking-tight">
          {DEMO_BARISTAS.find(b => b.id === selectedUser)?.name}
        </h2>
        <p className="text-[13px] text-fg-3 mt-1.5 mb-8">Şifreni gir</p>

        {/* PIN göstergesi */}
        <div className="flex justify-center items-center gap-3.5 h-6">
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-150 ${
                i < pin.length ? 'bg-crema' : 'bg-panel-3'
              }`}
            />
          ))}
        </div>

        <p className={`text-negative text-[13px] font-medium h-5 mt-3.5 mb-5 transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
          {error || ' '}
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button key={num} onClick={() => handleKeypad(num)} className={keypadBtn}>
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handleKeypad('0')} className={keypadBtn}>
            0
          </button>
          <button
            onClick={handleBackspace}
            className={`${keypadBtn} flex items-center justify-center text-fg-2`}
            aria-label="Sil"
          >
            <Icon name="chevronLeft" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
