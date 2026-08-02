import React from 'react';
import { WeeklyTrend } from '../utils/helpers';
import { card } from '../constants/ui';

interface WeeklyTrendCardProps {
  label: string;
  trend: WeeklyTrend;
  /** Artışın mı azalışın mı "iyi" sayıldığı — renk buna göre belirlenir. */
  goodDirection: 'up' | 'down';
}

export const WeeklyTrendCard: React.FC<WeeklyTrendCardProps> = ({ label, trend, goodDirection }) => {
  const { thisWeek, lastWeek, deltaPercent } = trend;
  const isIncrease = deltaPercent !== null && deltaPercent > 0;
  const isGood = deltaPercent === null || deltaPercent === 0
    ? null
    : goodDirection === 'up' ? isIncrease : !isIncrease;

  return (
    <div className={`${card} p-3.5 flex flex-col gap-1.5`}>
      <span className="text-[12px] text-fg-3">{label}</span>
      <span className="text-[22px] font-bold text-crema tnum">{thisWeek}</span>
      <div className="flex items-center gap-1.5 text-[12px] tnum flex-wrap">
        {deltaPercent === null ? (
          <span className="text-fg-3">Geçen hafta {lastWeek}</span>
        ) : (
          <>
            <span className={isGood === null ? 'text-fg-3' : isGood ? 'text-positive' : 'text-negative'}>
              {deltaPercent > 0 ? '+' : ''}{deltaPercent}%
            </span>
            <span className="text-fg-3">geçen haftaya göre</span>
          </>
        )}
      </div>
    </div>
  );
};
