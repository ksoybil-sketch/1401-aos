import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { card, tileBadge } from '../constants/ui';

/** İki özet kartının ortak kabuğu — başlık, "Tümünü Gör" ve liste. */
const SummaryShell: React.FC<{
  icon: string;
  accent: 'gold' | 'info';
  title: string;
  onSeeAll: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ icon, accent, title, onSeeAll, children, footer }) => (
  <div className={`${card} p-5`}>
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-3">
        <span className={`${tileBadge(accent)} w-9 h-9 text-base rounded-xl`}>{icon}</span>
        <h3 className="text-[15px] font-bold text-content">{title}</h3>
      </div>
      <button
        onClick={onSeeAll}
        className="text-gold text-xs font-semibold cursor-pointer transition-opacity hover:opacity-75"
      >
        Tümünü Gör
      </button>
    </div>
    <ul className="list-none p-0 m-0">{children}</ul>
    {footer}
  </div>
);

const row = 'flex justify-between items-center gap-3 py-2.5 border-b border-hairline last:border-b-0 text-sm';

export const DisplayCabinetSummaryCard: React.FC = () => {
  const navigate = useNavigate();
  const { inventory } = useStore();
  const { setInventoryCategoryFilter } = useUIStore();

  const teshirItems = inventory.filter((i) => i.category === 'Teşhir Dolabı');
  if (teshirItems.length === 0) return null;

  const summaryMap: Record<string, number> = {};
  teshirItems.forEach((i) => {
    summaryMap[i.name] = (summaryMap[i.name] || 0) + i.quantity;
  });
  const summaryArray = Object.entries(summaryMap)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <SummaryShell
      icon="🎂"
      accent="gold"
      title="Dolapta Neler Var?"
      onSeeAll={() => { setInventoryCategoryFilter('Teşhir Dolabı'); navigate('/inventory'); }}
    >
      {summaryArray.map((item) => (
        <li key={item.name} className={row}>
          <span className="text-content-secondary truncate">{item.name}</span>
          <span className="font-bold text-content shrink-0">{item.quantity} Adet</span>
        </li>
      ))}
    </SummaryShell>
  );
};

export const FrozenStockSummaryCard: React.FC = () => {
  const navigate = useNavigate();
  const { frozenStock } = useStore();

  if (frozenStock.length === 0) return null;

  const sorted = [...frozenStock].sort((a, b) => b.quantity - a.quantity);

  return (
    <SummaryShell
      icon="🧀"
      accent="info"
      title="Stokta Ne Var?"
      onSeeAll={() => navigate('/frozen-stock')}
      footer={
        sorted.length > 6 ? (
          <p className="mt-3 mb-0 text-xs text-content-muted text-center">
            +{sorted.length - 6} ürün daha...
          </p>
        ) : undefined
      }
    >
      {sorted.slice(0, 6).map((item) => (
        <li key={item.id} className={row}>
          <span className="text-content-secondary truncate">{item.name}</span>
          <span className={`font-bold shrink-0 ${item.quantity === 0 ? 'text-danger' : 'text-gold'}`}>
            {item.quantity === 0 ? 'Tükendi!' : `${item.quantity} Adet`}
          </span>
        </li>
      ))}
    </SummaryShell>
  );
};
