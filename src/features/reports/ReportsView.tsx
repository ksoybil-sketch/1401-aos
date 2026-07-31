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
      <div className="flex justify-between items-center px-0.5 mb-4">
        <span className="text-[15px] font-bold text-ink tracking-tight">📊 Analiz ve Raporlar</span>
        <button
          onClick={() => navigate('/')}
          className="bg-transparent border-none text-content-secondary text-[13px] cursor-pointer font-semibold"
        >
          Ana Ekran
        </button>
      </div>

      <button
        onClick={() => navigate('/barista-performance')}
        className="flex justify-between items-center w-full bg-surface-1 py-3.5 px-4 rounded-lg border border-surface-border mb-5 cursor-pointer text-content font-bold text-sm"
      >
        <span>👤 Barista Performans Raporu</span>
        <span className="text-content-muted">→</span>
      </button>

      <div className="flex flex-col gap-5">
        {/* Zayi Raporu */}
        <div className="bg-surface-1 p-4 rounded-lg border border-[rgba(255,107,107,0.2)]">
          <h3 className="mt-0 text-danger text-base mb-3">🔴 Çöpe Gidenler (Zayi)</h3>
          <ul className="p-0 m-0 list-none">
            {expiredLogs.length === 0 ? (
              <p className="text-content-secondary text-sm m-0">Zayi kaydı bulunmuyor.</p>
            ) : (
              expiredLogs.map((log) => (
                <li key={log.id} className="flex justify-between py-2 border-b border-surface-border text-sm last:border-b-0">
                  <span>{new Date(log.date).toLocaleDateString('tr-TR')} - <strong>{log.productName}</strong></span>
                  <span className="font-bold text-danger">{log.quantity} Adet</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Satılanlar / Tüketilenler Raporu */}
        <div className="bg-surface-1 p-4 rounded-lg border border-[rgba(52,201,135,0.2)]">
          <h3 className="mt-0 text-success text-base mb-3">🟢 Tüketilenler / Satılanlar</h3>
          <ul className="p-0 m-0 list-none">
            {consumedLogs.length === 0 ? (
              <p className="text-content-secondary text-sm m-0">Tüketim kaydı bulunmuyor.</p>
            ) : (
              consumedLogs.map((log) => (
                <li key={log.id} className="flex justify-between py-2 border-b border-surface-border text-sm last:border-b-0">
                  <span>{new Date(log.date).toLocaleDateString('tr-TR')} - <strong>{log.productName}</strong></span>
                  <span className="font-bold text-success">{log.quantity} Adet</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
