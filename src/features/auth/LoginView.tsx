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
      <div className="login-container">
        <div className="login-header">
          <img src="/icons/logo_goat.svg" alt="Logo" className="login-logo" />
          <h1 className="login-title">1401 AOS</h1>
          <p className="login-subtitle">Lütfen giriş yapacak baristayı seçin</p>
        </div>

        <div className="login-list">
          {DEMO_BARISTAS.map(b => (
            <button
              key={b.id}
              className="btn btn-secondary login-btn-item"
              onClick={() => setSelectedUser(b.id)}
            >
              <span>🧑‍🍳 {b.name}</span>
              <span className="login-btn-icon">Giriş Yap ➔</span>
            </button>
          ))}
          
          <div style={{ borderTop: '1px solid var(--surface-border)', margin: '20px 0' }}></div>
          <button
            className="btn admin-login-btn"
            onClick={onManagerLoginClick}
          >
            <span>👑 Yönetici Girişi Yap</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container" style={{ padding: 0 }}>
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
        <button 
          className="login-back-btn"
          onClick={() => { setSelectedUser(null); setPin(''); setError(''); }}
        >
          ❮ Geri
        </button>
      </div>

      <div className="login-pin-header">
        <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
          {selectedUser === 'admin' ? 'Yönetici' : DEMO_BARISTAS.find(b => b.id === selectedUser)?.name}
        </h2>
        <p className="login-subtitle" style={{ marginBottom: '30px' }}>
          Lütfen şifrenizi girin
        </p>

        <div className="pin-display" style={{ 
          fontSize: '32px', 
          letterSpacing: '10px', 
          height: '40px', 
          marginBottom: '20px',
          color: 'var(--text-main)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          {pin.length > 0 ? '•'.repeat(pin.length) : <span style={{ color: 'var(--text-muted)' }}>...</span>}
        </div>

        {error && <p style={{ color: 'var(--danger)', marginBottom: '20px' }}>{error}</p>}

        <div className="keypad-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button 
              key={num} 
              className="keypad-btn"
              onClick={() => handleKeypad(num)}
            >
              {num}
            </button>
          ))}
          <button 
            className="keypad-btn primary"
            onClick={handleLogin}
          >
            ✓
          </button>
          <button 
            className="keypad-btn"
            onClick={() => handleKeypad('0')}
          >
            0
          </button>
          <button 
            className="keypad-btn"
            style={{ fontSize: '18px', backgroundColor: 'var(--surface-border)' }}
            onClick={handleBackspace}
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
};
