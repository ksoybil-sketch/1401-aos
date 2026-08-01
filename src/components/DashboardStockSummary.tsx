import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Icon, IconName } from '../components/Icon';
import { card, cardTitle, iconChip, TONE, Tone } from '../constants/ui';

/** İki özet kartının ortak kabuğu — başlık, "Tümü" bağlantısı ve liste. */
const SummaryShell: React.FC<{
  icon: IconName;
  tone: Tone;
  title: string;
  onSeeAll: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ icon, tone, title, onSeeAll, children, footer }) => (
  // Sol kenardaki ince renkli şerit iki kartı birbirinden ayırır:
  // teşhir dolabı sıcak (kil), donuk stok soğuk (arduvaz) tonda.
  <div className={`${card} border-l-2 ${TONE[tone].edge}`}>
    <div className="flex justify-between items-center gap-3 px-4 pt-3.5 pb-3 border-b border-line">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={iconChip(tone)}>
          <Icon name={icon} size={16} />
        </span>
        <h3 className={cardTitle}>{title}</h3>
      </div>
      <button
        onClick={onSeeAll}
        className="text-fg-2 text-[12px] font-medium cursor-pointer transition-colors hover:text-crema shrink-0"
      >
        Tümü
      </button>
    </div>
    <ul className="list-none p-0 m-0 divide-y divide-line">{children}</ul>
    {footer}
  </div>
);

const row = 'flex justify-between items-center gap-3 px-4 py-2.5 text-[14px]';

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
      icon="cabinet"
      tone="caution"
      title="Dolapta neler var"
      onSeeAll={() => { setInventoryCategoryFilter('Teşhir Dolabı'); navigate('/inventory'); }}
    >
      {summaryArray.map((item) => (
        <li key={item.name} className={row}>
          {/* Ürün adı tam parlaklıkta: bu kartlar hızlı okunmak için var */}
          <span className="text-crema truncate">{item.name}</span>
          <span className="font-semibold text-caution shrink-0 tnum">{item.quantity}</span>
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
      icon="snowflake"
      tone="accent"
      title="Donuk stok"
      onSeeAll={() => navigate('/frozen-stock')}
      footer={
        sorted.length > 6 ? (
          <p className="px-4 py-2.5 text-[12px] text-fg-3 text-center border-t border-line">
            +{sorted.length - 6} ürün daha
          </p>
        ) : undefined
      }
    >
      {sorted.slice(0, 6).map((item) => (
        <li key={item.id} className={row}>
          <span className="text-crema truncate">{item.name}</span>
          <span className={`font-semibold shrink-0 tnum ${item.quantity === 0 ? 'text-negative' : 'text-accent'}`}>
            {item.quantity === 0 ? 'Tükendi' : item.quantity}
          </span>
        </li>
      ))}
    </SummaryShell>
  );
};
