import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export const ReportsView: React.FC = () => {
  const navigate = useNavigate();
  const { transactionLog } = useStore();

  const expiredLogs = transactionLog.filter(log => log.type === 'EXPIRED');
  const consumedLogs = transactionLog.filter(log => log.type === 'CONSUMED');

  return (
    <div>
      <div className="list-header" style={{ marginBottom: '16px' }}>
        <span className="list-title">📊 Analiz ve Raporlar</span>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
        >
          Ana Ekran
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Zayi Raporu */}
        <div style={{ backgroundColor: 'var(--surface-1)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--danger)', fontSize: '16px', marginBottom: '12px' }}>🔴 Çöpe Gidenler (Zayi)</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {expiredLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Zayi kaydı bulunmuyor.</p>
            ) : (
              expiredLogs.map((log) => (
                <li key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface-border)', fontSize: '14px' }}>
                  <span>{new Date(log.date).toLocaleDateString('tr-TR')} - <strong>{log.productName}</strong></span>
                  <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>{log.quantity} Adet</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Satılanlar / Tüketilenler Raporu */}
        <div style={{ backgroundColor: 'var(--surface-1)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52, 201, 135, 0.2)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--success)', fontSize: '16px', marginBottom: '12px' }}>🟢 Tüketilenler / Satılanlar</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {consumedLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Tüketim kaydı bulunmuyor.</p>
            ) : (
              consumedLogs.map((log) => (
                <li key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface-border)', fontSize: '14px' }}>
                  <span>{new Date(log.date).toLocaleDateString('tr-TR')} - <strong>{log.productName}</strong></span>
                  <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{log.quantity} Adet</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
