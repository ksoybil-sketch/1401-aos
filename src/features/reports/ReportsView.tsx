import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Icon } from '../../components/Icon';
import { WeeklyTrendCard } from '../../components/WeeklyTrendCard';
import { computeWeeklyTrend } from '../../utils/helpers';
import {
  card, iconChip, listGroup, listRow, rowChevron, screenTitle, sectionLabel
} from '../../constants/ui';

const logRow = 'flex justify-between items-center gap-3 px-4 py-2.5 text-[14px]';

export const ReportsView: React.FC = () => {
  const navigate = useNavigate();
  const { transactionLog } = useStore();

  const expiredLogs = transactionLog.filter(log => log.type === 'EXPIRED');
  const consumedLogs = transactionLog.filter(log => log.type === 'CONSUMED');

  const { zayiTrend, tuketimTrend } = useMemo(() => ({
    zayiTrend: computeWeeklyTrend(transactionLog, 'EXPIRED'),
    tuketimTrend: computeWeeklyTrend(transactionLog, 'CONSUMED')
  }), [transactionLog]);

  return (
    <div className="flex flex-col gap-3.5">
      <h2 className={`${screenTitle} mt-0.5`}>Raporlar</h2>

      <div className={listGroup}>
        <button onClick={() => navigate('/barista-performance')} className={listRow}>
          <span className={iconChip()}>
            <Icon name="cap" size={16} />
          </span>
          <span className="flex-1 text-[15px] font-medium text-crema">Barista Performans Raporu</span>
          <Icon name="chevronRight" size={16} className={rowChevron} />
        </button>
      </div>

      {/* Haftalık trend */}
      <div className={sectionLabel}>Bu hafta vs geçen hafta</div>
      <div className="grid grid-cols-2 gap-2.5">
        <WeeklyTrendCard label="Zayi" trend={zayiTrend} goodDirection="down" />
        <WeeklyTrendCard label="Tüketim" trend={tuketimTrend} goodDirection="up" />
      </div>

      {/* Zayi */}
      <div className={sectionLabel}>Zayi</div>
      <div className={card}>
        <ul className="p-0 m-0 list-none divide-y divide-line">
          {expiredLogs.length === 0 ? (
            <li className="px-4 py-3.5 text-[13px] text-fg-3">Zayi kaydı bulunmuyor.</li>
          ) : (
            expiredLogs.map((log) => (
              <li key={log.id} className={logRow}>
                <span className="min-w-0 truncate">
                  <span className="text-crema">{log.productName}</span>
                  <span className="text-fg-3 tnum"> · {new Date(log.date).toLocaleDateString('tr-TR')}</span>
                </span>
                <span className="font-medium text-negative shrink-0 tnum">{log.quantity}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Tüketilenler */}
      <div className={sectionLabel}>Tüketilenler</div>
      <div className={card}>
        <ul className="p-0 m-0 list-none divide-y divide-line">
          {consumedLogs.length === 0 ? (
            <li className="px-4 py-3.5 text-[13px] text-fg-3">Tüketim kaydı bulunmuyor.</li>
          ) : (
            consumedLogs.map((log) => (
              <li key={log.id} className={logRow}>
                <span className="min-w-0 truncate">
                  <span className="text-crema">{log.productName}</span>
                  <span className="text-fg-3 tnum"> · {new Date(log.date).toLocaleDateString('tr-TR')}</span>
                </span>
                <span className="font-medium text-positive shrink-0 tnum">{log.quantity}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
