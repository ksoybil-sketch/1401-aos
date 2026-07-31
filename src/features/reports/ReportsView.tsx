import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { card, cardInteractive, screenTitle, tileBadge } from '../../constants/ui';

const logRow = 'flex justify-between items-center gap-3 py-2.5 border-b border-hairline last:border-b-0 text-sm';

export const ReportsView: React.FC = () => {
  const navigate = useNavigate();
  const { transactionLog } = useStore();

  const expiredLogs = transactionLog.filter(log => log.type === 'EXPIRED');
  const consumedLogs = transactionLog.filter(log => log.type === 'CONSUMED');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-3">
        <h2 className={screenTitle}>📊 Analiz ve Raporlar</h2>
        <button
          onClick={() => navigate('/')}
          className="text-content-muted text-[13px] font-semibold cursor-pointer transition-colors hover:text-gold shrink-0"
        >
          Ana Ekran
        </button>
      </div>

      <button
        onClick={() => navigate('/barista-performance')}
        className={`${cardInteractive} p-5 flex items-center gap-4 w-full text-left`}
      >
        <span className={tileBadge('violet')}>👤</span>
        <span className="flex-1 font-bold text-[15px] text-content">Barista Performans Raporu</span>
        <span className="text-content-muted">›</span>
      </button>

      {/* Zayi Raporu */}
      <div className={`${card} p-5 border-danger-border`}>
        <h3 className="text-danger text-[15px] font-bold mb-3">🔴 Çöpe Gidenler (Zayi)</h3>
        <ul className="p-0 m-0 list-none">
          {expiredLogs.length === 0 ? (
            <p className="text-content-muted text-sm m-0">Zayi kaydı bulunmuyor.</p>
          ) : (
            expiredLogs.map((log) => (
              <li key={log.id} className={logRow}>
                <span className="text-content-secondary min-w-0 truncate">
                  {new Date(log.date).toLocaleDateString('tr-TR')} — <strong className="text-content">{log.productName}</strong>
                </span>
                <span className="font-bold text-danger shrink-0">{log.quantity} Adet</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Satılanlar / Tüketilenler Raporu */}
      <div className={`${card} p-5 border-success-border`}>
        <h3 className="text-success text-[15px] font-bold mb-3">🟢 Tüketilenler / Satılanlar</h3>
        <ul className="p-0 m-0 list-none">
          {consumedLogs.length === 0 ? (
            <p className="text-content-muted text-sm m-0">Tüketim kaydı bulunmuyor.</p>
          ) : (
            consumedLogs.map((log) => (
              <li key={log.id} className={logRow}>
                <span className="text-content-secondary min-w-0 truncate">
                  {new Date(log.date).toLocaleDateString('tr-TR')} — <strong className="text-content">{log.productName}</strong>
                </span>
                <span className="font-bold text-success shrink-0">{log.quantity} Adet</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
