import React, { useState } from 'react';

interface ManagerReauthModalProps {
  onClose: () => void;
  onSuccess: (password: string) => Promise<void>;
}

export const ManagerReauthModal: React.FC<ManagerReauthModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Lütfen şifrenizi girin.");
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      await onSuccess(password);
    } catch (err: any) {
      setError(err.message || "Şifre doğrulanamadı.");
      setLoading(false);
    } 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Müdür Yetki Doğrulaması</h2>
          <button onClick={onClose} className="btn-close" disabled={loading}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-inner">
          <div className="form-group">
            <span className="form-label">Hesap Şifreniz</span>
            <input
              type="password"
              className="form-input"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '-10px', marginBottom: '10px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
